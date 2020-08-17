const fetch = require('node-fetch');
const secret = require('./auth.json');
const fs = require('fs');
const path = require('path');

async function getCurrentAuthFile() {
  const json = fs.readFileSync(path.join(__dirname, 'auth.json'));
  const parse = JSON.parse(json);
  return parse || null;
}

async function refreshToken() {
  const authFile = await getCurrentAuthFile();
  if (!authFile.allegro.clientId || !authFile.allegro.clientSecret || !authFile.allegro.refreshToken) {
    return null;
  }
  const currentRefreshToken = authFile.allegro.refreshToken;
  const URL = `https://allegro.pl/auth/oauth/token?grant_type=refresh_token&refresh_token=${currentRefreshToken}`;
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' + Buffer.from(`${secret.allegro.clientId}:${secret.allegro.clientSecret}`).toString('base64')
    }
  });
  const json = await res.json();
  if (json.refresh_token) {
    authFile.allegro.refreshToken = json.refresh_token;
    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(__dirname, 'auth.json'), JSON.stringify(authFile, null, 2), (err, data) => {
        if (err) {
          console.error(err);
          reject();
        } else {
          console.log('Saved allegro refresh token');
          resolve(json.access_token);
        }
      });
    });
  } else {
    console.error(json);
    return null;
  }
}

module.exports = refreshToken;
