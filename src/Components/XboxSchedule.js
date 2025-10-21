// XboxSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/XboxSchedule.css";
import schedule from "../Schedule";

export default function XboxSchedule({
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
    <div className="xbox-wrap">
      <header className="xbox-header">
        <h1 className="xbox-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="xbox-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="xbox-card xbox-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="xbox-left">
                <div className="xbox-title">
                  {cls.replacement ? (
                    <span className="xbox-swap">
                      <span className="xbox-old">{cls.name}</span>
                      <span className="xbox-arrow" aria-hidden>
                        →
                      </span>
                      <span className="xbox-new">
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
                  <span className="xbox-chip xbox-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="xbox-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
