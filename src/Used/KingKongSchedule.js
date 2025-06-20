import React, { useEffect, useState } from "react";
import "../Used/KingKongSchedule.css"
import schedule from "../RhSchedule"; 

function KingKongSchedule({ day }) {
  const [visibleClasses, setVisibleClasses] = useState([]);

  useEffect(() => {
    schedule[day]?.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleClasses((prev) => [...prev, idx]);
      }, idx * 800);
    });
  }, [day]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="kong-container">
      <div className="kong-mist"></div>
      <div className="kong-shockwave"></div>
      <h1 className="kong-title">{day}</h1>
      <div className="kong-schedule">
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div 
              key={idx} 
              className={`kong-class ${visibleClasses.includes(idx) ? "impact" : ""}`}
            >
              <span className="class-name">{cls.name}</span>
              <span className="class-time">{formatTime(cls.start)}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default KingKongSchedule;
