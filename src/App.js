import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './pages/Header';
import Home from './pages/Home';
import TokenSale from './pages/TokenSale';
import Claim from './pages/Claim';
import Vesting from './pages/Vesting';
import AgreementPopup from './pages/AgreementPopup'; // Ensure correct path
import { FaTelegramPlane, FaTwitter } from 'react-icons/fa'; // Importing icons
import './App.css'; // Import the CSS file

const App = () => {
  const [agreed, setAgreed] = useState(localStorage.getItem('agreed') === 'true');

  const handleAgree = () => {
    setAgreed(true);
  };

  return (
    <div className="app-container">
      {!agreed && <AgreementPopup onAgree={handleAgree} />}
      {agreed && (
        <>
          <Router>
            <Header />
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/tokensale" element={<TokenSale />} />
              <Route path="/claim" element={<Claim />} />
              <Route path="/vesting" element={<Vesting />} />
            </Routes>
          </Router>
          <div className="footer">
            <div className="disclaimer">
              <p>
                Disclaimer: You can lose 100% of your money in crypto or by investing in our IDOs. We do our due diligence at a very high scale, but anything is possible.
              </p>
            </div>
            <div className="social-icons">
              <a href="https://t.me/yourtelegram" target="_blank" rel="noopener noreferrer" className="telegram">
                <FaTelegramPlane size={30} />
              </a>
              <a href="https://x.com/yourtwitter" target="_blank" rel="noopener noreferrer" className="twitter">
                <FaTwitter size={30} />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
