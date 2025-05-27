import React, { useEffect, useState } from "react";
import schedule from "../Schedule";
import "../Stylesheets/FoxNewsSchedule.css";

export default function FoxNewsSchedule({ day, animationDelay = 1500, animationInterval = 400 }) {
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
    <div className="fox-wrapper">
      <div className="fox-top-bar">
 
        <div className="fox-day">{day.toUpperCase()} SCHEDULE</div>
      </div>

      <div className="fox-schedule-container">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="fox-class-card" key={idx}>
                            <div className="fox-name">{cls.name.toUpperCase()}</div>
              <div className="fox-time">{formatTime(cls.start)}</div>
  
            </div>
          ) : null
        )}
      </div>

      <div className="fox-ticker">
        <div className="ticker-text">
          🔴 LIVE · MAPLE BJJ · {day.toUpperCase()} COVERAGE · TRAIN HARD · STAY SHARP · OSS! 🔥
        </div>
      </div>
    </div>
  );
}
