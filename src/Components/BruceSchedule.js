import React, { useEffect, useState } from "react";
import "../Stylesheets/BruceSchedule.css";
import schedule from "../Schedule";

export default function BruceSchedule({ day, animationDelay = 1500, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const classes = schedule[day] || [];
    classes.forEach((_, idx) => {
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
    <div className="bruce-wrapper">
      <div className="kanji kanji-1">武</div>
      <div className="kanji kanji-2">道</div>
      <div className="kanji kanji-3">龍</div>

      <h1 className="bruce-title">{day.toUpperCase()}</h1>

      <div className="bruce-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="scroll-card">
              <span className="scroll-class">{cls.name}</span>
              <span className="scroll-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
