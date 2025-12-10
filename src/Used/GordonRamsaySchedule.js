// GordonRamsaySchedule.js — Hell's Kitchen vibe (plain JS + CSS)
// Mobile-first: tight typography, equal-width time, thumb-friendly spacing.
import React from "react";
import "../Stylesheets/GordonRamsaySchedule.css";
import schedule from "../RhSchedule";

export default function GordonRamsaySchedule({ day }) {
  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  const items = schedule[day] || [];

  return (
    <div className="gr-wrap">
      {/* stainless wall + heat glow */}
      <div className="gr-wall" aria-hidden />
      <div className="gr-heat" aria-hidden />

      <header className="gr-head">
        <h1 className="gr-day">{(day || "").toUpperCase()}</h1>
       </header>

      <main className="gr-list">
        {items.map((cls, i) => (
          <div className="gr-card" key={i}>
            <div className="gr-left">
              <span className="gr-knife" aria-hidden />
              <span className="gr-name">
                {cls.replacement ? (
                  <span className="gr-swap">
                    <span className="gr-old">{cls.name}</span>
                    <span className="gr-arrow" aria-hidden>→</span>
                    <span className="gr-new">{String(cls.replacement)}</span>
                  </span>
                ) : (
                  cls.name
                )}
              </span>
              {cls.maple && <span className="gr-chip">MAPLE</span>}
            </div>
            <time className="gr-time">{formatTime(cls.start)}</time>
          </div>
        ))}
      </main>

      <aside className="gr-note" aria-hidden>
       </aside>
    </div>
  );
}
