const pool = require('../config/db');

const getUserById = async (username) => {
    const user = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    return user.rows[0];
};

const setUserIdInSession = async (req, res, next) => {
    if (req.session && req.session.username && !req.session.userId) {
        try {
            const user = await getUserById(req.session.username);
            if (user) {
                req.session.userId = user.id;
                console.log(`Logged in user: ${req.session.username}, userId: ${req.session.userId}`);
            } else {
                console.error('User not found');
                return res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error('Error setting user ID in session:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    next();
};

module.exports = setUserIdInSession;
