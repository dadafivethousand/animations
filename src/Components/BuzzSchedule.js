import React, { useEffect, useState } from "react";
import "../Stylesheets/BuzzSchedule.css"; // Updated CSS filename
import schedule from "../Schedule"; // Assume schedule data exists

function BuzzSchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
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
    <div className="buzz-container">
      {/* Space Background */}
      <div className={`buzz-bg ${showSchedule ? "active" : ""}`}></div>

      <div className="buzz-content">
        {/* Always Visible Day of the Week */}
        <h2 className="buzz-title">{day}</h2>

        {showSchedule && (
          <div className="buzz-classes">
            {schedule[day]?.map((cls, idx) => (
              visibleArray.includes(idx) && (
                <div key={idx} className="buzz-class">
                  <span className="buzz-class-name">{cls.name}</span> -{" "}
                  <span className="buzz-class-time">{formatTime(cls.start)}</span>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BuzzSchedule;
