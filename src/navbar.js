import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  // Function to check if the link is active
  const isActive = (path) => location.pathname === path ? "border-b-2 border-blue-500 text-blue-700" : "text-gray-700 dark:text-gray-400";

  return (
    <nav className="bg-transparent border-gray-200 px-6 sm:px-8 py-4 rounded dark:bg-gray-900">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <Link to="/" className="flex items-center">
          <span
            className="self-center text-4xl font-semibold whitespace-nowrap dark:text-white"
            style={{ fontFamily: "Monster Hunter Condensed" }}
          >
            Hunter's Book
          </span>
        </Link>
        <div
          className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1"
          id="navbar-search"
        >
          <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-bold md:ml-auto">
            <li>
              <Link
                to="/"
                className={`block py-2 pr-4 pl-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 ${isActive("/")}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/armor-search"
                className={`block py-2 pr-4 pl-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 ${isActive("/armor-search")}`}
              >
                Armor Search
              </Link>
            </li>
            <li>
              <Link
                to="/monster-search"
                className={`block py-2 pr-4 pl-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 ${isActive("/monster-search")}`}
              >
                Monster Search
              </Link>
            </li>
            <li>
              <Link
                to="/weapons"
                className={`block py-2 pr-4 pl-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 ${isActive("/weapons")}`}
              >
                Weapons
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
