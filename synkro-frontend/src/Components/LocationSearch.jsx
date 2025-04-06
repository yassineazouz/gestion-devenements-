import React, { useState, useEffect } from 'react';

const LocationSearch = ({ location, setLocation }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (input.length > 2) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${input}`)
          .then(res => res.json())
          .then(data => setSuggestions(data))
          .catch(err => console.error(err));
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [input]);

  const handleSelect = (suggestion) => {
    setLocation(suggestion.display_name);
    setInput(suggestion.display_name);
    setSuggestions([]);
  };

  return (
    <div className="autocomplete-container">
      <input
        placeholder="Add Location"
        value={input} className='location-input'
        onChange={e => setInput(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => handleSelect(s)}>
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;
