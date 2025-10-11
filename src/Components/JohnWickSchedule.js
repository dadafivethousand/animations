// JonWickSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/JohnWickSchedule.css";
import schedule from "../Schedule";

export default function JonWickSchedule({
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
    <div className="jonwick-wrap">
      <header className="jonwick-header">
        <h1 className="jonwick-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="jonwick-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="jonwick-card jonwick-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="jonwick-left">
                <div className="jonwick-title">
                  {cls.replacement ? (
                    <span className="jonwick-swap">
                      <span className="jonwick-old">{cls.name}</span>
                      <span className="jonwick-arrow" aria-hidden>
                        →
                      </span>
                      <span className="jonwick-new">
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
                  <span className="jonwick-chip jonwick-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="jonwick-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
