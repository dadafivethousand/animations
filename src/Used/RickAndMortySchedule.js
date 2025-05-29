import React, { useEffect, useState } from "react";
import "../Stylesheets/RickAndMortySchedule.css";
import schedule from "../Schedule";

export default function RickAndMortySchedule({ day, animationDelay = 1800, animationInterval = 350 }) {
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
    <div className="ram-wrapper">
      <h1 className="ram-title">🌀 {day}</h1>
      <div className="ram-schedule">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="ram-class portal-animate" key={idx}>
              <div className="ram-class-time">{formatTime(cls.start)}</div>
              <div className="ram-class-name">{cls.name}</div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
