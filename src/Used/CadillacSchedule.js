import React, { useEffect, useState } from "react";
import "./CadillacSchedule.css";
import schedule from "../Schedule";

export default function CadillacSchedule({ day, animationDelay = 1200, animationInterval = 300 }) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    (schedule[day] || []).forEach((_, i) => {
      setTimeout(() => {
        setVisible((v) => [...v, i]);
      }, animationDelay + i * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (dt) => {
    const h = Math.floor(dt),
          m = Math.round((dt - h) * 60),
          hr = h % 12 || 12,
          ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="cadillac-container">
      <h1 className="cadillac-day">{day.toUpperCase()}</h1>
      <div className="cadillac-track">
        {schedule[day]?.map((cls, i) =>
          visible.includes(i) && (
            <div
              key={i}
              className="cadillac-class"
              style={{ "--delay": `${0.3 * i}s` }}
            >
              <span className="cadillac-name">{cls.name}</span>
              <span className="cadillac-time">{formatTime(cls.start)}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
