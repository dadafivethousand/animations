import React, { useEffect, useState } from "react";
import "../Stylesheets/BrickSchedule.css";
import schedule from "../Schedule"; // or "../RhSchedule" if you prefer

export default function BrickSchedule({ day, animationDelay = 900, animationInterval = 160 }) {
  const [visible, setVisible] = useState([]);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  // staggered reveal with cleanup
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
    <div className="brick-wrap">
      {/* Centered weekday */}
      <header className="brick-header">
        <h1 className="brick-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="brick-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="brick-card brick-in"
              key={i}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="brick-left">
                {/* Name + inline Maple chip kept on ONE line */}
                <div className="brick-row">
                  <span className="brick-title">
                    {cls.replacement ? (
                      <span className="swap">
                        <span className="old">{cls.name}</span>
                        <span className="arrow" aria-hidden>→</span>
                        <span className="new">{String(cls.replacement)}</span>
                      </span>
                    ) : (
                      cls.name
                    )}
                  </span>
                  {cls.maple && (
                    <span className="chip chip--maple" title="Maple">📍 Maple</span>
                  )}
                </div>
              </div>

              {/* Start time ONLY */}
              <time className="brick-time" aria-label="Class start time">
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
