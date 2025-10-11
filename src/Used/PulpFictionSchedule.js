import React, { useEffect, useState } from "react";
import "../Stylesheets/PulpFictionSchedule.css";
import schedule from "../RhSchedule"; // or "../RhSchedule" if you prefer

export default function PulpFictionSchedule({ day, animationDelay = 900, animationInterval = 160 }) {
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
    <div className="pulp-wrap">
      {/* Centered weekday */}
      <header className="pulp-header">
        <h1 className="pulp-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="pulp-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="pulp-card pulp-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="pulp-left">
                {/* Name + inline Maple chip (stay on one line) */}
                <div className="pulp-title-row">
                  <span className="pulp-title">
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

              {/* Start time ONLY, equal width pill */}
              <time className="pulp-time" aria-label="Class start time">
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
