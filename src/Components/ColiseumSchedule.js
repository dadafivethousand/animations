// ColiseumSchedule.jsx
// Ancient Rome — Coliseum-themed schedule component
// - Single-file React component (plain JSX)
// - Imports "../Stylesheets/ColiseumSchedule.css" and "../Schedule"
// - Props: day, animationDelay, animationInterval
// - Mobile-first. List width = 80%. Top padding >= 50px. Time block fixed 90px.
// - Maple chip inline, replacement handling, clears timers on unmount.
// - Respects prefers-reduced-motion.

import React, { useEffect, useState } from "react";
import "../Stylesheets/ColiseumSchedule.css";
import schedule from "../Schedule";

export default function ColiseumSchedule({
  day,
  animationDelay = 900,
  animationInterval = 160,
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = (day || "").toString();
  const items = schedule[safeDay] || [];

  useEffect(() => {
    const timers = [];
    setVisible([]);
    items.forEach((_, i) => {
      const t = setTimeout(
        () => setVisible((v) => [...v, i]),
        animationDelay + i * animationInterval
      );
      timers.push(t);
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, [safeDay, items.length, animationDelay, animationInterval]);

  // Convert decimal hours -> 12-hour clock with zero-padded minutes and AM/PM.
  // Compute minutes digit-by-digit to avoid rounding edge-cases.
  const formatTime = (decimalHour) => {
    if (typeof decimalHour !== "number" || Number.isNaN(decimalHour)) return "";
    const hoursWhole = Math.floor(decimalHour);
    const fractional = decimalHour - hoursWhole;
    // minutes = round(fractional * 60)
    const minutesRaw = Math.round(fractional * 60);
    let hoursAdjusted = hoursWhole;
    let minutes = minutesRaw;
    if (minutes === 60) {
      hoursAdjusted = hoursWhole + 1;
      minutes = 0;
    }
    const period = hoursAdjusted < 12 ? "AM" : "PM";
    const hour12 = hoursAdjusted % 12 === 0 ? 12 : hoursAdjusted % 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hour12}:${minutesStr} ${period}`;
  };

  return (
    <div className="coliseum-wrap" role="region" aria-label={`Schedule for ${safeDay}`}>
      <header className="coliseum-header" role="banner" aria-hidden={false}>
        <div className="coliseum-wordmark" aria-hidden>
          <svg viewBox="0 0 64 64" className="coliseum-laurel" width="48" height="48" aria-hidden>
            <path d="M6 32c6-14 16-20 26-20s20 6 26 20c-10 6-16 6-26 6S16 38 6 32z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="coliseum-day">{safeDay ? safeDay.toUpperCase() : ""}</h1>
      </header>

      <main className="coliseum-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className="coliseum-card coliseum-in"
              role="article"
              style={{ animationDelay: `${Math.max(0, animationDelay - 240) + i * (animationInterval / 1.15)}ms` }}
            >
              <div className="coliseum-left">
                <div className="coliseum-title">
                  {cls.replacement ? (
                    <span className="coliseum-swap">
                      <span className="coliseum-old">{cls.name}</span>
                      <span className="coliseum-arrow" aria-hidden>→</span>
                      <span className="coliseum-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="coliseum-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="coliseum-chip coliseum-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="coliseum-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
