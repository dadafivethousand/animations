import React, { useEffect, useState } from "react";
import "../Stylesheets/RockySchedule.css";
import schedule from "../Schedule";

export default function RockySchedule({ day, animationDelay = 800, animationInterval = 250 }) {
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
    <div className="rocky-container">
      <h1 className="rocky-title">
        {day.toUpperCase().split("").map((char, i) => (
          <span key={i} style={{ "--i": i }}>{char}</span>
        ))}
      </h1>
      <div className="rocky-track">
        {schedule[day]?.map((cls, i) =>
          visible.includes(i) && (
            <div key={i} className="rocky-class" style={{ "--delay": `${i * 0.25}s` }}>
              <span className="rocky-name">{cls.name}</span>
              <span className="rocky-time">{formatTime(cls.start)}</span>
            </div>
          )
        )}
      </div>
 
    </div>
  );
}
