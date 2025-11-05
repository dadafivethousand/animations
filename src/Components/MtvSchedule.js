// MtvSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/MtvSchedule.css";
import schedule from "../Schedule";

export default function MtvSchedule({
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
    // create staggered reveal timeouts
    items.forEach((_, i) => {
      const t = setTimeout(
        () => setVisible((v) => [...v, i]),
        animationDelay + i * animationInterval
      );
      timers.push(t);
    });

    return () => timers.forEach((t) => clearTimeout(t));
    // depend on items.length and timing knobs and safeDay
  }, [safeDay, items.length, animationDelay, animationInterval]);

  // Format decimal hours to 12-hour clock (digit-by-digit)
  const formatTime = (decimalHour) => {
    if (typeof decimalHour !== "number" || Number.isNaN(decimalHour)) return "";
    // hours
    const hoursWhole = Math.floor(decimalHour);
    // minutes (precise)
    const minutesRaw = Math.round((decimalHour - hoursWhole) * 60);
    let hoursAdj = hoursWhole;
    let minutes = minutesRaw;
    if (minutes === 60) {
      hoursAdj = hoursWhole + 1;
      minutes = 0;
    }
    const ap = hoursAdj < 12 ? "AM" : "PM";
    const hour12 = hoursAdj % 12 === 0 ? 12 : hoursAdj % 12;
    const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hour12}:${mm} ${ap}`;
  };

  return (
    <div className="mtv-wrap">
      <header className="mtv-header">
        <h1 className="mtv-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="mtv-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className={`mtv-card mtv-in`}
              role="article"
              style={{ animationDelay: `${Math.max(0, animationDelay - 200) + i * (animationInterval / 1.1)}ms` }}
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
                  <span className="mtv-chip mtv-chip--maple" aria-hidden>
                    📍 MAPLE
                  </span>
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
