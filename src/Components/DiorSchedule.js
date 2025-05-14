import React, { useEffect, useState } from "react";
import "../Stylesheets/DiorSchedule.css";
import schedule from "../Schedule";

export default function DiorSchedule({ day, animationDelay = 800, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const entries = schedule[day] || [];
    entries.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray(prev => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="dior-wrapper">
      <div className="dior-cap" />
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
