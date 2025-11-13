// DonaldDuckSchedule.jsx
// Donald Duck–themed schedule (black background)
// - Plain JSX (no TypeScript)
// - Imports "../Stylesheets/DonaldDuckSchedule.css" and "../Schedule"
// - Props: day, animationDelay, animationInterval
// - Mobile-first, top padding >= 50px, list width = 80%, time block = 90px
// - Maple chip inline, replacement handling, clears timers on unmount

import React, { useEffect, useRef, useState } from "react";
import "../Stylesheets/DonaldDuckSchedule.css";
import schedule from "../Schedule";

export default function DonaldDuckSchedule({
  day,
  animationDelay = 700,
  animationInterval = 110,
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = (day || "").toString();
  const items = schedule[safeDay] || [];

  const timersRef = useRef([]);

  useEffect(() => {
    // cleanup previous timers
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

  // decimal -> 12-hour clock with zero-padded minutes and AM/PM (digit-by-digit math)
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
    <div className="donaldduck-wrap" role="region" aria-label={`Schedule for ${safeDay}`}>
      <header className="donaldduck-header" role="banner" aria-hidden={false}>
        <h1 className="donaldduck-day">{safeDay ? safeDay.toUpperCase() : ""}</h1>
 
      </header>

      <main className="donaldduck-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className="donaldduck-card donaldduck-in"
              role="article"
              style={{ animationDelay: `${Math.max(0, animationDelay - 160) + i * (animationInterval / 1.05)}ms` }}
            >
              <div className="donaldduck-left">
  
                <div className="donaldduck-title">
                  {cls.replacement ? (
                    <span className="donaldduck-swap">
                      <span className="donaldduck-old">{cls.name}</span>
                      <span className="donaldduck-arrow" aria-hidden>→</span>
                      <span className="donaldduck-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="donaldduck-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && <span className="donaldduck-chip donaldduck-chip--maple">📍 MAPLE</span>}
              </div>

              <time className="donaldduck-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
