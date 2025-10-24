// WomensSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/WomensSchedule.css";
import schedule from "../Schedule";

export default function WomensSchedule({
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
    <div className="womens-wrap">
      <header className="womens-header">
        <h1 className="womens-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="womens-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className={`womens-card womens-in ${cls.cancelled ? "is-cancelled" : ""}`}
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              aria-label={`${cls.name}${cls.cancelled ? " — cancelled" : ""}`}
            >
              <div className="womens-left">
                <div className="womens-title">
                  {cls.replacement ? (
                    <span className="womens-swap">
                      <span className="womens-old">{cls.name}</span>
                      <span className="womens-arrow" aria-hidden>
                        →
                      </span>
                      <span className="womens-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <span className="womens-chip womens-chip--maple" title="Maple">
                    📍 MAPLE
                  </span>
                )}

                {cls.cancelled && (
                  <span className="womens-chip womens-chip--cancelled" role="status" aria-label="Cancelled">
                    ✖ Cancelled
                  </span>
                )}
              </div>

              <time className="womens-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
