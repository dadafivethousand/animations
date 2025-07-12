import React, { useEffect, useState } from "react";
import "./TiestoSchedule.css";
import schedule from "../Schedule";

export default function TiestoSchedule({ day, animationDelay = 1000, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const classes = schedule[day] || [];
    classes.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="tiesto-container">
      <div className="tiesto-header">
        <h1 className="tiesto-day">{day.toUpperCase()}</h1>
        <div className="lightbeam"></div>
      </div>
      <div className="tiesto-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="tiesto-class-container">
            {visibleArray.includes(idx) && (
              <div className="tiesto-class">
                <span className="tiesto-class-name">{cls.name}</span>
                <span className="tiesto-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
