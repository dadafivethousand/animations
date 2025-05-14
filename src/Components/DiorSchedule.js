import React, { useEffect, useState } from "react";
import "../Stylesheets/DiorSchedule.css";
import schedule from "../Schedule";

export default function DiorSchedule({ day, animationDelay = 1500, animationInterval = 500 }) {
  const [visibleArray, setVisibleArray] = useState([]);
  const [capLifted, setCapLifted] = useState(false);
  const [innerPressed, setInnerPressed] = useState(false);
  const [mistVisible, setMistVisible] = useState(false);

  useEffect(() => {
    const entries = schedule[day] || [];
    entries.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray(prev => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
    });

    // Cap lifts after 2 seconds
    const capTimer = setTimeout(() => setCapLifted(true), 2000);

    // Start continuous spray loop after 3 seconds
    const loopTimer = setTimeout(() => {
      const sprayInterval = setInterval(() => {
        setInnerPressed(true);
        setMistVisible(true);
        triggerSpray();

        // Reset innerPressed to replay animation
        setTimeout(() => setInnerPressed(false), 300);
      }, 800);

      // Cleanup sprayInterval
      return () => clearInterval(sprayInterval);
    }, 3000);

    return () => {
      clearTimeout(capTimer);
      clearTimeout(loopTimer);
    };
  }, [day, animationDelay, animationInterval]);

  const triggerSpray = () => {
    const container = document.getElementById("spray-container");
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight / 3.1;

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

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="dior-wrapper">
      <div className={`dior-cap ${capLifted ? "dior-open" : ""}`} />

      <div className={`dior-inner-cap ${innerPressed ? "dior-pressed" : ""}`}>
        <div className="dior-inner-cap-circle">
          <div className="dior-inner-cap-hole">
            {mistVisible && <div className="spray-mist" />}
          </div>
        </div>
      </div>

      <div id="spray-container"></div>

      <div className="dior-border">
        <h1 className="dior-title">{day.toUpperCase()}</h1>
        <div className="dior-grid">
          {(schedule[day] || []).map((cls, idx) =>
            visibleArray.includes(idx) ? (
              <div className="dior-card" key={idx}>
                <span className="dior-class">{cls.name}</span>
                <span className="dior-time">{formatTime(cls.start)}</span>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
