// ClashOfClansSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/ClashOfClansSchedule.css";
import schedule from "../Schedule";

export default function ClashOfClansSchedule({
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
    <div className="clash-wrap">
      <header className="clash-header">
        <div className="clash-topbar">
          <span className="clash-topbar-gem" aria-hidden="true" />
          <h1 className="clash-day" aria-label={safeDay || "Day"}>
            {safeDay ? safeDay.toUpperCase() : ""}
          </h1>
          <span className="clash-topbar-shield" aria-hidden="true" />
        </div>
      </header>

      <main className="clash-list">
        {items.map((cls, i) => {
          if (!visible.includes(i)) return null;

          const hasReplacement = !!cls.replacement;
          const newName =
            typeof cls.replacement === "string"
              ? cls.replacement
              : "Replacement";

          return (
            <article className="clash-card clash-in" key={i}>
              <div className="clash-left">
                <div className="clash-badge" aria-hidden="true">
                  <span className="clash-badge-inner" />
                </div>

                <div className="clash-main">
                  <div className="clash-title">
                    {hasReplacement ? (
                      <span className="clash-swap">
                        <span className="clash-old">{cls.name}</span>
                        <span className="clash-arrow" aria-hidden="true">
                          →
                        </span>
                        <span className="clash-new">{newName}</span>
                      </span>
                    ) : (
                      cls.name
                    )}
                  </div>

                  {cls.maple && (
                    <span className="clash-chip clash-chip--maple">
                      📍 MAPLE
                    </span>
                  )}
                </div>
              </div>

              <time className="clash-time">
                {formatTime(cls.start)}
              </time>
            </article>
          );
        })}
      </main>
    </div>
  );
}
