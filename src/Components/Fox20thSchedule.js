// Fox20thSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/Fox20thSchedule.css";
import schedule from "../Schedule";

export default function Fox20thSchedule({
  day,
  animationDelay = 900,
  animationInterval = 160,
}) {
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
    <div className="fox20th-wrap">
      <header className="fox20th-header">
        <div className="fox20th-beams" aria-hidden />
        <h1 className="fox20th-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="fox20th-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="fox20th-card fox20th-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="fox20th-left">
                <div className="fox20th-title">
                  {cls.replacement ? (
                    <span className="fox20th-swap">
                      <span className="fox20th-old">{cls.name}</span>
                      <span className="fox20th-arrow" aria-hidden>
                        →
                      </span>
                      <span className="fox20th-new">
                        {typeof cls.replacement === "string"
                          ? cls.replacement
                          : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <span className="fox20th-chip fox20th-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="fox20th-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
