import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/armor-search">Armor Search</Link></li>
        <li><Link to="/monster-search">Monster Search</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/auth">Login/Register</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;