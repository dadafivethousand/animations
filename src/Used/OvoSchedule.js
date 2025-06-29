import React, { useEffect, useState } from "react";
import "../Stylesheets/OvoSchedule.css";
import schedule from "../Schedule";

export default function OvoSchedule({ day, animationDelay = 1200, animationInterval = 250 }) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    (schedule[day] || []).forEach((_, i) => {
      setTimeout(() => {
        setVisible((prev) => [...prev, i]);
      }, animationDelay + i * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const h = Math.floor(decimalTime),
          m = Math.round((decimalTime - h) * 60),
          hr = h % 12 || 12,
          ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="ovo-container">
      <h1 className="ovo-day">{day.toUpperCase()}</h1>
      <div className="ovo-track">
        {schedule[day]?.map((cls, i) =>
          visible.includes(i) && (
            <div key={i} className="ovo-class" style={{ "--delay": `${0.2 * i}s` }}>
              <span className="ovo-name">{cls.name}</span>
              <span className="ovo-time">{formatTime(cls.start)}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
