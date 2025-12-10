// WinniePoohSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/WinniePoohSchedule.css";
import schedule from "../Schedule";

export default function WinniePoohSchedule({
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

  // robust 12h formatting (round minutes correctly)
  const formatTime = (t) => {
    const totalMinutes = Math.round(t * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const hr = h % 12 || 12;
    const minutes = m < 10 ? "0" + m : String(m);
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${minutes} ${ap}`;
  };

  return (
    <div className="winnie-wrap" role="region" aria-label="Winnie the Pooh themed schedule">
      <header className="winnie-header" aria-hidden>
        <h1 className="winnie-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="winnie-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className={`winnie-card winnie-in ${cls.cancelled ? "is-cancelled" : ""}`}
              style={{ animationDelay: `${i * 40}ms` }}
              aria-label={`${cls.name}${cls.cancelled ? " — cancelled" : ""}`}
            >
              <div className="winnie-left">
                <div className="winnie-honey" aria-hidden />
                <div className="winnie-title-wrap">
                  <div className="winnie-title">
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

                  <div className="winnie-tags">
                    {cls.maple && <span className="chip chip--maple">📍 MAPLE</span>}
                    {cls.cancelled && <span className="chip chip--cancelled">✖ CANCELLED</span>}
                  </div>
                </div>
              </div>

              <time className="winnie-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
