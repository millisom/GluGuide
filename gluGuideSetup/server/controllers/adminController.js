const argon2 = require('argon2'); // for password hashing
const pool = require('../config/db');

const adminController = {
  listUsers: async (req, res) => {},
  createUser: async (req, res) => {},
  editUser: async (req, res) => {},
  deleteUser: async (req, res) => {},
  editPost: async (req, res) => {},
  deletePost: async (req, res) => {},
  editComment: async (req, res) => {},
  deleteComment: async (req, res) => {},
};

module.exports = adminController;
