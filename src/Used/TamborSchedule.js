import React, { useEffect, useState } from "react";
import "../Stylesheets/TamborSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function TamborSchedule({ day, animationDelay = 1000, animationInterval = 450 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      const classes = schedule[day] || [];
      if (classes.length === 0) return;

      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleArray((prev) => [...prev, idx]);
        }, idx * animationInterval);
      });
    }, animationDelay);
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
    <div className="tambor-container">
      <div className="tambor-pattern"></div> {/* Tribal Pattern Background */}
      <div className="tambor-header">
        <h1 className="tambor-day">{day.toUpperCase()}</h1>
      </div>
      <div className="tambor-content">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="tambor-class-container">
            {visibleArray.includes(idx) && (
              <div className="tambor-class tambor-dance-groove">
                <span className="tambor-class-name">{cls.name}</span>
                <span className="tambor-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TamborSchedule;
