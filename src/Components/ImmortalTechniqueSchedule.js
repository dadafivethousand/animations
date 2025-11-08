// ImmortalTechniqueSchedule.jsx
// Reworked Immortal Technique schedule — poster/torn layout + SVG blood-drip header
import React, { useEffect, useState } from "react";
import "../Stylesheets/ImmortalTechniqueSchedule.css";
import schedule from "../Schedule";

export default function ImmortalTechniqueSchedule({
  day,
  animationDelay = 700, // slightly snappier for this layout
  animationInterval = 110,
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = (day || "").toString();
  const items = schedule[safeDay] || [];

  useEffect(() => {
    const timers = [];
    setVisible([]);
    // Use staggered timeouts, but shorter delays for snappier feeling
    items.forEach((_, i) => {
      const t = setTimeout(
        () => setVisible((v) => [...v, i]),
        animationDelay + i * animationInterval
      );
      timers.push(t);
    });
    return () => timers.forEach((t) => clearTimeout(t));
    // deps include items.length per contract
  }, [safeDay, items.length, animationDelay, animationInterval]);

  // precise decimal -> 12-hour clock with zero-padded minutes and AM/PM
  const formatTime = (decimalHour) => {
    if (typeof decimalHour !== "number" || Number.isNaN(decimalHour)) return "";
    const hoursWhole = Math.floor(decimalHour);
    const minutesRaw = Math.round((decimalHour - hoursWhole) * 60);
    let hoursAdjusted = hoursWhole;
    let minutes = minutesRaw;
    if (minutes === 60) {
      hoursAdjusted = hoursWhole + 1;
      minutes = 0;
    }
    const period = hoursAdjusted < 12 ? "AM" : "PM";
    const hour12 = hoursAdjusted % 12 === 0 ? 12 : hoursAdjusted % 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hour12}:${minutesStr} ${period}`;
  };

  return (
    <div className="immortaltech-wrap">
      <header className="immortaltech-header" aria-hidden={false}>
        {/* Decorative SVG blood-drip behind the text for organic drips */}
 

        {/* Title sits above SVG drips (so drips look like they come from letters) */}
        <h1 className="immortaltech-title" data-text={safeDay ? safeDay.toUpperCase() : ""}>
          {safeDay ? safeDay.toUpperCase() : ""}
        </h1>
      </header>

      <main className="immortaltech-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className="immortaltech-poster immortaltech-in"
              role="article"
              style={{
                // stagger controlled via animationDelay/Interval but individual CSS duration controls tear speed
                animationDelay: `${Math.max(0, animationDelay - 200) + i * (animationInterval / 1.05)}ms`,
              }}
            >
              <div className="immortaltech-poster-left">
                <div className="immortaltech-poster-title">
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
                </div>

                {cls.maple && <span className="immortaltech-chip immortaltech-chip--maple">📍 MAPLE</span>}
              </div>

              <time className="immortaltech-wax" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
