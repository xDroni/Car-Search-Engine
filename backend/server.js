const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const getOtoMotoData = require('./otomoto');
const getAllegroData = require('./allegro');
const { bodyNames } = require('./utils');

const app = express();
const otomotoRoute = express.Router();
const allegroRoute = express.Router();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/otomoto', otomotoRoute);
app.use('/allegro', allegroRoute);

otomotoRoute.route('/:car').get(async (req, res) => {
  const url = 'https://www.otomoto.pl/ajax/search/list/';
  const params = {
    [bodyNames.otomoto.category]: 29,
    [bodyNames.otomoto.carName]: req.params.car
  };
  for (const key in req.query) {
    if (!req.query.hasOwnProperty(key)) continue;
    params[bodyNames.otomoto[key]] = req.query[key];
  }
  getOtoMotoData(url, req.params.car, params)
    .then(data => {
      res.json({ data });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

allegroRoute.route('/:car').get(async (req, res) => {
  const url = 'https://api.allegro.pl/offers/listing?';
  const params = {
    [bodyNames.allegro.category]: 4029,
    [bodyNames.allegro.limit]: 10,
    [bodyNames.allegro.carName]: req.params.car
  };
  for (const key in req.query) {
    if (!req.query.hasOwnProperty(key)) continue;
    params[bodyNames.allegro[key]] = req.query[key];
  }

  getAllegroData(url, req.params.car, params)
    .then(data => {
      res.json({ data });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
