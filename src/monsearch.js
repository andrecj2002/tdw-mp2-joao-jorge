import React, { useState, useEffect } from 'react';

const MonsterSearch = () => {
  const [monsters, setMonsters] = useState([]);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('name'); // Default to 'name' now
  const [loading, setLoading] = useState(true);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [allRewards, setAllRewards] = useState([]); // New state for all rewards
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedMonster, setSelectedMonster] = useState(null); // New state for selected monster

  // Fetch monsters data
  useEffect(() => {
    const fetchMonsters = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://mhw-db.com/monsters');
        const data = await response.json();
        setMonsters(data);

        // Collect all reward conditions from the API
        const rewards = data.flatMap(monster => {
          if (monster.rewards) {
            return monster.rewards
              .flatMap(reward => reward.conditions.map(condition => condition.condition))  // Extract conditions
              .filter(Boolean); // Remove any undefined or falsy values
          }
          return [];
        });

        // Update the state with unique reward conditions
        setAllRewards([...new Set(rewards)]);

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
      } else if (searchType === 'name') {
        options = monsters.map(monster => monster.name); // Added option for monster names
      }
      setFilteredOptions([...new Set(options.filter(Boolean))]);
    }
  }, [monsters, searchType]);

  // Filter monsters based on query and dropdown selection
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
      return monster.rewards?.some(reward =>
        reward.conditions?.some(
          condition =>
            condition.condition && condition.condition.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
    if (searchType === 'name') {
      return monster.name.toLowerCase().includes(query.toLowerCase());
    }
    return true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMonsters.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const openModal = monster => {
    setSelectedMonster(monster);
  };

  const closeModal = () => {
    setSelectedMonster(null);
  };

  // Close modal if clicked outside of the modal
  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-4">Search for Monsters</h1>

      <div className="flex justify-center items-center mb-4 space-x-4">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search for monsters or rewards..."
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
          <option value="name">Monster Name</option> {/* First option for searching by name */}
          <option value="locale">Locale</option>
          <option value="aliment">Aliment</option>
          <option value="resistance">Resistance</option>
          <option value="reward">Reward</option>
        </select>

        {/* Filter dropdown */}
        {searchType !== 'reward' && searchType !== 'name' && (
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
        )}

        {/* Rewards-specific dropdown */}
        {searchType === 'reward' && (
          <select
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Reward</option>
            {allRewards.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Display filtered monsters */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {currentItems.map(monster => (
            <div
              key={monster.id}
              className="border p-4 rounded-lg cursor-pointer"
              onClick={() => openModal(monster)}
            >
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

      {/* Modal for displaying rewards and resistances */}
      {selectedMonster && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-10"
          onClick={handleModalClick} // Close modal when clicked outside
        >
          <div className="bg-white p-6 rounded-lg w-96 relative flex flex-col">
            <h2 className="text-2xl font-semibold">{selectedMonster.name}</h2>
            <p className="mt-2 text-gray-600">Description: {selectedMonster.description || 'No description available.'}</p> {/* Monster Description */}
            <p>Locale: {selectedMonster.locations?.map(loc => loc.name).join(', ') || 'Unknown'}</p>

            <h3 className="text-xl font-semibold mt-4">Resistances:</h3>
            {selectedMonster.resistances && selectedMonster.resistances.length > 0 ? (
              <ul className="flex flex-wrap">
                {selectedMonster.resistances.map((resistance, index) => (
                  <li key={index} className="mr-4 mb-2 flex items-center">
                    <img
                      src={`/icones/Element_${resistance.element}_Icon.svg`}
                      alt={resistance.element}
                      className="w-6 h-6 mr-2"
                    />
                    <strong>{resistance.element}</strong>: {resistance.value}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No resistances available.</p>
            )}

{selectedMonster.rewards && selectedMonster.rewards.length > 0 ? (
  <ul>
    {selectedMonster.rewards.map((reward, index) => (
      <li key={index}>
        <strong>{reward.item.name}</strong>: 
        {/* Display the rarity as stars */}
        <span className="ml-2">
          {Array.from({ length: reward.item.rarity }).map((_, i) => (
            <img 
              key={i} 
              src="/icones/Star.svg"  // Path to the Star.svg image located in the public/icones folder
              alt="star" 
              className="inline-block w-4 h-4" 
            />
          ))}
        </span>
      </li>
    ))}
  </ul>
) : (
  <p>No rewards available.</p>
)}


            <div className="mt-auto text-center">
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white py-2 px-4 rounded-full mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonsterSearch;
