// WatchTheThroneSchedule.jsx
// Watch The Throne — schedule component
// - Plain JSX (no TypeScript)
// - Import path for CSS: "../Stylesheets/WatchTheThroneSchedule.css"
// - Imports schedule from "../Schedule"
// - Props: day, animationDelay, animationInterval
// - Mobile-first, top padding >= 50px, list width = 80%, time block = 90px
// - Maple chip inline, replacement handling, clears timers on unmount

import React, { useEffect, useRef, useState } from "react";
import "../Stylesheets/WatchTheThroneSchedule.css";
import schedule from "../RhSchedule";

export default function WatchTheThroneSchedule({
  day,
  animationDelay = 900,
  animationInterval = 160,
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = (day || "").toString();
  const items = schedule[safeDay] || [];

  const timersRef = useRef([]);

  useEffect(() => {
    // clear existing timers and reset visible
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    setVisible([]);

    items.forEach((_, i) => {
      const id = setTimeout(
        () =>
          setVisible((v) => (v.includes(i) ? v : [...v, i])),
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
    const period = hoursAdj < 12 ? "AM" : "PM";
    const hour12 = hoursAdj % 12 === 0 ? 12 : hoursAdj % 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hour12}:${minutesStr} ${period}`;
  };

  return (
    <div className="watchthrone-wrap" role="region" aria-label={`Schedule for ${safeDay}`}>
      <header className="watchthrone-header" role="banner">
        {/* If you paste the album cover as the page background, it will show behind this layout.
            Optional: add the album cover via CSS on .watchthrone-wrap background-image:
              background-image: url('../Media/watch_the_throne.jpg');
            I keep the wrapper neutral — paste your asset where you host it. */}
        <div className="watchthrone-overlay" aria-hidden />
        <h1 className="watchthrone-day" data-text={safeDay ? safeDay.toUpperCase() : ""}>
          {safeDay ? safeDay.toUpperCase() : ""}
        </h1>
      </header>

      <main className="watchthrone-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className="watchthrone-card watchthrone-in"
              role="article"
              style={{ animationDelay: `${Math.max(0, animationDelay - 240) + i * (animationInterval / 1.12)}ms` }}
            >
              <div className="watchthrone-left">
                <div className="watchthrone-title">
                  {cls.replacement ? (
                    <span className="watchthrone-swap">
                      <span className="watchthrone-old">{cls.name}</span>
                      <span className="watchthrone-arrow" aria-hidden>→</span>
                      <span className="watchthrone-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="watchthrone-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && <span className="watchthrone-chip watchthrone-chip--maple">📍 MAPLE</span>}
              </div>

              <time className="watchthrone-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
