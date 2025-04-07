const pool = require('../config/db');

const adminMiddleware = async (req, res, next) => {
  // Ensure there's an active session with a user ID
  if (req.session && req.session.userId) {
    try {
      // Fetch the user from the database to check if they are admin
      const result = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.session.userId]);

      // If user doesn't exist or is not admin, deny access
      if (result.rows.length === 0 || !result.rows[0].is_admin) {
        return res.status(403).json({ error: 'Unauthorized: Admin access required.' });
      }

      // User is admin; proceed to the next middleware or route handler
      next();
    } catch (err) {
      console.error("Error checking admin status:", err);
      res.status(500).json({ error: 'Server error while verifying admin status.' });
    }
  } else {
    // No valid session found
    res.status(401).json({ error: 'Unauthorized: Please log in.' });
  }
};

module.exports = adminMiddleware;
