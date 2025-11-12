// GorillazSchedule.jsx
// Gorillaz "Feel Good Inc." themed schedule
// - Plain JSX (no TypeScript)
// - Imports "../Stylesheets/GorillazSchedule.css" and "../Schedule"
// - Props: day, animationDelay, animationInterval
// - Mobile-first. Top padding >= 50px. List width = 80%. Time block fixed = 90px.
// - Maple chip inline, replacement handling, clears timers on unmount.

import React, { useEffect, useRef, useState } from "react";
import "../Stylesheets/GorillazSchedule.css";
import schedule from "../Schedule";

export default function GorillazSchedule({
  day,
  animationDelay = 700,
  animationInterval = 110,
}) {
  const safeDay = (day || "").toString();
  const items = schedule[safeDay] || [];

  const [visible, setVisible] = useState([]);
  const timersRef = useRef([]);

  useEffect(() => {
    // clear previous timers
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    setVisible([]);

    items.forEach((_, i) => {
      const id = setTimeout(
        () => setVisible((v) => (v.includes(i) ? v : [...v, i])),
        animationDelay + i * animationInterval
      );
      timersRef.current.push(id);
    });

    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, [safeDay, items.length, animationDelay, animationInterval]);

  // time formatting: decimal -> 12-hour clock with zero-padded minutes and AM/PM (digit-by-digit)
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
    const hour12 = hh % 12 === 0 ? 12 : hh % 12;
    const mmStr = mm < 10 ? `0${mm}` : `${mm}`;
    return `${hour12}:${mmStr} ${ap}`;
  };

  return (
    <div className="gorillaz-wrap" role="region" aria-label={`Schedule for ${safeDay}`}>
      <header className="gorillaz-header" role="banner" aria-hidden={false}>
        <h1 className="gorillaz-day" data-text={safeDay ? safeDay.toUpperCase() : ""}>
          {safeDay ? safeDay.toUpperCase() : ""}
        </h1>
       </header>

      <main className="gorillaz-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className="gorillaz-card gorillaz-in"
              role="article"
              style={{ animationDelay: `${Math.max(0, animationDelay - 180) + i * (animationInterval / 1.1)}ms` }}
            >
              <div className="gorillaz-left">
         

                <div className="gorillaz-title">
                  {cls.replacement ? (
                    <span className="gorillaz-swap">
                      <span className="gorillaz-old">{cls.name}</span>
                      <span className="gorillaz-arrow" aria-hidden>→</span>
                      <span className="gorillaz-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="gorillaz-name">{cls.name}</span>
                  )}

                  {cls.maple && <span className="gorillaz-chip gorillaz-chip--maple">📍 MAPLE</span>}
                </div>
              </div>

              <time className="gorillaz-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
      {/* grain overlay for texture (pure CSS) */}
      <div className="gorillaz-grain" aria-hidden />
    </div>
  );
}
