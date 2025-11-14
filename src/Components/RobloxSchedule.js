// RobloxSchedule.jsx
// Roblox-themed schedule component (plain JSX)
// - Imports "../Stylesheets/RobloxSchedule.css" and "../Schedule"
// - Props: day, animationDelay, animationInterval
// - Mobile-first, top padding >= 50px, list width = 80%, time block fixed = 90px
// - Maple chip inline, replacement handling, clears timers on unmount

import React, { useEffect, useRef, useState } from "react";
import "../Stylesheets/RobloxSchedule.css";
import schedule from "../Schedule";

export default function RobloxSchedule({
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

    // schedule staggered reveals
    items.forEach((_, i) => {
      const id = setTimeout(
        () => setVisible((v) => (v.includes(i) ? v : [...v, i])),
        animationDelay + i * animationInterval
      );
      timersRef.current.push(id);
    });

    // cleanup
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, [safeDay, items.length, animationDelay, animationInterval]);

  // convert decimal hours to 12-hour clock with zero-padded minutes and AM/PM
  const formatTime = (decimalHour) => {
    if (typeof decimalHour !== "number" || Number.isNaN(decimalHour)) return "";
    const hoursWhole = Math.floor(decimalHour);
    const fractional = decimalHour - hoursWhole;
    // compute minutes carefully
    const minutesRaw = Math.round(fractional * 60);
    let hoursAdj = hoursWhole;
    let minutes = minutesRaw;
    if (minutes === 60) {
      hoursAdj = hoursWhole + 1;
      minutes = 0;
    }
    const period = hoursAdj < 12 ? "AM" : "PM";
    const hour12 = hoursAdj % 12 === 0 ? 12 : hoursAdj % 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hour12}:${minutesStr} ${period}`;
  };

  return (
    <div className="roblox-wrap" role="region" aria-label={`Schedule for ${safeDay}`}>
      <header className="roblox-header" role="banner">
        <h1 className="roblox-day">{safeDay ? safeDay.toUpperCase() : ""}</h1>
       </header>

      <main className="roblox-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className="roblox-card roblox-in"
              role="article"
              style={{ animationDelay: `${Math.max(0, animationDelay - 160) + i * (animationInterval / 1.05)}ms` }}
            >
              <div className="roblox-left">
                <div className="roblox-block" aria-hidden />
                <div className="roblox-title">
                  {cls.replacement ? (
                    <span className="roblox-swap">
                      <span className="roblox-old">{cls.name}</span>
                      <span className="roblox-arrow" aria-hidden>→</span>
                      <span className="roblox-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="roblox-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && <span className="roblox-chip roblox-chip--maple">📍 MAPLE</span>}
              </div>

              <time className="roblox-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
