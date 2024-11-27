import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import semImagem from './media/no-image-svgrepo-com.svg';

const WeaponDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [weapon, setWeapon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeaponDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://mhw-db.com/weapons/${id}`);
        const data = await response.json();
        setWeapon(data);
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

  // Extracting weapon attributes like slots, elements, and durability
  const slots = weapon.slots || [];
  const elements = weapon.elements || [];
  const durability = weapon.durability || [];
  const attributes = weapon.attributes || {};

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  // Function to get the icon for each element type
  const getElementIcon = (element) => {
    return `/icones/Element_${element}_Icon.svg`; // Dynamic path for the icon
  };

  return (
    <div className="weapon-details-container p-4">
      {/* Updated Back button */}
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
          style={{ width: '15rem', height: '15rem' }} // Adjusted size in rem
        />
      </div>

      <div className="relative overflow-x-auto max-w-2xl mx-auto"> {/* Adjusted table width */}
        <table className="w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-2">Attribute</th>
              <th scope="col" className="px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {/* Weapon Type */}
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Weapon Type
              </th>
              <td className="px-4 py-2">{weapon.type}</td>
            </tr>

            {/* Rarity */}
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Rarity
              </th>
              <td className="px-4 py-2">{weapon.rarity}</td>
            </tr>

            {/* Attack */}
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Attack
              </th>
              <td className="px-4 py-2">
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

            {/* Slots */}
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                Slots
              </th>
              <td className="px-4 py-2">
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

            {/* Elements */}
            {elements.length > 0 && elements.map((element, index) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                <th scope="row" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                  <img
                    src={getElementIcon(element.type)}
                    alt={`${element.type} Element`}
                    className="w-6 h-6 mr-2"
                  />
                  {element.type} Element
                </th>
                <td className="px-4 py-2">{element.damage}</td>
              </tr>
            ))}

            {/* Durability */}
            {durability.length > 0 && (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  Durability
                </th>
                <td className="px-4 py-2">
                  {durability.map((sharpness, index) => (
                    <p key={index}>{sharpness.color}: {sharpness.value}</p>
                  ))}
                </td>
              </tr>
            )}

            {/* Weapon Attributes (e.g., Affinity, Defense) */}
            {attributes.affinity && (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  Affinity
                </th>
                <td className="px-4 py-2">{attributes.affinity}%</td>
              </tr>
            )}
            {attributes.defense && (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  Defense
                </th>
                <td className="px-4 py-2">{attributes.defense}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeaponDetails;
