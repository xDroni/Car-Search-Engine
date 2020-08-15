const fetch = require('node-fetch');
const cheerio = require('cheerio');

const authAllegro = require('./authAllegro');
const { bodyNames } = require('./utils');
const offerBaseUrl = 'https://allegro.pl/ogloszenie/';
const categoryBaseUrl = 'https://api.allegro.pl/sale/categories/';
const webScraperBaseUrl = 'https://allegro.pl/kategoria/samochody-osobowe-4029?';

async function getCategoriesNames(items, car, accessToken) {
  const categories = {};
  for (const key in items) {
    if (!items.hasOwnProperty(key)) continue;
    for (const offer of items[key]) {
      if (!categories.hasOwnProperty(offer.category.id)) {
        const data = await fetch(`${categoryBaseUrl}${offer.category.id}`, {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.allegro.public.v1+json',
            Authorization: `Bearer ${accessToken}`
          }
        });

        const json = await data.json();
        categories[offer.category.id] = json.name;
        if (json.leaf === true) {
          const data = await fetch(`${categoryBaseUrl}${json.parent.id}`, {
            method: 'GET',
            headers: {
              Accept: 'application/vnd.allegro.public.v1+json',
              Authorization: `Bearer ${accessToken}`
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

async function getExtraProperties(url, params) {
  const body = new URLSearchParams();
  for (const k in params) {
    if (!params.hasOwnProperty(k)) continue;
    body.append(k, params[k]);
  }

  const response = await fetch(`${url}${body.toString()}`);
  const html = await response.text();

  const $ = cheerio.load(html);

  return $('div[id="opbox-listing--base"] article')
    .toArray()
    .reduce((result, e) => {
      const key = $(e).attr('data-analytics-view-value');
      const info = $(e)
        .find('div > div:nth-child(2) > div > div:nth-last-child(1) > div > dl > dd')
        .toArray();

      result[key] = {
        car_condition: $(info[0]).text(),
        car_productionYear: $(info[1]).text(),
        car_mileage: $(info[2]).text(),
        car_engineCapacity: $(info[3]).text(),
        car_fuelType: $(info[4]).text(),
        car_city: $(e)
          .find('div > div:nth-child(2) > div:nth-child(4)')
          .text()
      };
      return result;
    }, {});
}

async function getData(url, car, params) {
  const accessToken = await authAllegro();

  if (!accessToken) {
    console.error('Cannot get allegro token');
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
      Authorization: `Bearer ${accessToken}`
    }
  });

  const extraData = await getExtraProperties(webScraperBaseUrl, params);

  const json = await data.json();
  const items = [];

  try {
    const categories = await getCategoriesNames(json.items, car, accessToken);
    for (const key in json.items) {
      if (!json.items.hasOwnProperty(key)) continue;
      json.items[key].map(offer => {
        items.push({
          car_id: offer.id,
          car_name: car,
          car_model: categories[offer.category.id],
          car_description: offer.name,
          car_productionYear: extraData[offer.id].car_productionYear ? extraData[offer.id].car_productionYear : null,
          car_mileage: extraData[offer.id].car_mileage ? extraData[offer.id].car_mileage : null,
          car_engineCapacity: extraData[offer.id].car_engineCapacity ? extraData[offer.id].car_engineCapacity : null,
          car_fuelType: extraData[offer.id].car_fuelType ? extraData[offer.id].car_fuelType : null,
          car_city: extraData[offer.id].car_city ? extraData[offer.id].car_city : null,
          car_region: params[bodyNames.allegro.api.region] || null,
          car_fullPage: offer.vendor ? offer.vendor.url : `${offerBaseUrl}${offer.id}`,
          car_image: offer.images[0].url.replace('/original/', '/s192/'),
          car_price: offer.sellingMode.price.amount,
          car_priceCurrency: offer.sellingMode.price.currency
        });
      });
    }

    return {
      allegro: {
        available: json.searchMeta.availableCount,
        total: json.searchMeta.totalCount,
        items
      }
    };
  } catch (e) {
    console.error(e);
    return Promise.reject({
      allegro: {
        available: 0,
        total: 0,
        items: []
      }
    });
  }
}

module.exports = getData;
