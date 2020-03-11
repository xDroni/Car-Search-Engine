const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const { getOtoMotoData } = require('./core');
const { bodyNames } = require('./utils');

const app = express();
const carRoutes = express.Router();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/cars', carRoutes);

carRoutes.route('/:car').get(async (req, res) => {
  const params = {
    [bodyNames.otomoto.priceFrom]: 3000,
    [bodyNames.otomoto.priceTo]: 5000,
    [bodyNames.otomoto.category]: 29,
    [bodyNames.otomoto.carName]: req.params.car
  }; //TODO hardcoded params here
  const data = await getOtoMotoData(req.params.car, params);
  res.json({ data });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
