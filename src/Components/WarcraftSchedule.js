import React, { useEffect, useState } from "react";
import "../Stylesheets/WarcraftSchedule.css"; // Custom Warcraft CSS
import schedule from "../Schedule"; // Assuming you have the data

function WarcraftSchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
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
          setVisibleArray((prev) => [...prev, idx]); // Reveal entries one by one
        }, idx * animationInterval);
      });
    }
  }, [showSchedule, day, animationInterval]);

  // Format decimal hours into AM/PM
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="warcraft-container">
      {/* Background Animation */}
      <div className={`warcraft-bg ${showSchedule ? "active" : ""}`}></div>

      <div className="warcraft-content">
        {/* Always Visible Day of the Week */}
        <h2 className="warcraft-title">{day}</h2>

        {showSchedule && (
          <div className="warcraft-classes">
            {schedule[day]?.map((cls, idx) => (
              visibleArray.includes(idx) && (
                <div key={idx} className="warcraft-class">
                  <span className="warcraft-class-name">{cls.name}</span> -{" "}
                  <span className="warcraft-class-time">{formatTime(cls.start)}</span>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WarcraftSchedule;
