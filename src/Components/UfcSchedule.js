// UfcSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/UfcSchedule.css";
import schedule from "../Schedule";

export default function UfcSchedule({
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
        () =>
          setVisible((v) => {
            if (!v.includes(i)) return [...v, i];
            return v;
          }),
        animationDelay + i * animationInterval
      );
      timers.push(t);
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, [safeDay, items.length, animationDelay, animationInterval]);

  const formatTime = (decimalHour) => {
    const h = Math.floor(decimalHour);
    const minutesRaw = (decimalHour - h) * 60;
    let m = Math.round(minutesRaw);
    let hh = h;
    if (m === 60) {
      hh = hh + 1;
      m = 0;
    }
    const hour12 = hh % 12 === 0 ? 12 : hh % 12;
    const ap = hh < 12 ? "AM" : "PM";
    const mm = m < 10 ? `0${m}` : `${m}`;
    return `${hour12}:${mm} ${ap}`;
  };

  return (
    <div className="ufc-wrap">
      <header className="ufc-header" role="banner">
        <h1 className="ufc-day">{safeDay ? safeDay.toUpperCase() : ""}</h1>
      </header>

      <main className="ufc-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className={`ufc-card ${cls.replacement ? "ufc-has-replacement" : ""} ufc-in`}
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              aria-labelledby={`ufc-title-${i}`}
            >
              <div className="ufc-left">
                <div className="ufc-badge" aria-hidden>
                  <div className="ufc-ring" />
                </div>

                <div
                  className="ufc-title"
                  id={`ufc-title-${i}`}
                  title={cls.name}
                >
                  {cls.replacement ? (
                    <span className="ufc-swap">
                      <span className="ufc-old">{cls.name}</span>
                      <span className="ufc-arrow" aria-hidden>→</span>
                      <span className="ufc-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="ufc-normal">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="ufc-chip ufc-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="ufc-time" dateTime={`${cls.start}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
