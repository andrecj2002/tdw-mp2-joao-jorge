import React, { useState, useEffect } from 'react';

const ArmorSearch = () => {
  const [armor, setArmor] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Increased items per page

  // Fetch à API
  useEffect(() => {
    fetch('https://mhw-db.com/armor')
      .then(response => response.json())
      .then(data => {
        setArmor(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching armor:', error);
        setLoading(false);
      });
  }, []);

  const filteredArmor = armor.filter(piece => piece.name.toLowerCase().includes(query.toLowerCase()));

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
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search armor..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-1/2"
        />
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {currentItems.map(piece => (
            <div key={piece.id} className="border p-2 rounded-lg">
              <h2 className="text-lg font-bold">{piece.name}</h2>
              {piece.assets && piece.assets.imageMale && (
                <img src={piece.assets.imageMale} alt={`${piece.name} male`} className="w-full h-auto max-h-12" />
              )}
              {piece.assets && piece.assets.imageFemale && (
                <img src={piece.assets.imageFemale} alt={`${piece.name} female`} className="w-full h-auto max-h-12" />
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