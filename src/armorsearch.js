import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import semImagem from "./media/no-image-svgrepo-com.svg";

const ArmorSearch = () => {
  const [armor, setArmor] = useState([]);
  const [skills, setSkills] = useState([]);
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cachedData = localStorage.getItem("armorData");
        if (cachedData) {
          setArmor(JSON.parse(cachedData));
        } else {
          const response = await fetch("https://mhw-db.com/armor");
          const data = await response.json();
          localStorage.setItem("armorData", JSON.stringify(data));
          setArmor(data);
        }

        const skillsResponse = await fetch("https://mhw-db.com/skills");
        const skillsData = await skillsResponse.json();
        setSkills(skillsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchType === "skills") {
      setFilteredSkills(
        skills
          .filter((skill) =>
            skill.name.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 5), // Limita a 5
      );
    }
  }, [query, searchType, skills]);

  // Filtro de Armaduras
  useEffect(() => {
    if (searchType === "name") {
      setFilteredNames(
        armor
          .filter((piece) =>
            piece.name.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 5), // Limita a 5
      );
    }
  }, [query, searchType, armor]);

  useEffect(() => {
    setQuery("");
    setCurrentPage(1);
  }, [searchType]);

  const filteredArmor = armor.filter((piece) => {
    switch (searchType) {
      case "name":
        return piece.name.toLowerCase().includes(query.toLowerCase());
      case "rarity":
        return piece.rarity === parseInt(query);
      case "rank":
        return piece.rank.toLowerCase() === query.toLowerCase();
      case "slots":
        return piece.slots.length >= parseInt(query);
      case "skills":
        return piece.skills.some((skill) =>
          skill.skillName.toLowerCase().includes(query.toLowerCase()),
        );
      default:
        return true;
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredArmor.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredArmor.length / itemsPerPage);
  const maxPageNumbers = 8;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  // Fecha Sugestões ao clicar whereverf
  const handleClickOutside = (e) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
      setIsSuggestionsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* Increased Title Size */}
      <h1 className="text-4xl font-bold text-center mb-4">Search for Armor</h1>

      <div className="flex justify-center items-center mb-4 space-x-4">
        {/* Procurar Inputs */}
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search armor..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsSuggestionsOpen(true); // Sugestões dinamicas
            }}
            ref={inputRef}
            className="p-2 border border-gray-300 rounded-lg w-full"
          />

          {/* Sugestões de nomes e skills */}
          {searchType === "name" && query && isSuggestionsOpen && (
            <ul
              className="absolute bg-white border w-full max-h-48 overflow-auto mt-1"
              ref={suggestionsRef}
            >
              {filteredNames.map((piece) => (
                <li
                  key={piece.id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setQuery(piece.name);
                    setIsSuggestionsOpen(false);
                  }}
                >
                  {piece.name}
                </li>
              ))}
            </ul>
          )}

          {searchType === "skills" && query && isSuggestionsOpen && (
            <ul
              className="absolute bg-white border w-full max-h-48 overflow-auto mt-1"
              ref={suggestionsRef}
            >
              {filteredSkills.map((skill) => (
                <li
                  key={skill.id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setQuery(skill.name || skill.skillName);
                    setIsSuggestionsOpen(false);
                  }}
                >
                  {skill.name || skill.skillName}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tipos de Filtros */}
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="name">Name</option>
          <option value="rarity">Rarity</option>
          <option value="rank">Rank</option>
          <option value="slots">Slots</option>
          <option value="skills">Skills</option>
        </select>
      </div>

      {/* Pull da API para os filtros */}
      <div className="flex justify-center space-x-4 mb-4">
        {searchType === "skills" && (
          <select
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select a Skill</option>
            {skills.map((skill) => (
              <option key={skill.id} value={skill.name || skill.skillName}>
                {skill.name || skill.skillName}
              </option>
            ))}
          </select>
        )}

        {searchType === "rarity" && (
          <select
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            {[...Array(12).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        )}

        {searchType === "rank" && (
          <select
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="low">Low</option>
            <option value="high">High</option>
            <option value="master">Master</option>
          </select>
        )}

        {searchType === "slots" && (
          <select
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            {[2, 3].map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="pb-8"></div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {currentItems.length > 0 ? (
            currentItems.map((piece) => (
              <div
                key={piece.id}
                className="p-2 border rounded-lg cursor-pointer"
                onClick={() => navigate(`/armor/${piece.id}`)}
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

      {/* Paginaçao */}
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
            .map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-3 py-2 ${
                  currentPage === pageNumber
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 text-black"
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
    </div>
  );
};

export default ArmorSearch;
