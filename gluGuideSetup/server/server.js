const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const setUserIdInSession = require('./middleware/sessionMiddleware');


// Load environment variables
dotenv.config();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
  },
}));


// Import routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const postRoutes = require('./routes/postRoutes');

// Use routes
app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/', postRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error Stack:', err.stack);
  console.log('Request URL:', req.originalUrl);
  res.status(500).send('Something broke!: ' + err.message);
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));

// middleware usage
app.use(setUserIdInSession);


// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log('Server is running on http://localhost:8080');
});
