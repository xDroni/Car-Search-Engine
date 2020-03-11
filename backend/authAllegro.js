const fetch = require('node-fetch');
const secret = require('./auth.json');
const fs = require('fs');

async function generateToken() {
  const URL = 'https://allegro.pl/auth/oauth/token?grant_type=client_credentials';
  fetch(URL, {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' + Buffer.from(`${secret.allegro.clientId}:${secret.allegro.clientSecret}`).toString('base64')
    }
  })
    .then(res => res.json())
    .then(res => {
      if (res.access_token) {
        fs.readFile('auth.json', (err, data) => {
          const json = JSON.parse(data);
          json.allegro.token = res.access_token;
          fs.writeFile('auth.json', JSON.stringify(json, null, 2), (err, data) => {
            if (err) {
              console.error(err);
            } else {
              console.log('Saved allegro auth token');
            }
          });
        });
      }
    });
}

module.exports = generateToken();
