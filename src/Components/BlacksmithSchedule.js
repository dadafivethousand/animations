import React, { useEffect, useState } from "react";
import "../Stylesheets/BlacksmithSchedule.css";
import schedule from "../Schedule"; // or "../RhSchedule" if you prefer

export default function BlacksmithSchedule({ day, animationDelay = 900, animationInterval = 160 }) {
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
    <div className="blacksmith-wrap">
      {/* Centered weekday in forged type */}
      <header className="blacksmith-header">
        <h1 className="blacksmith-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="blacksmith-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="blacksmith-card blacksmith-in"
              key={i}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="blacksmith-left">
                {/* One-line name + Maple chip */}
                <div className="blacksmith-row">
                  <span className="blacksmith-title">
                    {cls.replacement ? (
                      <span className="swap">
                        <span className="old">{cls.name}</span>
                        <span className="arrow" aria-hidden>→</span>
                        <span className="new">{String(cls.replacement)}</span>
                      </span>
                    ) : (
                      cls.name
                    )}
                  </span>
                  {cls.maple && (
                    <span className="chip chip--maple" title="Maple">📍 Maple</span>
                  )}
                </div>
              </div>

              {/* Start time ONLY, fixed width */}
              <time className="blacksmith-time" aria-label="Class start time">
                {formatTime(cls.start)}
              </time>

              {/* Decorative rivets */}
              <span className="rivet rivet--tl" aria-hidden />
              <span className="rivet rivet--tr" aria-hidden />
              <span className="rivet rivet--bl" aria-hidden />
              <span className="rivet rivet--br" aria-hidden />
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
