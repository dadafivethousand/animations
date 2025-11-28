// JuggernautSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/JuggernautSchedule.css";
import schedule from "../RhSchedule";

export default function JuggernautSchedule({
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
    <div className="juggernaut-wrap">
      <header className="juggernaut-header" role="banner">
        <h1 className="juggernaut-day">{safeDay ? safeDay.toUpperCase() : ""}</h1>
      </header>

      <main className="juggernaut-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className={`juggernaut-card ${cls.replacement ? "juggernaut-has-replacement" : ""} juggernaut-in`}
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              aria-labelledby={`juggernaut-title-${i}`}
            >
              <div className="juggernaut-left">
                <div
                  className="juggernaut-title"
                  id={`juggernaut-title-${i}`}
                  title={cls.name}
                >
                  {cls.replacement ? (
                    <span className="juggernaut-swap">
                      <span className="juggernaut-old">{cls.name}</span>
                      <span className="juggernaut-arrow" aria-hidden>→</span>
                      <span className="juggernaut-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="juggernaut-normal">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="juggernaut-chip juggernaut-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="juggernaut-time" dateTime={`${cls.start}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
