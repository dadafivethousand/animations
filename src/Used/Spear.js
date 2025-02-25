import React, { useState, useEffect } from "react";
import "../Stylesheets/Spear.css";

const MAX_SPEARS = 200; // Total spears in the barrage

const Spear = () => {
  const [spearCount, setSpearCount] = useState(0);

  useEffect(() => {
    // Step 1: Fire a single spear first
    setTimeout(() => {
      setSpearCount(1);
    }, 500); // 0.5s delay for the first spear

    // Step 2: Pause, then unleash full barrage
    setTimeout(() => {
      setSpearCount(MAX_SPEARS);
    }, 2500); // After 2.5s, full barrage begins
  }, []);

  return (
    <div className="spear-container">
      {Array.from({ length: spearCount }).map((_, index) => (
        <svg
          key={index}
          className="spear"
          style={{
            top: `${Math.random() * 100}vh`, // Random vertical position
            left: `-10vw`, // Start fully off-screen on the left
            animationDuration: `${3.5 + Math.random() * 2}s`, // Ensure smooth full-screen flight
            animationDelay: index === 0 ? "0s" : `${Math.random() * 2}s`, // First spear fires immediately, others staggered
            transform: `rotate(${Math.random() * 5 - 2.5}deg)`, // Slight rotation for realism
          }}
          viewBox="0 0 50 1000"
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

          {/* 🔥 Razor-Sharp Spearhead */}
          <polygon
            points="25,10 35,120 15,120"
            fill={`url(#metal-gradient-${index})`}
            stroke="#222"
            strokeWidth="2"
          />

          {/* 🔥 Long Spear Shaft */}
          <rect
            x="22"
            y="120"
            width="6"
            height="800"
            fill="#7C4A21"
            stroke="#4B2E0F"
            strokeWidth="2"
          />

          {/* 🔥 Leather-Wrapped Grip */}
          <rect
            x="22"
            y="900"
            width="6"
            height="60"
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
