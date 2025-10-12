// ElmoSchedule.jsx (unchanged)
import React, { useEffect, useState } from "react";
import "../Stylesheets/ElmoSchedule.css";
import schedule from "../Schedule";

export default function ElmoSchedule({
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
    <div className="elmo-wrap">
      <header className="elmo-header">
        <h1 className="elmo-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="elmo-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="elmo-card elmo-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="elmo-left">
                <div className="elmo-title">
                  {cls.replacement ? (
                    <span className="elmo-swap">
                      <span className="elmo-old">{cls.name}</span>
                      <span className="elmo-arrow" aria-hidden>
                        →
                      </span>
                      <span className="elmo-new">
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
                  <span className="elmo-chip elmo-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="elmo-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
