// PetroCanadaSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/PetroCanadaSchedule.css";
import schedule from "../Schedule";

export default function PetroCanadaSchedule({
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
    <div className="petrocanada-wrap">
      <header className="petrocanada-header">
        <h1 className="petrocanada-day" aria-label={safeDay || "Day"}>
          {safeDay ? safeDay.toUpperCase() : ""}
        </h1>
      </header>

      <main className="petrocanada-list">
        {items.map((cls, i) => {
          if (!visible.includes(i)) return null;

          const hasReplacement = !!cls.replacement;
          const newName =
            typeof cls.replacement === "string"
              ? cls.replacement
              : "Replacement";

          return (
            <article className="petrocanada-card petrocanada-in" key={i}>
              <div className="petrocanada-left">
                <div className="petrocanada-title">
                  {hasReplacement ? (
                    <span className="petrocanada-swap">
                      <span className="petrocanada-old">{cls.name}</span>
                      <span className="petrocanada-arrow" aria-hidden="true">
                        →
                      </span>
                      <span className="petrocanada-new">{newName}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <span className="petrocanada-chip petrocanada-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="petrocanada-time">
                {formatTime(cls.start)}
              </time>
            </article>
          );
        })}
      </main>
    </div>
  );
}
