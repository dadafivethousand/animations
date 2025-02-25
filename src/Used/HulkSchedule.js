import React, { useEffect, useState } from "react";
import schedule from "../Schedule";
import "../Stylesheets/HulkSchedule.css"; // Ensure CSS is linked

function HulkSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleClasses, setVisibleClasses] = useState([]);
  const [groundCrack, setGroundCrack] = useState(false);

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

          // Last class causes destruction
          if (idx === schedule[day].length - 1) {
            setTimeout(() => {
              setGroundCrack(true);
              setTimeout(() => setGroundCrack(false), 600);
            }, 800);
          }
        }, idx * 400);
      });
    }
  }, [showSchedule, day]);

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
    <div className={`hulk-container ${groundCrack ? "shake" : ""}`}>
      {/* Gamma Radiation Glow */}
      <div className="gamma-radiation"></div>

      {/* Energy Sparks */}
      <div className="energy-particles"></div>

      {/* Title Section */}
      <h1 className={`hulk-title ${showSchedule ? "visible" : ""}`}>
        {day}
      </h1>

      {/* Schedule Section */}
      <div className="hulk-schedule">
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`hulk-class ${visibleClasses.includes(idx) ? "smash-in" : ""}`}
            >
              <span className="hulk-class-text">
                {cls.name} - {formatTime(cls.start)}
              </span>
            </div>
          ))}
      </div>

      {/* Cracked Ground Effect */}
      <div className={`ground-crack ${groundCrack ? "active" : ""}`}></div>
    </div>
  );
}

export default HulkSchedule;
