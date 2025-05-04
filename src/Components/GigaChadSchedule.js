import React, { useEffect, useState } from "react";
import "../Stylesheets/GigaChadSchedule.css";
import schedule from "../Schedule";

export default function GigaChadSchedule({ day, animationDelay = 300, animationInterval = 150 }) {
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
    <div className="gigachad-wrapper">
      <h3 className="gigachad-title">{day.toUpperCase()}</h3>
      <div className="gigachad-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="gigachad-card" key={idx}>
              <span className="gigachad-class">{cls.name}</span>
              <span className="gigachad-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
