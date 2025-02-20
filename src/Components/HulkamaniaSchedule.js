import React, { useEffect, useState } from "react";
import "../Stylesheets/HulkamaniaSchedule.css";
import schedule from "../Schedule";

function HulkamaniaSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, 500);
  }, []);

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
    <div className="hulkamania-container">
      <div className="hulkamania-content">
        {/* Title */}
        <h1 className="hulkamania-title">{day}</h1>

        {/* Schedule Classes */}
        <div className="hulkamania-classes">
          {showSchedule &&
            schedule[day]?.map((cls, idx) => (
              <div
                key={idx}
                className="hulkamania-class"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <div className="hulkamania-class-name">{cls.name} - {formatTime(cls.start)}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default HulkamaniaSchedule;
