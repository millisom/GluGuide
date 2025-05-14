const argon2 = require('argon2');
const pool = require('../config/db');
const fs = require("fs");
const path = require("path");
const Post = require('../models/postModel');

// 👇 Add this once, at the top
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

const adminController = {

  listUsers: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, username, email, created_at, is_admin, profile_bio, profile_picture
        FROM users
        ORDER BY created_at DESC
      `);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Error retrieving users:", err);
      res.status(500).json({ error: "Server error retrieving users." });
    }
  },

  getSingleUser: async (req, res) => {
    const userId = req.params.id;
    try {
      const result = await pool.query(
        `SELECT id, username, email, is_admin, profile_bio FROM users WHERE id = $1`,
        [userId]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: "Server error" });
    }
  },

  // ✅ Updated avatar URL to use BASE_URL
  getUserAvatar: async (req, res) => {
    const userId = req.params.id;
    try {
      const result = await pool.query(
        `SELECT profile_picture FROM users WHERE id = $1`,
        [userId]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

      const { profile_picture } = result.rows[0];
      if (!profile_picture) return res.json({ url: "" });

      const url = `${BASE_URL}/uploads/${profile_picture}`;
      return res.json({ url });
    } catch (err) {
      console.error("Error fetching user avatar:", err);
      return res.status(500).json({ error: "Server error" });
    }
  },

  createUser: async (req, res) => {
    const { username, email, password, termsAccepted, is_admin } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required." });
    }

    try {
      const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: "User already exists." });
      }

      const hashedPassword = await argon2.hash(password);
      const result = await pool.query(
        `INSERT INTO users (username, email, password_hash, terms_accepted, is_admin)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, username, email, is_admin`,
        [username, email, hashedPassword, termsAccepted || false, is_admin || false]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Error creating new user:", err);
      res.status(500).json({ error: "Server error creating new user." });
    }
  },

  editUser: async (req, res) => {
    const userId = req.params.id;
    const { username, email, is_admin, newPassword, profile_bio } = req.body;

    try {
      const existingUser = await pool.query("SELECT * FROM users WHERE id=$1", [userId]);
      if (existingUser.rows.length === 0) return res.status(404).json({ error: "User not found." });

      let i = 1;
      const updates = [];
      const values = [];

      if (username !== undefined) {
        updates.push(`username = COALESCE($${i}, username)`); values.push(username); i++;
      }
      if (email !== undefined) {
        updates.push(`email = COALESCE($${i}, email)`); values.push(email); i++;
      }
      if (is_admin !== undefined) {
        updates.push(`is_admin = COALESCE($${i}, is_admin)`); values.push(is_admin); i++;
      }
      if (profile_bio !== undefined) {
        updates.push(`profile_bio = COALESCE($${i}, profile_bio)`); values.push(profile_bio); i++;
      }
      if (newPassword && newPassword.trim()) {
        const hashedPassword = await argon2.hash(newPassword);
        updates.push(`password_hash = $${i}`); values.push(hashedPassword); i++;
      }

      if (updates.length === 0) return res.status(200).json({ message: "No updates made." });

      const query = `
        UPDATE users
        SET ${updates.join(", ")}
        WHERE id = $${i}
        RETURNING id, username, email, is_admin, profile_bio
      `;
      values.push(userId);

      const updated = await pool.query(query, values);
      return res.status(200).json(updated.rows[0]);
    } catch (err) {
      console.error("Error editing user:", err);
      return res.status(500).json({ error: "Server error editing user." });
    }
  },

  deleteUserAvatar: async (req, res) => {
    const userId = req.params.id;
    try {
      const userResult = await pool.query("SELECT profile_picture FROM users WHERE id=$1", [userId]);
      if (userResult.rows.length === 0) return res.status(404).json({ error: "User not found." });

      const { profile_picture } = userResult.rows[0];
      if (!profile_picture) return res.status(400).json({ error: "User has no avatar." });

      await pool.query("UPDATE users SET profile_picture=null WHERE id=$1", [userId]);

      const fullPath = path.join(__dirname, "..", profile_picture);
      fs.unlink(fullPath, (err) => {
        if (err) console.error("Failed to remove avatar file from disk:", err);
      });

      return res.status(200).json({ message: "User avatar deleted successfully." });
    } catch (error) {
      console.error("Error deleting user avatar:", error);
      return res.status(500).json({ error: "Server error deleting user avatar." });
    }
  },

  deleteUser: async (req, res) => {
    const userIdToDelete = req.params.id;
    const loggedInUserId = req.session.userId;

    try {
      if (parseInt(userIdToDelete, 10) === loggedInUserId) {
        return res.status(403).json({ error: "You cannot delete yourself!" });
      }

      const existingUser = await pool.query("SELECT * FROM users WHERE id = $1", [userIdToDelete]);
      if (existingUser.rows.length === 0) {
        return res.status(404).json({ error: "User not found." });
      }

      await pool.query("DELETE FROM users WHERE id = $1", [userIdToDelete]);
      res.status(200).json({ message: "User deleted successfully." });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Server error deleting user." });
    }
  },

  editPost: async (req, res) => {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    let tagsArray = [];
    if (tags && typeof tags === 'string') {
      tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    } else if (Array.isArray(tags)) {
      tagsArray = tags.filter(tag => typeof tag === 'string' && tag.trim()).map(tag => tag.trim());
    }

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    try {
      const postToUpdate = await Post.getPostById(id);
      if (!postToUpdate) {
        return res.status(404).json({ message: "Post not found." });
      }

      const userId = postToUpdate.user_id;
      const updatedPost = await Post.updatePost(id, userId, title, content, tagsArray);

      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found or update failed during transaction." });
      }

      return res.status(200).json({ message: "Post updated successfully by admin", post: updatedPost });
    } catch (error) {
      console.error('Admin failed to update post:', error);
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  },

  deletePost: async (req, res) => {
    const postId = req.params.id;
    try {
      const existingPost = await pool.query("SELECT * FROM posts WHERE id = $1", [postId]);
      if (existingPost.rows.length === 0) {
        return res.status(404).json({ error: "Post not found." });
      }

      await pool.query("DELETE FROM posts WHERE id = $1", [postId]);
      res.status(200).json({ message: "Post deleted successfully." });
    } catch (err) {
      console.error("Error deleting post:", err);
      res.status(500).json({ error: "Server error deleting post." });
    }
  },

  editComment: async (req, res) => {
    const commentId = req.params.id;
    const { content } = req.body;

    try {
      const existingComment = await pool.query("SELECT * FROM comments WHERE id = $1", [commentId]);
      if (existingComment.rows.length === 0) {
        return res.status(404).json({ error: "Comment not found." });
      }

      const updatedComment = await pool.query(
        `UPDATE comments SET content = COALESCE($1, content), updated_at = NOW()
         WHERE id = $2 RETURNING id, content, updated_at`,
        [content, commentId]
      );

      res.status(200).json(updatedComment.rows[0]);
    } catch (err) {
      console.error("Error editing comment:", err);
      res.status(500).json({ error: "Server error editing comment." });
    }
  },

  deleteComment: async (req, res) => {
    const commentId = req.params.id;
    try {
      const existingComment = await pool.query("SELECT * FROM comments WHERE id = $1", [commentId]);
      if (existingComment.rows.length === 0) {
        return res.status(404).json({ error: "Comment not found." });
      }

      await pool.query("DELETE FROM comments WHERE id = $1", [commentId]);
      res.status(200).json({ message: "Comment deleted successfully." });
    } catch (err) {
      console.error("Error deleting comment:", err);
      res.status(500).json({ error: "Server error deleting comment." });
    }
  }
};

module.exports = adminController;
