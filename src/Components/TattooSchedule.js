// TattooSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/TattooSchedule.css";
import schedule from "../Schedule";

export default function TattooSchedule({
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
    <div className="tattoo-wrap">
      <header className="tattoo-header">
        <h1 className="tattoo-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="tattoo-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className={`tattoo-card tattoo-in ${cls.cancelled ? "is-cancelled" : ""}`}
              style={{ animationDelay: `${i * 40}ms` }}
              aria-label={cls.cancelled ? "Cancelled class" : undefined}
            >
              <div className="tattoo-left">
                <div className="tattoo-title">
                  {cls.replacement ? (
                    <span className="tattoo-swap">
                      <span className="tattoo-old">{cls.name}</span>
                      <span className="tattoo-arrow" aria-hidden>
                        →
                      </span>
                      <span className="tattoo-new">
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
                  <span className="tattoo-chip tattoo-chip--maple">📍 MAPLE</span>
                )}

                {cls.cancelled && (
                  <span className="tattoo-chip tattoo-chip--cancelled">✖ CANCELLED</span>
                )}
              </div>

              <time className="tattoo-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
