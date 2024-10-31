const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


// Load environment variables
dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
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

// Import and use routes
const authRoutes = require('./routes/authRoutes');
const loginRoute = require('./routes/loginRoute');
const userRoute = require('./routes/userRoute');
app.use('/', authRoutes);
app.use('/', loginRoute);
app.use('/', userRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error Stack:', err.stack);
  console.log('Request URL:', req.originalUrl);
  res.status(500).send('Something broke!: ' + err.message);
  next();
});



// Start the server
app.listen(8080, () => {
  console.log('Server running on port 8080');
});
