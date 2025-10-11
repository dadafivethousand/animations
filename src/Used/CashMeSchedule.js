import React, { useEffect, useState } from "react";
import "../Stylesheets/CashMeSchedule.css";
import schedule from "../Schedule"; // or "../RhSchedule" if your data lives there

export default function CashMeSchedule({
  day,
  // 2s initial pause before animating cards (per request)
  animationDelay = 2000,
  animationInterval = 160
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  useEffect(() => {
    const timers = [];
    setVisible([]);

    // initial pause, then staggered reveals
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
    if (m === 60) { m = 0; hh = (h + 1) % 24; } // edge rounding
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
    <div className="theme-wrap cashme">
      <header className="theme-header theme-header--center">
        <h1 className="theme-day">
          <span className="day-inner">{safeDay.toUpperCase()}</span>
        </h1>
      </header>

      <main className="theme-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="theme-card theme-in"
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
