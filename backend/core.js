const { getData } = require('./otomoto');

async function getOtoMotoData(car, params) {
  return getData(car, params);
}

module.exports = { getOtoMotoData };
