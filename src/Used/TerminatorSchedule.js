import React, { useEffect, useState } from "react";
import "./TerminatorSchedule.css";
import schedule from "../RhSchedule"; // Assuming schedule data exists

function TerminatorSchedule({ day, animationDelay = 800, animationInterval = 600 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay);
  }, [animationDelay]);

  useEffect(() => {
    if (showSchedule) {
      const classes = schedule[day] || [];
      if (classes.length === 0) return;

      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleArray((prev) => [...prev, idx]);
        }, idx * animationInterval);
      });
    }
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
    <div className="terminator-container">
      {/* Skynet HUD Header */}
      <div className="terminator-header">
        <h1 className="terminator-day">{day.toUpperCase()}</h1>
      </div>

      {/* Glitching Digital Schedule */}
      <div className="terminator-schedule">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="terminator-class-container">
            {visibleArray.includes(idx) && (
              <div className="terminator-class glitch-effect">
                <span className="terminator-class-name">{cls.name}</span>
                <span className="terminator-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TerminatorSchedule;
