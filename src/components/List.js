import React from 'react';
import '../tailwind.generated.css';

function List(props) {
  const carItems = () => {
    const output = [];
    console.log(props);
    const allegroStyle = 'bg-orange-100 hover:bg-orange-200';
    const otomotoStyle = 'bg-red-100 hover:bg-red-200';

    for (const key in props.data) {
      props.data[key].items.map(item => {
        output.push(
          // <span>{key === 'allegro' ? 'allegro' : 'otomoto'}</span>
          <a
            className={
              'block mb-4 max-w-2xl mx-auto flex p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-500 ' +
              (key === 'allegro' ? allegroStyle : otomotoStyle)
            }
            href={item.car_fullPage}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="w-48 object-scale-down" src={item.car_image} alt={item.car_model} />
            {/* right panel */}
            <div className="flex-col my-auto mx-auto ml-6">
              <h4 className="text-2xl text-gray-900 leading-tight">{item.car_model}</h4>
              <p className="text-base text-gray-600 leading-normal mb-2">{item.car_description}</p>
              {/* extra info */}
              <div className="flex mb-2">
                <div className="flex-auto text-center mr-4">
                  <p className="text-gray-600">Rok produkcji</p>
                  <p>{item.car_productionYear}</p>
                </div>
                <div className="flex-auto text-center mr-4">
                  <p className="text-gray-600">Przebieg</p>
                  <p>{item.car_mileage}</p>
                </div>
                <div className="flex-auto text-center mr-4">
                  <p className="text-gray-600">Poj. silnika</p>
                  <p>{item.car_engineCapacity}</p>
                </div>
                <div className="flex-auto text-center mr-4">
                  <p className="text-gray-600">Rodzaj paliwa</p>
                  <p>{item.car_fuelType}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <p>{item.car_city}</p>
                <p className="text-xl">
                  {item.car_price} {item.car_priceCurrency}
                </p>
              </div>
            </div>
          </a>
        );
      });
    }
    return output;
  };

  return props.neverFetched ? null : props.isLoading ? 'loading' : carItems();
}

export default List;
