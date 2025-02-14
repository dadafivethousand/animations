import React, { useEffect, useState } from "react";
import schedule from "../Schedule";
import "../Stylesheets/RastamanSchedule.css"; // Ensure correct import path

function RastamanSchedule({ day, smokeDelay = 1000 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [startSmoke, setStartSmoke] = useState(false);

  useEffect(() => {
    // Delay before showing the schedule
    const timeout = setTimeout(() => {
      setShowSchedule(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Delay before smoke starts rising
    const smokeTimeout = setTimeout(() => {
      setStartSmoke(true);
    }, smokeDelay);
    return () => clearTimeout(smokeTimeout);
  }, [smokeDelay]);

  // Convert decimal time to 12-hour format
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="rastaman-container">
      {/* Dark Smoke Overlay */}
      <div className={`smoke-layer ${startSmoke ? "visible" : ""}`}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`smoke smoke-${i + 1}`}></div>
        ))}
      </div>

      {/* Day of the Week */}
      <h1 className={`rastaman-title ${showSchedule ? "visible" : ""}`}>
        {day}
      </h1>

      {/* Schedule */}
      <div className={`rastaman-schedule ${showSchedule ? "visible" : ""}`}>
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`rastaman-class ${showSchedule ? "slide-in" : ""}`}
              style={{ animationDelay: `${idx * 0.3}s` }}
            >
              {/* Rastaman Hat above the time */}
               <span className="rastaman-class-text">
                {cls.name} - {formatTime(cls.start)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default RastamanSchedule;
