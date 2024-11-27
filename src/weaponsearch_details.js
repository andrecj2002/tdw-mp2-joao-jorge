import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import semImagem from './media/no-image-svgrepo-com.svg';

const WeaponDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [weapon, setWeapon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(0); // Track the current level
  const [decorations, setDecorations] = useState([]); // Store decorations data
  const [elements, setElements] = useState([]); // Store elements data

  useEffect(() => {
    const fetchWeaponDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://mhw-db.com/weapons/${id}`);
        const data = await response.json();
        setWeapon(data);
        setDecorations(data.decorations || []);  // Pull decorations from API
        setElements(data.elements || []);        // Pull elements from API
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weapon details:', error);
        setLoading(false);
      }
    };
    fetchWeaponDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!weapon) {
    return <p>No weapon details found.</p>;
  }

  // Function to render sharpness levels as a multi-colored bar (one level at a time)
  const renderSharpnessBar = (sharpness) => {
    if (!sharpness) return null;

    const colorMap = {
      red: '#FF4C4C',    // Red
      orange: '#FF9F4F', // Orange
      yellow: '#FFEC4F', // Yellow
      green: '#4CAF50',  // Green
      blue: '#42A5F5',   // Blue
      white: '#F0F4F8',  // White
      purple: '#9C27B0'  // Purple
    };

    return (
      <div style={{ width: '50%', height: '10px', display: 'flex', margin: '0 auto' }}>
        {Object.entries(sharpness).map(([color, value]) => {
          if (value > 0) {
            return (
              <div
                key={color}
                style={{
                  width: `${value}%`,
                  backgroundColor: colorMap[color] || '#000',
                  height: '100%',
                }}
              />
            );
          }
          return null;
        })}
      </div>
    );
  };

  // Extracting weapon attributes like slots, elements, and durability
  const slots = weapon.slots || [];
  const durability = weapon.durability || [];
  const attributes = weapon.attributes || {};

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleLevelChange = (event) => {
    setCurrentLevel(parseInt(event.target.value)); // Update current level based on dropdown
  };

  // Function to get the element icon path
  const getElementIcon = (elementType) => {
    // Construct the icon filename based on element type
    const elementName = elementType.charAt(0).toUpperCase() + elementType.slice(1); // Capitalize the first letter
    return `/icones/Element_${elementName}_Icon.svg`; // Assuming icons are stored in public/icones/
  };

  return (
    <div className="weapon-details-container p-4">
      <button
        onClick={handleBackClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mb-4"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold mb-4 text-center">{weapon.name}</h1>

      <div className="image-container mb-4">
        <img
          src={weapon.assets?.image || semImagem}
          alt={weapon.name}
          className="mx-auto"
          style={{ width: '15rem', height: '15rem' }}
        />
      </div>

      {/* Sharpness Bar with Title */}
      <div className="sharpness-bar-container mb-6">
        <h2 className="font-bold text-lg mb-2">Sharpness</h2> {/* Change to h2 */}
        <div className="sharpness-bar" style={{ width: '100%' }}>
          {renderSharpnessBar(durability[currentLevel])}
        </div>
        {/* Dropdown for selecting sharpness level */}
        <div className="mt-4">
          <label htmlFor="sharpness-level" className="mr-2 font-medium">Select Sharpness Level</label>
          <select
            id="sharpness-level"
            value={currentLevel}
            onChange={handleLevelChange}
            className="p-2 border rounded"
          >
            {durability.map((_, index) => (
              <option key={index} value={index}>
                Level {index + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table with increased size */}
      <div className="relative overflow-x-auto max-w-4xl mx-auto">
        <table className="w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-4">Attribute</th>
              <th scope="col" className="px-6 py-4">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Weapon Type
              </th>
              <td className="px-6 py-4">{weapon.type}</td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Rarity
              </th>
              <td className="px-6 py-4">{weapon.rarity}</td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Attack
              </th>
              <td className="px-6 py-4">
                {weapon.attack ? (
                  <>
                    <p>Base: {weapon.attack.base}</p>
                    <p>Raw: {weapon.attack.raw}</p>
                  </>
                ) : (
                  <p>N/A</p>
                )}
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Slots
              </th>
              <td className="px-6 py-4">
                {slots.length > 0 ? (
                  <ul>
                    {slots.map((slot, index) => (
                      <li key={index}>
                        {slot.size} Slot
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No slots available</p>
                )}
              </td>
            </tr>

            {/* Display Affinity */}
            {attributes.affinity !== undefined && (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  Affinity
                </th>
                <td className="px-6 py-4">{attributes.affinity}%</td>
              </tr>
            )}

            {/* Display Defense */}
            {attributes.defense !== undefined && (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  Defense
                </th>
                <td className="px-6 py-4">{attributes.defense}</td>
              </tr>
            )}

            {/* Display Decorations */}
            {decorations.length > 0 && (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  Decorations
                </th>
                <td className="px-6 py-4">
                  <ul>
                    {decorations.map((decoration, index) => (
                      <li key={index}>{decoration.name}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}

            {/* Display Elements */}
            {elements.length > 0 && (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  Elements
                </th>
                <td className="px-6 py-4">
                  {elements.map((element, index) => (
                    <div key={index} className="flex items-center">
                      <img
                        src={getElementIcon(element.type)}
                        alt={element.type}
                        className="w-6 h-6 mr-2"
                      />
                      <p>{element.type}</p>
                    </div>
                  ))}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeaponDetails;
