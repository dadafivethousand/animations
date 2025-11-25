// OlympicsSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/OlympicsSchedule.css";
import schedule from "../Schedule";

export default function OlympicsSchedule({
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
      const t = setTimeout(() => {
        setVisible((v) => [...v, i]);
      }, animationDelay + i * animationInterval);
      timers.push(t);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [safeDay, animationDelay, animationInterval, items.length]);

  const formatTime = (t) => {
    if (typeof t !== "number") return "";
    let h = Math.floor(t);
    let m = Math.round((t - h) * 60);

    if (m === 60) {
      h += 1;
      m = 0;
    }

    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    const mm = m < 10 ? "0" + m : String(m);
    return `${hr}:${mm} ${ap}`;
  };

  return (
    <div className="olympics-wrap">
      <header className="olympics-header">
        <h1 className="olympics-day" aria-label={safeDay || "Day"}>
          {safeDay ? safeDay.toUpperCase() : ""}
        </h1>
      </header>

      <main className="olympics-list">
        {items.map((cls, i) => {
          if (!visible.includes(i)) return null;

          const hasReplacement = !!cls.replacement;
          const newName =
            typeof cls.replacement === "string"
              ? cls.replacement
              : "Replacement";

          return (
            <article className="olympics-card olympics-in" key={i}>
              <div className="olympics-left">
                <div className="olympics-title">
                  {hasReplacement ? (
                    <span className="olympics-swap">
                      <span className="olympics-old">{cls.name}</span>
                      <span className="olympics-arrow" aria-hidden="true">
                        →
                      </span>
                      <span className="olympics-new">{newName}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <span className="olympics-chip olympics-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="olympics-time">
                {formatTime(cls.start)}
              </time>
            </article>
          );
        })}
      </main>
    </div>
  );
}
