import React, { useEffect, useState } from "react";
import "../Stylesheets/DiscordSchedule.css";
import schedule from "../Schedule"; // or "../RhSchedule"

export default function DiscordSchedule({ day, animationDelay = 900, animationInterval = 160 }) {
  const [visible, setVisible] = useState([]);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  // staggered reveal with cleanup
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

  // 12h formatting with zero-padded minutes
  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="discord-wrap">
      {/* Channel-style header with centered weekday */}
      <header className="discord-header">
        <span className="discord-hash" aria-hidden>#</span>
        <h1 className="discord-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="discord-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="discord-card discord-in"
              key={i}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Left hash pill (same as your input bar) */}
              <div>
              <span className="pill">#</span>

              {/* Name + MAPLE inline (never wraps to next line) */}
              <div className="discord-row">
                <span className="discord-title">
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
                </div>
                {cls.maple && <span className="chip chip--maple">📍 Maple</span>}
              </div>

              {/* Start time ONLY — fixed width, centered */}
              <time className="discord-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>


    </div>
  );
}
