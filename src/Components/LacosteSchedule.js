// LacosteSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/LacosteSchedule.css";
import schedule from "../Schedule";

export default function LacosteSchedule({
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
        setVisible((prev) => [...prev, i]);
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
    <div className="lacoste-wrap">
      <header className="lacoste-header">
        <h1 className="lacoste-day" aria-label={safeDay || "Day"}>
          {safeDay ? safeDay.toUpperCase() : ""}
        </h1>
      </header>

      <main className="lacoste-list">
        {items.map((cls, i) => {
          if (!visible.includes(i)) return null;

          const hasReplacement = !!cls.replacement;
          const newName =
            typeof cls.replacement === "string"
              ? cls.replacement
              : "Replacement";

          return (
            <article className="lacoste-card lacoste-in" key={i}>
              <div className="lacoste-left">
                <div className="lacoste-title">
                  {hasReplacement ? (
                    <span className="lacoste-swap">
                      <span className="lacoste-old">{cls.name}</span>
                      <span className="lacoste-arrow" aria-hidden="true">
                        →
                      </span>
                      <span className="lacoste-new">{newName}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <span className="lacoste-chip lacoste-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="lacoste-time">
                {formatTime(cls.start)}
              </time>
            </article>
          );
        })}
      </main>
    </div>
  );
}
