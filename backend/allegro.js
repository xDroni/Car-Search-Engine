const fetch = require('node-fetch');
const secret = require('./auth.json');

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
    for (const key in json.items) {
      if (!json.items.hasOwnProperty(key)) continue;
      json.items[key].map(offer => {
        items.push({
          car_id: offer.id,
          car_name: car,
          car_description: offer.name,
          car_image: offer.images[0].url,
          car_price: offer.sellingMode.price.amount,
          car_priceCurrency: offer.sellingMode.price.currency,
          offer_category: offer.category.id
        });
      });
    }

    return {
      available: json.searchMeta.availableCount,
      total: json.searchMeta.totalCount,
      items
    };
  } catch (e) {
    return Promise.reject(json);
  }
}

module.exports = getData;
