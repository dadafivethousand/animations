import React, { useEffect, useState } from "react";
import "../Stylesheets/NASCARSchedule.css";
import schedule from "../Schedule";

export default function NASCARSchedule({ day, animationDelay = 1000, animationInterval = 250 }) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    const timers = (schedule[day] || []).map((_, i) =>
      setTimeout(() => setVisible((v) => [...v, i]), animationDelay + i * animationInterval)
    );
    return () => timers.forEach(clearTimeout);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (dt) => {
    const h = Math.floor(dt);
    const m = Math.round((dt - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="nascar-container">
      <div className="nascar-logo-title">
        <div className="nascar-stripes">
          <div className="stripe yellow" />
          <div className="stripe yellow2" />
          <div className="stripe red" />
          <div className="stripe red2" />
          <div className="stripe blue" />
        </div>
        <h1 className="nascar-text">{day.toUpperCase()}</h1>
      </div>
      <div className="nascar-track">
        {schedule[day]?.map((cls, i) =>
          visible.includes(i) && (
            <div key={i} className="nascar-class" style={{ "--delay": `${i * 0.2}s` }}>
              <span className="nascar-name">{cls.name}</span>
              <span className="nascar-time">{formatTime(cls.start)}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
