import React, { useEffect, useState } from "react";
import "../Stylesheets/TekkenSchedule.css";
import schedule from "../Schedule";

export default function TekkenSchedule({ day, animationDelay = 1000, animationInterval = 350 }) {
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
    <div className="tekken-wrapper">
        <div className="tekken-background-image"> </div>
      <h2 className="tekken-day">{day.toUpperCase()}</h2>
      <div className="tekken-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="tekken-card" key={idx}>
              <span className="tekken-class">{cls.name}</span>
              <span className="tekken-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
