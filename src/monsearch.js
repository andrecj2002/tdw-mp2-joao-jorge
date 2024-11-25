import React, { useState, useEffect, useRef } from 'react';
import semImagem from './media/no-image-svgrepo-com.svg';

const MonsterSearch = () => {
  const [monsters, setMonsters] = useState([]);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('locale');
  const [loading, setLoading] = useState(true);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Fetch monsters data
  useEffect(() => {
    const fetchMonsters = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://mhw-db.com/monsters');
        const data = await response.json();
        setMonsters(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchMonsters();
  }, []);

  // Populate filtered options for dropdown based on search type
  useEffect(() => {
    if (monsters.length > 0) {
      let options = [];
      if (searchType === 'locale') {
        options = monsters.flatMap(monster => monster.locations?.map(loc => loc.name) || []);
      } else if (searchType === 'aliment') {
        options = monsters.flatMap(monster => monster.ailments?.map(ail => ail.name) || []);
      } else if (searchType === 'resistance') {
        options = monsters.flatMap(monster => monster.resistances?.map(res => res.element) || []);
      } else if (searchType === 'reward') {
        options = monsters.flatMap(monster => monster.rewards?.map(reward => reward.condition) || []);
      }
      setFilteredOptions([...new Set(options.filter(Boolean))]); // Remove duplicates and falsy values
    }
  }, [monsters, searchType]);

  // Filter monsters based on query
  const filteredMonsters = monsters.filter(monster => {
    if (searchType === 'locale') {
      return monster.locations?.some(loc => loc.name.toLowerCase().includes(query.toLowerCase()));
    }
    if (searchType === 'aliment') {
      return monster.ailments?.some(ail => ail.name.toLowerCase().includes(query.toLowerCase()));
    }
    if (searchType === 'resistance') {
      return monster.resistances?.some(res => res.element.toLowerCase().includes(query.toLowerCase()));
    }
    if (searchType === 'reward') {
      return monster.rewards?.some(reward => reward.condition.toLowerCase().includes(query.toLowerCase()));
    }
    return true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMonsters.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-4">Search for Monsters</h1>

      <div className="flex justify-center items-center mb-4 space-x-4">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search monsters..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-1/2"
        />

        {/* Search type dropdown */}
        <select
          value={searchType}
          onChange={e => setSearchType(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="locale">Locale</option>
          <option value="aliment">Aliment</option>
          <option value="resistance">Resistance</option>
          <option value="reward">Reward</option>
        </select>

        {/* Filter dropdown */}
        <select
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select {searchType}</option>
          {filteredOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Display filtered monsters */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {currentItems.map(monster => (
            <div key={monster.id} className="border p-4 rounded-lg">
              <img
                src={monster.imageUrl || semImagem}
                alt={monster.name}
                className="w-full h-32 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold">{monster.name}</h2>
              <p>Locale: {monster.locations?.map(loc => loc.name).join(', ') || 'Unknown'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: Math.ceil(filteredMonsters.length / itemsPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`p-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MonsterSearch;
