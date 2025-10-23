import React from 'react';
import '../styles/OlympicRings.css';

const OlympicRings = () => {
  return (
    <div className="olympic-rings">
      <div className="rings-top">
        <div className="olympic-ring blue"></div>
        <div className="olympic-ring black"></div>
        <div className="olympic-ring red"></div>
      </div>
      <div className="rings-bottom">
        <div className="olympic-ring yellow"></div>
        <div className="olympic-ring green"></div>
      </div>
    </div>
  );
};

export default OlympicRings;
