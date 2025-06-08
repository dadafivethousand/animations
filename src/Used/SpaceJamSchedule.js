import React, { useEffect, useState } from "react";
import "../Stylesheets/SpaceJamSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function SpaceJamSchedule({ day, animationDelay = 1000, animationInterval = 350 }) {
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
    <div className="spacejam-container">
      <div className="spacejam-header">
        <h1 className="spacejam-day">{day.toUpperCase()}</h1>
      </div>
      <div className="spacejam-content">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="spacejam-class-container">
            {visibleArray.includes(idx) && (
              <div className="spacejam-class spacejam-slam">
                <span className="spacejam-class-name">{cls.name}</span>
                <span className="spacejam-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpaceJamSchedule;
