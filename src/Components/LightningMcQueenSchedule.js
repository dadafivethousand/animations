import React, { useEffect, useState } from "react";
import "../Stylesheets/LightningMcQueenSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function LightningMcQueenSchedule({ day, animationDelay = 500, animationInterval = 400 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay);
  }, [animationDelay]);

  useEffect(() => {
    if (showSchedule) {
      const classes = schedule[day] || [];
      if (classes.length === 0) return;

      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleArray((prev) => [...prev, idx]);
        }, idx * animationInterval);
      });
    }
  }, [showSchedule, day, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="lightning-container">
      <div className="lightning-header">
        <h1 className="lightning-day">{day.toUpperCase()}</h1>
      </div>

      <div className="lightning-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="lightning-class-container">
            {visibleArray.includes(idx) && (
              <div className="lightning-class speed-entry">
                <span className="lightning-class-name">{cls.name}</span>
                <span className="lightning-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LightningMcQueenSchedule;
