import React, { useEffect, useState } from "react";
import "../Stylesheets/CanadaSchedule.css";
import schedule from "../RhSchedule";

export default function CanadaSchedule({ day, animationDelay = 800, animationInterval = 250 }) {
  const [visible, setVisible] = useState([]);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    setVisible([]);
    setTitleVisible(false);

    const titleTimer = setTimeout(() => setTitleVisible(true), animationDelay);

    const classTimers = [];
    if (schedule[day]) {
      schedule[day].forEach((_, i) => {
        const timer = setTimeout(() => {
          setVisible((v) => [...v, i]);
        }, animationDelay + 600 + i * animationInterval);
        classTimers.push(timer);
      });
    }

    return () => {
      clearTimeout(titleTimer);
      classTimers.forEach(clearTimeout);
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
    <div className="canada-container">
      <h1
        className="canada-title"
        style={{ "--title-delay": `${animationDelay}ms` }}
      >
        {day.toUpperCase().split("").map((char, i) => (
          <span key={i} style={{ "--i": i }}>{char}</span>
        ))}
      </h1>

      <div className="canada-track">
        {titleVisible &&
          schedule[day]?.map((cls, i) =>
            visible.includes(i) && (
              <div key={i} className="canada-class" style={{ "--delay": `${i * 0.2}s` }}>
                <span className="canada-name">{cls.name}</span>
                <span className="canada-time">{formatTime(cls.start)}</span>
              </div>
            )
          )}
      </div>
    </div>
  );
}
