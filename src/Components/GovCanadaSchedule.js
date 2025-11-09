// GovCanadaSchedule.jsx
// Government of Canada themed schedule component
// Follows the schedule contract: day, animationDelay, animationInterval
import React, { useEffect, useState } from "react";
import "../Stylesheets/GovCanadaSchedule.css";
import schedule from "../Schedule";

export default function GovCanadaSchedule({
  day,
  animationDelay = 900,
  animationInterval = 160,
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
    <div className="govcan-wrap">
      <header className="govcan-header" role="banner" aria-hidden={false}>
        <div className="govcan-wordmark" aria-hidden>
          <svg viewBox="0 0 64 64" className="govcan-maple" role="img" aria-hidden>
            <title>Maple Leaf</title>
            <path fill="#D52B1E" d="M32 6l4 8 9 1-7 6 2 9-8-4-8 4 2-9-7-6 9-1z" />
          </svg>
          <div className="govcan-labels">
            <div className="govcan-gov">GOVERNMENT OF CANADA</div>
            <div className="govcan-gov-fr">GOUVERNEMENT DU CANADA</div>
          </div>
        </div>

        <h1 className="govcan-day">{safeDay ? safeDay.toUpperCase() : ""}</h1>
      </header>

      <main className="govcan-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className="govcan-card govcan-in"
              role="article"
              style={{ animationDelay: `${Math.max(0, animationDelay - 240) + i * (animationInterval / 1.15)}ms` }}
            >
              <div className="govcan-left">
                <div className="govcan-title">
                  {cls.replacement ? (
                    <span className="govcan-swap">
                      <span className="govcan-old">{cls.name}</span>
                      <span className="govcan-arrow" aria-hidden>→</span>
                      <span className="govcan-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="govcan-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="govcan-chip govcan-chip--maple" aria-hidden>
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="govcan-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
