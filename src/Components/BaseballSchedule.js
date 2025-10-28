// BaseballSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/BaseballSchedule.css";
import schedule from "../Schedule";

export default function BaseballSchedule({
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
    return () => timers.forEach(clearTimeout);
  }, [safeDay, animationDelay, animationInterval, items.length]);

  // careful 12h conversion (digit-by-digit care)
  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const minutes = m < 10 ? "0" + m : String(m);
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${minutes} ${ap}`;
  };

  return (
    <div className="baseball-wrap" role="region" aria-label="Baseball themed schedule">
      <header className="baseball-header">
        <div className="baseball-hero">
          <div className="baseball-bat" aria-hidden />
          <div className="baseball-mitt" aria-hidden />
          <div className="baseball-ball" aria-hidden />
        </div>

        <h1 className="baseball-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="baseball-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className={`baseball-card baseball-in ${cls.cancelled ? "is-cancelled" : ""}`}
              style={{ animationDelay: `${i * 36}ms` }}
              aria-label={`${cls.name}${cls.cancelled ? " — cancelled" : ""}`}
            >
              <div className="baseball-left">
                <div className="baseball-title">
                  {cls.replacement ? (
                    <span className="swap">
                      <span className="old">{cls.name}</span>
                      <span className="arrow" aria-hidden>
                        →
                      </span>
                      <span className="new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                <div className="baseball-tags">
                  {cls.maple && <span className="chip chip--maple">📍 MAPLE</span>}
                  {cls.cancelled && <span className="chip chip--cancelled">✖ CANCELLED</span>}
                </div>
              </div>

              <time className="baseball-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
