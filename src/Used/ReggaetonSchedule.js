import React, { useEffect, useState } from "react";
import "../Stylesheets/ReggaetonSchedule.css"; 
import schedule from "../Schedule"; // Using the existing schedule

function ReggaetonSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleClasses, setVisibleClasses] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (showSchedule) {
      schedule[day]?.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleClasses((prev) => [...prev, idx]);
        }, idx * 500); // Delay each class sliding in
      });
    }
  }, [showSchedule, day]);

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
    <div className="reggaeton-container">
      {/* Title for the Day */}
      <h1 className={`reggaeton-title ${showSchedule ? "visible" : ""}`}>
        {day}
      </h1>

      {/* Schedule List */}
      <div className="reggaeton-schedule-wrapper">
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`reggaeton-class ${visibleClasses.includes(idx) ? "dance-in" : ""} ${cls.cancelled ? "cancelled" : ""}`}
            >
              <span className="reggaeton-class-text">
                {cls.name} - {formatTime(cls.start)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ReggaetonSchedule;
