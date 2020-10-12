import React, { useState } from 'react';
import '../tailwind.generated.css';

function Form(props) {
  const [params, setParams] = useState({});

  function handleSubmit(event) {
    event.preventDefault();
    props.onSubmit(params);
  }

  function handleChange(event) {
    setParams({
      ...params,
      [event.target.id]: event.target.value
    });
  }

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="flex flex-wrap">
        <div className="md:w-40 md:mr-8">
          <label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2" htmlFor="query">
            Samochód
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-900 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="query"
            type="text"
            placeholder="Audi"
            onChange={handleChange}
            value={params.query}
          />
          {/*<p className="text-red-500 text-xs italic">Please fill out this field.</p>*/}
        </div>
        <div className="flex mb-8">
          <div className="w-full md:w-32 mr-2">
            <label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2" htmlFor="priceFrom">
              Cena od
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-900 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="priceFrom"
              type="text"
              placeholder="10000 zł"
              onChange={handleChange}
              value={params.priceFrom}
            />
          </div>
          <div className="w-full md:w-32 mr-8">
            <label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2" htmlFor="priceTo">
              Cena do
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-900 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="priceTo"
              type="text"
              placeholder="50000 zł"
              onChange={handleChange}
              value={params.priceTo}
            />
          </div>
        </div>
        <div className="flex mb-8">
          <div className="w-full md:w-32 mr-2">
            <label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2" htmlFor="priceTo">
              Moc od
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-900 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="hpFrom"
              type="text"
              placeholder="100 KM"
              onChange={handleChange}
              value={params.hpFrom}
            />
          </div>
          <div className="w-full md:w-32 mr-8">
            <label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2" htmlFor="priceTo">
              Moc do
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-900 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="hpTo"
              type="text"
              placeholder="200 KM"
              onChange={handleChange}
              value={params.hpTo}
            />
          </div>
        </div>
        <div className="flex mb-8">
          <div className="w-full md:w-32 mr-2">
            <label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2" htmlFor="priceTo">
              Rok produkcji od
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-900 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="productionYearFrom"
              type="text"
              placeholder="2013 r."
              onChange={handleChange}
              value={params.productionYearFrom}
            />
          </div>
          <div className="w-full md:w-32 mr-8">
            <label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2" htmlFor="priceTo">
              Rok produkcji do
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-900 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="productionYearTo"
              type="text"
              placeholder="2018 r."
              onChange={handleChange}
              value={params.productionYearTo}
            />
          </div>
        </div>
        <div className="flex mb-8">
          <div className="w-full md:w-32 mr-2">
            <label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2" htmlFor="priceTo">
              Przebieg od
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-900 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="mileageFrom"
              type="text"
              placeholder="0 km"
              onChange={handleChange}
              value={params.mileageFrom}
            />
          </div>
          <div className="w-full md:w-32 mr-8">
            <label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2" htmlFor="priceTo">
              Przebieg do
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-900 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="mileageTo"
              type="text"
              placeholder="100000 km"
              onChange={handleChange}
              value={params.mileageTo}
            />
          </div>
        </div>
      </div>
      <div className="md:w-1/3">
        <button
          className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Szukaj
        </button>
      </div>
    </form>
  );
}

export default Form;
