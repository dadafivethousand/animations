// JohnCenaSchedule.js — WWE / John Cena arena vibe (plain JS + CSS)
// Mobile-first. Shows: Day + classes only. Equal-width time badges. MAPLE + replacement.
import React from "react";
import "../Stylesheets/JohnCenaSchedule.css";
import schedule from "../RhSchedule"; // adjust path if needed

export default function JohnCenaSchedule({ day }) {
  const items = schedule[day] || [];

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="jc-wrap">
      {/* background layers */}
      <div className="jc-bg" aria-hidden />
      <div className="jc-stars" aria-hidden />
      <div className="jc-vignette" aria-hidden />

      {/* ring ropes header */}
      <header className="jc-head">
 
        <h1 className="jc-day">{(day || "").toUpperCase()}</h1>
      </header>

      <main className="jc-list">
        {items.map((cls, i) => (
          <div className="jc-card" key={i}>
            <div className="jc-left">
               <span className="jc-name">
                {cls.replacement ? (
                  <span className="jc-swap">
                    <span className="jc-old">{cls.name}</span>
                    <span className="jc-arrow" aria-hidden>→</span>
                    <span className="jc-new">{String(cls.replacement)}</span>
                  </span>
                ) : (
                  cls.name
                )}
              </span>
              {cls.maple && <span className="jc-chip">MAPLE</span>}
            </div>
            <time className="jc-time">{formatTime(cls.start)}</time>
          </div>
        ))}
      </main>
    </div>
  );
}
