const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { URLSearchParams } = require('url');

async function getPage(car, params) {
  const URL = `https://www.otomoto.pl/osobowe/q-${car}/?`;
  const p = new URLSearchParams(params);

  const data = await fetch(URL + p)
    .then(res => res.text())
    .then(res => res)
    .catch(err => {
      return Promise.reject(err);
    });

  return parseData(data);
}

async function getData(url, car, params) {
  if(params.hasOwnProperty('page')) {
    return getPage(car, params);
  }

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

  return parseData(data, car);
}

async function parseData(data, car) {
  const $ = cheerio.load(data);

  const count =
    $('span[class="counter"]')
      .first()
      .text()
      .replace(/[()]/g, '') || null;

  const currentPage =
    parseInt($('ul[class="om-pager rel"]')
      .find('li[class="active"]')
      .text()) || null;

  const nextPage =
    $('ul[class="om-pager rel"]')
      .find('li[class="next abs"] > a')
      .attr('href') || null;

  const prevPage =
    $('ul[class="om-pager rel"]')
      .find('li[class="prev abs"] > a')
      .attr('href') || null;

  const carEntries = $('article');

  return {
    otomoto: {
      currentPage: currentPage,
      nextPage: nextPage ? currentPage + 1 : null,
      prevPage: prevPage ? currentPage - 1 : null,
      total: parseInt(count.replace(/\s/g, '')),
      items: carEntries
        .map((i, e) => {
          let image;
          try {
            image =
              $(e)
                .find('img')
                .attr('data-src')
                .trim()
                .replace(/s=([0-9]*x[0-9]*)/, '') || null;
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
