// NvidiaSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/NvidiaSchedule.css";
import schedule from "../RhSchedule";

export default function NvidiaSchedule({
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
        () => setVisible((v) => {
          // push index only if not already present (defensive)
          if (!v.includes(i)) return [...v, i];
          return v;
        }),
        animationDelay + i * animationInterval
      );
      timers.push(t);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [safeDay, items.length, animationDelay, animationInterval]);

  const formatTime = (decimalHour) => {
    // Step-by-step conversion of decimal hours -> 12-hour clock with zero-padded minutes and AM/PM
    const hoursDecimal = decimalHour;
    const hourInteger = Math.floor(hoursDecimal);
    const minuteDecimal = hoursDecimal - hourInteger;
    // multiply minuteDecimal by 60, rounded to nearest integer
    const minuteUnrounded = minuteDecimal * 60;
    const minute = Math.round(minuteUnrounded);

    // handle rounding edge (e.g., 1.999 -> 2:00)
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
    <div className="nvidia-wrap">
      <header className="nvidia-header">
        <h1 className="nvidia-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="nvidia-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className={`nvidia-card ${cls.replacement ? "nvidia-has-replacement" : ""} nvidia-in`}
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="nvidia-left">
                <div className="nvidia-title" title={cls.name}>
                  {cls.replacement ? (
                    <span className="nvidia-swap">
                      <span className="nvidia-old">{cls.name}</span>
                      <span className="nvidia-arrow" aria-hidden>
                        →
                      </span>
                      <span className="nvidia-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="nvidia-normal">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="nvidia-chip nvidia-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="nvidia-time" dateTime={`${cls.start}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
