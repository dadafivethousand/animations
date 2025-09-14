// EAHockeySchedule.jsx — EA SPORTS (NHL/ice) themed, mobile-first
import React, { useEffect, useState } from "react";
import "../Stylesheets/EASportsSchedule.css";
import schedule from "../Schedule";

export default function EASportsSchedule({
  day,
  animationDelay = 900,
  animationInterval = 140,
}) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const items = schedule[day] || [];
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
  }, [day, animationDelay, animationInterval]);

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="nhl-wrap">
      <header className="nhl-appbar">
        <div className="nhl-medallion" aria-hidden>
          <span className="nhl-ea">EA</span>
          <span className="nhl-sports">SPORTS</span>
        </div>
        <span className="nhl-day">{(day || "").toUpperCase()}</span>
      </header>

      <main className="nhl-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="nhl-card nhl-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="nhl-left">
                <div className="nhl-title">
                  {cls.replacement ? (
                    <span className="nhl-swap">
                      <span className="nhl-old">{cls.name}</span>
                      <span className="nhl-arrow" aria-hidden>
                        →
                      </span>
                      <span className="nhl-new">{String(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>
                <div className="nhl-tags">
                  {cls.maple && (
                    <span className="nhl-chip nhl-chip--maple">📍 Maple</span>
                  )}
                </div>
              </div>

              <time className="nhl-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
