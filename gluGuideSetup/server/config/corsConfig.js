const corsOptions = {
  origin: [
    'http://localhost:5173',
  ],
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
