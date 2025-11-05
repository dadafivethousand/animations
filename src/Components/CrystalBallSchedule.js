// CrystalBallSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/CrystalBallSchedule.css";
import schedule from "../Schedule";

export default function CrystalBallSchedule({
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
      const t = setTimeout(
        () => setVisible((v) => [...v, i]),
        animationDelay + i * animationInterval
      );
      timers.push(t);
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, [safeDay, items.length, animationDelay, animationInterval]);

  // convert decimal hours to 12-hour clock with zero-padded minutes and AM/PM
  const formatTime = (decimalHour) => {
    if (typeof decimalHour !== "number" || Number.isNaN(decimalHour)) return "";
    // compute hours and minutes carefully digit-by-digit
    const hoursWhole = Math.floor(decimalHour);
    const fractional = decimalHour - hoursWhole;
    // multiply fractional by 60 precisely
    const minutesRaw = Math.round(fractional * 60);
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
    <div className="crystalball-wrap">
      <header className="crystalball-header">
        <h1 className="crystalball-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="crystalball-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className={`crystalball-card crystalball-in`}
              role="article"
              style={{
                // keep card animation timing immediate (stagger handled by visible)
                animationDelay: `${Math.max(0, animationDelay - 240) + i * (animationInterval / 1.12)}ms`,
              }}
            >
              <div className="crystalball-left">
                <div className="crystalball-title">
                  {cls.replacement ? (
                    <span className="crystalball-swap">
                      <span className="crystalball-old">{cls.name}</span>
                      <span className="crystalball-arrow" aria-hidden>
                        →
                      </span>
                      <span className="crystalball-new">
                        {typeof cls.replacement === "string" ? cls.replacement : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="crystalball-name">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="crystalball-chip crystalball-chip--maple">📍 MAPLE</span>
                )}
              </div>

              <time className="crystalball-time" dateTime={`${cls.start || ""}`}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
