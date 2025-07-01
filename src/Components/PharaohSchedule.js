import React, { useEffect, useState } from "react";
import "../Stylesheets/PharaohSchedule.css";
import schedule from "../Schedule";

export default function PharaohSchedule({ day, animationDelay = 1000, animationInterval = 300 }) {
  const [visible, setVisible] = useState([]);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    setVisible([]);
    setTitleVisible(false);

    const titleTimer = setTimeout(() => setTitleVisible(true), animationDelay);

    const timers = [];
    (schedule[day] || []).forEach((_, i) => {
      const timer = setTimeout(() => {
        setVisible((v) => [...v, i]);
      }, animationDelay + 800 + i * animationInterval);
      timers.push(timer);
    });

    return () => {
      clearTimeout(titleTimer);
      timers.forEach(clearTimeout);
    };
  }, [day, animationDelay, animationInterval]);

  const formatTime = (dt) => {
    const h = Math.floor(dt),
      m = Math.round((dt - h) * 60),
      hr = h % 12 || 12,
      ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="pharaoh-container">
      <h1 className="pharaoh-title" style={{ "--title-delay": `${animationDelay}ms` }}>
        {day.toUpperCase().split("").map((char, i) => (
          <span key={i} style={{ "--i": i }}>{char}</span>
        ))}
      </h1>

      <div className="pharaoh-track">
        {titleVisible &&
          schedule[day]?.map((cls, i) =>
            visible.includes(i) && (
              <div key={i} className="pharaoh-class" style={{ "--delay": `${i * 0.2}s` }}>
                <span className="pharaoh-name">{cls.name}</span>
                <span className="pharaoh-time">{formatTime(cls.start)}</span>
              </div>
            )
          )}
      </div>
    </div>
  );
}
