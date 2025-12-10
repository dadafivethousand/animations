// FastFuriousSchedule.jsx
import React, { useEffect, useState } from "react";
import "./FastFuriousSchedule.css";
import schedule from "../RhSchedule";

function FastFuriousSchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setShowSchedule(true), animationDelay);
    return () => clearTimeout(t);
  }, [animationDelay]);

  useEffect(() => {
    if (!showSchedule) return;
    const classes = schedule[day] || [];
    const timers = [];
    classes.forEach((_, idx) => {
      const t = setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, idx * animationInterval);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [showSchedule, day, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="fastfurious-container">
      <h1 className="fastfurious-day"><br />{day.toUpperCase()}<br /></h1>

      <div className="fastfurious-schedule">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="fastfurious-class animated-entry">
              <div className="ff-left">
                <span className="fastfurious-class-name">{cls.name}</span>
                {cls.maple && (
                  <span className="ff-maple">
                    <span className="ff-pin" aria-hidden>📍</span>
                    MAPLE
                  </span>
                )}
              </div>
              <span className="fastfurious-class-time">⏱️ {formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default FastFuriousSchedule;
