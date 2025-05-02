import React, { useEffect, useState } from "react";
import "../Stylesheets/SixNineSchedule.css";
import schedule from "../Schedule";

export default function SixNineSchedule({ day, animationDelay = 300, animationInterval = 150 }) {
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
    <div className="sixnine-wrapper">
      <h3 className="sixnine-title">{day.toUpperCase()}</h3>
      <div className="sixnine-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="sixnine-card" key={idx}>
              <span className="sixnine-class">{cls.name}</span>
              <span className="sixnine-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
