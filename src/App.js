import React, { useEffect, useState } from 'react';
import Form from './components/Form';
import Settings from './components/Settings';
import List from './components/List';
import SavedCars from './components/SavedCars';
import AllegroAuth from './components/AllegroAuth';

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
  const [pagination, setPagination] = useState({ next: null, previous: null, current: 1 });
  const [currentParams, setCurrentParams] = useState(null);

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
    t = t.filter(item => item.car_fullPage !== car.car_fullPage);
    localStorage.setItem('savedCars', JSON.stringify(t));

    setSavedCars(t);
  };

  const handlePagination = async (state) => {
    if (apiData) console.log(apiData);
    const otomotoNextPage = apiData.otomoto.nextPage;
    const allegroNextOffset = apiData.allegro.nextOffset;

    const otomotoPrevPage = apiData.otomoto.prevPage;
    const allegroPrevOffset = apiData.allegro.prevOffset;

    const esc = encodeURIComponent;
    const params = Object.keys(formData)
      .map(k => {
        if (k !== 'query') {
          return esc(k) + '=' + esc(formData[k]);
        }
      })
      .join('&');

    let fetchUrls = [];

    if(state === 'next') {
      fetchUrls.push(
        `${APICallURL}:${APICallPORT}/${otomotoEndpoint}/${formData.query}?${params}&page=${otomotoNextPage}`, // otomoto call
        `${APICallURL}:${APICallPORT}/${allegroEndpoint}/${formData.query}?${params}&offset=${allegroNextOffset}` // allegro call
      )
    }

    if(state === 'prev') {
      fetchUrls.push(
        `${APICallURL}:${APICallPORT}/${otomotoEndpoint}/${formData.query}?${params}&page=${otomotoPrevPage}`, // otomoto call
        `${APICallURL}:${APICallPORT}/${allegroEndpoint}/${formData.query}?${params}&offset=${allegroPrevOffset}` // allegro call
      )
    }
    console.log(fetchUrls);

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

    });
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
      setCurrentParams(formData);
      setLoading(false);
      setNeverFetched(false);
    });
  }, [formData]);

  return (
    <div className="App mx-4 mt-4">
      <div className="flex">
        <Form onSubmit={handleFormSubmit}/>
        <div className="flex flex-col w-1/4">
          <AllegroAuth/>
          <Settings onChange={handleChangeSettings} settings={settings} setSettings={setSettings}/>
          <SavedCars savedCars={savedCars} handleDeleteSavedCar={handleDeleteSavedCar}/>
        </div>
      </div>
      <div className="flex justify-center mb-3 ">
        <button style={neverFetched ? {display: 'none'} : null} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l mr-2" onClick={() => handlePagination('prev')}>Poprzednia strona</button>
        <button style={neverFetched ? {display: 'none'} : null} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r" onClick={() => handlePagination('next')}>Następna strona</button>
      </div>
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
