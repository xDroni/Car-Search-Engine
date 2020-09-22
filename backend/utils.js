const bodyNames = {
  otomoto: {
    priceFrom: 'search[filter_float_price:from]',
    priceTo: 'search[filter_float_price:to]',
    carName: 'search[filter_enum_make]',
    category: 'search[category_id]',
    hpFrom: 'search[filter_float_engine_power:from]',
    productionYearFrom: 'search[filter_float_year:from]',
    productionYearTo: 'search[filter_float_year:to]',
    hpTo: 'search[filter_float_engine_power:to]',
    query: 'q',
    page: 'page' // todo
  },
  allegro: {
    api: {
      priceFrom: 'price.from',
      priceTo: 'price.to',
      carName: 'phrase',
      category: 'category.id',
      location: 'location.city',
      region: 'location.province',
      productionYearFrom: 'parameter.1.from',
      productionYearTo: 'parameter.1.to',
      mileageFrom: 'parameter.4.from',
      mileageTo: 'parameter.4.to',
      engineCapacityFrom: 'parameter.5.from',
      engineCapacityTo: 'parameter.5.to',
      fuelType: 'parameter.16',
      hpFrom: 'parameter.14.from',
      hpTo: 'parameter.14.to',
      limit: 'limit',
      offset: 'offset'
    },
    web: {
      page: 'p'
    }
  }
};

module.exports = { bodyNames };
