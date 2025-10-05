import React, { useEffect, useState } from "react";
import "../Stylesheets/TikTokSchedule.css";
import schedule from "../Schedule"; // or "../RhSchedule" if you prefer

export default function TikTokSchedule({ day, animationDelay = 900, animationInterval = 160 }) {
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
    <div className="tiktok-wrap">
      {/* Centered weekday */}
      <header className="tiktok-header">
        <h1 className="tiktok-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="tiktok-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="tiktok-card tiktok-in"
              key={i}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="tiktok-left">
                {/* Name + inline Maple chip — keep on one line */}
                <div className="tiktok-row">
                  <span className="tiktok-title">
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

              {/* Start time ONLY, equal width pill */}
              <time className="tiktok-time" aria-label="Class start time">
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
