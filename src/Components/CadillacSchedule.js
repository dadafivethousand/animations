import React, { useEffect, useState } from "react";
import "../Stylesheets/CadillacSchedule.css";
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
    <div className="cadillac-clean-container">
      <h1 className="cadillac-clean-day">{day.toUpperCase()}</h1>
      <div className="cadillac-clean-track">
        {schedule[day]?.map((cls, i) =>
          visible.includes(i) && (
            <div key={i} className="cadillac-clean-class">
              <span className="cadillac-clean-name">{cls.name}</span>
              <span className="cadillac-clean-time">{formatTime(cls.start)}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
