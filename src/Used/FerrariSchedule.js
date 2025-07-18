import React, { useEffect, useState } from "react";
import "./FerrariSchedule.css";
import schedule from "../RhSchedule";

export default function FerrariSchedule({ day, animationDelay = 2000, animationInterval = 150 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const entries = schedule[day] || [];
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
    <div className="ferrari-wrapper">
      <div className="stripe-bar" />
      <h3 className="ferrari-title">{day.toUpperCase()}</h3>
      <div className="ferrari-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="ferrari-card" key={idx}>
              <span className="ferrari-class">{cls.name}</span>
              <span className="ferrari-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
