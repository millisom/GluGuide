const pool = require('../config/db'); // Import the PostgreSQL connection pool

// function to find or create tags
async function findOrCreateTags(tagNames, dbClient) {
  const tagIds = [];
  for (const name of tagNames) {
    let tagResult = await dbClient.query('SELECT id FROM tags WHERE name = $1', [name]);
    let tagId;
    if (tagResult.rows.length > 0) {
      tagId = tagResult.rows[0].id;
    } else {
      tagResult = await dbClient.query('INSERT INTO tags (name) VALUES ($1) RETURNING id', [name]);
      tagId = tagResult.rows[0].id;
    }
    tagIds.push(tagId);
  }
  return tagIds;
}

// function to link tags to a post
async function linkTagsToPost(postId, tagIds, dbClient) {
  if (tagIds.length === 0) return;
  const values = tagIds.map((tagId, index) => `($1, $${index + 2})`).join(',');
  const query = `INSERT INTO post_tags (post_id, tag_id) VALUES ${values}`;
  await dbClient.query(query, [postId, ...tagIds]);
}

const Post = {
  // Method to create a new post with tags
  // tags are empty bydefault
  async createPost(userId, title, content, postPicture, tags = []) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const postQuery = 'INSERT INTO posts (user_id, title, content, created_at, post_picture) VALUES ($1, $2, $3, NOW(), $4) RETURNING *';
      const postValues = [userId, title, content, postPicture];
      const postResult = await client.query(postQuery, postValues);
      const newPost = postResult.rows[0];

      const tagIds = await findOrCreateTags(tags, client);

      if (tagIds.length > 0) {
        await linkTagsToPost(newPost.id, tagIds, client);
      }

      await client.query('COMMIT');
      const createdPostWithTags = await this.getPostById(newPost.id);
      return createdPostWithTags; // Return the newly created post with tags

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating post with tags:', error);
      throw new Error('Failed to create post in database.');
    } finally {
      client.release();
    }
  },

  // Method to get User from usertabel by name and get ID
  async getUserIdByUsername(username) {
    const query = 'SELECT id FROM users WHERE username = $1';
    const values = [username];

    try {
      const result = await pool.query(query, values);
      if (result.rows.length === 0){
        return null; 
      }
      return result.rows[0].id;
    } catch (error) {
      // Ensure error is handled properly
      throw new Error('Error fetching user ID: ' + error.message); // Create a new Error instance
    }
  },

  async getAllPostsOrderedByTime() {
    const query = `
      SELECT
        p.*,
        u.username,
        COALESCE(array_length(p.likes, 1), 0) AS likes_count,
        COALESCE(array_agg(t.name) FILTER (WHERE t.name IS NOT NULL), '{}') AS tags
      FROM
        posts p
      JOIN
        users u ON p.user_id = u.id
      LEFT JOIN
        post_tags pt ON p.id = pt.post_id
      LEFT JOIN
        tags t ON pt.tag_id = t.id
      GROUP BY
        p.id, u.username -- Group by post ID and user username
      ORDER BY
        p.created_at DESC
    `;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching posts with tags:", error);
      throw new Error('Error fetching posts: ' + error.message);
    }
  },

  // Method to get all posts for a specific user with tags
  async getPosts(userId) {
    const query = `
      SELECT 
        p.*, 
        COALESCE(array_length(p.likes, 1), 0) AS likes_count, -- Count of likes
        COALESCE(array_agg(t.name) FILTER (WHERE t.name IS NOT NULL), '{}') AS tags -- Aggregate tags
      FROM 
        posts p
      LEFT JOIN -- Use LEFT JOIN in case a post has no tags
        post_tags pt ON p.id = pt.post_id
      LEFT JOIN 
        tags t ON pt.tag_id = t.id
      WHERE 
        p.user_id = $1
      GROUP BY
        p.id -- Group by post ID to aggregate tags correctly
      ORDER BY
        p.created_at DESC -- Keep ordering
    `;
    const values = [userId];
    try {
        const result = await pool.query(query, values);
        console.log('Posts for user:', result.rows);
        return result.rows;
    } catch (error) {
        throw new Error('Error fetching posts for user: ' + error.message);
    }
  },

  async updatePost(postId, userId, title, content, tags = []) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const updatePostQuery = 'UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING id';
      const updateResult = await client.query(updatePostQuery, [title, content, postId, userId]);

      if (updateResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      await client.query('DELETE FROM post_tags WHERE post_id = $1', [postId]);

      const tagIds = await findOrCreateTags(tags, client);

      if (tagIds.length > 0) {
        await linkTagsToPost(postId, tagIds, client);
      }

      await client.query('COMMIT');

      const updatedPostWithTags = await this.getPostById(postId);
      return updatedPostWithTags;

    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error('Failed to update post in database.');
    } finally {
      client.release();
    }
  },

  async getPostById(postId) {
    const query = `
      SELECT
          p.*,
          u.username,
          COALESCE(array_length(p.likes, 1), 0) AS likes_count,
          COALESCE(array_agg(t.name) FILTER (WHERE t.name IS NOT NULL), '{}') AS tags
      FROM
          posts p
      JOIN
          users u ON p.user_id = u.id
      LEFT JOIN
          post_tags pt ON p.id = pt.post_id
      LEFT JOIN
          tags t ON pt.tag_id = t.id
      WHERE
          p.id = $1
      GROUP BY
          p.id, u.username -- Group by post ID and user username
    `;
    const values = [postId];

    try {
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        return null; // No post found
      }
      return result.rows[0]; // Return the found post with tags
    } catch (error) {
      throw new Error('Error fetching post: ' + error.message);
    }
  },

  async setPostImage(id, imagePath) {
    const query = 'UPDATE posts SET post_picture = $1 WHERE id = $2';
    try {
        const result = await pool.query(query, [imagePath, id]);
        return result.rowCount;
    } catch (error) {
        throw new Error('Error setting post image: ' + error.message);
    }
},


  async deletePostById(id) {
    const query = 'DELETE FROM posts WHERE id = $1 RETURNING *';
    const values = [id];

    try {
      const result = await pool.query(query, values);
      return result.rowCount; 
    } catch (error) {
      throw new Error('Error deleting post: ' + error.message);
    }
  },

  async toggleLike(postId, userId) {
    const queryGetLikes = 'SELECT likes FROM posts WHERE id = $1';
    const queryUpdateLikes = 'UPDATE posts SET likes = $1 WHERE id = $2 RETURNING *';

    try {
        // Get the current likes array
        const result = await pool.query(queryGetLikes, [postId]);
        if (result.rows.length === 0) {
            throw new Error('Post not found');
        }

        let likes = result.rows[0].likes || []; // Get existing likes or initialize as an empty array

        // Check if the userId already liked the post
        if (likes.includes(userId)) {
            // Unlike: Remove userId from the likes array
            likes = likes.filter(id => id !== userId);
        } else {
            // Like: Add userId to the likes array
            likes.push(userId);
        }

        // Update the likes in the database
        const updateResult = await pool.query(queryUpdateLikes, [likes, postId]);
        return updateResult.rows[0];
    } catch (error) {
        throw new Error('Error toggling like: ' + error.message);
    }
  },

  async updateLikes(postId, likes) {
    const query = 'UPDATE posts SET likes = $1 WHERE id = $2 RETURNING *';
    const values = [likes, postId];
  
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error updating likes: ' + error.message);
    }
  },

  
  async getAuthorProfileByUsername(username) {
    const userQuery = `
      SELECT id, username, profile_bio, profile_picture 
      FROM users 
      WHERE username = $1
    `;
  
    const postsQuery = `
      SELECT id, title, created_at 
      FROM posts 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
  
    try {
      // Fetch user details
      const userResult = await pool.query(userQuery, [username]);
      if (userResult.rows.length === 0) {
        return null; // No user found
      }
  
      const user = userResult.rows[0]; // Get user details
      const userId = user.id;
  
      // Transform profile_picture into a public URL if it exists
      if (user.profile_picture) {
        const filename = user.profile_picture.split('\\').pop(); // Extract the filename from the local path
        user.profile_picture = `http://localhost:8080/uploads/${filename}`; // Create the public URL
      }
  
      // Fetch posts created by the user
      const postsResult = await pool.query(postsQuery, [userId]);
      const posts = postsResult.rows;
  
      return { user, posts }; // Return both user details and their posts
    } catch (error) {
      throw new Error('Error fetching author profile: ' + error.message);
    }
  },

  // Method to get all unique tag names
  async getAllTags() {
    const query = 'SELECT name FROM tags ORDER BY name ASC';
    try {
      const result = await pool.query(query);
      return result.rows.map(row => row.name);
    } catch (error) {
      console.error("Error fetching all tags:", error);
      throw new Error('Error fetching tags: ' + error.message);
    }
  }
  
};

module.exports = Post;
