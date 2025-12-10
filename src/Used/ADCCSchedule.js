// ADCCSchedule.jsx — refactored to indicate MAPLE classes (inline chip)
import React, { useEffect, useState } from "react";
import "./ADCCSchedule.css";
import schedule from "../RhSchedule";

export default function ADCCSchedule({ day, animationDelay = 800, animationInterval = 150 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const entries = schedule[day] || [];
    setVisibleArray([]);
    entries.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
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
    <div className="adcc-wrapper">
      <div className="adcc-header">
        <h1 className="adcc-title">{day.toUpperCase()}</h1>
      </div>

      <div className="adcc-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="adcc-card" key={idx}>
              <div className="adcc-left">
                <div className="adcc-class">{cls.name}</div>
                {cls.maple && <span className="adcc-chip">📍 MAPLE</span>}
              </div>
              <div className="adcc-time">{formatTime(cls.start)}</div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
