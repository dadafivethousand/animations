import React, { useEffect, useState } from "react";
import "../Stylesheets/RealisticLightsaber.css";

export default function RealisticLightsaber() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Auto-ignite after 1 second
    const timer = setTimeout(() => setActive(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`realistic-lightsaber ${active ? "active" : ""}`}>
      {/* Multi-section metallic handle (lighter gray) */}
      <div className="lightsaber-handle">
        <div className="handle-emitter" />
        <div className="handle-grip" />
        <div className="handle-pommel" />

        {/* Decorative red button */}
        <div className="lightsaber-button" />
      </div>

      {/* Extended blade (dual-layer) — more intensely red */}
      <div className="lightsaber-blade">
        <div className="outer-blade" />
        <div className="inner-blade" />
      </div>
    </div>
  );
}
