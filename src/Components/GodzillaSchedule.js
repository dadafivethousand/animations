import React, { useEffect, useState } from "react";
import "../Stylesheets/GodzillaSchedule.css"; 
import schedule from "../Schedule"; 

function GodzillaSchedule({ day }) {
  const [visibleClasses, setVisibleClasses] = useState([]);

  useEffect(() => {
    schedule[day]?.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleClasses((prev) => [...prev, idx]);
      }, idx * 150);
    });
  }, [day]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes === 0 ? "00" : minutes} ${amPm}`;
  };

  return (
    <div className="godzilla-container">
      <h1 className="godzilla-title">{day}</h1>
      <div className="godzilla-schedule">
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div 
              key={idx} 
              className={`godzilla-class ${visibleClasses.includes(idx) ? "impact" : ""}`}
            >
              <span className="class-name">{cls.name}</span>
              <span className="class-time">{formatTime(cls.start)}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default GodzillaSchedule;
