// BestBuySchedule.jsx
// Best Buy–inspired schedule (clean retail / tech store aesthetic)
// - Plain JSX (no TypeScript)
// - Imports "../Stylesheets/BestBuySchedule.css" and "../Schedule"
// - Props: day, animationDelay, animationInterval
// - Mobile-first. Top padding >= 50px. List width = 80%. Time block fixed = 90px.
// - Maple chip inline, replacement handling, clears timers on unmount.
// - Respects prefers-reduced-motion.

import React, { useEffect, useState } from "react";
import "../Stylesheets/BestBuySchedule.css";
import schedule from "../Schedule";

export default function BestBuySchedule({
  day,
  animationDelay = 850,
  animationInterval = 130,
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

  // Precise conversion decimal hours -> 12-hour clock with zero-padded minutes and AM/PM
  const formatTime = (decimalHour) => {
    if (typeof decimalHour !== "number" || Number.isNaN(decimalHour)) return "";
    // compute hours and minutes carefully (digit by digit)
    const hoursWhole = Math.floor(decimalHour);
    const fractional = decimalHour - hoursWhole;
    const minutesRaw = Math.round(fractional * 60);
    let hoursAdj = hoursWhole;
    let minutes = minutesRaw;
    if (minutes === 60) {
      hoursAdj = hoursWhole + 1;
      minutes = 0;
    }
    const period = hoursAdj < 12 ? "AM" : "PM";
    const hour12 = hoursAdj % 12 === 0 ? 12 : hoursAdj % 12;
    const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hour12}:${mm} ${period}`;
  };

  return (
    <div className="bestbuy-wrap">
      <header className="bestbuy-header" role="banner">
        <div className="bestbuy-badge" aria-hidden />
        <h1 className="bestbuy-day">{safeDay ? safeDay.toUpperCase() : ""}</h1>
      </header>

      <main className="bestbuy-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className="bestbuy-card bestbuy-in"
              role="article"
              style={{
                animationDelay: `${Math.max(0, animationDelay - 200) + i * (animationInterval / 1.05)}ms`,
              }}
            >
              <div className="bestbuy-left">
                <div className="bestbuy-title">
                  {cls.replacement ? (
                    <span className="bestbuy-swap">
                      <span className="bestbuy-old">{cls.name}</span>
                      <span className="bestbuy-arrow" aria-hidden>→</span>
                      <span className="bestbuy-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="bestbuy-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="bestbuy-chip bestbuy-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="bestbuy-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
