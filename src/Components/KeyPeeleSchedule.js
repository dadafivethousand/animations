// KeyPeeleSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/KeyPeeleSchedule.css";
import schedule from "../Schedule";

export default function KeyPeeleSchedule({
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
    <div className="keypeele-wrap">
      <header className="keypeele-header">
        <h1 className="keypeele-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="keypeele-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="keypeele-card keypeele-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="keypeele-left">
                <div className="keypeele-title">
                  {cls.replacement ? (
                    <span className="keypeele-swap">
                      <span className="keypeele-old">{cls.name}</span>
                      <span className="keypeele-arrow" aria-hidden>
                        →
                      </span>
                      <span className="keypeele-new">
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
                  <span className="keypeele-chip keypeele-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="keypeele-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
