// File: F1Schedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/F1Schedule.css";
import schedule from "../RhSchedule";

export default function F1Schedule({
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
    let h = Math.floor(decimalHour);
    let m = Math.round((decimalHour - h) * 60);
    if (m === 60) { h += 1; m = 0; }
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const ap = h < 12 ? "AM" : "PM";
    const mm = m < 10 ? `0${m}` : `${m}`;
    return `${hour12}:${mm} ${ap}`;
  };

  return (
    <div className="f1-wrap">
      <header className="f1-header">
        <h1 className="f1-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="f1-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className={`f1-card ${cls.replacement ? "f1-has-replacement" : ""} f1-in`}
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="f1-left">
                <div className="f1-title" title={cls.name}>
                  {cls.replacement ? (
                    <span className="f1-swap">
                      <span className="f1-old">{cls.name}</span>
                      <span className="f1-arrow" aria-hidden>→</span>
                      <span className="f1-new">{typeof cls.replacement === "string" ? cls.replacement : "Replacement"}</span>
                    </span>
                  ) : (
                    <span className="f1-normal">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="f1-chip f1-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="f1-time" dateTime={`${cls.start}`}>{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}

/* End of F1Schedule.jsx */


