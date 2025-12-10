// OnePieceSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/OnePieceSchedule.css";
import schedule from "../Schedule";

export default function OnePieceSchedule({
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
    <div className="onepiece-wrap">
      <header className="onepiece-header">
        <h1 className="onepiece-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="onepiece-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="onepiece-card onepiece-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="onepiece-left">
                <div className="onepiece-title">
                  {cls.replacement ? (
                    <span className="onepiece-swap">
                      <span className="onepiece-old">{cls.name}</span>
                      <span className="onepiece-arrow" aria-hidden>
                        →
                      </span>
                      <span className="onepiece-new">
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
                  <span className="onepiece-chip onepiece-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="onepiece-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
