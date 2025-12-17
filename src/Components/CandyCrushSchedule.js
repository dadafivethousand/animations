// CandyCrushSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/CandyCrushSchedule.css";
import schedule from "../Schedule";

export default function CandyCrushSchedule({
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
    <div className="candycrush-wrap">
      <header className="candycrush-header">
        <div className="candycrush-top">
          <div className="candycrush-heart" aria-hidden="true" />
          <h1 className="candycrush-day" aria-label={safeDay || "Day"}>
            {safeDay ? safeDay.toUpperCase() : ""}
          </h1>
          <div className="candycrush-gold" aria-hidden="true" />
        </div>
      </header>

      <main className="candycrush-list">
        {items.map((cls, i) => {
          if (!visible.includes(i)) return null;

          const hasReplacement = !!cls.replacement;
          const newName =
            typeof cls.replacement === "string"
              ? cls.replacement
              : "Replacement";

          return (
            <article className="candycrush-card candycrush-in" key={i}>
              <div className="candycrush-left">
                <div className="candycrush-gems" aria-hidden="true">
                  <span className="candycrush-gem candycrush-gem--blue" />
                  <span className="candycrush-gem candycrush-gem--orange" />
                  <span className="candycrush-gem candycrush-gem--purple" />
                </div>

                <div className="candycrush-main">
                  <div className="candycrush-title-row">
                    <div className="candycrush-title">
                      {hasReplacement ? (
                        <span className="candycrush-swap">
                          <span className="candycrush-old">{cls.name}</span>
                          <span
                            className="candycrush-arrow"
                            aria-hidden="true"
                          >
                            →
                          </span>
                          <span className="candycrush-new">{newName}</span>
                        </span>
                      ) : (
                        cls.name
                      )}
                    </div>

                    {cls.maple && (
                      <span className="candycrush-chip candycrush-chip--maple">
                        📍 MAPLE
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <time className="candycrush-time">
                {formatTime(cls.start)}
              </time>
            </article>
          );
        })}
      </main>
    </div>
  );
}
