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
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Frontend URLs
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS', 'PATCH'],
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200, // To handle legacy browsers
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

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the gluGuide API!');
  });
  

// Middleware usage
app.use(setUserIdInSession);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/currentUser', (req, res) => {
  if (req.session && req.session.userId) {
      return res.status(200).json({ userId: req.session.userId });
  }
  res.status(401).json({ message: 'User not logged in' });
});


// Import routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const glucoseRoutes = require('./routes/glucoseRoutes');
const foodItemRoutes = require('./routes/foodItemRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const mealRoutes = require('./routes/mealRoutes');
const alertRoutes = require('./routes/alertRoutes');

// Use routes
app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/', postRoutes);
app.use('/', commentRoutes);
app.use('/', adminRoutes);
app.use('/glucose', glucoseRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error Stack:', err.stack);
  console.log('Request URL:', req.originalUrl);
  res.status(500).send('Something broke!: ' + err.message);
  next();
});
app.use((req, res, next) => {
  console.log('Request Body:', req.body);
  next();
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log('Server is running on http://localhost:8080');
});
