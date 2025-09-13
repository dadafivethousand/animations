// HeavyMetalSchedule.js — Slipknot / Korn aesthetic (no icons, mobile-first)
import React from "react";
import "../Stylesheets/HeavyMetalSchedule.css";
import schedule from "../Schedule";

export default function HeavyMetalSchedule({ day }) {
  const items = schedule[day] || [];

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="hm3-wrap">
      {/* stage splatter + vignette + torn gutters */}
      <div className="hm3-splatter" aria-hidden />
      <div className="hm3-vignette" aria-hidden />
      <div className="hm3-gutters" aria-hidden />

      <header className="hm3-head">
        <h1 className="hm3-day">{(day || "").toUpperCase()}</h1>
      </header>

      <main className="hm3-list">
        {items.map((cls, i) => (
          <div className="hm3-card" key={i}>
            <div className="hm3-left">
              <span className="hm3-spine" aria-hidden />
              <span className="hm3-name">
                {cls.replacement ? (
                  <span className="hm3-swap">
                    <span className="hm3-old">{cls.name}</span>
                    <span className="hm3-arrow" aria-hidden>→</span>
                    <span className="hm3-new">{String(cls.replacement)}</span>
                  </span>
                ) : (
                  cls.name
                )}
              </span>
              {cls.maple && <span className="hm3-chip">MAPLE</span>}
            </div>
            <time className="hm3-time">{formatTime(cls.start)}</time>
          </div>
        ))}
      </main>
    </div>
  );
}
