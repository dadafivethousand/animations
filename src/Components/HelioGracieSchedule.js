// HelioGracieSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/HelioGracieSchedule.css";
import schedule from "../Schedule";

export default function HelioGracieSchedule({
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
    // precise conversion decimal hours -> 12-hour clock with zero-padded minutes + AM/PM
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
    <div className="heliogracie-wrap">
      <header className="heliogracie-header">
        <h1 className="heliogracie-day">{safeDay ? safeDay.toUpperCase() : ""}</h1>
      </header>

      <main className="heliogracie-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className={`heliogracie-card ${cls.replacement ? "heliogracie-has-replacement" : ""} heliogracie-in`}
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              aria-labelledby={`heliogracie-title-${i}`}
            >
              <div className="heliogracie-left">
                <div
                  className="heliogracie-title"
                  id={`heliogracie-title-${i}`}
                  title={cls.name}
                >
                  {cls.replacement ? (
                    <span className="heliogracie-swap">
                      <span className="heliogracie-old">{cls.name}</span>
                      <span className="heliogracie-arrow" aria-hidden>→</span>
                      <span className="heliogracie-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="heliogracie-normal">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="heliogracie-chip heliogracie-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="heliogracie-time" dateTime={`${cls.start}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
