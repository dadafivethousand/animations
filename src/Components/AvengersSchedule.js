import React, { useEffect, useState } from "react";
import "../Stylesheets/AvengersSchedule.css";
import schedule from "../Schedule"; // or "../RhSchedule" if you prefer

export default function AvengersSchedule({ day, animationDelay = 800, animationInterval = 140 }) {
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

  const formatRange = (s, e) => {
    if (typeof e === "number") return `${formatTime(s)} — ${formatTime(e)}`;
    return formatTime(s);
  };

  return (
    <div className="avengers-wrap">
      <header className="avengers-header">
 
        <h1 className="avengers-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="avengers-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="avengers-card avengers-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="avengers-left">
                <div className="avengers-title">
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

              <time className="avengers-time" aria-label="Class time">
                {formatRange(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
