// FireworksSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/FireworksSchedule.css";
import schedule from "../Schedule";

export default function FireworksSchedule({
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

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [safeDay, animationDelay, animationInterval, items.length]);

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="fireworks-wrap">
      <header className="fireworks-header">
        <h1 className="fireworks-day">{safeDay.toUpperCase()}</h1>
       </header>

      <main
        className="fireworks-list"
        aria-label={`${safeDay || "Selected day"} schedule`}
      >
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="fireworks-card fireworks-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="fireworks-left">
                <div className="fireworks-title">
                  {cls.replacement ? (
                    <span className="fireworks-swap">
                      <span className="fireworks-old">{cls.name}</span>
                      <span className="fireworks-arrow" aria-hidden>
                        →
                      </span>
                      <span className="fireworks-new">
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
                  <span className="fireworks-chip fireworks-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="fireworks-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
