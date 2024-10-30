const express = require('express');
const cors = require('cors');
// const bcrypt = require('bcryptjs');
const argon2 = require('argon2');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const loginRoute = require('./routes/loginRoute');
const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/', authRoutes);
app.use('/', loginRoute);


app.listen(8080, () => {
  console.log('Server running on port 8080');
});