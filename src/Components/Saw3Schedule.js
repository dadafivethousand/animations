// Saw3Schedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/Saw3Schedule.css";
import schedule from "../Schedule";

export default function Saw3Schedule({
  day,
  animationDelay = 800,
  animationInterval = 140,
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
    const m = Math.round((decimalHour - h) * 60);
    const hr12 = h % 12 === 0 ? 12 : h % 12;
    const ap = h < 12 ? "AM" : "PM";
    const mm = m < 10 ? `0${m}` : `${m}`;
    return `${hr12}:${mm} ${ap}`;
  };

  return (
    <div className="saw3-wrap">
      <header className="saw3-header">
        <h1 className="saw3-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="saw3-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className={`saw3-card saw3-in`}
              role="article"
              style={{ animationDelay: `${Math.max(0, animationDelay - 200) + i * (animationInterval / 1.1)}ms` }}
            >
              <div className="saw3-left">
                <div className="saw3-title">
                  {cls.replacement ? (
                    <span className="saw3-swap">
                      <span className="saw3-old">{cls.name}</span>
                      <span className="saw3-arrow" aria-hidden>
                        →
                      </span>
                      <span className="saw3-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="saw3-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="saw3-chip saw3-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="saw3-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
