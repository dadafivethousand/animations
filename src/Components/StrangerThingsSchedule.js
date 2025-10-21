// StrangerThingsSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/StrangerThingsSchedule.css";
import schedule from "../Schedule";

export default function StrangerThingsSchedule({
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
    <div className="strangerthings-wrap">
      <header className="strangerthings-header">
        <h1 className="strangerthings-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="strangerthings-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="strangerthings-card strangerthings-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="strangerthings-left">
                <div className="strangerthings-title">
                  {cls.replacement ? (
                    <span className="strangerthings-swap">
                      <span className="strangerthings-old">{cls.name}</span>
                      <span className="strangerthings-arrow" aria-hidden>
                        →
                      </span>
                      <span className="strangerthings-new">
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
                  <span className="strangerthings-chip strangerthings-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="strangerthings-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
