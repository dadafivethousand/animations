import React, { useEffect, useState } from "react";
import "../Stylesheets/WildNOutSchedule.css";
import schedule from "../Schedule"; // or "../RhSchedule"

export default function WildNOutSchedule({ day, animationDelay = 900, animationInterval = 160 }) {
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
    <div className="wild-wrap">
      <header className="wild-header">
        <h1 className="wild-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="wild-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="wild-card wild-in"
              key={i}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="wild-left">
                <div className="wild-row">
                  <span className="wild-title">
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
                  {cls.maple && <span className="chip chip--maple">📍 Maple</span>}
                </div>
              </div>

              <time className="wild-time">{formatTime(cls.start)}</time>
              {/* cinematic underglow flare */}
              <span className="wild-flare" aria-hidden />
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
