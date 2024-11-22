import React, { useState, useEffect } from 'react';

const ArmorSearch = () => {
  const [armor, setArmor] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('https://mhw-db.com/armor')
      .then(response => response.json())
      .then(data => setArmor(data))
      .catch(error => console.error('Error fetching armor:', error));
  }, []);

  const filteredArmor = armor.filter(piece => piece.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <h1>Search for Armor</h1>
      <input
        type="text"
        placeholder="Search armor..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <div>
        {filteredArmor.length > 0 ? (
          filteredArmor.map(piece => (
            <div key={piece.id}>
              <h2>{piece.name}</h2>
              <p>{piece.description}</p>
            </div>
          ))
        ) : (
          armor.map(piece => (
            <div key={piece.id}>
              <h2>{piece.name}</h2>
              <p>{piece.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ArmorSearch;