// MetaSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/MetaSchedule.css";
import schedule from "../Schedule";

export default function MetaSchedule({
  day,
  animationDelay = 900,
  animationInterval = 160,
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  // Staggered reveal with cleanup
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

  // 12h format with zero-padded minutes
  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="meta-wrap">
      <header className="meta-header">
        <h1 className="meta-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="meta-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="meta-card meta-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="meta-left">
                <div className="meta-title">
                  {cls.replacement ? (
                    <span className="meta-swap">
                      <span className="meta-old">{cls.name}</span>
                      <span className="meta-arrow" aria-hidden>
                        →
                      </span>
                      <span className="meta-new">
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
                  <span className="meta-chip meta-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="meta-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
