const fetch = require('node-fetch');
const cheerio = require('cheerio');

const authAllegro = require('./authAllegro');
const { bodyNames } = require('./utils');
const offerBaseUrl = 'https://allegro.pl/ogloszenie/';
const webScraperBaseUrl = 'https://allegro.pl/kategoria/samochody-osobowe-4029?';

async function getExtraProperties(url, params) {
  const body = new URLSearchParams();
  for (const k in params) {
    if (!params.hasOwnProperty(k)) continue;
    body.append(k, params[k]);
  }

  const response = await fetch(`${url}${body.toString()}`);
  const html = await response.text();

  const $ = cheerio.load(html);

  return $('div[class="opbox-listing"] article')
    .toArray()
    .reduce((result, e) => {
      const key = $(e).attr('data-analytics-view-value');
      // getting first 3 words of description as a car model
      const car_model = $(e)
        .find('h2')
        .text()
        .split(' ')
        .slice(0, 3)
        .join(' ');

      const info = $(e)
        .find('div > div:nth-child(2) > div > div:nth-last-child(1) > div > dl > dd')
        .toArray();

      result[key] = {
        car_model,
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
  const accessToken = await authAllegro.refreshToken();

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
    for (const key in json.items) {
      if (!json.items.hasOwnProperty(key)) continue;
      json.items[key].map(offer => {
        items.push({
          car_id: offer.id,
          car_name: car,
          car_model: extraData[offer.id] !== undefined ? extraData[offer.id].car_model : null,
          car_description: offer.name,
          car_productionYear: extraData[offer.id] !== undefined ? extraData[offer.id].car_productionYear : null,
          car_mileage: extraData[offer.id] !== undefined ? extraData[offer.id].car_mileage : null,
          car_engineCapacity: extraData[offer.id] !== undefined ? extraData[offer.id].car_engineCapacity : null,
          car_fuelType: extraData[offer.id] !== undefined ? extraData[offer.id].car_fuelType : null,
          car_city: extraData[offer.id] !== undefined ? extraData[offer.id].car_city : null,
          car_region: params[bodyNames.allegro.api.region] || null,
          car_fullPage: offer.vendor ? offer.vendor.url : `${offerBaseUrl}${offer.id}`,
          car_image: offer.images[0] !== undefined ? offer.images[0].url.replace('/original/', '/s192/') : null,
          car_price: offer.sellingMode.price.amount,
          car_priceCurrency: offer.sellingMode.price.currency
        });
      });
    }

    const available = parseInt(json.searchMeta.availableCount);
    const currentPage = `${url}${body.toString()}`;
    const nextOffset = parseInt(currentPage.match(/&offset=([0-9]+)/)[1]) + 60;
    const prevOffset = parseInt(currentPage.match(/&offset=([0-9]+)/)[1]) - 60;

    return {
      allegro: {
        available,
        total: json.searchMeta.totalCount,
        nextOffset: nextOffset <= available ? nextOffset : null,
        prevOffset: prevOffset >= 0 ? prevOffset : null,
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
