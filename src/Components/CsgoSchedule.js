import React, { useEffect, useState } from "react";
import "../Stylesheets/CsgoSchedule.css";
import schedule from "../Schedule";

export default function CsgoSchedule({ day, animationDelay = 800, animationInterval = 200 }) {
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
    <div className="csgo-wrapper">
      <h3 className="csgo-title">{day.toUpperCase()}</h3>
      <div className="csgo-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="csgo-card" key={idx}>
                 <div className="csgo-name">{cls.name}</div>
                <div className="csgo-time">{formatTime(cls.start)}</div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
