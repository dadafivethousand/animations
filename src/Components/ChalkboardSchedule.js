import React, { useEffect, useState } from 'react';
import '../Stylesheets/ChalkboardSchedule.css';
import schedule from '../Schedule';

export default function ChalkboardSchedule({
  day,
  animationDelay = 500,      // initial delay before first card
  animationInterval = 300    // delay between cards
}) {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    setRendered(false);
    const timer = setTimeout(() => setRendered(true), 300);
    return () => clearTimeout(timer);
  }, [day]);

  const formatTime = dec => {
    const h = Math.floor(dec);
    const m = Math.round((dec - h) * 60).toString().padStart(2, '0');
    const hh = h % 12 === 0 ? 12 : h % 12;
    const ampm = h < 12 ? 'AM' : 'PM';
    return `${hh}:${m} ${ampm}`;
  };

  return (
    <div className="chalk-wrapper">
      <h1 className="chalk-title">{day.toUpperCase()}</h1>
      <div className="chalk-grid">
        {schedule[day]?.map((cls, idx) => (
          <div
            className="chalk-card"
            key={idx}
            style={{
              '--idx': idx,
              animationDelay: rendered
                ? `${animationDelay + idx * animationInterval}ms`
                : '0ms'
            }}
          >
            <span className="chalk-class">{cls.name}</span>
            <span className="chalk-time">{formatTime(cls.start)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
