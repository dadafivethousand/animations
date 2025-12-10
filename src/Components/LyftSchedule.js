import React, { useEffect, useState } from "react";
import "../Stylesheets/LyftSchedule.css";
import schedule from "../Schedule"; // or "../RhSchedule"

export default function LyftSchedule({
  day,
  animationDelay = 1200,
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
    if (m === 60) { m = 0; hh = (h + 1) % 24; } // 7.999 -> 8:00
    const hr = hh % 12 || 12;
    const ap = hh < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  const labelForReplacement = (rep) => {
    if (rep === true) return "Replacement";
    if (typeof rep === "string" && rep.trim()) return rep;
    return "";
  };

  const initial = (s) =>
    typeof s === "string" && s.trim()
      ? s.trim().charAt(0).toUpperCase()
      : "•";

  return (
    <div className="lyft-wrap">
      {/* subtle moving gradient + dots handled in CSS via ::before/::after */}

      <header className="lyft-header lyft-header--center">
        <div className="lyft-brand">
          <span className="lyft-glyph" aria-hidden />
          <span className="lyft-word">Lyft</span>
        </div>
        <h1 className="lyft-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="lyft-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="lyft-card lyft-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* avatar puck like a driver photo */}
              <div className="lyft-avatar" aria-hidden>{initial(cls.name)}</div>

              <div className="lyft-left">
                <div className="lyft-title">
                  {cls.replacement ? (
                    <span className="lyft-swap">
                      <span className="lyft-old">{cls.name}</span>
                      <span className="lyft-arrow" aria-hidden>→</span>
                      <span className="lyft-new">{labelForReplacement(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <div className="lyft-tags">
                    <span className="lyft-chip lyft-chip--maple">📍 Maple</span>
                  </div>
                )}
              </div>

              <time className="lyft-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
