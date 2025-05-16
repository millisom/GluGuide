const session = require('express-session');

const isProduction = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);


const sessionConfig = (app) => {
  app.use(session({
    name: 'gluguide.sid', 
    secret: process.env.SESSION_SECRET || 'default_secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, 
      secure: isProduction,  
      sameSite: isProduction ? 'none' : 'lax', 
    },
  }));
};

module.exports = sessionConfig;
