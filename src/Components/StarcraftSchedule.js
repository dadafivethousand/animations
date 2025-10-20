// StarcraftSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/StarcraftSchedule.css";
import schedule from "../Schedule";

export default function StarcraftSchedule({
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
    <div className="starcraft-wrap">
      <header className="starcraft-header">
        <h1 className="starcraft-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="starcraft-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="starcraft-card starcraft-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="starcraft-left">
                <div className="starcraft-title">
                  {cls.replacement ? (
                    <span className="starcraft-swap">
                      <span className="starcraft-old">{cls.name}</span>
                      <span className="starcraft-arrow" aria-hidden>
                        →
                      </span>
                      <span className="starcraft-new">
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
                  <span className="starcraft-chip starcraft-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="starcraft-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
