import React, { useEffect, useState } from "react";
import "../Stylesheets/ThanosSchedule.css";
import schedule from "../RhSchedule"; // or "../RhSchedule"

export default function ThanosSchedule({
  day,
  // cinematic pause before cards reveal
  animationDelay = 2000,
  animationInterval = 160
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  useEffect(() => {
    const timers = [];
    setVisible([]);

    // initial pause, then staggered reveal
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
    <div className="thanos-wrap">
      {/* Deep-space layers behind content */}
      <div className="thanos-cosmos" aria-hidden />
      <div className="thanos-stars" aria-hidden />

      <header className="thanos-header thanos-header--center">
        <h1 className="thanos-day">
          <span className="thanos-day-inner">{safeDay.toUpperCase()}</span>
        </h1>
      </header>

      <main className="thanos-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="thanos-card thanos-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Gauntlet spine with stones */}
              <span className="thanos-spine" aria-hidden />

              <div className="thanos-left">
                <div className="thanos-title">
                  {cls.replacement ? (
                    <span className="thanos-swap">
                      <span className="thanos-old">{cls.name}</span>
                      <span className="thanos-arrow" aria-hidden>→</span>
                      <span className="thanos-new">{labelForReplacement(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <div className="thanos-tags">
                    <span className="thanos-chip thanos-chip--maple">📍 Maple</span>
                  </div>
                )}
              </div>

              <time className="thanos-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
