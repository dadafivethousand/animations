import React, { useEffect, useState } from "react";
import "../Stylesheets/BullsSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function BullsSchedule({ day, animationDelay = 1000, animationInterval = 400 }) {
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
    <div className="bulls-container">
      {/* Glowing Bulls Banner */}
      <div className="bulls-header">
        <h1 className="bulls-day">{day.toUpperCase()}</h1>
        <div className="bulls-glow"></div>
      </div>

      {/* Bulls Schedule Entries - ALL VISIBLE */}
      <div className="bulls-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className={`bulls-class entry-${idx % 3}`}>
              <span className="bulls-class-name">{cls.name}</span>
              <span className="bulls-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default BullsSchedule;
