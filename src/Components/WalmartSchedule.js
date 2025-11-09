// WalmartSchedule.jsx
// Walmart-themed schedule component (big-box retail aesthetic)
// - Single-file React component (plain JSX)
// - Imports "../Stylesheets/WalmartSchedule.css" and "../Schedule"
// - Props: day, animationDelay, animationInterval
// - Mobile-first, list width 80%, header centered (30px), time block 90px
// - Maple chip inline, replacement handling, clears timers on unmount
import React, { useEffect, useState } from "react";
import "../Stylesheets/WalmartSchedule.css";
import schedule from "../Schedule";

export default function WalmartSchedule({
  day,
  animationDelay = 800,
  animationInterval = 120,
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

  // Convert decimal hours to 12-hour clock with zero-padded minutes and AM/PM
  const formatTime = (decimalHour) => {
    if (typeof decimalHour !== "number" || Number.isNaN(decimalHour)) return "";
    // compute hours and minutes digit-by-digit
    const hoursWhole = Math.floor(decimalHour);
    const fractional = decimalHour - hoursWhole;
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
    <div className="walmart-wrap">
      <header className="walmart-header" role="banner" aria-hidden={false}>
 
        <h1 className="walmart-day">{safeDay ? safeDay.toUpperCase() : ""}</h1>
      </header>

      <main className="walmart-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className="walmart-card walmart-in"
              role="article"
              style={{
                animationDelay: `${Math.max(0, animationDelay - 160) + i * (animationInterval / 1.05)}ms`,
              }}
            >
              <div className="walmart-left">
                <div className="walmart-title">
                  {cls.replacement ? (
                    <span className="walmart-swap">
                      <span className="walmart-old">{cls.name}</span>
                      <span className="walmart-arrow" aria-hidden>
                        →
                      </span>
                      <span className="walmart-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="walmart-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="walmart-chip walmart-chip--maple" aria-hidden>
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="walmart-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
