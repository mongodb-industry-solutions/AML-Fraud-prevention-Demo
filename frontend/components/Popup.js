// Popup.js

import React from 'react';
import '../styles/Popup.css'; 

const Popup = ({ isOpen, onClose, loading, children }) => {
  const popupClassName = isOpen ? 'popup-container open' : 'popup-container';

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <div className={popupClassName}>
      <div className="popup">
        { !loading && (
          <button className="close-button" onClick={handleClose}>
            &times;
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Popup;
