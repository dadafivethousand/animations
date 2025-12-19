// AngryBirdsSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/AngryBirdsSchedule.css";
import schedule from "../Schedule";

export default function AngryBirdsSchedule({
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
    <div className="angrybirds-wrap">
      <header className="angrybirds-header">
        <h1 className="angrybirds-day" aria-label={safeDay || "Day"}>
          {safeDay ? safeDay.toUpperCase() : ""}
        </h1>
      </header>

      <main className="angrybirds-list">
        {items.map((cls, i) => {
          if (!visible.includes(i)) return null;

          const hasReplacement = !!cls.replacement;
          const newName =
            typeof cls.replacement === "string"
              ? cls.replacement
              : "Replacement";

          return (
            <article className="angrybirds-card angrybirds-in" key={i}>
              <div className="angrybirds-left">
                <div className="angrybirds-sling" aria-hidden="true">
                  <span className="angrybirds-sling-post angrybirds-sling-post--left" />
                  <span className="angrybirds-sling-post angrybirds-sling-post--right" />
                  <span className="angrybirds-sling-band" />
                </div>

                <div className="angrybirds-title">
                  {hasReplacement ? (
                    <span className="angrybirds-swap">
                      <span className="angrybirds-old">{cls.name}</span>
                      <span className="angrybirds-arrow" aria-hidden="true">
                        →
                      </span>
                      <span className="angrybirds-new">{newName}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <span className="angrybirds-chip angrybirds-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="angrybirds-time">
                {formatTime(cls.start)}
              </time>
            </article>
          );
        })}
      </main>
    </div>
  );
}
