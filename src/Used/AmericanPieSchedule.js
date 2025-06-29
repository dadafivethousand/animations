import React, { useEffect, useState } from "react";
import "../Stylesheets/AmericanPieSchedule.css";
import schedule from "../Schedule";

export default function AmericanPieSchedule({ day, animationDelay = 1000, animationInterval = 300 }) {
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
    <div className="ap-container">
      <h1 className="ap-title">{day.toUpperCase()}</h1>
      <div className="ap-track">
        {schedule[day]?.map((cls, i) =>
          visible.includes(i) && (
            <div key={i} className="ap-class" style={{ "--delay": `${i * 0.3}s` }}>
              <span className="ap-name">{cls.name}</span>
              <span className="ap-time">{formatTime(cls.start)}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
