import React, { useEffect, useState } from "react";
import schedule from "../Schedule";
import "../Stylesheets/SpartanSchedule.css"; // Pure CSS Spartan theme

function SpartanSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    // Delay before schedule appears
    const timeout = setTimeout(() => {
      setShowSchedule(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

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
    <div className="spartan-container">
      {/* Title */}
      <h1 className={`spartan-title ${showSchedule ? "spartan-visible" : ""}`}>
        {day}
      </h1>

      {/* Schedule */}
      <div className={`spartan-schedule  `}>
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`spartan-class ${showSchedule ? "spartan-fade-in" : ""}`}
              style={{ animationDelay: `${idx * 1}s` }}
            >
              <span className="spartan-class-text">
                {cls.name} - {formatTime(cls.start)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SpartanSchedule;
