import React, { useEffect, useState } from "react";
import "../Stylesheets/ShrekSchedule.css"; 
import schedule from "../Schedule"; 

function ShrekSchedule({ day }) {
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
    <div className="shrek-container">
      {/* 🧅 Shrek Title with Moving Ears */}
      <h1 className={`shrek-title ${showSchedule ? "visible" : ""}`}>
        {day} 🧅🐉
      </h1>

      {/* 🌿 Schedule List */}
      <div className="shrek-schedule-wrapper">
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`shrek-class ${visibleClasses.includes(idx) ? "bounce-in" : ""} ${
                cls.cancelled ? "shrek-cancelled" : ""
              }`}
            >
              <div className="shrek-ears"></div> {/* Left Ear */}
              <span className="shrek-class-text">
                {cls.name} - {formatTime(cls.start)}
              </span>
              <div className="shrek-ears right"></div> {/* Right Ear */}
            </div>
          ))}
      </div>
    </div>
  );
}

export default ShrekSchedule;
