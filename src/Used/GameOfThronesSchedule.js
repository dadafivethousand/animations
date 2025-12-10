import React, { useEffect, useState } from "react";
import "./GameOfThronesSchedule.css";
import schedule from "../RhSchedule"; // or "../RhSchedule" if you prefer

export default function GameOfThronesSchedule({ day, animationDelay = 900, animationInterval = 160 }) {
  const [visible, setVisible] = useState([]);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  useEffect(() => {
    // reveal cards with stagger
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
    <div className="got-wrap">
      {/* Weekday centered */}
      <header className="got-header">
        <h1 className="got-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="got-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="got-card got-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="got-left">
                {/* Replacement handling */}
                <div className="got-title">
                  {cls.replacement ? (
                    <span className="swap">
                      <span className="old">{cls.name}</span>
                      <span className="arrow" aria-hidden>→</span>
                      <span className="new">{String(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {/* Maple badge (inside the card) */}
                {cls.maple && (
                  <div className="tags">
                    <span className="chip chip--maple">📍 Maple</span>
                  </div>
                )}
              </div>

              {/* Start time ONLY */}
              <time className="got-time" aria-label="Class start time">
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
