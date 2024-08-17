import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './pages/Header';
import Home from './pages/Home';
import TokenSale from './pages/TokenSale';
import Claim from './pages/Claim';
import Vesting from './pages/Vesting';

const App = () => {
  return (
    <Router>
      <Header /> {/* Ensure this is only included once */}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/tokensale" element={<TokenSale />} />
        <Route path="/claim" element={<Claim />} />
        <Route path="/vesting" element={<Vesting />} />
      </Routes>
    </Router>
  );
};

export default App;
