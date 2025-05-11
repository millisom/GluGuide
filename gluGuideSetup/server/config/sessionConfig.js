const session = require('express-session');

const sessionConfig = (app) => {
  app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
    },
  }));
};

module.exports = sessionConfig; 