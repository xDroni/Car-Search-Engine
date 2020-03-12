const fetch = require('node-fetch');

const secret = require('./auth.json');
const { bodyNames } = require('./utils');
const offerBaseUrl = 'https://allegro.pl/ogloszenie/';
const categoryBaseUrl = 'https://api.allegro.pl/sale/categories/';

async function getCategoriesNames(items, car) {
  const categories = {};
  for (const key in items) {
    if (!items.hasOwnProperty(key)) continue;
    for (const offer of items[key]) {
      if (!categories.hasOwnProperty(offer.category.id)) {
        const data = await fetch(`${categoryBaseUrl}${offer.category.id}`, {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.allegro.public.v1+json',
            Authorization: `Bearer ${secret.allegro.token}`
          }
        });

        const json = await data.json();
        categories[offer.category.id] = json.name;
        if (json.leaf === true) {
          const data = await fetch(`${categoryBaseUrl}${json.parent.id}`, {
            method: 'GET',
            headers: {
              Accept: 'application/vnd.allegro.public.v1+json',
              Authorization: `Bearer ${secret.allegro.token}`
            }
          });
          const parentCategory = await data.json();
          if (car.toLowerCase().indexOf(parentCategory.name.toLowerCase()) === -1)
            categories[offer.category.id] = parentCategory.name + ' ' + categories[offer.category.id];
        }
      }
    }
  }
  return categories;
}

async function getData(url, car, params) {
  if (!secret.allegro.token) {
    console.error('Cannot read allegro token');
    return;
  }

  const body = new URLSearchParams();
  for (const k in params) {
    if (!params.hasOwnProperty(k)) continue;
    body.append(k, params[k]);
  }

  const data = await fetch(`${url}${body.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.allegro.public.v1+json',
      Authorization: `Bearer ${secret.allegro.token}`
    }
  });

  const json = await data.json();
  const items = [];

  try {
    const categories = await getCategoriesNames(json.items, car);
    for (const key in json.items) {
      if (!json.items.hasOwnProperty(key)) continue;
      json.items[key].map(offer => {
        items.push({
          car_id: offer.id,
          car_name: car,
          car_model: categories[offer.category.id],
          car_description: offer.name,
          car_productionYear: null,
          car_mileage: null,
          car_engineCapacity: null,
          car_fuelType: null,
          car_city: params[bodyNames.allegro.location] || null,
          car_region: params[bodyNames.allegro.region] || null,
          car_fullPage: `${offerBaseUrl}${offer.id}`,
          car_image: offer.images[0].url,
          car_price: offer.sellingMode.price.amount,
          car_priceCurrency: offer.sellingMode.price.currency
        });
      });
    }

    return {
      available: json.searchMeta.availableCount,
      total: json.searchMeta.totalCount,
      items
    };
  } catch (e) {
    console.error(e);
    return Promise.reject(json);
  }
}

module.exports = getData;
