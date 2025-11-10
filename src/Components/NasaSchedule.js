// NasaSchedule.jsx
// Improved NASA Mission Control–style schedule
// - Plain JSX (no TypeScript)
// - Imports "../Stylesheets/NasaSchedule.css" and "../Schedule"
// - Props: day, animationDelay, animationInterval
// - Mobile-first, top padding >= 50px, list width = 80%, time block = 90px
// - Maple chip inline, replacement handling, clears timers on unmount
import React, { useEffect, useState, useRef } from "react";
import "../Stylesheets/NasaSchedule.css";
import schedule from "../Schedule";

export default function NasaSchedule({
  day,
  animationDelay = 700,
  animationInterval = 120,
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = (day || "").toString();
  const items = schedule[safeDay] || [];

  // store timers in ref for robust cleanup (no leaks)
  const timersRef = useRef([]);

  useEffect(() => {
    // clear any existing timers
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    setVisible([]);

    // schedule reveal timeouts (staggered)
    items.forEach((_, i) => {
      const id = setTimeout(
        () => setVisible((v) => (v.includes(i) ? v : [...v, i])),
        animationDelay + i * animationInterval
      );
      timersRef.current.push(id);
    });

    // cleanup on unmount or dependency change
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
    // include items.length to follow contract
  }, [safeDay, items.length, animationDelay, animationInterval]);

  // precise decimal -> 12-hour clock with zero-padded minutes and AM/PM
  const formatTime = (decimalHour) => {
    if (typeof decimalHour !== "number" || Number.isNaN(decimalHour)) return "";
    const hoursWhole = Math.floor(decimalHour);
    const fractional = decimalHour - hoursWhole;
    const minutesRaw = Math.round(fractional * 60);
    let hoursAdjusted = hoursWhole;
    let minutes = minutesRaw;
    if (minutes === 60) {
      hoursAdjusted = hoursWhole + 1;
      minutes = 0;
    }
    const ampm = hoursAdjusted < 12 ? "AM" : "PM";
    const hour12 = hoursAdjusted % 12 === 0 ? 12 : hoursAdjusted % 12;
    const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hour12}:${mm} ${ampm}`;
  };

  return (
    <div className="nasa-wrap" role="region" aria-label={`Schedule for ${safeDay}`}>
      <header className="nasa-header" role="banner" aria-hidden={false}>
        {/* Logo slot — paste your logo into the .nasa-logo element */}
 
        
        <div className="nasa-header-center">
          <h1 className="nasa-day">{safeDay ? safeDay.toUpperCase() : ""}</h1>
 
        </div>
 
      </header>

      <main className="nasa-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className="nasa-card nasa-in"
              role="article"
              style={{ animationDelay: `${Math.max(0, animationDelay - 200) + i * (animationInterval / 1.05)}ms` }}
            >
              <div className="nasa-left">
          

                <div className="nasa-title">
                  {cls.replacement ? (
                    <span className="nasa-swap">
                      <span className="nasa-old">{cls.name}</span>
                      <span className="nasa-arrow" aria-hidden>→</span>
                      <span className="nasa-new">{typeof cls.replacement === "string" ? cls.replacement : "Replacement"}</span>
                    </span>
                  ) : (
                    <span className="nasa-name">{cls.name}</span>
                  )}

                  {cls.maple && <span className="nasa-chip nasa-chip--maple">📍 MAPLE</span>}
                </div>
              </div>

              <time className="nasa-time" dateTime={`${cls.start || ""}`}>
                <span className="nasa-time-main">{formatTime(cls.start)}</span>
                <span className="nasa-time-sub" aria-hidden>{/* subtle seconds marker for UI life */}●</span>
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
