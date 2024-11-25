import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./navbar";
import ArmorSearch from "./armorsearch";
import ArmorDetails from "./armorsearch_details";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/armor-search" element={<ArmorSearch />} />
        <Route path="/armor/:id" element={<ArmorDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
