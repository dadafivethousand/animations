// LAGraffitiSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/LAGraffitiSchedule.css";
import schedule from "../Schedule";

export default function LAGraffitiSchedule({
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
    <div className="lagraffiti-wrap">
      <header className="lagraffiti-header">
        <h1 className="lagraffiti-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="lagraffiti-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="lagraffiti-card lagraffiti-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="lagraffiti-left">
                <div className="lagraffiti-title">
                  {cls.replacement ? (
                    <span className="lagraffiti-swap">
                      <span className="lagraffiti-old">{cls.name}</span>
                      <span className="lagraffiti-arrow" aria-hidden>
                        →
                      </span>
                      <span className="lagraffiti-new">
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
                  <span className="lagraffiti-chip lagraffiti-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="lagraffiti-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
