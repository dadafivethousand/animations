// BugattiSchedule.jsx — sleek Bugatti-inspired schedule (mobile-first)
// Supports animationDelay/animationInterval, MAPLE indicator, and replacement display.
import React, { useEffect, useState } from "react";
import "../Stylesheets/BugattiSchedule.css";
import schedule from "../RhSchedule";

export default function BugattiSchedule({
  day,
  animationDelay = 900,
  animationInterval = 160,
}) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const items = schedule[day] || [];
    setVisible([]);
    const timers = [];
    items.forEach((_, i) => {
      const t = setTimeout(
        () => setVisible((v) => [...v, i]),
        animationDelay + i * animationInterval
      );
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="bgti-wrap">
 
 
        <h1 className="bgti-day">{(day || "").toUpperCase()}</h1>
 
      <main className="bgti-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div
              key={i}
              className="bgti-card bgti-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="bgti-left">
                <span className="bgti-dot" aria-hidden />
                <span className="bgti-name">
                  {cls.replacement ? (
                    <span className="bgti-swap">
                      <span className="bgti-old">{cls.name}</span>
                      <span className="bgti-arrow" aria-hidden>→</span>
                      <span className="bgti-new">{String(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </span>
                {cls.maple && <span className="bgti-chip">📍 MAPLE</span>}
              </div>
              <time className="bgti-time">{formatTime(cls.start)}</time>
            </div>
          ) : null
        )}
      </main>

      <div className="bgti-sheen" aria-hidden />
    </div>
  );
}
