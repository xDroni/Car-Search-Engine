const bodyNames = {
  otomoto: {
    priceFrom: 'search[filter_float_price:from]',
    priceTo: 'search[filter_float_price:to]',
    carName: 'search[filter_enum_make]',
    category: 'search[category_id]:'
  },
  allegro: {
    priceFrom: 'price.from',
    priceTo: 'price.to',
    carName: 'phrase',
    category: 'category.id',
    location: 'location.city',
    limit: 'limit',
    offset: 'offset'
  }
};

module.exports = { bodyNames };
