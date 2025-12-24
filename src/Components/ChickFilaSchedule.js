// ChickFilaSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/ChickFilaSchedule.css";
import schedule from "../Schedule";

export default function ChickFilaSchedule({
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
          setVisible((prev) => {
            if (!prev.includes(i)) return [...prev, i];
            return prev;
          }),
        animationDelay + i * animationInterval
      );
      timers.push(t);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
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
    <div className="chickfila-wrap">
      <header className="chickfila-header" role="banner">
        <h1 className="chickfila-day">
          {safeDay ? safeDay.toUpperCase() : ""}
        </h1>
      </header>

      <main
        className="chickfila-list"
        aria-live="polite"
        aria-label={`${safeDay || "Selected day"} schedule`}
      >
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className={`chickfila-card ${
                cls.replacement ? "chickfila-has-replacement" : ""
              } chickfila-in`}
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              aria-labelledby={`chickfila-title-${i}`}
            >
              <div className="chickfila-left">
                <div className="chickfila-icon">
                  <span className="chickfila-icon-chicken" aria-hidden="true">
                    🐔
                  </span>
                </div>

                <div
                  className="chickfila-title"
                  id={`chickfila-title-${i}`}
                  title={cls.name}
                >
                  {cls.replacement ? (
                    <span className="chickfila-swap">
                      <span className="chickfila-old">{cls.name}</span>
                      <span className="chickfila-arrow" aria-hidden>
                        →
                      </span>
                      <span className="chickfila-new">
                        {typeof cls.replacement === "string"
                          ? cls.replacement
                          : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="chickfila-normal">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="chickfila-chip chickfila-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time
                className="chickfila-time"
                dateTime={String(cls.start)}
              >
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
