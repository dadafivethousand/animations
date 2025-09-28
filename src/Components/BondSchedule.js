import React, { useEffect, useState } from "react";
import "../Stylesheets/BondSchedule.css";
import schedule from "../Schedule"; // or "../RhSchedule"

export default function BondSchedule({
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
    <div className="bond-wrap">
      {/* Gunbarrel swirl (pure CSS) lives behind content */}
      <div className="bond-gunbarrel" aria-hidden />

      <header className="bond-header bond-header--center">
        <h1 className="bond-day">
          <span className="bond-day-inner">
            {safeDay.toUpperCase()}
          
          </span>
        </h1>
      </header>

      <main className="bond-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="bond-card bond-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* left gold sight-line */}
              <span className="bond-sight" aria-hidden />

              <div className="bond-left">
                <div className="bond-title">
                  {cls.replacement ? (
                    <span className="bond-swap">
                      <span className="bond-old">{cls.name}</span>
                      <span className="bond-arrow" aria-hidden>→</span>
                      <span className="bond-new">{labelForReplacement(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <div className="bond-tags">
                    <span className="bond-chip bond-chip--maple">📍 Maple</span>
                  </div>
                )}
              </div>

              <time className="bond-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
