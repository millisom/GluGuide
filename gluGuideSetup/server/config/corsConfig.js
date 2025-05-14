const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://jolly-sky-00b185510.6.azurestaticapps.net',
    'https://jolly-sky-00b185510-120.centralus.6.azurestaticapps.net' 
  ],
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
