import React from "react";
import "../Stylesheets/Spear.css";

const Spear = () => {
  return (
    <div className="spear-container">
      <svg
        className="spear"
        viewBox="0 0 200 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic gradient for spearhead */}
          <linearGradient id="metal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B0B0B0" />
            <stop offset="50%" stopColor="#E0E0E0" />
            <stop offset="100%" stopColor="#A0A0A0" />
          </linearGradient>

          {/* Wood texture */}
          <pattern id="wood-texture" patternUnits="userSpaceOnUse" width="10" height="10">
            <rect width="10" height="10" fill="#8B5A2B" />
            <path d="M0,5 L10,5" stroke="#5D3A1A" strokeWidth="1" />
          </pattern>
        </defs>

        {/* SHARP Spearhead */}
        <polygon
          points="100,10 130,150 70,150"
          fill="url(#metal-gradient)"
          stroke="#222"
          strokeWidth="4"
        />

        {/* Spear shaft */}
        <rect
          x="85"
          y="150"
          width="30"
          height="600"
          fill="url(#wood-texture)"
          stroke="#4B2E0F"
          strokeWidth="3"
        />
 
      </svg>
    </div>
  );
};

export default Spear;
