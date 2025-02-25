import React, { useEffect, useState } from "react";
import "../Stylesheets/PoliceSchedule.css"; 
import schedule from "../Schedule"; // Using the existing schedule

function PoliceSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleClasses, setVisibleClasses] = useState([]);
  
  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, 800);
  }, []);

  useEffect(() => {
    if (showSchedule) {
      schedule[day]?.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleClasses((prev) => [...prev, idx]);
        }, idx * 500);
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
    <div className="police-container">
      {/* Blinding Sirens */}
      <div className="siren siren-red"></div>
      <div className="siren siren-blue"></div>
      <div className="siren-overlay"></div>

      {/* Title for the Day */}
      <h1 className={`police-title ${showSchedule ? "visible" : ""}`}>
        {day}
      </h1>

      {/* Schedule List */}
      <div className="police-schedule-wrapper">
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`police-class ${visibleClasses.includes(idx) ? "slide-in" : ""} ${
                cls.cancelled ? "cancelled" : ""
              }`}
            >
              <span className="police-class-text">
                {cls.name} - {formatTime(cls.start)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PoliceSchedule;
