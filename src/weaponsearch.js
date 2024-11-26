import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import semImagem from './media/no-image-svgrepo-com.svg';

const WeaponSearch = () => {
  const [weapons, setWeapons] = useState([]);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [rarities, setRarities] = useState([]);
  const [damageTypes, setDamageTypes] = useState([]);
  const [elements, setElements] = useState([]);
  const [filteredRarity, setFilteredRarity] = useState('');
  const [filteredDamageType, setFilteredDamageType] = useState('');
  const [filteredElement, setFilteredElement] = useState('');
  const [selectedWeaponType, setSelectedWeaponType] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://mhw-db.com/weapons');
        const data = await response.json();
        setWeapons(data);

        // Extract unique values for filters
        const uniqueRarities = [...new Set(data.map(weapon => weapon.rarity))];
        const uniqueDamageTypes = [
          ...new Set(data.map(weapon => weapon.damageType || 'No damage type')),
        ];

        // Extract unique elements from weapons data
        const uniqueElements = [
          ...new Set(data.flatMap(weapon => weapon.element ? [weapon.element] : [])),
        ];

        setRarities(uniqueRarities);
        setDamageTypes(uniqueDamageTypes);
        setElements(['', ...uniqueElements]); // Include empty string for 'No element'

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply filters based on selected values
  const filteredWeapons = weapons.filter(weapon => {
    const matchesName = searchType === 'name' ? weapon.name.toLowerCase().includes(query.toLowerCase()) : true;
    const matchesRarity = filteredRarity ? weapon.rarity === parseInt(filteredRarity) : true;
    const matchesDamageType = filteredDamageType ? weapon.damageType === filteredDamageType : true;
    const matchesElement = filteredElement ? weapon.element === filteredElement : true;
    const matchesWeaponType = selectedWeaponType ? weapon.type === selectedWeaponType : true; // Match weapon type filter

    return matchesName && matchesRarity && matchesDamageType && matchesElement && matchesWeaponType;
  });

  // Paginate the filtered results
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWeapons.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredWeapons.length / itemsPerPage);
  const maxPageNumbers = 8;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-4">Search for Weapons</h1>

      <div className="flex justify-center items-center mb-4 space-x-4">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search weapons..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>

        <select
          value={searchType}
          onChange={e => setSearchType(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="name">Name</option>
          <option value="rarity">Rarity</option>
          <option value="damageType">Damage Type</option>
          <option value="element">Element</option>
        </select>

        {/* Button to open the modal */}
        <button
          onClick={() => setModalOpen(true)}
          className="p-2 bg-blue-500 text-white rounded-lg"
        >
          Select Weapon Type
        </button>
      </div>

      {/* Filter dropdowns for rarity, damage type, and element */}
      <div className="flex justify-center space-x-4 mb-4">
        {searchType === 'rarity' && (
          <select
            value={filteredRarity}
            onChange={e => setFilteredRarity(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Rarity</option>
            {rarities.map(rarity => (
              <option key={rarity} value={rarity}>
                {rarity}
              </option>
            ))}
          </select>
        )}

        {searchType === 'damageType' && (
          <select
            value={filteredDamageType}
            onChange={e => setFilteredDamageType(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Damage Type</option>
            {damageTypes.map(damageType => (
              <option key={damageType} value={damageType}>
                {damageType}
              </option>
            ))}
          </select>
        )}

        {searchType === 'element' && (
          <select
            value={filteredElement}
            onChange={e => setFilteredElement(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Element</option>
            {elements.map((element, index) => (
              <option key={index} value={element}>
                {element ? element.charAt(0).toUpperCase() + element.slice(1) : 'No Element'}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {currentItems.length > 0 ? (
            currentItems.map(weapon => (
              <div
                key={weapon.id}
                className="p-2 border rounded-lg cursor-pointer"
                onClick={() => navigate(`/weapon/${weapon.id}`)}
              >
                <h2 className="text-lg font-bold">{weapon.name}</h2>
                <div className="flex justify-center items-center space-x-2">
                  <img
                    src={weapon.assets?.image || semImagem}
                    alt={weapon.name}
                    className="w-36 h-36 object-contain"
                  />
                </div>
                <p className="text-sm">{weapon.description}</p>
              </div>
            ))
          ) : (
            <div>No results found</div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          {currentPage > 1 && (
            <button
              onClick={() => paginate(currentPage - 1)}
              className="px-3 py-2 bg-blue-500 text-white rounded"
            >
              &lt;
            </button>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(startPage - 1, endPage)
            .map(pageNumber => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-3 py-2 ${
                  currentPage === pageNumber
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-200 text-black'
                } rounded`}
              >
                {pageNumber}
              </button>
            ))}

          {currentPage < totalPages && (
            <button
              onClick={() => paginate(currentPage + 1)}
              className="px-3 py-2 bg-blue-500 text-white rounded"
            >
              &gt;
            </button>
          )}
        </div>
      )}

      {/* Modal for selecting weapon type */}
      {modalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-4 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">Select Weapon Type</h2>

      {/* Generate buttons for each unique weapon type */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from(new Set(weapons.map(weapon => weapon.type))) // Get unique weapon types
          .map((weaponType, index) => {
            // Construct the image path
            const imagePath = `/weapons/${weaponType.toLowerCase().replace(/ /g, '-')}.png`;
            
            return (
              <button
                key={index}
                onClick={() => setSelectedWeaponType(weaponType)}
                className="flex flex-col items-center p-2 border rounded-lg"
              >
                {/* Display weapon image */}
                <img
                  src={imagePath}
                  alt={weaponType}
                  className="w-16 h-16 object-contain mb-2"
                />
                <span className="text-sm font-bold">{weaponType}</span>
              </button>
            );
          })}
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setModalOpen(false)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Close
        </button>
        <button
          onClick={() => setModalOpen(false)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default WeaponSearch;
