// LinkedInSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/LinkedInSchedule.css";
import schedule from "../RhSchedule";

export default function LinkedInSchedule({
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
    <div className="linkedin-wrap">
      <header className="linkedin-header">
        <h1 className="linkedin-day" aria-label={safeDay || "Day"}>
          {safeDay ? safeDay.toUpperCase() : ""}
        </h1>
      </header>

      <main className="linkedin-list">
        {items.map((cls, i) => {
          if (!visible.includes(i)) return null;

          const hasReplacement = !!cls.replacement;
          const newName =
            typeof cls.replacement === "string"
              ? cls.replacement
              : "Replacement";

          return (
            <article className="linkedin-card linkedin-in" key={i}>
              <div className="linkedin-left">
                <div className="linkedin-title">
                  {hasReplacement ? (
                    <span className="linkedin-swap">
                      <span className="linkedin-old">{cls.name}</span>
                      <span className="linkedin-arrow" aria-hidden="true">
                        →
                      </span>
                      <span className="linkedin-new">{newName}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <span className="linkedin-chip linkedin-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="linkedin-time">
                {formatTime(cls.start)}
              </time>
            </article>
          );
        })}
      </main>
    </div>
  );
}
