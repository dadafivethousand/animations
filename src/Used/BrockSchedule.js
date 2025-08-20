import React, { useEffect, useState } from "react";
import "../Stylesheets/BrockSchedule.css";
import schedule from "../Schedule";

export default function BrockLesnarSchedule({ day, animationDelay = 1200, animationInterval = 200 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const entries = schedule[day] || [];
    setVisibleArray([]);
    entries.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray(prev => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="brock-wrapper">
      <div className="brock-header">
        <h1 className="brock-title">{day.toUpperCase()}</h1>
    
      </div>
      <div className="brock-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="brock-card" key={idx}>
   
              <div className="brock-class">
                {cls.name}
                {cls.maple && <span className="brock-tag">MAPLE</span>}
              </div>
                         <div className="brock-time">{formatTime(cls.start)}</div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
