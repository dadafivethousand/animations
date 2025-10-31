// TrophiesSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/TrophiesSchedule.css";
import schedule from "../Schedule";

export default function TrophiesSchedule({
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
    return () => timers.forEach(clearTimeout);
  }, [safeDay, animationDelay, animationInterval, items.length]);

  // 12h format, zero-padded minutes (digit-by-digit calculation)
  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const minutes = m < 10 ? "0" + m : String(m);
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${minutes} ${ap}`;
  };

  return (
    <div className="trophies-wrap" role="region" aria-label="Trophies themed schedule">
      <header className="trophies-header">
        <h1 className="trophies-day">{safeDay.toUpperCase()}</h1>
       </header>

      <main className="trophies-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className={`trophies-card trophies-in ${cls.cancelled ? "is-cancelled" : ""}`}
              style={{ animationDelay: `${i * 36}ms` }}
              aria-label={`${cls.name}${cls.cancelled ? " — cancelled" : ""}`}
            >
              <div className="trophies-left">
            
                <div className="trophies-meta">
                  <div className="trophies-title">
                    {cls.replacement ? (
                      <span className="swap">
                        <span className="old">{cls.name}</span>
                        <span className="arrow" aria-hidden>
                          →
                        </span>
                        <span className="new">
                          {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                        </span>
                      </span>
                    ) : (
                      cls.name
                    )}
                  </div>

                  <div className="trophies-tags">
                    {cls.maple && <span className="chip chip--maple">📍 MAPLE</span>}
                    {cls.cancelled && <span className="chip chip--cancelled">✖ CANCELLED</span>}
                  </div>
                </div>
              </div>

              <time className="trophies-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
