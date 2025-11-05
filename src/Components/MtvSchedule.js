// MtvSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/MtvSchedule.css";
import schedule from "../Schedule";

export default function MtvSchedule({
  day,
  animationDelay = 700,
  animationInterval = 120,
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

  // strict digit-by-digit minutes calculation
  const formatTime = (decimalHour) => {
    if (typeof decimalHour !== "number" || Number.isNaN(decimalHour)) return "";
    const h = Math.floor(decimalHour);
    // compute minutes precisely
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
    <div className="mtv-wrap">
      <header className="mtv-header" role="banner" aria-hidden={false}>
        {/* Title: big yellow text with teal outline; no background color */}
        <h1 className="mtv-day">{safeDay.toUpperCase()}</h1>
        {/* decorative red scribble (pure CSS) */}
        <div className="mtv-logo-scribble" aria-hidden />
      </header>

      <main className="mtv-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className={`mtv-card mtv-in`}
              role="article"
              style={{
                animationDelay: `${Math.max(0, animationDelay - 180) + i * (animationInterval / 1.1)}ms`,
              }}
            >
              <div className="mtv-left">
                <div className="mtv-title">
                  {cls.replacement ? (
                    <span className="mtv-swap">
                      <span className="mtv-old">{cls.name}</span>
                      <span className="mtv-arrow" aria-hidden>
                        →
                      </span>
                      <span className="mtv-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="mtv-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="mtv-chip mtv-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="mtv-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
