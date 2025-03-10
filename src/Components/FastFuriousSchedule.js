import React, { useEffect, useState } from "react";
import "../Stylesheets/FastFuriousSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function FastFuriousSchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
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
    <div className="fastfurious-container">
      <h1 className="fastfurious-day">🚗💨 <br></br>{day.toUpperCase()} <br></br>🏁</h1>
      <div className="fastfurious-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className="fastfurious-class animated-entry">
              <span className="fastfurious-class-name"> {cls.name}</span>
              <span className="fastfurious-class-time">⏱️ {formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>

      {/* 🏁 Speedometer & NOS Effect */}
    
    </div>
  );
}

export default FastFuriousSchedule;
