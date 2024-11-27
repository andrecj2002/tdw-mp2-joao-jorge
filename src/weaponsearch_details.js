import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import semImagem from './media/no-image-svgrepo-com.svg';

const WeaponDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [weapon, setWeapon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(0); // Track the current level
  const [elements, setElements] = useState([]); // Store elements data

  useEffect(() => {
    const fetchWeaponDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://mhw-db.com/weapons/${id}`);
        const data = await response.json();
        setWeapon(data);
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

  // Renderizar Sharpness 
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

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleLevelChange = (event) => {
    setCurrentLevel(parseInt(event.target.value)); // Update current level based on dropdown
  };

  // Function to get the element icon path
  const getElementIcon = (elementType) => {
    const elementName = elementType.charAt(0).toUpperCase() + elementType.slice(1); // Capitalize the first letter
    return `/icones/Element_${elementName}_Icon.svg`; // Assuming icons are stored in public/icones/
  };

  const getWeaponVideo = (weaponType) => {
    const videoMap = {
      'switch-axe': 'https://www.youtube.com/embed/lsltopn6Zis',
      'great-sword': 'https://www.youtube.com/embed/azF6ruKpeLM',
      'long-sword': 'https://www.youtube.com/embed/ipF2H78kS10',
      'sword-and-shield': 'https://www.youtube.com/embed/apboPug3AUA',
      'dual-blades': 'https://www.youtube.com/embed/SMYqnNCx95U',
      'hammer': 'https://www.youtube.com/embed/P2Is_z19Dxc',
      'hunting-horn': 'https://www.youtube.com/embed/OG20lpdqwiw',
      'gunlance': 'https://www.youtube.com/embed/UW_2gma8Yk8',
      'charge-blade': 'https://www.youtube.com/embed/OltfWqxcGUs',
      'insect-glaive': 'https://www.youtube.com/embed/vEyRRODdvw0',
      'light-bowgun': 'https://www.youtube.com/embed/muEsWLXpNFY',
      'heavy-bowgun': 'https://www.youtube.com/embed/QESoKKFc9SY',
      'bow': 'https://www.youtube.com/embed/g3Alvh9yUuM',
    };
  
    // Return the corresponding embed video URL or default to a placeholder if not found
    return videoMap[weaponType] || 'https://www.youtube.com/embed/default'; // Default video link
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
  
<div className="sharpness-bar-container mb-6">
  <div className="flex flex-col items-center">
    <h2 className="font-bold text-lg mb-2">Sharpness</h2>
    
    <div className="sharpness-bar" style={{ width: '50%' }}>
      {renderSharpnessBar(durability[currentLevel])}
    </div>
    <div className="mt-4 flex justify-center items-center">
      <label htmlFor="sharpness-level" className="mr-2 font-medium">
        Select Sharpness Level
      </label>
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
</div>

      {/* Flex container for the table and video */}
      <div className="flex flex-wrap md:flex-nowrap justify-center items-start gap-6 max-w-[1200px] mx-auto">
  {/* Weapon details table */}
  <div
    className="relative overflow-x-auto flex-grow"
    style={{
      flexBasis: '65%',
      maxWidth: '65%',
      minWidth: '25rem',
    }}
  >
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
            Affinity
          </th>
          <td className="px-6 py-4">
            {weapon.attributes?.affinity !== undefined
              ? `${weapon.attributes.affinity}%`
              : 'N/A'}
          </td>
        </tr>
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            Defense
          </th>
          <td className="px-6 py-4">
            {weapon.attributes?.defense !== undefined
              ? weapon.attributes.defense
              : 'N/A'}
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
                    {slot.size} Slot - Rank {slot.rank}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No slots available</p>
            )}
          </td>
        </tr>
        {weapon.phial && (
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Phial Type
            </th>
            <td className="px-6 py-4">
              {weapon.phial.type}
              {weapon.phial.damage !== null && (
                <p>Damage: {weapon.phial.damage}</p>
              )}
            </td>
          </tr>
        )}
        {weapon.shelling && (
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Shelling Type
            </th>
            <td className="px-6 py-4">{weapon.shelling.type}</td>
          </tr>
        )}
        {elements.length > 0 && (
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Element
            </th>
            <td className="px-6 py-4">
              {elements.map((element, index) => (
                <div key={index} className="flex items-center">
                  <img
                    src={getElementIcon(element.type)}
                    alt={element.type}
                    className="w-5 h-5 mr-2"
                  />
                  {element.damage > 0 ? `${element.damage} ${element.type}` : ''}
                </div>
              ))}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Video Section */}
  {weapon.type && (
    <div
      className="video-container flex-shrink-0"
      style={{
        flexBasis: '35%',
        maxWidth: '35%',
        minWidth: '18.75rem',
      }}
    >
      <h2 className="pb-5 pt-5 text-center text-lg font-bold mb-[1rem]">Learn About the Weapon</h2>

      <iframe
        width="100%"
        height="100%"
        style={{ aspectRatio: '16/9' }}
        src={getWeaponVideo(weapon.type)} // Get the corresponding embed video for the weapon type
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  )}
</div>

    </div>
  );
      
};

export default WeaponDetails;
