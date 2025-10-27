// MadMaxSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/MadMaxSchedule.css";
import schedule from "../Schedule";

export default function MadMaxSchedule({
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
    <div className="madmax-wrap">
      <header className="madmax-header">
        <h1 className="madmax-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="madmax-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="madmax-card madmax-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="madmax-left">
                <div className="madmax-title">
                  {cls.replacement ? (
                    <span className="madmax-swap">
                      <span className="madmax-old">{cls.name}</span>
                      <span className="madmax-arrow" aria-hidden>
                        →
                      </span>
                      <span className="madmax-new">
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
                  <div className="madmax-tags">
                    <span className="madmax-chip madmax-chip--maple">📍 MAPLE</span>
                  </div>
                )}
              </div>

              <time className="madmax-time" aria-label="Class start time">
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
