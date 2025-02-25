import React, { useEffect, useState } from "react";
import "../Stylesheets/PuckAnimation.css";

function PuckAnimation() {
  const [pucks, setPucks] = useState([]);

  useEffect(() => {
    // Add a new puck every second until we have 5 pucks
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        // Generate a random scatter offset between -150px and 150px
        const scatter = Math.floor(Math.random() * 300) - 150;
        setPucks((prev) => [...prev, { id: i, scatter }]);
      }, i * 1000);
    }
  }, []);

  return (
    <div className="puck-container">
      {pucks.map((puck) => (
        <div
          key={puck.id}
          className="puck"
          style={{ "--scatter-x": `${puck.scatter}px` }}
        ></div>
      ))}
    </div>
  );
}

export default PuckAnimation;
