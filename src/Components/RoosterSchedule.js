import React, { useEffect, useState } from "react";
import "../Stylesheets/RoosterSchedule.css";
import schedule from "../RhSchedule"; // or "../RhSchedule"

export default function RoosterSchedule({ day, animationDelay = 900, animationInterval = 160 }) {
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
    <div className="rooster-wrap">
      <header className="rooster-header">
        <h1 className="rooster-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="rooster-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="rooster-card rooster-in"
              key={i}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="rooster-left">
                <div className="rooster-row">
                  <span className="rooster-title">
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

              {/* Start time ONLY, fixed width */}
              <time className="rooster-time">{formatTime(cls.start)}</time>

              {/* Decorative sunrise crest */}
              <span className="rooster-crest" aria-hidden />
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
