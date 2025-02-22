import React from "react";
import "../Stylesheets/Spear.css";

const NUM_SPEARS = 150; // Massive battle chaos

const Spear = () => {
  return (
    <div className="spear-container">
      {Array.from({ length: NUM_SPEARS }).map((_, index) => (
        <svg
          key={index}
          className="spear"
          style={{
            top: `${Math.random() * 100}vh`, // Random vertical spawn
            left: `${-20 - Math.random() * 50}vw`, // Starts off-screen
            animationDuration: `${0.8 + Math.random() * 1}s`, // Varying speed
            transform: `rotate(${Math.random() * 15 - 7.5}deg)`, // Random slight tilt
          }}
          viewBox="0 0 50 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Metallic gradient for spearhead */}
            <linearGradient id={`metal-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D8D8D8" />
              <stop offset="50%" stopColor="#F0F0F0" />
              <stop offset="100%" stopColor="#A0A0A0" />
            </linearGradient>

            {/* Leather grip texture */}
            <linearGradient id={`leather-wrap-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5A2D0C" />
              <stop offset="100%" stopColor="#3E1E06" />
            </linearGradient>
          </defs>

          {/* 🔥 Sharpened Spearhead */}
          <polygon
            points="25,10 35,80 15,80"
            fill={`url(#metal-gradient-${index})`}
            stroke="#222"
            strokeWidth="2"
          />

          {/* 🔥 Thin, realistic spear shaft */}
          <rect
            x="22"
            y="80"
            width="6"
            height="450"
            fill="#7C4A21"
            stroke="#4B2E0F"
            strokeWidth="2"
          />

          {/* 🔥 Leather-wrapped grip */}
          <rect
            x="22"
            y="450"
            width="6"
            height="40"
            fill={`url(#leather-wrap-${index})`}
            stroke="#3E1E06"
            strokeWidth="2"
          />
        </svg>
      ))}
    </div>
  );
};

export default Spear;
