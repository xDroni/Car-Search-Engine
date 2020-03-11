const bodyNames = {
  otomoto: {
    priceFrom: 'search[filter_float_price:from]',
    priceTo: 'search[filter_float_price:to]',
    carName: 'search[filter_enum_make]',
    category: 'search[category_id]:'
  },
  allegro: {} //TODO
};

module.exports = { bodyNames };
