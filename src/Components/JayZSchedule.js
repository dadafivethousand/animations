import React, { useEffect, useState } from "react";
import "../Stylesheets/JayZSchedule.css";
import schedule from "../Schedule";

export default function JayZSchedule({ day, animationDelay = 1000, animationInterval = 250 }) {
  const [visible, setVisible] = useState([]);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    setVisible([]);
    setTitleVisible(false);

    const titleTimer = setTimeout(() => setTitleVisible(true), animationDelay);

    const timers = [];
    if (schedule[day]) {
      schedule[day].forEach((_, i) => {
        const timer = setTimeout(() => {
          setVisible((v) => [...v, i]);
        }, animationDelay + 600 + i * animationInterval);
        timers.push(timer);
      });
    }

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
    <div className="jayz-container">
      <h1 className="jayz-title" style={{ "--title-delay": `${animationDelay}ms` }}>
        {day.toUpperCase().split("").map((char, i) => (
          <span key={i} style={{ "--i": i }}>{char}</span>
        ))}
      </h1>

      <div className="jayz-track">
        {titleVisible &&
          schedule[day]?.map((cls, i) =>
            visible.includes(i) && (
              <div key={i} className="jayz-class" style={{ "--delay": `${i * 0.2}s` }}>
                <span className="jayz-name">{cls.name}</span>
                <span className="jayz-time">{formatTime(cls.start)}</span>
              </div>
            )
          )}
      </div>
    </div>
  );
}
