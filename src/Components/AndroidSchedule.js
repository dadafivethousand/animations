// AndroidSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/AndroidSchedule.css";
import schedule from "../Schedule";

export default function AndroidSchedule({
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
      timers.forEach(clearTimeout);
    };
  }, [safeDay, animationDelay, animationInterval, items.length]);

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="android-wrap">
      <header className="android-header">
  
        <h1 className="android-day">{safeDay.toUpperCase()}</h1>
       </header>

      <main className="android-list" aria-label={`${safeDay} schedule`}>
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="android-card android-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="android-left">
                <div className="android-title">
                  {cls.replacement ? (
                    <span className="android-swap">
                      <span className="android-old">{cls.name}</span>
                      <span className="android-arrow" aria-hidden>
                        →
                      </span>
                      <span className="android-new">
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
                  <span className="android-chip android-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="android-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
