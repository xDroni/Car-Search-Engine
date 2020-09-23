import React, { useEffect, useState } from 'react';
import Form from './components/Form';
import Settings from './components/Settings';
import List from './components/List';
import SavedCars from './components/SavedCars';

const APICallURL = 'http://localhost';
const APICallPORT = 4000;
const otomotoEndpoint = 'otomoto/';
const allegroEndpoint = 'allegro/';

function App() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [neverFetched, setNeverFetched] = useState(true);
  const [settings, setSettings] = useState({
    images: true,
    price: true
  });
  const [apiData, setApiData] = useState({});

  let parsedCars = [];

  try {
    parsedCars = JSON.parse(localStorage.getItem('savedCars')) || [];
  } catch (e) {
    console.error(e);
  }

  const [savedCars, setSavedCars] = useState(parsedCars);

  const handleFormSubmit = params => {
    setFormData({
      ...params
    });
  };

  const handleChangeSettings = params => {
    setSettings({
      ...params
    });
  };

  const handleSavedCars = item => {
    const t = [...savedCars];
    if (!savedCars.some(e => e.car_fullPage === item.car_fullPage)) t.push(item);
    localStorage.setItem('savedCars', JSON.stringify(t));
    setSavedCars(t);
  };

  const handleDeleteSavedCar = car => {
    let t = [...savedCars];
    console.log(t);
    t = t.filter(item => item.car_fullPage !== car.car_fullPage);
    console.log(t);
    localStorage.setItem('savedCars', JSON.stringify(t));

    setSavedCars(t);
  };

  useEffect(() => {
    if (formData === null) return;

    const esc = encodeURIComponent;
    const params = Object.keys(formData)
      .map(k => {
        if (k !== 'query') {
          return esc(k) + '=' + esc(formData[k]);
        }
      })
      .join('&');

    const fetchUrls = [
      `${APICallURL}:${APICallPORT}/${otomotoEndpoint}/${formData.query}?${params}`, // otomoto call
      `${APICallURL}:${APICallPORT}/${allegroEndpoint}/${formData.query}?${params}` // allegro call
    ];

    const fetchPromises = fetchUrls.map(url =>
      fetch(url)
        .then(response => response.json())
        .catch(err => console.error(err))
    );
    Promise.all(fetchPromises).then(results => {
      const data = {};
      for (const result of results) {
        for (const key in result) {
          data[key] = result[key];
        }
      }

      setApiData(data);
      setLoading(false);
      setNeverFetched(false);
    });
  }, [formData]);

  return (
    <div className="App mx-4 mt-4">
      <div className="flex mr-8">
        <Form onSubmit={handleFormSubmit} />
        <Settings onChange={handleChangeSettings} settings={settings} setSettings={setSettings} />
      </div>
      <SavedCars savedCars={savedCars} handleDeleteSavedCar={handleDeleteSavedCar} />
      <List
        data={apiData}
        isLoading={loading}
        neverFetched={neverFetched}
        settings={settings}
        onChangeSavedCars={handleSavedCars}
      />
    </div>
  );
}

export default App;
