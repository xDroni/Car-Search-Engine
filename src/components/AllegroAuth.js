import React, { useState } from 'react';
import '../tailwind.generated.css';

function AllegroAuth() {
  const [status, setStatus] = useState(null);
  const [display, setDisplay] = useState(false);

  const URL = `http://localhost:4000/allegroAuth`;
  const authorize = async () => {
    const res = await fetch(URL);
    const json = await res.json()
    window.open(json);
  }

  const check = async () => {
    const res = await fetch(`http://localhost:4000/allegroAuth/check`);
    setStatus(res.status)
    setDisplay(true);
    setTimeout(() => {
      setDisplay(false);
    }, 3000);
  }

  return (
    <div>
      <button onClick={() => authorize()} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mb-3">Autoryzacja Allegro</button>
      <button onClick={() => check()} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mb-3">Sprawdź pomyślność autoryzacji</button>
      <p style={!display ? {'display': 'none'} : null}>{status === 200 ? 'OK' : 'Błąd podczas autoryzacji'}</p>
    </div>
  )
}

export default AllegroAuth;
