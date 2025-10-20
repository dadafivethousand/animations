// NarutoSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/NarutoSchedule.css";
import schedule from "../Schedule";

export default function NarutoSchedule({
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
    <div className="naruto-wrap">
      <header className="naruto-header">
        <h1 className="naruto-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="naruto-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="naruto-card naruto-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="naruto-left">
                <div className="naruto-title">
                  {cls.replacement ? (
                    <span className="naruto-swap">
                      <span className="naruto-old">{cls.name}</span>
                      <span className="naruto-arrow" aria-hidden>
                        →
                      </span>
                      <span className="naruto-new">
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
                  <span className="naruto-chip naruto-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="naruto-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
