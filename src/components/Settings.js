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
    <div>
      <input onClick={handleChange} type="checkbox" id="images" name="images" checked={props.settings.images} />
      <label htmlFor="images">Images</label>
      <input
        onClick={handleChange}
        type="checkbox"
        id="description"
        name="description"
        checked={props.settings.description}
      />
      <label htmlFor="description">Description</label>
    </div>
  );
}

export default Settings;