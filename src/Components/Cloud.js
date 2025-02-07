import React, { useEffect, useState } from "react";
import '../Stylesheets/Cloud.css'

const CloudySky = () => {
  const [moveClouds, setMoveClouds] = useState(false);
  const clouds = Array.from({ length: 10 }); // Generate 27 clouds

  useEffect(() => {
    setTimeout(() => setMoveClouds(true), 0); // Automatically trigger movement
  }, []);

  return (
    <div className="sky">
      <div className={`cloud-group left ${moveClouds ? "move-left" : ""}`}>
        {clouds.slice(0, 5).map((_, i) => (
          <div key={i} className="cloud">
            {[...Array(5)].map((_, j) => (
              <span key={j} className="puff"></span>
            ))}
          </div>
        ))}
      </div>
      <div className={`cloud-group right ${moveClouds ? "move-right" : ""}`}>
        {clouds.slice(5).map((_, i) => (
          <div key={i} className="cloud">
            {[...Array(5)].map((_, j) => (
              <span key={j} className="puff"></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CloudySky;
