// MarvelFlashSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/MarvelFlashSchedule.css";
import schedule from "../RhSchedule";

export default function MarvelFlashSchedule({
  day,
  animationDelay = 600,
  animationInterval = 100,
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

    return () => timers.forEach((t) => clearTimeout(t));
  }, [safeDay, items.length, animationDelay, animationInterval]);

  const formatTime = (decimalHour) => {
    if (typeof decimalHour !== "number" || Number.isNaN(decimalHour)) return "";
    const h = Math.floor(decimalHour);
    const m = Math.round((decimalHour - h) * 60);
    const hr12 = h % 12 === 0 ? 12 : h % 12;
    const ap = h < 12 ? "AM" : "PM";
    const mm = m < 10 ? `0${m}` : `${m}`;
    return `${hr12}:${mm} ${ap}`;
  };

  return (
    <div className="marvelflash-wrap">
      <header className="marvelflash-header">
        <h1 className="marvelflash-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="marvelflash-list" aria-live="polite">
        {items.map((cls, i) => (
          visible.includes(i) ? (
            <article
              key={i}
              className={`marvelflash-card marvelflash-in`}
              role="article"
              style={{ animationDelay: `0ms` }}
            >
              <div className="marvelflash-left">
                <div className="marvelflash-title">
                  {cls.replacement ? (
                    <span className="marvelflash-swap">
                      <span className="marvelflash-old">{cls.name}</span>
                      <span className="marvelflash-arrow" aria-hidden>
                        →
                      </span>
                      <span className="marvelflash-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="marvelflash-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="marvelflash-chip marvelflash-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="marvelflash-time" dateTime={`${cls.start || ""}`}>{formatTime(cls.start)}</time>
            </article>
          ) : null
        ))}
      </main>
    </div>
  );
}
 