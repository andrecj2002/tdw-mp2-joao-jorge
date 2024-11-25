import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./navbar";
import ArmorSearch from "./armorsearch";
import ArmorDetails from "./armorsearch_details";
import MonsterSearch from "./monsearch";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/armor-search" element={<ArmorSearch />} />
        <Route path="/armor/:id" element={<ArmorDetails />} />
        <Route path="/monster-search" element={<MonsterSearch />} />
      </Routes>
    </Router>
  );
};

export default App;
