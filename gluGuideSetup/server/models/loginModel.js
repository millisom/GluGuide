const pool = require('../config/db');
const argpn2 = require('argon2');

const loginModel = {
    async login(username, password){
        try{
            const result = await pool.query('SELECT username, password_hash FROM users WHERE username = $1', [username]);
            if(result.rows.length === 0){
                return null;
            }
            const user = result.rows[0];

            const validPassword = await argpn2.verify(user.password_hash, password);
            if(validPassword){
                return user;
            } else {
                return null;
            }
        } catch(error){
            console.error('Error in loginModel:', error);
            throw error;
        }
    }
};
module.exports = loginModel;
