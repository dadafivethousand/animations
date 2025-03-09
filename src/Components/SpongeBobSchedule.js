import React, { useEffect, useState } from "react";
import "../Stylesheets/SpongeBobSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function SpongeBobSchedule({ day, animationDelay = 1000, animationInterval = 1500 }) {
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
    <div className="spongebob-container">
      {/* SpongeBob-Themed Title */}
      <h1 className="spongebob-title">{day.toUpperCase()}</h1>
      {/* Schedule Content */}
      <div className="spongebob-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className="spongebob-class">
              <span className="spongebob-class-name">{cls.name}</span>
              <span className="spongebob-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>

      {/* Loads of Bubbles */}
      <div className="bubbles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`bubble bubble${i % 4}`} />
        ))}
      </div>
    </div>
  );
}

export default SpongeBobSchedule;
