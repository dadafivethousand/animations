import React, { useEffect, useState } from "react";
import "../Stylesheets/BassProSchedule.css";
import schedule from "../RhSchedule"; // or "../RhSchedule" if you store data there

export default function BassProSchedule({
  day,
  // 2s initial pause before animating cards (tunable)
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
    if (m === 60) { m = 0; hh = (h + 1) % 24; }
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
    <div className="bp-wrap">
      <header className="bp-header bp-header--center">
        <h1 className="bp-day">
          <span className="bp-day-inner">{safeDay.toUpperCase()}</span>
        </h1>
      </header>

      <main className="bp-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="bp-card bp-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="bp-left">
                <div className="bp-title">
                  {cls.replacement ? (
                    <span className="bp-swap">
                      <span className="bp-old">{cls.name}</span>
                      <span className="bp-arrow" aria-hidden>→</span>
                      <span className="bp-new">{labelForReplacement(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <div className="bp-tags">
                    <span className="bp-chip bp-chip--maple">📍 Maple</span>
                  </div>
                )}
              </div>

              <time className="bp-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
