// MonkeySchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/MonkeySchedule.css";
import schedule from "../Schedule";

export default function MonkeySchedule({
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
    // careful decimal -> 12-hour with zero-padded minutes and AM/PM
    const hoursDecimal = decimalHour;
    const hourInteger = Math.floor(hoursDecimal);
    const minuteDecimal = hoursDecimal - hourInteger;
    const minuteUnrounded = minuteDecimal * 60;
    let minute = Math.round(minuteUnrounded);

    // handle minute == 60
    let finalHour = hourInteger;
    let finalMinute = minute;
    if (finalMinute === 60) {
      finalHour = finalHour + 1;
      finalMinute = 0;
    }

    const hour12 = finalHour % 12 === 0 ? 12 : finalHour % 12;
    const period = finalHour < 12 ? "AM" : "PM";
    const mm = finalMinute < 10 ? `0${finalMinute}` : `${finalMinute}`;
    return `${hour12}:${mm} ${period}`;
  };

  return (
    <div className="monkey-wrap">
      <header className="monkey-header">
        <h1 className="monkey-day">{safeDay ? safeDay.toUpperCase() : ""}</h1>
      </header>

      <main className="monkey-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className={`monkey-card ${cls.replacement ? "monkey-has-replacement" : ""} monkey-in`}
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              aria-labelledby={`monkey-title-${i}`}
            >
              <div className="monkey-left">
                {/* Pure CSS monkey emoji / meme face */}
                <div className="monkey-face" aria-hidden>
                  <div className="monkey-ear ear-left" />
                  <div className="monkey-ear ear-right" />
                  <div className="monkey-head">
                    <div className="monkey-eye eye-left">
                      <div className="monkey-pupil" />
                    </div>
                    <div className="monkey-eye eye-right">
                      <div className="monkey-pupil" />
                    </div>
                    <div className="monkey-brows" />
                    <div className="monkey-mouth" />
                  </div>
                </div>

                <div className="monkey-title" id={`monkey-title-${i}`} title={cls.name}>
                  {cls.replacement ? (
                    <span className="monkey-swap">
                      <span className="monkey-old">{cls.name}</span>
                      <span className="monkey-arrow" aria-hidden>→</span>
                      <span className="monkey-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="monkey-normal">{cls.name}</span>
                  )}
                </div>

                {cls.maple && <span className="monkey-chip monkey-chip--maple">📍 MAPLE</span>}
              </div>

              <time className="monkey-time" dateTime={`${cls.start}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
