import React, { useEffect, useState } from "react";
import "../Stylesheets/TopGunSchedule.css";
import schedule from "../Schedule";

export default function TopGunSchedule({ day, animationDelay = 1000, animationInterval = 300 }) {
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
    <div className="topgun-wrapper">
      <div className="topgun-header">
        <h1>TOP GUN FLIGHT SCHEDULE</h1>
        <h2>{day.toUpperCase()}</h2>
      </div>
      <div className="topgun-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="topgun-card" key={idx}>
              <span className="topgun-class">{cls.name}</span>
              <span className="topgun-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
