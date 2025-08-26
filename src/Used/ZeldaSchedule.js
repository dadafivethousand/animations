// ZeldaSchedule.jsx
import React, { useEffect, useState } from "react";
import "./ZeldaSchedule.css";
import schedule from "../RhSchedule";

export default function ZeldaSchedule({
  day,
  animationDelay = 1000,
  animationInterval = 300,
}) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const entries = schedule[day] || [];
    const timers = [];
    setVisibleArray([]);
    entries.forEach((_, idx) => {
      const t = setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="zelda-wrapper">
      <h2 className="zelda-day">{(day || "").toUpperCase()}</h2>

      <div className="zelda-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="zelda-card" key={idx} style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="zelda-left">
                <span className="zelda-class">{cls.name}</span>
                {cls.maple && (
                  <span className="zelda-badge">
                    <span className="zelda-pin" aria-hidden>📍</span>
                    Maple
                  </span>
                )}
              </div>
              <span className="zelda-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
