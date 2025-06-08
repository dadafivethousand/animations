import React, { useEffect, useState } from "react";
import "../Stylesheets/JurassicSchedule.css";
import schedule from "../Schedule";

export default function JurassicSchedule({ day, animationDelay = 1000, animationInterval = 400 }) {
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
    <div className="jurassic-wrapper">
      <h3 className="jurassic-title">{day.toUpperCase()}</h3>
      <div className="jurassic-grid">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div
              className="jurassic-card"
              key={idx}
              style={{ animationDelay: `${idx * animationInterval}ms` }}
            >
              <span className="jurassic-class">{cls.name}</span>
              <span className="jurassic-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
