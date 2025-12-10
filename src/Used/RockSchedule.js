// RockSchedule.jsx
import React, { useEffect, useState } from "react";
import "./RockSchedule.css";
import schedule from "../RhSchedule";

export default function RockSchedule({
  day,
  animationDelay = 1500,
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
    <div className="rock-wrapper">
      <h1 className="rock-title">{(day || "").toUpperCase()}</h1>

      <div className="rock-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="rock-card" key={idx}>
              <div className="rock-left">
                <span className="rock-class">{cls.name}</span>
                {cls.maple && (
                  <span className="rock-maple">
                    <span className="rock-pin" aria-hidden>
                      📍
                    </span>
                    MAPLE
                  </span>
                )}
              </div>

              <span className="rock-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
