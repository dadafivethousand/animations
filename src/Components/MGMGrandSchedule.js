// MGMGrandSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/MGMGrandSchedule.css";
import schedule from "../Schedule";

export default function MGMGrandSchedule({
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
    <div className="mgmgrand-wrap">
      <header className="mgmgrand-header">
        <h1 className="mgmgrand-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="mgmgrand-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="mgmgrand-card mgmgrand-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="mgmgrand-left">
                <div className="mgmgrand-title">
                  {cls.replacement ? (
                    <span className="mgmgrand-swap">
                      <span className="mgmgrand-old">{cls.name}</span>
                      <span className="mgmgrand-arrow" aria-hidden>
                        →
                      </span>
                      <span className="mgmgrand-new">
                        {typeof cls.replacement === "string"
                          ? cls.replacement
                          : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <span className="mgmgrand-chip mgmgrand-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="mgmgrand-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
