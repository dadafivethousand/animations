import React, { useEffect, useState } from "react";
import schedule from "../Schedule";
import "../Stylesheets/BigShowSchedule.css"; // Ensure correct import path

function BigShowSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [ringImpact, setRingImpact] = useState(false);
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

          // Last class SLAMS the ring
          if (idx === schedule[day].length - 1) {
            setTimeout(() => {
              setRingImpact(true);
              setTimeout(() => setRingImpact(false), 300);
            }, 800);
          }
        }, idx * 400);
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
    <div className={`bigshow-container ${ringImpact ? "ring-shake" : ""}`}>
      {/* Arena Lighting */}
 
      {/* Day Title */}
      <h1 className={`bigshow-title ${showSchedule ? "visible" : ""}`}>
        {day}
      </h1>

      {/* Schedule */}
      <div className="schedule-wrapper">
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`bigshow-class ${visibleClasses.includes(idx) ? "rise-up" : ""}`}
            >
              <span className="bigshow-class-text">
                {cls.name} - {formatTime(cls.start)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default BigShowSchedule;
