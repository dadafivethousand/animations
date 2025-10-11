import React, { useEffect, useState } from "react";
import "../Stylesheets/LionKingSchedule.css";
import schedule from "../RhSchedule"; // or "../RhSchedule" if your data lives there

export default function LionKingSchedule({
  day,
  // 2s initial pause before animating cards
  animationDelay = 1,
  animationInterval = 160
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  useEffect(() => {
    const timers = [];
    setVisible([]);

    // Initial pause, then staggered reveals
    const startT = setTimeout(() => {
      items.forEach((_, i) => {
        const t = setTimeout(
          () => setVisible((v) => [...v, i]),
          i * animationInterval
        );
        timers.push(t);
      });
    }, animationDelay);

    timers.push(startT);
    return () => timers.forEach(clearTimeout);
  }, [safeDay, animationDelay, animationInterval, items.length]);

  const formatTime = (t) => {
    if (typeof t !== "number") return "";
    const h = Math.floor(t);
    let m = Math.round((t - h) * 60);
    let hh = h;
    if (m === 60) { m = 0; hh = (h + 1) % 24; } // rounding edge
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
    <div className="lk-wrap lk-priderock">
      <header className="lk-header lk-header--center">
        <h1 className="lk-day">
          <span className="lk-day-inner">{safeDay.toUpperCase()}</span>
        </h1>
      </header>

      <main className="lk-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="lk-card lk-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="lk-left">
                <div className="lk-title">
                  {cls.replacement ? (
                    <span className="lk-swap">
                      <span className="lk-old">{cls.name}</span>
                      <span className="lk-arrow" aria-hidden>→</span>
                      <span className="lk-new">{labelForReplacement(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <div className="lk-tags">
                    <span className="lk-chip lk-chip--maple">📍 Maple</span>
                  </div>
                )}
              </div>

              <time className="lk-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
