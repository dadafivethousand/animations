// ImmortalTechniqueSchedule.jsx
// Graffiti-on-wall variant (Immortal Technique — Revolutionary Vol. 2 inspiration)
//
// Props: day, animationDelay, animationInterval
// - Renders schedule items directly painted on a concrete wall.
// - Times are in a fixed 90px "stamp" on the right (as required).
// - Maple chip inline (📍 MAPLE). Replacement handling supported.
// - Clears timers on unmount; respects prefers-reduced-motion.

import React, { useEffect, useState } from "react";
import "../Stylesheets/ImmortalTechniqueSchedule.css";
import schedule from "../Schedule";

export default function ImmortalTechniqueSchedule({
  day,
  animationDelay = 700,
  animationInterval = 110,
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = (day || "").toString();
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

    return () => timers.forEach((t) => clearTimeout(t));
  }, [safeDay, items.length, animationDelay, animationInterval]);

  // Time formatting: decimal -> 12-hour clock with zero-padded minutes and AM/PM
  const formatTime = (decimalHour) => {
    if (typeof decimalHour !== "number" || Number.isNaN(decimalHour)) return "";
    const h = Math.floor(decimalHour);
    const fractional = decimalHour - h;
    const mRaw = Math.round(fractional * 60);
    let hh = h;
    let mm = mRaw;
    if (mm === 60) {
      hh = h + 1;
      mm = 0;
    }
    const ap = hh < 12 ? "AM" : "PM";
    const hr12 = hh % 12 === 0 ? 12 : hh % 12;
    const mmStr = mm < 10 ? `0${mm}` : `${mm}`;
    return `${hr12}:${mmStr} ${ap}`;
  };

  return (
        <div className="immortaltech-outside-wrap">
    <div className="immortaltech-wrap">
      <header className="immortaltech-header" role="banner" aria-hidden={false}>
        <h1 className="immortaltech-day" data-text={safeDay ? safeDay.toUpperCase() : ""}>
          {safeDay ? safeDay.toUpperCase() : ""}
        </h1>
      </header>

      <main className="immortaltech-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className="immortaltech-item immortaltech-in"
              role="article"
              style={{ animationDelay: `${Math.max(0, animationDelay - 200) + i * (animationInterval / 1.05)}ms` }}
            >
              <div className="immortaltech-left">
                <div className="immortaltech-graffiti">
                  {cls.replacement ? (
                    <span className="immortaltech-swap">
                      <span className="immortaltech-old">{cls.name}</span>
                      <span className="immortaltech-arrow" aria-hidden>→</span>
                      <span className="immortaltech-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="immortaltech-name">{cls.name}</span>
                  )}

                  {cls.maple && (
                    <span className="immortaltech-chip" aria-hidden>📍 MAPLE</span>
                  )}
                </div>
              </div>

              <time className="immortaltech-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
    </div>

  );
}
