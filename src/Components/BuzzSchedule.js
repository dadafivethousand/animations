import React, { useEffect, useState } from "react";
import "../Stylesheets/BuzzSchedule.css"; 
import schedule from "../Schedule"; 

function BuzzSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleClasses, setVisibleClasses] = useState([]);
  const [launch, setLaunch] = useState(false);

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

      // Activate warp speed effect after a few seconds
      setTimeout(() => {
        setLaunch(true);
      }, 2000);
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
    <div className={`buzz-container ${launch ? "warp-speed" : ""}`}>
      {/* 🚀 Starfield Background */}
      <div className="buzz-stars"></div>

      {/* 🌌 Space Warp Animation */}
      <div className="buzz-space-warp"></div>

      {/* 🚀 Buzz Lightyear Title */}
      <h1 className={`buzz-title ${showSchedule ? "visible" : ""}`}>
        {day} 🚀🪐
      </h1>

      {/* 📋 Galactic Schedule */}
      <div className="buzz-schedule-wrapper">
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`buzz-class ${visibleClasses.includes(idx) ? "zero-gravity" : ""} ${
                cls.cancelled ? "buzz-cancelled" : ""
              }`}
            >
              <div className="buzz-wings left"></div> {/* Left Wing */}
              <span className="buzz-class-text">
                {cls.name} - {formatTime(cls.start)}
              </span>
              <div className="buzz-wings right"></div> {/* Right Wing */}
            </div>
          ))}
      </div>
    </div>
  );
}

export default BuzzSchedule;
