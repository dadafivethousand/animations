import React, { useEffect, useState } from "react";
import "../Stylesheets/FiremanSchedule.css"; 
import schedule from "../Schedule"; 

function FiremanSchedule({ day }) {
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
    <div className="fire-container">
      {/* 🔥 Massive Fire Background */}
      <div className="fire-overlay"></div>

      {/* 🚨 Flashing Emergency Sirens */}
 
      {/* 🔥 Day Title */}
      <h1 className={`fire-title ${showSchedule ? "fire-visible" : ""}`}>
        {day}
    </h1>
        <div className="fire-and-truck"> <div className=""> <div className="fire-water">💧</div>  <div className={`fire ${showSchedule ? 'show-fire': ''}`}> </div> 🔥</div>  <div className={`firetruck ${showSchedule ? 'fire-drive': ''}`}>🚒</div> </div>
    

      {/* 🔥 Schedule List */}
      <div className="fire-schedule-wrapper">
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`fire-class ${visibleClasses.includes(idx) ? "fire-slide-in" : ""} ${
                cls.cancelled ? "fire-cancelled" : ""
              }`}
            >
              <span className="fire-class-text">
                {cls.name} - {formatTime(cls.start)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default FiremanSchedule;
