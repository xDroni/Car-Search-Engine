const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { URLSearchParams } = require('url');

async function getData(url, car, params) {
  const body = new URLSearchParams();
  for (const k in params) {
    if (!params.hasOwnProperty(k)) continue;
    body.append(k, params[k]);
  }
  const data = await fetch(url, { method: 'POST', body: body })
    .then(res => res.text())
    .then(res => res)
    .catch(err => {
      return Promise.reject(err);
    });

  const $ = cheerio.load(data);

  const count =
    $('span[class="counter"]')
      .first()
      .text()
      .replace(/[()]/g, '') || null;

  const paginationUrl =
    $('ul[class="om-pager rel"]')
      .find('li > a')
      .attr('href')
      .replace(/&page=[0-9]+/, '') || null;

  const carEntries = $('article');

  return {
    otomoto: {
      current: 1,
      total: parseInt(count.replace(/\s/g, '')),
      paginationUrl,
      items: carEntries
        .map((i, e) => {
          let image;
          try {
            image =
              $(e)
                .find('img')
                .attr('data-src')
                .trim()
                .replace(/s=([0-9]*x[0-9]*;)/, '') || null;
          } catch (e) {
            image = null;
          }

          return {
            car_id: $(e)
              .find('a[class="offer-title__link"]')
              .attr('data-ad-id')
              .trim(),
            car_name: car,
            car_model:
              $(e)
                .find('a[class="offer-title__link"]')
                .attr('title')
                .trim() || null,
            car_description:
              $(e)
                .find('h3')
                .text()
                .trim() || null,
            car_productionYear:
              $(e)
                .find('li[data-code="year"]')
                .text()
                .trim() || null,
            car_mileage:
              $(e)
                .find('li[data-code="mileage"]')
                .text()
                .trim() || null,
            car_engineCapacity:
              $(e)
                .find('li[data-code="engine_capacity"]')
                .text()
                .trim() || null,
            car_fuelType:
              $(e)
                .find('li[data-code="fuel_type"]')
                .text()
                .trim() || null,
            car_city:
              $(e)
                .find('span[class="ds-location-city"]')
                .text()
                .trim() || null,
            car_region:
              $(e)
                .find('span[class="ds-location-region"]')
                .text()
                .trim()
                .replace(/[()]/g, '') || null,
            car_fullPage:
              $(e)
                .find('a[class="offer-title__link"]')
                .attr('href')
                .trim()
                .replace(/#[A-Za-z0-9]*/g, '') || null,
            car_image: image,
            car_price: $(e)
              .find('div[class="offer-item__price"] span span:nth-child(1)')
              .text()
              .trim(),
            car_priceCurrency: $(e)
              .find('div[class="offer-item__price"] span span:nth-child(2)')
              .text()
              .trim()
          };
        })
        .get()
    }
  };
}

module.exports = getData;
