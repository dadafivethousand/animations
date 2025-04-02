import React, { useEffect, useState } from "react";
import "../Stylesheets/GothicSchedule.css";
import schedule from "../Schedule";

export default function GothicSchedule({ day, animationDelay = 1000, animationInterval = 250 }) {
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
    <div className="gothic-container">
      <div className="gothic-header">
        <h1 className="gothic-day">{day.toUpperCase()}</h1>
      </div>
      <div className="gothic-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="gothic-class-container">
            {visibleArray.includes(idx) && (
              <div className="gothic-class">
                <span className="gothic-class-name">{cls.name}</span>
                <span className="gothic-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
