const pool = require('../config/db');

const getUserByUsername = (username, callback) => {
    const query = 'SELECT username, password_hash FROM users WHERE username = $1';
    const params = [username];

    pool.query(query, params, callback);
};

module.exports = { getUserByUsername };
