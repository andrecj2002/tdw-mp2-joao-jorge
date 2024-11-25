import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./navbar";
import ArmorSearch from "./armorsearch";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/armor-search" element={<ArmorSearch />} />
      </Routes>
    </Router>
  );
};

export default App;
