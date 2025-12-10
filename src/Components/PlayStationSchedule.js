// PlayStationSchedule.jsx (clean PS5-style)
import React, { useEffect, useState } from "react";
import "../Stylesheets/PlayStationSchedule.css";
import schedule from "../RhSchedule";

export default function PlayStationSchedule({
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
    <div className="playstation-wrap">
      <header className="playstation-header">
        <h1 className="playstation-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="playstation-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="playstation-card playstation-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="playstation-left">
                <div className="playstation-title">
                  {cls.replacement ? (
                    <span className="playstation-swap">
                      <span className="playstation-old">{cls.name}</span>
                      <span className="playstation-arrow" aria-hidden>
                        →
                      </span>
                      <span className="playstation-new">
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
                  <span className="playstation-chip playstation-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="playstation-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
