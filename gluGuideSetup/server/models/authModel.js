//Define the User model in models/userModel.js for interacting with the database.
const { clear } = require('console');
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
    },

    async forgotPassword(email) {
      const query = 'SELECT * FROM users WHERE email = $1';
      const values = [email];
      try {
        const result = await pool.query(query, values);
        return result;
      } catch (error) {
        throw error;
      }
    },
    async passwordToken(token, expires, email) {
      const query = 'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE email = $3';
      const values = [token, expires, email];
      try {
        const result = await pool.query(query, values);
        return result;
      } catch (error) {
        throw error;
      }
    },

    async verifyResetToken(token) {
      const query = 'SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()';
      const values = [token];
      const result = await pool.query(query, values);
      return result;
    },
  
    async updatePassword(username, hashedPassword) {
      const query = 'UPDATE users SET password_hash = $1 WHERE username = $2';
      const values = [hashedPassword, username];
      const result = await pool.query(query, values);
      return result;
    },
  
    async clearResetToken(username) {
      const query = 'UPDATE users SET password_reset_token = NULL, password_reset_expires = NULL WHERE username = $1';
      const values = [username];
      const result = await pool.query(query, values);
      return result;
    }
};

module.exports = User;