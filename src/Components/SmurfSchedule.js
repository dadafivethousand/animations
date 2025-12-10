// SmurfSchedule.jsx (unchanged)
import React, { useEffect, useState } from "react";
import "../Stylesheets/SmurfSchedule.css";
import schedule from "../Schedule";

export default function SmurfSchedule({
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
    <div className="smurf-wrap">
      <header className="smurf-header">
        <h1 className="smurf-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="smurf-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="smurf-card smurf-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="smurf-left">
                <div className="smurf-title">
                  {cls.replacement ? (
                    <span className="smurf-swap">
                      <span className="smurf-old">{cls.name}</span>
                      <span className="smurf-arrow" aria-hidden>
                        →
                      </span>
                      <span className="smurf-new">
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
                  <span className="smurf-chip smurf-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="smurf-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
