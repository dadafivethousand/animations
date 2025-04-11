import React, { useEffect, useState } from "react";
import "../Stylesheets/AlienSchedule.css";
import schedule from "../Schedule";

export default function AlienSchedule({ day, animationDelay = 500, animationInterval = 300 }) {
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
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${amPm}`;
  };

  return (
    <div className="alien-container">
      <div className="starfield"></div>

      {/* ONE floating spaceship emoji */}
      <div className="ufo-float">🛸</div>

      <h1 className="alien-title">{day.toUpperCase()}</h1>

      <div className="alien-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="alien-class">
              <div className="beam"></div>
              <span className="alien-name">{cls.name}</span>
              <span className="alien-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
