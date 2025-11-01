// MegaManSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/MegaManSchedule.css";
import schedule from "../Schedule";

export default function MegaManSchedule({
  day,
  animationDelay = 700,
  animationInterval = 120,
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
    <div className="megaman-wrap">
      <header className="megaman-header">
              <div className="megaman-hud">
          <div className="megaman-hud__bar">
            <div className="megaman-hud__energy" aria-hidden />
          </div>
    
        </div>
        <h1 className="megaman-day">{safeDay.toUpperCase()}</h1>
        <div className="megaman-hud">
          <div className="megaman-hud__bar">
            <div className="megaman-hud__energy" aria-hidden />
          </div>
    
        </div>
      </header>

      <main className="megaman-list" aria-live="polite">
        {items.map((cls, i) => (
          visible.includes(i) ? (
            <article
              key={i}
              className={`megaman-card megaman-in`}
              role="article"
              style={{ animationDelay: `${Math.max(0, animationDelay - 300) + i * (animationInterval / 1.2)}ms` }}
            >
              <div className="megaman-left">
                <div className="megaman-title">
                  {cls.replacement ? (
                    <span className="megaman-swap">
                      <span className="megaman-old">{cls.name}</span>
                      <span className="megaman-arrow" aria-hidden>
                        →
                      </span>
                      <span className="megaman-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="megaman-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="megaman-chip megaman-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="megaman-time" dateTime={`${cls.start || ""}`}>{formatTime(cls.start)}</time>
            </article>
          ) : null
        ))}
      </main>
    </div>
  );
}
 