import React, { useEffect, useState } from "react";
import "../Stylesheets/WitcherSchedule.css";
import schedule from "../Schedule";

export default function WitcherSchedule({ day, animationDelay = 2000, animationInterval = 400 }) {
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
    <div className="witcher-wrapper">
      <h3 className="witcher-title">{day.toUpperCase()}</h3>
      <div className="witcher-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="witcher-card" key={idx}>
              <div className="witcher-class">{cls.name}</div>
              <div className="witcher-time">{formatTime(cls.start)}</div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
