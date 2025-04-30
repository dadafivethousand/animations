import React, { useEffect, useState } from "react";
import "../Stylesheets/PacManSchedule.css";
import schedule from "../Schedule";

export default function PacManSchedule({
  day,
  animationDelay = 1500,
  animationInterval = 300
}) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    const entries = schedule[day] || [];
    entries.forEach((_, i) => {
      setTimeout(() => {
        setVisible(prev => [...prev, i]);
      }, animationDelay + i * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = dec => {
    const h = Math.floor(dec);
    const m = Math.round((dec - h) * 60);
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}:${m.toString().padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
  };

  return (
    <div className="pacman-wrapper">
      <h1 className="pacman-title">{day.toUpperCase()}</h1>
      <div className="pacman-pellets">
        {Array(10).fill(0).map((_, i) => <span key={i} className="pellet" />)}
      </div>
      <div className="pacman-grid">
        {schedule[day]?.map((cls, idx) =>
          visible.includes(idx) && (
            <div className="pacman-card" key={idx}>
              <span>{cls.name}</span>
              <span className="pacman-time">{formatTime(cls.start)}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
