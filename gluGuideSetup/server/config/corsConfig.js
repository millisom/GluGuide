const corsOptions = {
  origin: ['http://localhost:5173', 
           'http://127.0.0.1:5173',
           'https://brave-rock-05f2ab803.6.azurestaticapps.net'], // Frontend URLs
           
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS', 'PATCH'],
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200, // To handle legacy browsers
};

module.exports = corsOptions; 