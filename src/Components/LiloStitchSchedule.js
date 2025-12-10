// LiloStitchSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/LiloStitchSchedule.css";
import schedule from "../Schedule";

export default function LiloStitchSchedule({
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
    <div className="lilostitch-wrap">
      <header className="lilostitch-header" role="banner">
        <h1 className="lilostitch-day">
          {safeDay ? safeDay.toUpperCase() : ""}
        </h1>
      </header>

      <main
        className="lilostitch-list"
        aria-live="polite"
        aria-label={`${safeDay || "Selected day"} schedule`}
      >
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className={`lilostitch-card ${
                cls.replacement ? "lilostitch-has-replacement" : ""
              } lilostitch-in`}
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              aria-labelledby={`lilostitch-title-${i}`}
            >
              <div className="lilostitch-left">
                <div
                  className="lilostitch-title"
                  id={`lilostitch-title-${i}`}
                  title={cls.name}
                >
                  {cls.replacement ? (
                    <span className="lilostitch-swap">
                      <span className="lilostitch-old">{cls.name}</span>
                      <span className="lilostitch-arrow" aria-hidden>
                        →
                      </span>
                      <span className="lilostitch-new">
                        {typeof cls.replacement === "string"
                          ? cls.replacement
                          : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="lilostitch-normal">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="lilostitch-chip lilostitch-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time
                className="lilostitch-time"
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
