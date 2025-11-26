// GithubTechSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/GithubTechSchedule.css";
import schedule from "../Schedule";

export default function GithubTechSchedule({
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
    <div className="githubtech-wrap">
      <header className="githubtech-header">
        <h1 className="githubtech-day" aria-label={safeDay || "Day"}>
          {safeDay ? safeDay.toUpperCase() : ""}
        </h1>
      </header>

      <main className="githubtech-list">
        {items.map((cls, i) => {
          if (!visible.includes(i)) return null;

          const hasReplacement = !!cls.replacement;
          const newName =
            typeof cls.replacement === "string"
              ? cls.replacement
              : "Replacement";

          return (
            <article className="githubtech-card githubtech-in" key={i}>
              <div className="githubtech-left">
                <div className="githubtech-title">
                  {hasReplacement ? (
                    <span className="githubtech-swap">
                      <span className="githubtech-old">{cls.name}</span>
                      <span className="githubtech-arrow" aria-hidden="true">
                        →
                      </span>
                      <span className="githubtech-new">{newName}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <span className="githubtech-chip githubtech-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="githubtech-time">
                {formatTime(cls.start)}
              </time>
            </article>
          );
        })}
      </main>
    </div>
  );
}
