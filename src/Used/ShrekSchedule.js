import React, { useEffect, useState } from "react";
import "../Stylesheets/ShrekSchedule.css"; // Custom CSS
import schedule from "../Schedule"; // Assume schedule data exists

function ShrekSchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay); // Controlled start time
  }, [animationDelay]);

  useEffect(() => {
    if (showSchedule) {
      const classes = schedule[day] || [];
      if (classes.length === 0) return;

      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleArray((prev) => [...prev, idx]); // Reveal one by one
        }, idx * animationInterval);
      });
    }
  }, [showSchedule, day, animationInterval]);

  // Convert decimal hours to AM/PM format
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="shrek-container">
      {/* Swamp Background */}
      <div className={`shrek-bg ${showSchedule ? "active" : ""}`}></div>

      <div className="shrek-content">
        {/* Shrek Title */}
 
        {/* Always Visible Day of the Week */}
        <h2 className="shrek-title">{day}</h2>

        {showSchedule && (
          <div className="shrek-classes">
            {schedule[day]?.map((cls, idx) => (
              visibleArray.includes(idx) && (
                <div key={idx} className="shrek-class">
                  <span className="shrek-class-name">{cls.name}</span> -{" "}
                  <span className="shrek-class-time">{formatTime(cls.start)}</span>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShrekSchedule;
