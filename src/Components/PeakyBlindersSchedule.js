// PeakyBlindersSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/PeakyBlindersSchedule.css";
import schedule from "../Schedule";

export default function PeakyBlindersSchedule({
  day,
  animationDelay = 900,
  animationInterval = 160,
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  // staggered reveal with cleanup (no leaked timers)
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

  // 12h format, zero-padded minutes, AM/PM
  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="peaky-wrap">
      {/* Centered weekday — brass plaque */}
      <header className="peaky-header">
        <h1 className="peaky-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="peaky-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className={`peaky-card peaky-in ${cls.cancelled ? "is-cancelled" : ""}`}
              key={i}
              style={{ animationDelay: `${i * 50}ms` }}
              aria-live={cls.cancelled ? "polite" : undefined}
              aria-label={cls.cancelled ? "Cancelled class" : undefined}
            >
              <div className="peaky-left">
                {/* One-line title with Replacement + Maple chip inline */}
                <div className="peaky-row">
                  <span className="peaky-title">
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

                  {cls.cancelled && (
                    <span className="chip chip--cancelled" role="status" aria-label="Cancelled">
                      ✖ Cancelled
                    </span>
                  )}
                </div>
              </div>

              {/* Start time ONLY — equal width pill */}
              <time className="peaky-time" aria-label="Class start time">
                {formatTime(cls.start)}
              </time>

              {/* decorative razor accent */}
              <span className="peaky-razor" aria-hidden />
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
