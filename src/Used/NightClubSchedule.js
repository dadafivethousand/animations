import React, { useEffect, useState } from "react";
import "../Stylesheets/NightclubSchedule.css";
import schedule from "../Schedule";

export default function NightclubSchedule({ day, animationDelay = 1000, animationInterval = 400 }) {
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
    <div className="nightclub-container">
      <h1 className="nightclub-day">{day}</h1>
      <div className="nightclub-classes">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="neon-class" key={idx}>
                              <span className="neon-name">{cls.name}</span>
              <span className="neon-time">{formatTime(cls.start)}</span>

            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
