import React, { useEffect, useState } from "react";
import "./ScoobySchedule.css";
import schedule from "../Schedule";

export default function ScoobySchedule({ day, animationDelay = 1000, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const classes = schedule[day] || [];
    classes.forEach((_, idx) => {
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
    <div className="scooby-container">
      <h1 className="scooby-title">{day.toUpperCase()}</h1>
 

      <div className="scooby-list">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="scooby-card">
              <div className="scooby-class">{cls.name}</div>
              <div className="scooby-time">{formatTime(cls.start)}</div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
