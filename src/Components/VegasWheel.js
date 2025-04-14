import React, { useState } from "react";
import "../Stylesheets/VegasWheel.css";

export default function VegasWheel() {
  const [spinAngle, setSpinAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const segments = [
    "JACKPOT",
    "DOUBLE",
    "LOSE A TURN",
    "HALF PRIZE",
    "FREE SPIN",
    "WIN x2",
    "BANKRUPT",
    "LUCKY DRAW",
  ];

  const handleSpin = () => {
    if (isSpinning) return; // prevent multiple spins at once

    const randomSpin = Math.floor(Math.random() * 360) + 360 * 4; 
    // e.g. random angle from 0–359, plus multiple full rotations
    setSpinAngle(randomSpin);
    setIsSpinning(true);

    // let the spin happen, then reset
    setTimeout(() => {
      setIsSpinning(false);
      // In a real app, you'd also compute the final segment here
      // e.g. ( (spinAngle % 360) / (360 / segments.length) ) => the index
    }, 4000); // match the CSS spin duration
  };

  return (
    <div className="vegas-container">
      <div className="vegas-wheel" style={{ transform: `rotate(${spinAngle}deg)` }}>
        {segments.map((text, i) => (
          <div key={i} className="vegas-segment">
            <span className="segment-label">{text}</span>
          </div>
        ))}
      </div>
      <div className="pointer"></div>

      <button className="spin-button" onClick={handleSpin} disabled={isSpinning}>
        SPIN
      </button>
    </div>
  );
}
