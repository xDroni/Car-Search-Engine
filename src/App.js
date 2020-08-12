import React, { useEffect, useState } from 'react';
import Form from './components/Form';
import List from './components/List';

const APICallURL = 'http://localhost';
const APICallPORT = 4000;
const otomotoEndpoint = 'otomoto/';
const allegroEndpoint = 'allegro/';

function App() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [neverFetched, setNeverFetched] = useState(true);
  const [apiData, setApiData] = useState({});

  const handleFormSubmit = params => {
    setFormData({
      ...params
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

    console.log(params);

    // api call
    fetch(`${APICallURL}:${APICallPORT}/${otomotoEndpoint}/${formData.query}?${params}`)
      .then(response => response.json())
      .then(data => {
        setApiData({ otomoto: data });
        setLoading(false);
        setNeverFetched(false);
      });
  }, [formData]);

  return (
    <div className="App mx-4 mt-4">
      <Form onSubmit={handleFormSubmit} />
      <List data={apiData} isLoading={loading} neverFetched={neverFetched} />
    </div>
  );
}

export default App;
