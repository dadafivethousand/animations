// JohnCenaSchedule.jsx — two-tone (BG + Accent), mobile-first
import React, { useEffect, useState } from "react";
import "../Stylesheets/JohnCenaSchedule.css";
import schedule from "../Schedule";

export default function JohnCenaSchedule({
  day,
  animationDelay = 800,
  animationInterval = 140,
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
    <div className="jc2t-wrap">
      <header className="jc2t-head">
        <div className="jc2t-stripe" aria-hidden />
        <h1 className="jc2t-day">{(day || "").toUpperCase()}</h1>
      </header>

      <main className="jc2t-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div
              className="jc2t-card jc2t-in"
              key={i}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="jc2t-left">
                <span className="jc2t-dot" aria-hidden />
                <span className="jc2t-name">
                  {cls.replacement ? (
                    <span className="jc2t-swap">
                      <span className="jc2t-old">{cls.name}</span>
                      <span className="jc2t-arrow" aria-hidden>→</span>
                      <span className="jc2t-new">{String(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </span>
                {cls.maple && <span className="jc2t-chip">📍 MAPLE</span>}
              </div>
              <time className="jc2t-time">{formatTime(cls.start)}</time>
            </div>
          ) : null
        )}
      </main>
    </div>
  );
}
