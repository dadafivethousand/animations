import React from "react";
import "../Stylesheets/Spray.css";

export default function Spray() {
  const handleSpray = () => {
    const container = document.getElementById("spray-container");
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight / 2;

    for (let i = 0; i < 100; i++) {
      const dot = document.createElement("div");
      dot.className = "spray-dot";

      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 100;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      dot.style.left = `${originX}px`;
      dot.style.top = `${originY}px`;
      dot.style.setProperty("--transform", `translate(${x}px, ${y}px) scale(1)`);

      container.appendChild(dot);

      setTimeout(() => dot.remove(), 1000);
    }
  };

  return (
    <div className="spray-wrapper">
      <button className="spray-button" onClick={handleSpray}>Spray</button>
      <div id="spray-container"></div>
    </div>
  );
}
