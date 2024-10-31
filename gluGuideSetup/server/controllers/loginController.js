const loginModel = require('../models/loginModel');

const loginUser = (req, res) => {
    // console.log('Received login request');
    // console.log('Request Body:', req.body); // Log incoming request data

    loginModel.getUserByUsername(req.body.username, (err, results) => {
        if (err) {
            // console.error('Database Error:', err.message); // Log the error message
            // console.error('Error Stack:', err.stack); // Log the error stack trace for more details
            return res.json({ Message: 'An error occurred: ' + err.message, Stack: err.stack });
        }

        // console.log('Query Results:', results); // Log the raw results from the query
        // console.log('Rows Retrieved:', results.rows); // Log the rows specifically

        if (results.rows.length > 0) {
            const user = results.rows[0];
            req.session.username = user.username;
            // console.log('User authenticated:', req.session.username); // Log the authenticated username

            return res.json({ Login: true });
        } else {
            // console.log('No matching user found'); // Log if no user was found with the provided username
            return res.json({ Login: false });
        }
    });
};

module.exports = { loginUser };
