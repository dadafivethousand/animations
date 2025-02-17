import React, { useEffect, useState } from "react";
import schedule from "../Schedule"; // Ensure correct schedule import
import "../Stylesheets/FiftyCent.css"; // Link CSS file

function FiftyCentSchedule({ day, intervals = [400, 800, 1200, 1500, 1800] }) {
  const [visibleClasses, setVisibleClasses] = useState([]);

  useEffect(() => {
    if (schedule[day]) {
      schedule[day].forEach((_, idx) => {
        setTimeout(() => {
          setVisibleClasses((prev) => [...prev, idx]);
        }, intervals[idx] || 2000); // Use interval if provided, else default to 2000ms
      });
    }
  }, [day, intervals]);

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
    <div className="fifty-container">
      {/* Album Title at the Top */}

      {/* Schedule for the Selected Day */}
      <div className="fifty-schedule">
      <h1 className="fifty-title">{day}</h1>

        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`fifty-class ${visibleClasses.includes(idx) ? "fade-in" : ""}`}
            >
              <span className="fifty-class-text">
                {cls.name} - {formatTime(cls.start)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default FiftyCentSchedule;
