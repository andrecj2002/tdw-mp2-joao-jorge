import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import semImagem from './media/no-image-svgrepo-com.svg';

const ArmorSearch = () => {
  const [armor, setArmor] = useState([]);
  const [skills, setSkills] = useState([]);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false); // Track suggestions box state

  const suggestionsRef = useRef(null); // Reference for suggestions box
  const inputRef = useRef(null); // Reference for the input field
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cachedData = localStorage.getItem('armorData');
        if (cachedData) {
          setArmor(JSON.parse(cachedData));
        } else {
          const response = await fetch('https://mhw-db.com/armor');
          const data = await response.json();
          localStorage.setItem('armorData', JSON.stringify(data));
          setArmor(data);
        }

        const skillsResponse = await fetch('https://mhw-db.com/skills');
        const skillsData = await skillsResponse.json();
        setSkills(skillsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // This will filter skills based on the query for suggestions
  useEffect(() => {
    if (searchType === 'skills') {
      setFilteredSkills(
        skills.filter(skill =>
          skill.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5) // Limit suggestions to 5
      );
    }
  }, [query, searchType, skills]);

  // This will filter armor names based on the query for suggestions
  useEffect(() => {
    if (searchType === 'name') {
      setFilteredNames(
        armor.filter(piece =>
          piece.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5) // Limit suggestions to 5
      );
    }
  }, [query, searchType, armor]);

  // Reset the page and query when searchType changes
  useEffect(() => {
    setQuery('');
    setCurrentPage(1);
  }, [searchType]);

  const filteredArmor = armor.filter(piece => {
    switch (searchType) {
      case 'name':
        return piece.name.toLowerCase().includes(query.toLowerCase());
      case 'rarity':
        return piece.rarity === parseInt(query);
      case 'rank':
        return piece.rank.toLowerCase() === query.toLowerCase();
      case 'slots':
        return piece.slots.length >= parseInt(query);
      case 'skills':
        return piece.skills.some(skill =>
          skill.skillName.toLowerCase().includes(query.toLowerCase())
        );
      default:
        return true;
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredArmor.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredArmor.length / itemsPerPage);
  const maxPageNumbers = 8;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  // Close suggestions if clicked outside
  const handleClickOutside = (e) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
      setIsSuggestionsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-center mb-4">Search for Armor</h1>
      <div className="flex justify-center items-center mb-4 space-x-2">
        <div className="relative w-1/2"> {/* Set the width to match the input field */}
          <input
            type="text"
            placeholder="Search armor..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setIsSuggestionsOpen(true);  // Open suggestions when user types
            }}
            ref={inputRef}  // Reference the input field
            className="p-2 border border-gray-300 rounded-lg w-full" // Make input take full width
          />
          
          {/* Name Suggestions for Name Search */}
          {searchType === 'name' && query && isSuggestionsOpen && (
            <ul className="absolute bg-white border w-full max-h-48 overflow-auto mt-1" ref={suggestionsRef}>
              {filteredNames.map(piece => (
                <li
                  key={piece.id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setQuery(piece.name);
                    setIsSuggestionsOpen(false); // Close suggestions on selection
                  }}
                >
                  {piece.name}
                </li>
              ))}
            </ul>
          )}

          {/* Skill Suggestions for Skills Search */}
          {searchType === 'skills' && query && isSuggestionsOpen && (
            <ul className="absolute bg-white border w-full max-h-48 overflow-auto mt-1" ref={suggestionsRef}>
              {filteredSkills.map(skill => (
                <li
                  key={skill.id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setQuery(skill.name || skill.skillName);
                    setIsSuggestionsOpen(false); // Close suggestions on selection
                  }}
                >
                  {skill.name || skill.skillName}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <select
          value={searchType}
          onChange={e => setSearchType(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="name">Name</option>
          <option value="rarity">Rarity</option>
          <option value="rank">Rank</option>
          <option value="slots">Slots</option>
          <option value="skills">Skills</option>
        </select>

        {/* Dropdown for Skills */}
        {searchType === 'skills' && (
          <select
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select a Skill</option>
            {skills.map(skill => (
              <option key={skill.id} value={skill.name || skill.skillName}>
                {skill.name || skill.skillName}
              </option>
            ))}
          </select>
        )}

        {/* Dropdown for Rarity */}
        {searchType === 'rarity' && (
          <select
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            {[...Array(12).keys()].map(i => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        )}

        {/* Dropdown for Rank */}
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

        {/* Dropdown for Slots */}
        {searchType === 'slots' && (
          <select
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            {[2, 3].map(i => (
              <option key={i} value={i}>
                {i}
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
            currentItems.map(piece => (
              <div
                key={piece.id}
                className="border p-2 rounded-lg cursor-pointer"
                onClick={() => navigate(`/armor/${piece.id}`)} // Navigate to ArmorDetails on click
              >
                <h2 className="text-lg font-bold">{piece.name}</h2>
                <div className="flex justify-center items-center space-x-2">
                  <img
                    src={piece.assets?.imageMale || semImagem}
                    alt={`${piece.name} male`}
                    className="w-36 h-36 object-contain"
                  />
                  <img
                    src={piece.assets?.imageFemale || semImagem}
                    alt={`${piece.name} female`}
                    className="w-36 h-36 object-contain"
                  />
                </div>
                <p className="text-sm">{piece.description}</p>
              </div>
            ))
          ) : (
            <div>No results found</div>
          )}
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
