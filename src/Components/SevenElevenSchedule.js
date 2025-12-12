// SevenElevenSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/SevenElevenSchedule.css";
import schedule from "../Schedule";

export default function SevenElevenSchedule({
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
    <div className="seveneleven-wrap">
      <header className="seveneleven-header" role="banner">
        <h1 className="seveneleven-day">
          {safeDay ? safeDay.toUpperCase() : ""}
        </h1>
      </header>

      <main
        className="seveneleven-list"
        aria-live="polite"
        aria-label={`${safeDay || "Selected day"} schedule`}
      >
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className={`seveneleven-card ${
                cls.replacement ? "seveneleven-has-replacement" : ""
              } seveneleven-in`}
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              aria-labelledby={`seveneleven-title-${i}`}
            >
              <div className="seveneleven-left">
                <div
                  className="seveneleven-title"
                  id={`seveneleven-title-${i}`}
                  title={cls.name}
                >
                  {cls.replacement ? (
                    <span className="seveneleven-swap">
                      <span className="seveneleven-old">{cls.name}</span>
                      <span className="seveneleven-arrow" aria-hidden>
                        →
                      </span>
                      <span className="seveneleven-new">
                        {typeof cls.replacement === "string"
                          ? cls.replacement
                          : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="seveneleven-normal">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="seveneleven-chip seveneleven-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time
                className="seveneleven-time"
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
