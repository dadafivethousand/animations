import React, { useEffect, useState } from "react";
import "../Stylesheets/BoltSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function BoltSchedule({ day, animationDelay = 800, animationInterval = 300 }) {
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
    <div className="bolt-container">
      <div className="bolt-lightning"></div> {/* Lightning Flash Effect */}
      <div className="bolt-header">
        <h1 className="bolt-day">{day.toUpperCase()}</h1>
      </div>
      <div className="bolt-content">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="bolt-class-container">
            {visibleArray.includes(idx) && (
              <div className="bolt-class bolt-speed-flash">
                <span className="bolt-class-name">{cls.name}</span>
                <span className="bolt-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoltSchedule;
