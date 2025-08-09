import React, { useEffect, useState } from "react";
import "../Stylesheets/SafariSchedule.css";
import schedule from "../RhSchedule";

export default function SafariSchedule({ day, animationDelay = 1000, animationInterval = 200 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const entries = schedule[day] || [];
    setVisibleArray([]);
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
    <div className="safari-wrapper">
      <div className="safari-header">
        <h1 className="safari-title">{day.toUpperCase()}</h1>
      </div>
      <div className="safari-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="safari-card" key={idx}>
              <div className="safari-class">
                {cls.name}
                {cls.maple && <span className="safari-tag">MAPLE</span>}
              </div>
              <div className="safari-time">{formatTime(cls.start)}</div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
