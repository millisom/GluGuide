const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

app.set('trust proxy', 1);

// Configuration imports
const corsOptions = require('./config/corsConfig');
const sessionConfig = require('./config/sessionConfig');
const setupMiddleware = require('./config/middlewareConfig');
const setupRoutes = require('./config/routesConfig');

// Load environment variables
dotenv.config();

console.log("CORS allowed origins:", corsOptions.origin);


// Setup CORS
app.use(cors(corsOptions));

// Setup session
sessionConfig(app);

// Setup middleware
setupMiddleware(app);

// Setup routes
setupRoutes(app);

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log('Server is running on http://localhost:8080');
});
