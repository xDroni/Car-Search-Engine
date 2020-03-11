const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const carRoutes = express.Router();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/cars', carRoutes);

carRoutes.route('/').get((req, res) => {
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
