import React, { useEffect, useState } from "react";
import "./WarcraftSchedule.css";
import schedule from "../RhSchedule"; // Assuming schedule data exists

function WarcraftSchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
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
    <div className="warcraft-container">
      <h1 className="warcraft-day">⚔️ {day.toUpperCase()} ⚔️</h1>
      <div className="warcraft-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className={`warcraft-class animated-entry ${idx % 2 === 0 ? "horde" : "alliance"}`}>
              <span className="warcraft-class-name">{cls.name}</span>
              <span className="warcraft-class-time"> {formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>

      {/* 📜 War Scroll Background */}
      <div className="warcraft-scroll"></div>
    </div>
  );
}

export default WarcraftSchedule;
