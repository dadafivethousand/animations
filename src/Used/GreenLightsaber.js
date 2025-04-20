import React, { useEffect, useState } from "react";
import "../Stylesheets/GreenLightsaber.css";

export default function GreenLightsaber() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Auto-ignite after 1 second
    const timer = setTimeout(() => setActive(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`green-lightsaber ${active ? "active" : ""}`}>
      {/* Multi-section metallic handle (lighter gray) */}
      <div className="lightsaber-handle">
        <div className="handle-emitter" />
        <div className="handle-grip" />
        <div className="handle-pommel" />

        {/* Decorative red button (you can change color if you like) */}
        <div className="lightsaber-button" />
      </div>

      {/* Extended blade (dual-layer) — now green */}
      <div className="lightsaber-blade">
        <div className="green-outer-blade" />
        <div className="green-inner-blade" />
      </div>
    </div>
  );
}
