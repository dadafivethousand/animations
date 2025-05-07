import React, { useEffect, useState } from "react";
import "../Stylesheets/FlappySchedule.css";
import schedule from "../Schedule";

export default function FlappySchedule({ day, animationDelay = 800, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const entries = schedule[day] || [];
    entries.forEach((_, idx) => {
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
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="flappy-wrapper">
      <h2 className="flappy-day">{day.toUpperCase()}</h2>
      <div className="flappy-pipe-track">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="flappy-card" key={idx} style={{ top: `${idx * 110}px` }}>
              <div className="flappy-pipe-top" />
              <div className="flappy-info">
                <div className="flappy-class">{cls.name}</div>
                <div className="flappy-time">{formatTime(cls.start)}</div>
              </div>
              <div className="flappy-pipe-bottom" />
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
