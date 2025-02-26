import React, { useEffect, useState } from "react";
import "../Stylesheets/MapleKombatSchedule.css"; 
import schedule from "../Schedule"; 

function MapleKombatSchedule({ day }) {
  const [visibleClasses, setVisibleClasses] = useState([]);

  useEffect(() => {
    schedule[day]?.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleClasses((prev) => [...prev, idx]);
      }, idx * 200);
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
    <div className="kombat-container">
      <div className="fire"></div>
      <div className="smoke"></div>
      <h1 className="kombat-title">MAPLE KOMBAT</h1>
      <div className="kombat-schedule">
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div 
              key={idx} 
              className={`kombat-class ${visibleClasses.includes(idx) ? "slam-in" : ""}`}
            >
              <span>{cls.name} - {formatTime(cls.start)}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default MapleKombatSchedule;
    