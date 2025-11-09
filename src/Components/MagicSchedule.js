// MagicCardSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/MagicSchedule.css";
import schedule from "../RhSchedule";

export default function MagicCardSchedule({
  day,
  animationDelay = 900,
  animationInterval = 160,
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = day || "";
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
  // Compute minutes digit-by-digit to avoid arithmetic edge-cases.
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
    <div className="magiccard-wrap">
      <header className="magiccard-header" role="banner">
        <h1 className="magiccard-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="magiccard-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className="magiccard-card magiccard-in"
              role="article"
              style={{ animationDelay: `${Math.max(0, animationDelay - 240) + i * (animationInterval / 1.15)}ms` }}
            >
              <div className="magiccard-left">
                <div className="magiccard-title">
                  {cls.replacement ? (
                    <span className="magiccard-swap">
                      <span className="magiccard-old">{cls.name}</span>
                      <span className="magiccard-arrow" aria-hidden>→</span>
                      <span className="magiccard-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="magiccard-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="magiccard-chip magiccard-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="magiccard-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
