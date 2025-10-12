// CasperSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/CasperSchedule.css";
import schedule from "../Schedule";

export default function CasperSchedule({
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
    <div className="casper-wrap">
      <header className="casper-header">
        <h1 className="casper-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="casper-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="casper-card casper-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="casper-left">
                <div className="casper-title">
                  {cls.replacement ? (
                    <span className="casper-swap">
                      <span className="casper-old">{cls.name}</span>
                      <span className="casper-arrow" aria-hidden>
                        →
                      </span>
                      <span className="casper-new">
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
                  <span className="casper-chip casper-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="casper-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
