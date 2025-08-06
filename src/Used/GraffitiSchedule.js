import React, { useEffect, useState } from "react";
import "./GraffitiSchedule.css";
import schedule from "../RhSchedule";

export default function GraffitiSchedule({ day, animationDelay = 1000, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const entries = schedule[day] || [];
    setVisibleArray([]); // Reset on day change
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
    <div className="graffiti-wrapper">
      <h1 className="graffiti-title">{day.toUpperCase()}</h1>
      <div className="graffiti-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className={`graffiti-card ${cls.maple ? "maple" : ""}`} key={idx}>
              <span className="graffiti-class">
                {cls.name}
                {cls.maple && <span className="maple-badge">MAPLE LOCATION</span>}
              </span>
              <span className="graffiti-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
