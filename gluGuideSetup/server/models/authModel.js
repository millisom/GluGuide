//Define the User model in models/userModel.js for interacting with the database.
const pool = require('../config/db');
// const bcrypt = require('bycrypt.js');
const argon2 = require('argon2');

const User = {
    async createUser(username, email, password, termsAccepted) {
      const hashedPassword = await argon2.hash(password);
      const query = 'INSERT INTO users (username, email, password_hash, terms_accepted) VALUES ($1, $2, $3, $4) RETURNING *';
      const values = [username, email, hashedPassword, termsAccepted];
  
      try {
        const result = await pool.query(query, values);
        return result.rows[0];
      } catch (error) {
        throw error;
      }
    },

    async findUserByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];

        try {
            const result = await pool.query(query,values);
            return result.rows[0];
        }
        catch (error) {
            throw error;
        }    
    },
    async getUserByUsername(username) {
      const query = 'SELECT username, password_hash FROM users WHERE username = $1';
      const values = [username];
  
      try {
        const result = await pool.query(query, values);
        return result;
      } catch (error) {
        throw error;
      }
    }
  
};

module.exports = User;