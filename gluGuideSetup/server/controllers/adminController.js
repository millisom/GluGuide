const argon2 = require('argon2'); // for password hashing
const pool = require('../config/db');

const adminController = {

  // List all users
  listUsers: async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT id, username, email, created_at, is_admin FROM users ORDER BY created_at DESC'
      );

      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error retrieving users:', err);
      res.status(500).json({ error: 'Server error retrieving users.' });
    }
  },
  createUser: async (req, res) => {},
  editUser: async (req, res) => {},
  deleteUser: async (req, res) => {},
  editPost: async (req, res) => {},
  deletePost: async (req, res) => {},
  editComment: async (req, res) => {},
  deleteComment: async (req, res) => {},
};

module.exports = adminController;
