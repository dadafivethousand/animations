import React, { useEffect, useState } from "react";
import "../Stylesheets/MichaelJacksonSchedule.css";
import schedule from "../Schedule";

export default function MichaelJacksonSchedule({ day, animationDelay = 1500, animationInterval = 300 }) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    (schedule[day] || []).forEach((_, i) => {
      setTimeout(() => {
        setVisible((v) => [...v, i]);
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
    <div className="mj-container">
      <h1 className="mj-day">{day.toUpperCase()}</h1>
      <div className="mj-track">
        {schedule[day]?.map((cls, i) =>
          visible.includes(i) && (
            <div key={i} className="mj-class" style={{ "--delay": `${0.3 * i}s` }}>
              <span className="mj-class-name">{cls.name}</span>
              <span className="mj-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
