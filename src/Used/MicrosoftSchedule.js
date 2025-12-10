import React, { useEffect, useState } from "react";
import "../Stylesheets/MicrosoftSchedule.css";
import schedule from "../RhSchedule"; // or "../RhSchedule" if you prefer

export default function MicrosoftSchedule({ day, animationDelay = 900, animationInterval = 160 }) {
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

  // 12h formatting with zero-padded minutes
  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="microsoft-wrap">
      {/* Centered weekday */}
      <header className="microsoft-header">
        <div className="microsoft-logo" aria-hidden>
          <span className="sq sq--red" />
          <span className="sq sq--green" />
          <span className="sq sq--blue" />
          <span className="sq sq--yellow" />
        </div>
        <h1 className="microsoft-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="microsoft-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="microsoft-card microsoft-in"
              key={i}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="microsoft-left">
                {/* Name + inline Maple chip — keep on one line */}
                <div className="microsoft-row">
                  <span className="microsoft-title">
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
                    <span className="mschip--maple" title="Maple">📍 Maple</span>
                  )}
                </div>
              </div>

              {/* Start time ONLY (fixed width) */}
              <time className="microsoft-time" aria-label="Class start time">
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
