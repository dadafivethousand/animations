import React, { useEffect, useState } from "react";
import "../Stylesheets/DragonSchedule.css";
import schedule from "../Schedule";

export default function DragonSchedule({ day, animationDelay = 900, animationInterval = 300 }) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    (schedule[day] || []).forEach((_, i) => {
      setTimeout(() => {
        setVisible((v) => [...v, i]);
      }, animationDelay + i * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (dt) => {
    const h = Math.floor(dt),
      m = Math.round((dt - h) * 60),
      hr = h % 12 || 12,
      ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="dragon-container">
      <h1
        className="dragon-title"
        style={{ "--title-delay": `${animationDelay}ms` }}
      >
        {day.toUpperCase().split("").map((char, i) => (
          <span key={i} style={{ "--i": i }}>{char}</span>
        ))}
      </h1>
      <div className="dragon-track">
        {schedule[day]?.map((cls, i) =>
          visible.includes(i) && (
            <div key={i} className="dragon-class" style={{ "--delay": `${i * 0.3}s` }}>
              <span className="dragon-name">{cls.name}</span>
              <span className="dragon-time">{formatTime(cls.start)}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
