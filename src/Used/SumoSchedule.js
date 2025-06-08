import React, { useEffect, useState } from "react";
import "../Stylesheets/SumoSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function SumoSchedule({ day, animationDelay = 800, animationInterval = 500 }) {
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
    <div className="sumo-container">
      <div className="sumo-header">
        <h1 className="sumo-day">{day.toUpperCase()}</h1>
      </div>
      <div className="sumo-content">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="sumo-class-container">
            {visibleArray.includes(idx) && (
              <div className="sumo-class sumo-bow">
                <span className="sumo-class-name">{cls.name}</span>
                <span className="sumo-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SumoSchedule;
