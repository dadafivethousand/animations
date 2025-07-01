import React, { useEffect, useState } from "react";
import "../Stylesheets/AirForceOnesSchedule.css";
import schedule from "../Schedule";

export default function AirForceOnesSchedule({ day, animationDelay = 800, animationInterval = 200 }) {
  const [visible, setVisible] = useState([]);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    setVisible([]);
    setTitleVisible(false);

    // Reveal the title after the specified delay
    const titleTimer = setTimeout(() => {
      setTitleVisible(true);
    }, animationDelay);

    // Then reveal each class after the title becomes visible
    const classTimers = [];

    if (schedule[day]) {
      schedule[day].forEach((_, i) => {
        const timer = setTimeout(() => {
          setVisible((v) => [...v, i]);
        }, animationDelay + 600 + i * animationInterval); // 600ms = estimated title animation time
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
    <div className="af1-container">
      <h1
        className="af1-title"
        style={{ "--title-delay": `${animationDelay}ms` }}
      >
        {day.toUpperCase().split("").map((char, i) => (
          <span key={i} style={{ "--i": i }}>{char}</span>
        ))}
      </h1>

      <div className="af1-track">
        {titleVisible &&
          schedule[day]?.map((cls, i) =>
            visible.includes(i) && (
              <div key={i} className="af1-class" style={{ "--delay": `${i * 0.2}s` }}>
                <span className="af1-name">{cls.name}</span>
                <span className="af1-time">{formatTime(cls.start)}</span>
              </div>
            )
          )}
      </div>
    </div>
  );
}
