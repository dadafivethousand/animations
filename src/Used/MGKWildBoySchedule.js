import React, { useEffect, useState } from "react";
import "../Stylesheets/MGKWildBoySchedule.css";
import schedule from "../Schedule"; // or "../RhSchedule" if you prefer

export default function MGKWildBoySchedule({ day, animationDelay = 900, animationInterval = 160 }) {
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
    <div className="mgk-wrap">
      {/* Weekday centered */}
      <header className="mgk-header">
        <h1 className="mgk-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="mgk-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="mgk-card mgk-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="mgk-left">
                <div className="mgk-title-row">
                  <span className="mgk-title">
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
                    <span className="chip chip--maple">📍 Maple</span>
                  )}
                </div>
              </div>

              {/* Start time ONLY */}
              <time className="mgk-time" aria-label="Class start time">
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
