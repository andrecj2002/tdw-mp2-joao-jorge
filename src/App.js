import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./navbar";
import ArmorSearch from "./armorsearch";
import ArmorDetails from "./armorsearch_details";
import MonsterSearch from "./monsearch";
import WeaponSearch from "./weaponsearch";
import WeaponDetails from "./weaponsearch_details";
import HomePage from "./homepage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/armor-search" element={<ArmorSearch />} />
        <Route path="/armor/:id" element={<ArmorDetails />} />
        <Route path="/monster-search" element={<MonsterSearch />} />
        <Route path="/weapons" element={<WeaponSearch />} />
        <Route path="/weapon/:id" element={<WeaponDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
