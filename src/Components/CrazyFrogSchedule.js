import React, { useEffect, useState } from "react";
import "../Stylesheets/CrazyFrogSchedule.css";
import schedule from "../Schedule";

export default function CrazyFrogSchedule({ day, animationDelay = 1000, animationInterval = 300 }) {
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
    <div className="crazyfrog-wrapper">
      <h1 className="crazyfrog-title">{day.toUpperCase()}</h1>
      <div className="crazyfrog-grid">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div
              className="crazyfrog-card"
              key={idx}
              style={{ animationDelay: `${idx * animationInterval}ms` }}
            >
              <span className="crazyfrog-class">{cls.name}</span>
              <span className="crazyfrog-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
     <img src={'https://media.giphy.com/media/Z4lRC5aRkknfMcyNoI/giphy.gif'}/>
    </div>
  );
}
