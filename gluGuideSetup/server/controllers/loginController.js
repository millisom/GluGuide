const loginModel = require('../models/loginModel');

const loginController = {
    async login(req, res) {
        try{
            const { username, password} = req.body;
            if(!username || !password){
                return res.status(400).json({error: 'Username and password required'});
            }

            const user = await loginModel.login(username, password);
            if(user){
                return res.json({message: 'Login successful'});
            } else {
                return res.status(401).json({error: 'Invalid username or password'});
            }
        } catch(error){
            console.error('Error in loginController:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
};
module.exports = loginController;