import React, { useEffect, useState } from "react";
import "../Stylesheets/PopeyeSchedule.css";
import schedule from "../Schedule"; // switch to "../RhSchedule" if needed

export default function PopeyeSchedule({
  day,
  animationDelay = 900,
  animationInterval = 160
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
    if (typeof t !== "number") return "";
    const h = Math.floor(t);
    let m = Math.round((t - h) * 60);
    let hh = h;
    if (m === 60) { m = 0; hh = (h + 1) % 24; } // handle rounding edge case
    const hr = hh % 12 || 12;
    const ap = hh < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  const labelForReplacement = (rep) => {
    if (rep === true) return "Replacement";
    if (typeof rep === "string" && rep.trim()) return rep;
    return "";
  };

  return (
    <div className="theme-wrap popeye-wrap">
      <header className="theme-header popeye-header">
        <div className="popeye-badge" aria-hidden>⚓</div>
        <h1 className="theme-day popeye-day">{safeDay.toUpperCase()}</h1>
        <div className="popeye-spinach" aria-hidden>🥫</div>
      </header>

      <main className="theme-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="theme-card theme-in popeye-card"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="theme-left">
                <div className="theme-title">
                  {cls.replacement ? (
                    <span className="swap">
                      <span className="old">{cls.name}</span>
                      <span className="arrow" aria-hidden>→</span>
                      <span className="new">{labelForReplacement(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <div className="tags">
                    <span className="chip chip--maple">📍 Maple</span>
                  </div>
                )}
              </div>

              <time className="theme-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
