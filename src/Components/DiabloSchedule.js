// DiabloSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/DiabloSchedule.css";
import schedule from "../Schedule";

export default function DiabloSchedule({
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

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [safeDay, items.length, animationDelay, animationInterval]);

  // convert decimal hours to 12-hour clock with zero-padded minutes and AM/PM
  const formatTime = (decimalHour) => {
    if (typeof decimalHour !== "number" || Number.isNaN(decimalHour)) return "";
    const hoursWhole = Math.floor(decimalHour);
    // compute minutes carefully, digit-by-digit
    const minutesRaw = Math.round((decimalHour - hoursWhole) * 60);
    let hoursAdjusted = hoursWhole;
    let minutes = minutesRaw;
    if (minutes === 60) {
      hoursAdjusted = hoursWhole + 1;
      minutes = 0;
    }
    const period = hoursAdjusted < 12 ? "AM" : "PM";
    const hour12 = hoursAdjusted % 12 === 0 ? 12 : hoursAdjusted % 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hour12}:${minutesStr} ${period}`;
  };

  return (
    <div className="diablo-wrap">
      <header className="diablo-header" role="banner">
        <h1 className="diablo-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="diablo-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className={`diablo-card diablo-in`}
              role="article"
              style={{
                animationDelay: `${Math.max(0, animationDelay - 260) + i * (animationInterval / 1.15)}ms`,
              }}
            >
              <div className="diablo-left">
                <div className="diablo-title">
                  {cls.replacement ? (
                    <span className="diablo-swap">
                      <span className="diablo-old">{cls.name}</span>
                      <span className="diablo-arrow" aria-hidden>
                        →
                      </span>
                      <span className="diablo-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="diablo-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && <span className="diablo-chip diablo-chip--maple">📍 MAPLE</span>}
              </div>

              <time className="diablo-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
