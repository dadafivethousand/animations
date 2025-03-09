import React, { useEffect, useState } from "react";
import "../Stylesheets/GodzillaSchedule.css"; // Custom CSS
import schedule from "../Schedule"; // Assume schedule data exists

function GodzillaSchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
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
    <div className="godzilla-container">
      {/* Green Energy Background Animation */}
      <div className={`godzilla-bg ${showSchedule ? "active" : ""}`}></div>

      <div className="godzilla-content">
        {/* Always Visible Day of the Week */}
        <h1 className="godzilla-title">{day}</h1>

        {showSchedule && (
          <div className="godzilla-classes">
            {schedule[day]?.map((cls, idx) => (
              visibleArray.includes(idx) && (
                <div key={idx} className="godzilla-class">
                  <span className="godzilla-class-name">{cls.name}</span> -{" "}
                  <span className="godzilla-class-time">{formatTime(cls.start)}</span>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GodzillaSchedule;
