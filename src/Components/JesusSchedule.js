import React, { useEffect, useState } from "react";
import "../Stylesheets/JesusSchedule.css";
import schedule from "../Schedule";

export default function JesusSchedule({ day, animationDelay = 500, animationInterval = 300 }) {
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
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="jesus-wrapper">
      <div className="heaven-glow"></div>
      <div className="floating-crosses">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="cross-float">✝</div>
        ))}
      </div>

      <h1 className="jesus-day">{day.toUpperCase()}</h1>

      <div className="jesus-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="jesus-class-card">
              <span className="class-name">{cls.name}</span>
              <span className="class-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
