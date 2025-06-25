import React, { useEffect, useState } from "react";
import "../Stylesheets/IcedOutSchedule.css";
import schedule from "../Schedule";

export default function IcedOutSchedule({ day, animationDelay = 1000, animationInterval = 300 }) {
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
    const h = Math.floor(dt);
    const m = Math.round((dt - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="ice-container">
      <h1 className="ice-title">
  {day.toUpperCase().split("").map((char, i) => (
    <span key={i} style={{ "--i": i }}>{char}</span>
  ))}
</h1>

      <div className="ice-track">
        {schedule[day]?.map((cls, i) =>
          visible.includes(i) && (
            <div key={i} className="ice-class shine-effect" style={{ "--delay": `${i * 0.3}s` }}>
              <span className="ice-name">{cls.name}</span>
              <span className="ice-time">{formatTime(cls.start)}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
