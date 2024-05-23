// components/FloatingButton.js

import React from 'react';
import Image from 'next/image';
import '../styles/floatingButtonStyles.css'; // Make sure to import your CSS file

const FloatingButton = ({ onClick }) => {
  return (
    <Image
      className="floating-button"
      src="/images/Add.png"
      alt="Add"
      onClick={onClick}
    /> 
  );
};

export default FloatingButton;
