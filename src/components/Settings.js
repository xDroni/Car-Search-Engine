import React from 'react';
import '../tailwind.generated.css';

function Settings(props) {
  function handleChange(event) {
    const newSettings = {
      ...props.settings,
      [event.target.id]: event.target.checked
    };

    props.setSettings(newSettings);
    props.onChange(newSettings);
  }

  return (
    <div className="w-32 mb-4">
      <div>
        <input onClick={handleChange} type="checkbox" id="images" name="images" checked={props.settings.images} className="mr-2 leading-tight" />
        <label htmlFor="images">Zdjęcia</label>
      </div>
      <div>
        <input
          onClick={handleChange}
          type="checkbox"
          id="description"
          name="description"
          checked={props.settings.description}
          className="mr-2 leading-tight"
        />
        <label htmlFor="description">Opis</label>
      </div>
    </div>
  );
}

export default Settings;
