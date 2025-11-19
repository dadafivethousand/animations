// StarbucksSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/StarbucksSchedule.css";
import schedule from "../Schedule";

export default function StarbucksSchedule({
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

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [safeDay, items.length, animationDelay, animationInterval]);

  const formatTime = (decimalHour) => {
    // convert decimal hours to 12-hour clock with zero-padded minutes and AM/PM
    const h = Math.floor(decimalHour);
    // calculate minutes precisely
    const minutesRaw = (decimalHour - h) * 60;
    const m = Math.round(minutesRaw);
    let finalHour = h;
    let finalMinute = m;
    if (finalMinute === 60) {
      finalHour = finalHour + 1;
      finalMinute = 0;
    }
    const hour12 = finalHour % 12 === 0 ? 12 : finalHour % 12;
    const ap = finalHour < 12 ? "AM" : "PM";
    const mm = finalMinute < 10 ? `0${finalMinute}` : `${finalMinute}`;
    return `${hour12}:${mm} ${ap}`;
  };

  return (
    <div className="starbucks-wrap">
      <header className="starbucks-header">
        <h1 className="starbucks-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="starbucks-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className={`starbucks-card ${cls.replacement ? "starbucks-has-replacement" : ""} starbucks-in`}
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              aria-labelledby={`starbucks-title-${i}`}
            >
              <div className="starbucks-left">
                <div
                  className="starbucks-title"
                  id={`starbucks-title-${i}`}
                  title={cls.name}
                >
                  {cls.replacement ? (
                    <span className="starbucks-swap">
                      <span className="starbucks-old">{cls.name}</span>
                      <span className="starbucks-arrow" aria-hidden>
                        →
                      </span>
                      <span className="starbucks-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="starbucks-normal">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="starbucks-chip starbucks-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="starbucks-time" dateTime={`${cls.start}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
