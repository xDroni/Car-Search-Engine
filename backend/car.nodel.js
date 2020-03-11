const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Car = new Schema({
  car_id: {
    type: Number
  },
  car_name: {
    type: String
  },
  car_model: {
    type: String
  },
  car_description: {
    type: String
  },
  car_productionYear: {
    type: Number
  },
  car_mileage: {
    type: String
  },
  car_engineCapacity: {
    type: String
  },
  car_fuelType: {
    type: String
  },
  car_city: {
    type: String
  },
  car_region: {
    type: String
  },
  car_fullPage: {
    type: String
  },
  car_image: {
    type: String
  },
  car_price: {
    type: String
  },
  car_priceCurrency: {
    type: String
  }
});

module.exports = mongoose.model('Car', Car);
