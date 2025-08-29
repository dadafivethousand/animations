// CowboySchedule.jsx — refactored to show MAPLE classes
import React, { useEffect, useState } from "react";
import "./CowboySchedule.css";
import schedule from "../RhSchedule";

function CowboySchedule({ day, animationDelay = 1000, animationInterval = 400 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const start = setTimeout(() => {
      const classes = schedule[day] || [];
      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleArray((prev) => [...prev, idx]);
        }, idx * animationInterval);
      });
    }, animationDelay);
    return () => clearTimeout(start);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="cowboy-container">
      <div className="cowboy-dust"></div>
      <div className="cowboy-header">
        <h1 className="cowboy-day">{day.toUpperCase()}</h1>
      </div>

      <div className="cowboy-content">
        {(schedule[day] || []).map((cls, idx) => (
          <div key={idx} className="cowboy-class-container">
            {visibleArray.includes(idx) && (
              <div className={`cowboy-class cowboy-drop-${idx % 2 === 0 ? "left" : "right"}`}>
                <div className="cowboy-left">
                  <span className="cowboy-class-name">{cls.name}</span>
                  {cls.maple && (
                    <span className="cowboy-badge">
                      <span className="cowboy-star" aria-hidden>★</span>
                      MAPLE
                    </span>
                  )}
                </div>
                <span className="cowboy-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CowboySchedule;
