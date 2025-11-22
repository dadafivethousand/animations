// AlbumCoverSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/AlbumCoverSchedule.css";
import schedule from "../Schedule";

export default function AlbumCoverSchedule({
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
    // Step-by-step decimal -> 12-hour clock with zero-padded minutes and AM/PM
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
    <div className="albumcover-wrap">
      <header className="albumcover-header">
        <h1 className="albumcover-day">{safeDay ? safeDay.toUpperCase() : ""}</h1>
      </header>

      <main className="albumcover-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className={`albumcover-card ${cls.replacement ? "albumcover-has-replacement" : ""} albumcover-in`}
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              aria-labelledby={`albumcover-title-${i}`}
            >
              <div className="albumcover-left">
            
                <div className="albumcover-title" id={`albumcover-title-${i}`} title={cls.name}>
                  {cls.replacement ? (
                    <span className="albumcover-swap">
                      <span className="albumcover-old">{cls.name}</span>
                      <span className="albumcover-arrow" aria-hidden>→</span>
                      <span className="albumcover-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="albumcover-normal">{cls.name}</span>
                  )}
                </div>

                {cls.maple && <span className="albumcover-chip albumcover-chip--maple">📍 MAPLE</span>}
              </div>

              <time className="albumcover-time" dateTime={`${cls.start}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
