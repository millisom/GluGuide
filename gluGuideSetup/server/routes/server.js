const express = require('express');
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});


app.listen(8080, () => {
  console.log('Server running on port 8080');
});
