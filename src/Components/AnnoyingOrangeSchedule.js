// AnnoyingOrangeSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/AnnoyingOrangeSchedule.css";
import schedule from "../Schedule";

export default function AnnoyingOrangeSchedule({
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
    // convert decimal hours to 12-hour clock with zero-padded minutes and AM/PM
    const h = Math.floor(decimalHour);
    const minutesRaw = (decimalHour - h) * 60;
    const m = Math.round(minutesRaw);

    let finalHour = h;
    let finalMinute = m;
    if (finalMinute === 60) {
      finalHour += 1;
      finalMinute = 0;
    }

    const hour12 = finalHour % 12 === 0 ? 12 : finalHour % 12;
    const ap = finalHour < 12 ? "AM" : "PM";
    const mm = finalMinute < 10 ? `0${finalMinute}` : `${finalMinute}`;
    return `${hour12}:${mm} ${ap}`;
  };

  return (
    <div className="annoyingorange-wrap">
      <header className="annoyingorange-header">
        <h1 className="annoyingorange-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="annoyingorange-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className={`annoyingorange-card ${cls.replacement ? "annoyingorange-has-replacement" : ""} annoyingorange-in`}
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              aria-labelledby={`annoyingorange-title-${i}`}
            >
              <div className="annoyingorange-left">
                <div
                  className="annoyingorange-title"
                  id={`annoyingorange-title-${i}`}
                  title={cls.name}
                >
                  {cls.replacement ? (
                    <span className="annoyingorange-swap">
                      <span className="annoyingorange-old">{cls.name}</span>
                      <span className="annoyingorange-arrow" aria-hidden>→</span>
                      <span className="annoyingorange-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="annoyingorange-normal">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="annoyingorange-chip annoyingorange-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="annoyingorange-time" dateTime={`${cls.start}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
