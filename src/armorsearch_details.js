import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import semImagem from "./media/no-image-svgrepo-com.svg";

const ArmorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [armor, setArmor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [armorSetBonus, setArmorSetBonus] = useState(null); // To store armor set bonus information

  useEffect(() => {
    const fetchArmorDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://mhw-db.com/armor/${id}`);
        const data = await response.json();
        setArmor(data);
        setLoading(false);

        // Fetch armor set bonus information if the set name or ID is available
        if (data.setName) {
          const setResponse = await fetch(
            `https://mhw-db.com/armor-sets?name=${data.setName}`,
          );
          const setData = await setResponse.json();

          if (setData.length > 0 && setData[0].bonus) {
            setArmorSetBonus(setData[0].bonus); // Set the armor set bonus if it exists
          }
        }
      } catch (error) {
        console.error("Error fetching armor details:", error);
        setLoading(false);
      }
    };
    fetchArmorDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!armor) {
    return <p>No armor details found.</p>;
  }

  // Check if resistances, skills, and decorations exist to prevent errors
  const resistances = armor.resistances || {};
  const skills = armor.skills || [];

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  // Function to get the icon for each element type
  const getElementIcon = (element) => {
    return `/icones/Element_${element}_Icon.svg`; // Dynamic path for the icon
  };

  return (
    <div className="armor-details-container p-4">
      {/* Updated Back button */}
      <button
        onClick={handleBackClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mb-4"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold mb-4 text-center">{armor.name}</h1>

      <div className="image-container mb-4">
        <img
          src={armor.assets?.imageMale || semImagem}
          alt={armor.name}
          className="mx-auto"
          style={{ width: "15rem", height: "15rem" }} // Adjusted size in rem
        />
      </div>

      <div className="relative overflow-x-auto max-w-2xl mx-auto">
        {" "}
        {/* Adjusted table width */}
        <table className="w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-2">
                Attribute
              </th>
              <th scope="col" className="px-4 py-2">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Rarity
              </th>
              <td className="px-4 py-2">{armor.rarity}</td>
            </tr>

            {/* Fire Resistance with Icon next to Name */}
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center"
              >
                <img
                  src={getElementIcon("Fire")}
                  alt="Fire Resistance"
                  className="w-6 h-6 mr-2"
                />
                Fire Resistance
              </th>
              <td className="px-4 py-2">{resistances.fire || "N/A"}</td>
            </tr>

            {/* Water Resistance with Icon next to Name */}
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center"
              >
                <img
                  src={getElementIcon("Water")}
                  alt="Water Resistance"
                  className="w-6 h-6 mr-2"
                />
                Water Resistance
              </th>
              <td className="px-4 py-2">{resistances.water || "N/A"}</td>
            </tr>

            {/* Thunder Resistance with Icon next to Name */}
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center"
              >
                <img
                  src={getElementIcon("Thunder")}
                  alt="Thunder Resistance"
                  className="w-6 h-6 mr-2"
                />
                Thunder Resistance
              </th>
              <td className="px-4 py-2">{resistances.thunder || "N/A"}</td>
            </tr>

            {/* Ice Resistance with Icon next to Name */}
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center"
              >
                <img
                  src={getElementIcon("Ice")}
                  alt="Ice Resistance"
                  className="w-6 h-6 mr-2"
                />
                Ice Resistance
              </th>
              <td className="px-4 py-2">{resistances.ice || "N/A"}</td>
            </tr>

            {/* Dragon Resistance with Icon next to Name */}
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center"
              >
                <img
                  src={getElementIcon("Dragon")}
                  alt="Dragon Resistance"
                  className="w-6 h-6 mr-2"
                />
                Dragon Resistance
              </th>
              <td className="px-4 py-2">{resistances.dragon || "N/A"}</td>
            </tr>

            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Skills
              </th>
              <td className="px-4 py-2">
                {skills.length > 0 ? (
                  <ul>
                    {skills.map((skill, index) => (
                      <li key={index}>
                        {skill.skillName} {skill.level && `+${skill.level}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No skills available</p>
                )}
              </td>
            </tr>

            {/* Armor Set Skill */}
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Armor Set Skill
              </th>
              <td className="px-4 py-2">
                {armorSetBonus ? (
                  <>
                    <p>{armorSetBonus.name}</p>
                    <ul>
                      {armorSetBonus.ranks.map((rank, index) => (
                        <li key={index}>
                          {rank.pieces} pieces: {rank.skill.skillName} (Level{" "}
                          {rank.skill.level})
                          <br />
                          <span className="text-sm text-gray-500">
                            {rank.skill.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>None</p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArmorDetails;
