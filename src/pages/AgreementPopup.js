import React, { useState, useEffect } from 'react';
import './AgreementPopup.css';

const AgreementPopup = ({ onAgree }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check local storage for agreement status
    const hasAgreed = localStorage.getItem('agreed');
    if (!hasAgreed) {
      setIsVisible(true);
    }
  }, []);

  const handleAgree = () => {
    setIsVisible(false);
    localStorage.setItem('agreed', 'true'); // Store agreement status in local storage
    onAgree();
  };

  return (
    isVisible && (
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>Terms & Conditions</h2>
          <p>
            By entering this website, you confirm that you are not a citizen or resident of any sanctioned country.
          </p>
          <button onClick={handleAgree} className="agree-button">
            I Agree
          </button>
        </div>
      </div>
    )
  );
};

export default AgreementPopup;
