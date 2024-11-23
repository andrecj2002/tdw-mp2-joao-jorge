import React, { useState, useEffect } from 'react';

const ArmorSearch = () => {
  const [armor, setArmor] = useState([]);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch à API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://mhw-db.com/armor');
        const data = await response.json();
        setArmor(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching armor:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredArmor = armor.filter(piece => {
    switch (searchType) {
      case 'name':
        return piece.name.toLowerCase().includes(query.toLowerCase());
      case 'rarity':
        return piece.rarity === parseInt(query);
      case 'rank':
        return piece.rank.toLowerCase() === query.toLowerCase();
      case 'resistance':
        return Object.values(piece.resistances).some(res => res >= parseInt(query));
      case 'slots':
        return piece.slots.length >= parseInt(query);
      case 'skills':
        return piece.skills.some(skill => skill.skillName.toLowerCase().includes(query.toLowerCase()));
      case 'decos':
        return piece.slots.some(slot => slot.rank >= parseInt(query));
      default:
        return true;
    }
  });

  // Lógica de Paginação 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredArmor.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Pagination controls
  const totalPages = Math.ceil(filteredArmor.length / itemsPerPage);
  const maxPageNumbers = 8;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-center mb-4">Search for Armor</h1>
      <div className="flex justify-center items-center mb-4 space-x-2">
        <input
          type="text"
          placeholder="Search armor..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-1/2"
        />
        <select
          value={searchType}
          onChange={e => setSearchType(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="name">Name</option>
          <option value="rarity">Rarity</option>
          <option value="rank">Rank</option>
          <option value="resistance">Resistance</option>
          <option value="slots">Slots</option>
          <option value="skills">Skills</option>
          <option value="decos">Decorations</option>
        </select>
        {searchType === 'rarity' && (
          <select
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            {[...Array(12).keys()].map(i => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        )}
        {searchType === 'rank' && (
          <select
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="low">Low</option>
            <option value="high">High</option>
            <option value="master">Master</option>
          </select>
        )}
        {searchType === 'slots' && (
          <select
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            {[1, 2, 3].map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        )}
        {searchType === 'skills' && (
          <select
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            {/* Replace with actual skills list */}
            <option value="attack">Attack</option>
            <option value="defense">Defense</option>
            <option value="health">Health</option>
          </select>
        )}
        {searchType === 'decos' && (
          <select
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            {/* Replace with actual decorations list */}
            <option value="attack">Attack</option>
            <option value="defense">Defense</option>
            <option value="health">Health</option>
          </select>
        )}
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {currentItems.map(piece => (
            <div key={piece.id} className="border p-2 rounded-lg">
              <h2 className="text-lg font-bold">{piece.name}</h2>
              {piece.assets && piece.assets.imageMale && (
                <img src={piece.assets.imageMale} alt={`${piece.name} male`} className="w-full h-auto max-h-8 max-w-20" />
              )}
              {piece.assets && piece.assets.imageFemale && (
                <img src={piece.assets.imageFemale} alt={`${piece.name} female`} className="w-full h-auto max-h-8 max-w-20" />
              )}
              <p className="text-sm">{piece.description}</p>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-4">
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
          <button
            key={startPage + index}
            onClick={() => paginate(startPage + index)}
            className={`px-2 py-1 mx-1 border rounded ${currentPage === startPage + index ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
          >
            {startPage + index}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ArmorSearch;