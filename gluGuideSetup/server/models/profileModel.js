const pool = require('../config/db');

const Profile = {
    async getuserbio(username) {
        const query = 'SELECT profile_bio FROM users WHERE username = $1';
        const values = [username];
        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error fetching user bio: ' + error.message);
        }
    },

    async setUserbio(username, bio) {
        const query = 'UPDATE users SET profile_bio = $1 WHERE username = $2';
        const values = [bio, username];
        try {
            const result = await pool.query(query, values);
            if (result.rowCount === 0) {
                throw new Error('No rows updated');
            }
            return result.rowCount;
        } catch (error) {
            throw new Error('Error setting user bio: ' + error.message);
        }
    },

    async getUserDp(username){
        const query = 'SELECT profile_picture FROM users WHERE username = $1';
        const values = [username];
        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        }
        catch (error) {
            throw new Error('Error fetching user dp: ' + error.message);
        }
    },

    async setUserDp(username, dp){
        const query = 'UPDATE users SET profile_picture = $1 WHERE username = $2';
        const values = [dp, username];
        try {
            const result = await pool.query(query, values);
            if (result.rowCount === 0) {
                throw new Error('No rows updated');
            }
            return result.rowCount;
        } catch (error) {
            throw new Error('Error setting user dp: ' + error.message);
        }
    },

    async deleteDp(username){
        const query = 'UPDATE users SET profile_picture = NULL WHERE username = $1';
        const values = [username];
        try {
            const result = await pool.query(query, values);
            if (result.rowCount === 0) {
                throw new Error('No rows updated');
            }
            return result.rowCount;
        } catch (error) {
            throw new Error('Error deleting user dp: ' + error.message);
        }
    },
    async getUserByName(username) {
        const query = 'SELECT id FROM users WHERE username = $1';
        const values = [username];
        try {
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching user by username: ' + error.message);
        }
    },
    async getPostsForUser(userId) {
        const query = 'SELECT * FROM posts WHERE user_id = $1';
        const values = [userId];
        try {
            const result = await pool.query(query, values);
            console.log('Posts:', result.rows);
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching posts for user: ' + error.message);
        }
    },
    async updatePostForUser(userId, title, content) {
        const query = 'UPDATE posts SET title = $1, content = $2 WHERE user_id = $3';
        const values = [title, content, userId];
        try {
            const result = await pool.query(query, values);
            return result.rowCount;
        } catch (error) {
            throw new Error('Error updating post for user: ' + error.message);
        }
    },
    async deleteAccount(username) {
        const query = 'DELETE FROM users WHERE username = $1';
        const values = [username];
        try {
            const result = await pool.query(query, values);
            return result.rowCount;
        } catch (error) {
            throw new Error('Error deleting user account: ' + error.message);
        }
    }
};

module.exports = Profile;
