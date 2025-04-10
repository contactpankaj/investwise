
import React from "react";
import "./AnimatedHomePage.css";

const AnimatedHomePage = ({ onEnter }) => {
  return (
    <div className="homepage-container" onClick={onEnter}>
      <img src="/image.png" alt="Investwise Logo" className="logo-img" />

      <div className="bars">
        <div className="bar" style={{ height: '-60px', animationDelay: '0.6s' }} />
        <div className="bar" style={{ height: '-50px', animationDelay: '0.8s' }} />
        <div className="bar" style={{ height: '-40px', animationDelay: '1s' }} />
        <div className="bar" style={{ height: '-30px', animationDelay: '1.2s' }} />
      </div>

      <h1 className="title">INVESTWISE</h1>
      <p className="subtitle">Click to begin</p>
    </div>
  );
};

export default AnimatedHomePage;
