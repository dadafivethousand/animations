import React, { useEffect, useState } from "react";
import "../Stylesheets/PowerRangersSchedule.css";
import schedule from "../Schedule"; // or "../RhSchedule"

export default function PowerRangersSchedule({
  day,
  // cinematic pause before cards reveal (tunable)
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
    if (m === 60) { m = 0; hh = (h + 1) % 24; } // edge case rounding
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
    <div className="ranger-wrap">
      {/* Morphin Grid + lightning (behind content) */}
      <div className="ranger-grid" aria-hidden />
      <div className="ranger-bolts" aria-hidden>
        <span className="ranger-bolt b1" />
        <span className="ranger-bolt b2" />
        <span className="ranger-bolt b3" />
      </div>

      <header className="ranger-header ranger-header--center">
        <h1 className="ranger-day">
          <span className="ranger-day-inner">{safeDay.toUpperCase()}</span>
        </h1>
      </header>

      <main className="ranger-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className={`ranger-card ranger-in ranger-color-${i % 5}`}
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* left colored morph stripe */}
              <span className="ranger-spine" aria-hidden />

              <div className="ranger-left">
                <div className="ranger-title">
                  {cls.replacement ? (
                    <span className="ranger-swap">
                      <span className="ranger-old">{cls.name}</span>
                      <span className="ranger-arrow" aria-hidden>→</span>
                      <span className="ranger-new">{labelForReplacement(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <div className="ranger-tags">
                    <span className="ranger-chip ranger-chip--maple">📍 Maple</span>
                  </div>
                )}
              </div>

              <time className="ranger-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
