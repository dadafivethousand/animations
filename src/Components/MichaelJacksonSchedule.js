import React, { useEffect, useState } from "react";
import "../Stylesheets/MichaelJacksonSchedule.css";
import schedule from "../Schedule";

export default function MichaelJacksonSchedule({ day, animationDelay = 1500, animationInterval = 400 }) {
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
    <div className="mjx-container">
      <div className="mjx-background" />
      <h1 className="mjx-title">{day.toUpperCase()}</h1>
      <div className="mjx-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="mjx-class-wrapper">
            {visibleArray.includes(idx) && (
              <div className="mjx-class" style={{ animationDelay: `${idx * 200}ms` }}>
                <span className="mjx-class-name">{cls.name}</span>
                <span className="mjx-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 
