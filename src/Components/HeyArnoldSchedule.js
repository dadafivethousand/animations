import React, { useEffect, useState } from "react";
import "../Stylesheets/HeyArnoldSchedule.css";
import schedule from "../Schedule"; // or "../RhSchedule"

export default function HeyArnoldSchedule({ day, animationDelay = 900, animationInterval = 160 }) {
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
    <div className="arnold-wrap">
      <header className="arnold-header">
        <div className="arnold-burst" aria-hidden />
        <h1 className="arnold-day">{safeDay.toUpperCase()}</h1>
        <div className="arnold-scribble" aria-hidden />
      </header>

      <main className="arnold-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="arnold-card arnold-in"
              key={i}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="arnold-left">
                <div className="arnold-row">
                  <span className="arnold-title">
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

              <time className="arnold-time">{formatTime(cls.start)}</time>
              <span className="arnold-pin" aria-hidden />
            </article>
          ) : null
        )}
      </main>

      <div className="arnold-skyline" aria-hidden />
    </div>
  );
}
