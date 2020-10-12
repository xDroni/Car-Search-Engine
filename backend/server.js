const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const getOtoMotoData = require('./otomoto');
const getAllegroData = require('./allegro');
const { bodyNames } = require('./utils');

const app = express();
const otomotoRoute = express.Router();
const allegroRoute = express.Router();
const allegroAuthRoute = express.Router();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/otomoto', otomotoRoute);
app.use('/allegro', allegroRoute);
app.use('/allegroAuth', allegroAuthRoute);

otomotoRoute.route('/:car').get(async (req, res) => {
  const url = 'https://www.otomoto.pl/ajax/search/list/';
  const params = {
    [bodyNames.otomoto.category]: 29,
    [bodyNames.otomoto.query]: req.params.car
  };
  for (const key in req.query) {
    if (!req.query.hasOwnProperty(key)) continue;
    params[bodyNames.otomoto[key]] = req.query[key];
  }
  getOtoMotoData(url, req.params.car, params)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

allegroAuthRoute.route('').get(async (req, res) => {
  const { getRefreshTokenForFirstTime } = require('./authAllegro');
  try {
    const text = await getRefreshTokenForFirstTime();
    res.json(text);
  } catch (e) {
    res.json(e.message);
  }
});

allegroAuthRoute.route('/check').get(async (req, res) => {
  const { refreshToken } = require('./authAllegro');
  const accessToken = await refreshToken();

  if(accessToken) {
    res.status(200).send('OK');
  } else {
    res.status(500).send('error');
  }
});

allegroAuthRoute.route('/token/:refreshToken').get(async (req, res) => {
  const { saveRefreshToken } = require('./authAllegro');
  saveRefreshToken(req.params.refreshToken)
    .then(() => {
      res.status(200);
    })
    .catch(err => {
      console.error(err);
    });
});

allegroRoute.route('/:car').get(async (req, res) => {
  const url = 'https://api.allegro.pl/offers/listing?';
  const params = {
    [bodyNames.allegro.api.category]: 4029,
    [bodyNames.allegro.api.carName]: req.params.car,
    [bodyNames.allegro.api.limit]: 60, // the maximum number of offers in a response (60 is max)
    [bodyNames.allegro.api.offset]: 0
  };
  for (const key in req.query) {
    if (!req.query.hasOwnProperty(key)) continue;
    params[bodyNames.allegro.api[key]] = req.query[key];
  }

  getAllegroData(url, req.params.car, params)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
