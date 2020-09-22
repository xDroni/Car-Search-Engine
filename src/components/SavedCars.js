import React from 'react';
import '../tailwind.generated.css';

function SavedCars(props) {
  const savedCars = () => {
    const items = props.savedCars || [];

    return items.map(item => {
      return (
        <p key={item.car_id}>
          {item.car_model}, {item.car_price} {item.car_priceCurrency}{' '}
          <span onClick={() => props.handleDeleteSavedCar(item)}>usuń</span>
        </p>
      );
    });
  };

  return savedCars();
}

export default SavedCars;
