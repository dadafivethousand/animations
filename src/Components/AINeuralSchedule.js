// AINeuralSchedule.jsx
// AI Neural Network themed schedule component
// - Plain JSX (no TypeScript)
// - Imports "../Stylesheets/AINeuralSchedule.css" and "../Schedule"
// - Props: day, animationDelay, animationInterval
// - Mobile-first, top padding >= 50px, list width = 80%, time block = 90px
// - Maple chip inline, replacement handling, clears timers on unmount
import React, { useEffect, useState } from "react";
import "../Stylesheets/AINeuralSchedule.css";
import schedule from "../Schedule";

export default function AINeuralSchedule({
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

  // convert decimal hours to 12-hour clock with zero-padded minutes and AM/PM
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
    const period = hoursAdjusted < 12 ? "AM" : "PM";
    const hour12 = hoursAdjusted % 12 === 0 ? 12 : hoursAdjusted % 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hour12}:${minutesStr} ${period}`;
  };

  return (
    <div className="ainneural-wrap" role="region" aria-label={`Schedule for ${safeDay}`}>
      <header className="ainneural-header" role="banner">
        <h1 className="ainneural-day">{safeDay ? safeDay.toUpperCase() : ""}</h1>
      </header>

      <main className="ainneural-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className="ainneural-card ainneural-in"
              role="article"
              style={{ animationDelay: `${Math.max(0, animationDelay - 160) + i * (animationInterval / 1.05)}ms` }}
            >
              <div className="ainneural-left">
                {/* node column */}
                <div className="ainneural-nodes" aria-hidden>
                  <span className="node node--big" />
                  <span className="link" />
                  <span className="node node--med" />
                  <span className="link" />
                  <span className="node node--small" />
                </div>

                {/* textual title / replacement */}
                <div className="ainneural-title">
                  {cls.replacement ? (
                    <span className="ainneural-swap">
                      <span className="ainneural-old">{cls.name}</span>
                      <span className="ainneural-arrow" aria-hidden>→</span>
                      <span className="ainneural-new">{typeof cls.replacement === "string" ? cls.replacement : "Replacement"}</span>
                    </span>
                  ) : (
                    <span className="ainneural-name">{cls.name}</span>
                  )}

                  {cls.maple && <span className="ainneural-chip ainneural-chip--maple">📍 MAPLE</span>}
                </div>
              </div>

              <time className="ainneural-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
