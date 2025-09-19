import React, { useEffect, useState } from "react";
import "../Stylesheets/BobBuilderSchedule.css";
import schedule from "../Schedule"; // or "../RhSchedule"

export default function BobBuilderSchedule({
  day,
  animationDelay = 2000,
  animationInterval = 160
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  useEffect(() => {
    const timers = [];
    setVisible([]);

    const startT = setTimeout(() => {
      items.forEach((_, i) => {
        const t = setTimeout(() => setVisible((v) => [...v, i]), i * animationInterval);
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
    <div className="builder-wrap">
      <header className="builder-header builder-header--center" role="banner">
        <h1 className="builder-day">
          <span className="builder-day-inner">{safeDay.toUpperCase()}</span>
        </h1>
      </header>

      <main className="builder-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="builder-card builder-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* left hazard stripe */}
              <div className="builder-spine" aria-hidden />

              <div className="builder-left">
                <div className="builder-title">
                  {cls.replacement ? (
                    <span className="builder-swap">
                      <span className="builder-old">{cls.name}</span>
                      <span className="builder-arrow" aria-hidden>→</span>
                      <span className="builder-new">{labelForReplacement(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <div className="builder-tags">
                    <span className="builder-chip builder-chip--maple">📍 Maple</span>
                  </div>
                )}
              </div>

              <time className="builder-time" aria-label="Start time">
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
