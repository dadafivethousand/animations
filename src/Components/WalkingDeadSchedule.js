import React, { useEffect, useState } from "react";
import "../Stylesheets/WalkingDeadSchedule.css";
import schedule from "../Schedule";

export default function WalkingDeadSchedule({ day, animationDelay = 600, animationInterval = 350 }) {
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
    <div className="twd-container">
      <div className="twd-overlay" />
      <h1 className="twd-title">{day.toUpperCase()}</h1>
      <div className="twd-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="twd-class-container">
            {visibleArray.includes(idx) && (
              <div className="twd-class" style={{ animationDelay: `${idx * 200}ms` }}>
                <span className="twd-class-name">{cls.name}</span>
                <span className="twd-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
