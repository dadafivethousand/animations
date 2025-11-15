// GarfieldSchedule.jsx
// Garfield-themed schedule component (plain JSX)
// - Imports "../Stylesheets/GarfieldSchedule.css" and "../Schedule"
// - Props: day, animationDelay, animationInterval
// - Mobile-first, top padding >= 50px, list width = 80%, time block fixed = 90px
// - Maple chip inline, replacement handling, clears timers on unmount

import React, { useEffect, useRef, useState } from "react";
import "../Stylesheets/GarfieldSchedule.css";
import schedule from "../Schedule";

export default function GarfieldSchedule({
  day,
  animationDelay = 700,
  animationInterval = 120,
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = (day || "").toString();
  const items = schedule[safeDay] || [];
  const timersRef = useRef([]);

  useEffect(() => {
    // clear previous timers
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    setVisible([]);

    // staggered reveal
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

  // decimal -> 12-hour clock with zero-padded minutes and AM/PM
  const formatTime = (decimalHour) => {
    if (typeof decimalHour !== "number" || Number.isNaN(decimalHour)) return "";
    const hoursWhole = Math.floor(decimalHour);
    const fractional = decimalHour - hoursWhole;
    const minutesRaw = Math.round(fractional * 60);
    let hoursAdj = hoursWhole;
    let minutes = minutesRaw;
    if (minutes === 60) {
      hoursAdj = hoursWhole + 1;
      minutes = 0;
    }
    const ampm = hoursAdj < 12 ? "AM" : "PM";
    const hour12 = hoursAdj % 12 === 0 ? 12 : hoursAdj % 12;
    const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hour12}:${mm} ${ampm}`;
  };

  return (
    <div className="garfield-wrap" role="region" aria-label={`Schedule for ${safeDay}`}>
      <header className="garfield-header" role="banner">
        <h1 className="garfield-day">{safeDay ? safeDay.toUpperCase() : ""}</h1>
 
      </header>

      <main className="garfield-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className="garfield-card garfield-in"
              role="article"
              style={{ animationDelay: `${Math.max(0, animationDelay - 160) + i * (animationInterval / 1.05)}ms` }}
            >
              <div className="garfield-left">
                <div className="garfield-paw" aria-hidden />
                <div className="garfield-title">
                  {cls.replacement ? (
                    <span className="garfield-swap">
                      <span className="garfield-old">{cls.name}</span>
                      <span className="garfield-arrow" aria-hidden>→</span>
                      <span className="garfield-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="garfield-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && <span className="garfield-chip garfield-chip--maple">📍 MAPLE</span>}
              </div>

              <time className="garfield-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
