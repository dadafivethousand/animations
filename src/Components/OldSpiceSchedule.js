// OldSpiceSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/OldSpiceSchedule.css";
import schedule from "../RhSchedule";

export default function OldSpiceSchedule({
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
    <div className="oldspice-wrap">
      <header className="oldspice-header">
        <h1 className="oldspice-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="oldspice-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="oldspice-card oldspice-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="oldspice-left">
                <div className="oldspice-title">
                  {cls.replacement ? (
                    <span className="oldspice-swap">
                      <span className="oldspice-old">{cls.name}</span>
                      <span className="oldspice-arrow" aria-hidden>
                        →
                      </span>
                      <span className="oldspice-new">
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
                  <span className="oldspice-chip oldspice-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="oldspice-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
