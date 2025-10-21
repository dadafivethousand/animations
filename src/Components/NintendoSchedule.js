// NintendoSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/NintendoSchedule.css";
import schedule from "../Schedule";

export default function NintendoSchedule({
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
    <div className="nintendo-wrap">
      <header className="nintendo-header">
        <h1 className="nintendo-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="nintendo-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="nintendo-card nintendo-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="nintendo-left">
                <div className="nintendo-title">
                  {cls.replacement ? (
                    <span className="nintendo-swap">
                      <span className="nintendo-old">{cls.name}</span>
                      <span className="nintendo-arrow" aria-hidden>
                        →
                      </span>
                      <span className="nintendo-new">
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
                  <span className="nintendo-chip nintendo-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="nintendo-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
