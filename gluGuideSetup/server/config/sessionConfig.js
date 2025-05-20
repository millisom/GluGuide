const session = require('express-session');

const isProduction = process.env.NODE_ENV === 'production';

const sessionConfig = (app) => {
  
  if (isProduction) {
    app.set('trust proxy', 1); // Only set this *inside* the function
  }



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
