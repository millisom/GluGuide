const express = require('express');
const router = express.Router();

router.get('/user', (req, res) => {
    if (req.session.username) {
        return res.json({ valid: true, username: req.session.username });
    }else{
        return res.json({ valid: false });
    }
}
);

module.exports = router;
