import React, { useEffect, useState } from "react";
import "../Stylesheets/GriseldaBlancoSchedule.css";
import schedule from "../Schedule"; 

export default function GriseldaBlancoSchedule({ day, animationDelay = 900, animationInterval = 160 }) {
  const [visible, setVisible] = useState([]);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  useEffect(() => {
    const timers = [];
    setVisible([]);
    items.forEach((_, i) => {
      const t = setTimeout(
        () => setVisible((v) => [...v, i]),
        animationDelay + i * animationInterval
      );
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [safeDay, animationDelay, animationInterval, items.length]);

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="griselda-wrap">
      <header className="griselda-header">
        <h1 className="griselda-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="griselda-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="griselda-card griselda-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="griselda-left">
                <div className="griselda-title-row">
                  <span className="griselda-title">
                    {cls.replacement ? (
                      <span className="swap">
                        <span className="old">{cls.name}</span>
                        <span className="arrow">→</span>
                        <span className="new">{String(cls.replacement)}</span>
                      </span>
                    ) : (
                      cls.name
                    )}
                  </span>
                  {cls.maple && (
                    <span className="chip chip--maple">📍 Maple</span>
                  )}
                </div>
              </div>
              <time className="griselda-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
