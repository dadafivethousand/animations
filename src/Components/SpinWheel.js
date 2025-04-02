import React, { useState } from 'react';
import '../Stylesheets/SpinWheel.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SpinWheel = () => {
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    // Always stop on Thursday (index 3)
    const sliceAngle = 360 / days.length;
    const targetAngle = 360 - (sliceAngle * 3 + sliceAngle / 2); // Offset to align pointer with center of slice
    const fullSpins = 5 * 360; // 5 full spins for drama
    const totalRotation = fullSpins + targetAngle;
    setRotation(totalRotation);
  };

  return (
    <div className="spin-container">
      <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
        {days.map((day, i) => (
          <div
            key={day}
            className="slice"
            style={{
              transform: `rotate(${i * 360 / days.length}deg) skewY(-${90 - 360 / days.length}deg)`
            }}
          >
            <span>{day}</span>
          </div>
        ))}
      </div>
      <div className="pointer" />
      <button onClick={spin}>SPIN</button>
    </div>
  );
};

export default SpinWheel;