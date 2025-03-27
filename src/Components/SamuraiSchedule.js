import React, { useEffect, useState } from "react";
import "../Stylesheets/SamuraiSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function SamuraiSchedule({ day, animationDelay = 800, animationInterval = 500 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      const classes = schedule[day] || [];
      if (classes.length === 0) return;

      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleArray((prev) => [...prev, idx]);
        }, idx * animationInterval);
      });
    }, animationDelay);
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
    <div className="samurai-scroll">
      {/* Samurai Battle Banner (Day of the Week) */}
      <div className="samurai-banner">
        <div className="samurai-banner-text">{day.toUpperCase()}</div>
      </div>

      <div className="samurai-paper">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="samurai-entry-container">
            {visibleArray.includes(idx) && (
              <div className="samurai-entry samurai-slice">
                <div className="samurai-kanji">武</div> {/* Kanji for "Martial Arts" */}
                <div className="samurai-text">
                  <span className="samurai-class-name">{cls.name}</span>
                  <span className="samurai-class-time">{formatTime(cls.start)}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SamuraiSchedule;
