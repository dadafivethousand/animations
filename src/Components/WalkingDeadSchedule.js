// WalkingDeadSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/WalkingDeadSchedule.css";
import schedule from "../Schedule";

export default function WalkingDeadSchedule({
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

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="walkingdead2-wrap" role="region" aria-label="Walking Dead themed schedule">
      <header className="walkingdead2-header" aria-hidden>
 

        <h1 className="walkingdead2-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="walkingdead2-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className={`walkingdead2-card walkingdead2-in ${cls.cancelled ? "is-cancelled" : ""}`}
              style={{ animationDelay: `${i * 36}ms` }}
              aria-label={`${cls.name}${cls.cancelled ? " — cancelled" : ""}`}
            >
              <div className="walkingdead2-left">
                <div className="walkingdead2-title-wrap">
                  <div className="walkingdead2-title">
                    {cls.replacement ? (
                      <span className="walkingdead2-swap">
                        <span className="walkingdead2-old">{cls.name}</span>
                        <span className="walkingdead2-arrow" aria-hidden>→</span>
                        <span className="walkingdead2-new">
                          {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                        </span>
                      </span>
                    ) : (
                      cls.name
                    )}
                  </div>

                  <div className="walkingdead2-tags">
                    {cls.maple && <span className="walkingdead2-chip walkingdead2-chip--maple">📍 MAPLE</span>}
                    {cls.cancelled && <span className="walkingdead2-chip walkingdead2-chip--cancelled">✖ CANCELLED</span>}
                  </div>
                </div>
              </div>

              <time className="walkingdead2-time">{formatTime(cls.start)}</time>

              <span className="walkingdead2-bolt" aria-hidden />
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
