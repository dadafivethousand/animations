import React, { useEffect, useState } from "react";
import "../Stylesheets/YSLSchedule.css";
import schedule from "../Schedule"; // or "../RhSchedule" if you prefer

export default function YSLSchedule({ day, animationDelay = 900, animationInterval = 160 }) {
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

  const formatRange = (s, e) => (typeof e === "number" ? `${formatTime(s)} — ${formatTime(e)}` : formatTime(s));

  return (
    <div className="ysl-wrap">
      <header className="ysl-header">
        <div className="ysl-mono" aria-hidden>
          <span className="ysl-y">Y</span>
          <span className="ysl-s">S</span>
          <span className="ysl-l">L</span>
        </div>
        <h1 className="ysl-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="ysl-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="ysl-card ysl-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="ysl-left">
                <div className="ysl-title">
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

                {cls.maple && (
                  <div className="tags">
                    <span className="chip chip--maple">📍 Maple</span>
                  </div>
                )}
              </div>

              <time className="ysl-time" aria-label="Class time">
                {formatRange(cls.start, cls.end)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
