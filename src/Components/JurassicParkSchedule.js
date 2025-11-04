// JurassicParkSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/JurassicParkSchedule.css";
import schedule from "../Schedule";

export default function JurassicParkSchedule({
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

  const formatTime = (decimalHour) => {
    if (typeof decimalHour !== "number" || Number.isNaN(decimalHour)) return "";
    const h = Math.floor(decimalHour);
    // careful minutes arithmetic to avoid 60 edge-case
    const fractional = decimalHour - h;
    const mRaw = Math.round(fractional * 60);
    let hh = h;
    let mm = mRaw;
    if (mm === 60) {
      hh = h + 1;
      mm = 0;
    }
    const period = hh < 12 ? "AM" : "PM";
    const hr12 = hh % 12 === 0 ? 12 : hh % 12;
    const mmStr = mm < 10 ? `0${mm}` : `${mm}`;
    return `${hr12}:${mmStr} ${period}`;
  };

  return (
    <div className="jurassic-wrap">
      <header className="jurassic-header">
        <h1 className="jurassic-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="jurassic-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className={`jurassic-card jurassic-in`}
              role="article"
              style={{
                animationDelay: `${Math.max(0, animationDelay - 240) + i * (animationInterval / 1.15)}ms`,
              }}
            >
              <div className="jurassic-left">
                <div className="jurassic-title">
                  {cls.replacement ? (
                    <span className="jurassic-swap">
                      <span className="jurassic-old">{cls.name}</span>
                      <span className="jurassic-arrow" aria-hidden>
                        →
                      </span>
                      <span className="jurassic-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="jurassic-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="jurassic-chip jurassic-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="jurassic-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
