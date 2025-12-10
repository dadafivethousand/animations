import React, { useEffect, useState } from "react";
import "../Stylesheets/JamrockSchedule.css";
import schedule from "../RhSchedule"; // or "../RhSchedule"

export default function JamrockSchedule({
  day,
  animationDelay = 2000,
  animationInterval = 160
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  useEffect(() => {
    const timers = [];
    setVisible([]);

    const startT = setTimeout(() => {
      items.forEach((_, i) => {
        const t = setTimeout(
          () => setVisible((v) => [...v, i]),
          i * animationInterval
        );
        timers.push(t);
      });
    }, animationDelay);

    timers.push(startT);
    return () => timers.forEach(clearTimeout);
  }, [safeDay, animationDelay, animationInterval, items.length]);

  const formatTime = (t) => {
    if (typeof t !== "number") return "";
    const h = Math.floor(t);
    let m = Math.round((t - h) * 60);
    let hh = h;
    if (m === 60) { m = 0; hh = (h + 1) % 24; }
    const hr = hh % 12 || 12;
    const ap = hh < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  const labelForReplacement = (rep) => {
    if (rep === true) return "Replacement";
    if (typeof rep === "string" && rep.trim()) return rep;
    return "";
  };

  return (
    <div className="jam-wrap">
      {/* NEW: background GIF anchored bottom */}
      <div className="jam-bg" aria-hidden />

      <header className="jam-header jam-header--center">
        <h1 className="jam-day">
          <span className="jam-day-inner">{safeDay.toUpperCase()}</span>
        </h1>
      </header>

      <main className="jam-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="jam-card jam-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="jam-left">
                <div className="jam-title">
                  {cls.replacement ? (
                    <span className="jam-swap">
                      <span className="jam-old">{cls.name}</span>
                      <span className="jam-arrow" aria-hidden>→</span>
                      <span className="jam-new">{labelForReplacement(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <div className="jam-tags">
                    <span className="jam-chip jam-chip--maple">📍 Maple</span>
                  </div>
                )}
              </div>

              <time className="jam-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
