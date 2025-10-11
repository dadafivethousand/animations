// TomJerrySchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/TomJerrySchedule.css";
import schedule from "../Schedule";

export default function TomJerrySchedule({
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
    <div className="tomjerry-wrap">
      <header className="tomjerry-header">
        <h1 className="tomjerry-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="tomjerry-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="tomjerry-card tomjerry-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="tomjerry-left">
                <div className="tomjerry-title">
                  {cls.replacement ? (
                    <span className="tomjerry-swap">
                      <span className="tomjerry-old">{cls.name}</span>
                      <span className="tomjerry-arrow" aria-hidden>
                        →
                      </span>
                      <span className="tomjerry-new">
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
                  <span className="tomjerry-chip tomjerry-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="tomjerry-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
