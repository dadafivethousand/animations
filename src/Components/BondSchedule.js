import React, { useEffect, useState } from "react";
import "../Stylesheets/BondSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function BondSchedule({ day, animationDelay = 1500, animationInterval = 500 }) {
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
    <div className="bond-container">
       <div className="bond-header">
        <h1 className="bond-day">{day.toUpperCase()}</h1>
      </div>
      <div className="bond-content">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="bond-class-container">
            {visibleArray.includes(idx) && (
              <div className="bond-class bond-fade-in">
                <span className="bond-class-name">{cls.name}</span>
                <span className="bond-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="bond-007">007</div>  {/* Golden 007 Text */}
    </div>
  );
}

export default BondSchedule;
