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

    // Create a new user
    createUser: async (req, res) => {
        const { username, email, password, termsAccepted, is_admin } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required.' });
        }

        try {
            // Check if user already exists by email
            const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            if (existingUser.rows.length > 0) {
                return res.status(409).json({ error: 'User already exists.' });
            }

            // Hash the password securely
            const hashedPassword = await argon2.hash(password);

            // Insert the new user into the database
            const result = await pool.query(
                `INSERT INTO users (username, email, password_hash, terms_accepted, is_admin) 
            VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, is_admin`,
                [username, email, hashedPassword, termsAccepted || false, is_admin || false]
            );

            res.status(201).json(result.rows[0]);

        } catch (err) {
            console.error('Error creating new user:', err);
            res.status(500).json({ error: 'Server error creating new user.' });
        }
    },

    editUser: async (req, res) => { },
    deleteUser: async (req, res) => { },
    editPost: async (req, res) => { },
    deletePost: async (req, res) => { },
    editComment: async (req, res) => { },
    deleteComment: async (req, res) => { },
};

module.exports = adminController;
