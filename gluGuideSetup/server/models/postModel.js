const pool = require('../config/db');

const Post = {
    async getAll() {
        const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
        return result.rows;
    },

    async getById(id) {
        const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
        return result.rows[0];
    },

    async create(title, content) {
        const result = await pool.query(
            'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *',
            [title, content]
        );
        return result.rows[0];
    },

    async update(id, title, content) {
        await pool.query(
            'UPDATE posts SET title = $1, content = $2 WHERE id = $3',
            [title, content, id]
        );
    },

    async delete(id) {
        await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    }
};

module.exports = Post;
