import React, { useEffect, useState } from "react";
import "../Stylesheets/BuzzSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function BuzzSchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
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
    <div className="toystory-container">
      {/* Pixar-like floating text */}
      <h1 className="toystory-day">🚀 {day.toUpperCase()} 🤠</h1>

      {/* Schedule Entries */}
      <div className="toystory-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className="toystory-class animated-entry">
              <span className="toystory-class-name">🧸 {cls.name}</span>
              <span className="toystory-class-time">⏳ {formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>

      {/* Floating Pixar Ball */}
      <div className="toystory-ball">🔵⭐</div>
    </div>
  );
}

export default BuzzSchedule;
