import React, { useEffect, useState } from "react";
import "../Stylesheets/NinjaSchedule.css";
import schedule from "../Schedule"; // or "../RhSchedule" if you prefer

export default function NinjaSchedule({ day, animationDelay = 900, animationInterval = 160 }) {
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
    <div className="ninja-wrap">
      <header className="ninja-header">
        <h1 className="ninja-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="ninja-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="ninja-card ninja-in"
              key={i}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="ninja-left">
                <div className="ninja-row">
                  <span className="ninja-title">
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
                  {cls.maple && <span className="chip chip--maple">📍 Maple</span>}
                </div>
              </div>

              <time className="ninja-time" aria-label="Class start time">
                {formatTime(cls.start)}
              </time>

              {/* decorative shuriken */}
              <span className="ninja-star" aria-hidden />
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
