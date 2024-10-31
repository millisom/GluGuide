const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
        console.error('Error destroying session:', err);
        res.status(500).send('Error destroying session');
        } else {
        res.status(200).send('Session destroyed');
        }
    });
    });

module.exports = router;