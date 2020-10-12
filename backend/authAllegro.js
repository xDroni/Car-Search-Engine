const fetch = require('node-fetch');
const secret = require('./auth.json');
const fs = require('fs');
const path = require('path');

async function getCurrentAuthFile() {
  const json = fs.readFileSync(path.join(__dirname, 'auth.json'));
  const parse = JSON.parse(json);
  return parse || null;
}

async function getRefreshTokenForFirstTime() {
  const authFile = await getCurrentAuthFile();
  if (!authFile.allegro.clientId) {
    throw new Error('ClientId is missing');
  }

  const URL = `https://allegro.pl/auth/oauth/device?client_id=${authFile.allegro.clientId}`;
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' + Buffer.from(`${authFile.allegro.clientId}:${authFile.allegro.clientSecret}`).toString('base64')
    }
  });
  const json = await res.json();

  let timesRun = 0;
  const intervalId = setInterval(() => {
    timesRun++;
    if (timesRun === 24) {
      clearInterval(intervalId);
    }

    console.log('Checking for authorization...');

    fetch(`https://allegro.pl/auth/oauth/token?grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Adevice_code&device_code=${json.device_code}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' + Buffer.from(`${authFile.allegro.clientId}:${authFile.allegro.clientSecret}`).toString('base64')
      }
    }).then(res => res.json()
      .then(json => {
        if (json.refresh_token) {
          console.log(json.refresh_token);
          fetch(`http://localhost:4000/allegroAuth/token/${json.refresh_token}`)
            .then(res => {
              console.log(res);
            }).catch(err => {
            console.error(err);
          });
          clearInterval(intervalId);
        }
      }));
  }, 10000);

  return json.verification_uri_complete;
}

async function saveRefreshToken(refreshToken) {
  const authFile = await getCurrentAuthFile();

  authFile.allegro.refreshToken = refreshToken;
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, 'auth.json'), JSON.stringify(authFile, null, 2), (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log('Saved allegro refresh token for the first time');
        resolve();
      }
    });
  });
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

module.exports = { refreshToken, getRefreshTokenForFirstTime, saveRefreshToken };
