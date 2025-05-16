const session = require('express-session');

const isProduction = process.env.NODE_ENV === 'production';

const sessionConfig = (app) => {
  app.use(session({
    name: 'gluguide.sid', // Optional, but helps identify the session
    secret: process.env.SESSION_SECRET || 'default_secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
      secure: isProduction,  // ✅ HTTPS only in production
      sameSite: isProduction ? 'none' : 'lax', // ✅ allow cross-site cookies in prod
    },
  }));
};

module.exports = sessionConfig;
