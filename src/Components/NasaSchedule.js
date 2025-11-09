// NasaSchedule.jsx
// NASA Mission Control style schedule
// - Plain JSX (no TypeScript)
// - Imports "../Stylesheets/NasaSchedule.css" and "../Schedule"
// - Props: day, animationDelay, animationInterval
// - Mobile-first, top padding >= 50px, list width = 80%, time block = 90px
// - Maple chip inline, replacement handling, clears timers on unmount

import React, { useEffect, useState } from "react";
import "../Stylesheets/NasaSchedule.css";
import schedule from "../Schedule";

export default function NasaSchedule({
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

  // convert decimal hours to 12-hour clock w/ zero-padded minutes and AM/PM (digit-by-digit math)
  const formatTime = (decimalHour) => {
    if (typeof decimalHour !== "number" || Number.isNaN(decimalHour)) return "";
    const h = Math.floor(decimalHour);
    const fractional = decimalHour - h;
    const mRaw = Math.round(fractional * 60);
    let hh = h;
    let mm = mRaw;
    if (mm === 60) {
      hh = h + 1;
      mm = 0;
    }
    const ap = hh < 12 ? "AM" : "PM";
    const hr12 = hh % 12 === 0 ? 12 : hh % 12;
    const mmStr = mm < 10 ? `0${mm}` : `${mm}`;
    return `${hr12}:${mmStr} ${ap}`;
  };

  return (
    <div className="nasa-wrap" role="region" aria-label={`Schedule for ${safeDay}`}>
      <header className="nasa-header" role="banner">
        {/* placeholder for logo — paste your logo into .nasa-logo element in CSS/HTML */}
        <div className="nasa-logo" aria-hidden />
        <h1 className="nasa-day">{safeDay ? safeDay.toUpperCase() : ""}</h1>
        <div className="nasa-meta" aria-hidden>
          <div className="nasa-tiny">MISSION LOG</div>
          <div className="nasa-tiny nasa-tiny--muted">UTC</div>
        </div>
      </header>

      <main className="nasa-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className="nasa-card nasa-in"
              role="article"
              style={{ animationDelay: `${Math.max(0, animationDelay - 240) + i * (animationInterval / 1.15)}ms` }}
            >
              <div className="nasa-left">
                <div className="nasa-hud">
                  <div className="nasa-hud-dot" aria-hidden />
                  <div className="nasa-hud-line" aria-hidden />
                </div>

                <div className="nasa-title">
                  {cls.replacement ? (
                    <span className="nasa-swap">
                      <span className="nasa-old">{cls.name}</span>
                      <span className="nasa-arrow" aria-hidden>→</span>
                      <span className="nasa-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="nasa-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && <span className="nasa-chip nasa-chip--maple">📍 MAPLE</span>}
              </div>

              <time className="nasa-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
