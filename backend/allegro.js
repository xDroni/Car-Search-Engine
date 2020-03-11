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
  return data.json();
}

module.exports = getData;
