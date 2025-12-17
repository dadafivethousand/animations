// CyberpunkSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/CyberpunkSchedule.css";
import schedule from "../RhSchedule";

export default function CyberpunkSchedule({
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
    <div className="cyberpunk-wrap">
      <header className="cyberpunk-header">
        <h1 className="cyberpunk-day" aria-label={safeDay || "Day"}>
          {safeDay ? safeDay.toUpperCase() : ""}
        </h1>
      </header>

      <main className="cyberpunk-list">
        {items.map((cls, i) => {
          if (!visible.includes(i)) return null;

          const hasReplacement = !!cls.replacement;
          const newName =
            typeof cls.replacement === "string"
              ? cls.replacement
              : "Replacement";

          return (
            <article className="cyberpunk-card cyberpunk-in" key={i}>
              <div className="cyberpunk-left">
                <div className="cyberpunk-title">
                  {hasReplacement ? (
                    <span className="cyberpunk-swap">
                      <span className="cyberpunk-old">{cls.name}</span>
                      <span className="cyberpunk-arrow" aria-hidden="true">
                        →
                      </span>
                      <span className="cyberpunk-new">{newName}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <span className="cyberpunk-chip cyberpunk-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="cyberpunk-time">
                {formatTime(cls.start)}
              </time>
            </article>
          );
        })}
      </main>
    </div>
  );
}
