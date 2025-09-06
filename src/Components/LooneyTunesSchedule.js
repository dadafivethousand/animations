 // LooneyTunesSchedule.jsx — mobile-first, “Looney Tunes” vibe with MAPLE + replacement support
import React, { useEffect, useState } from "react";
import "../Stylesheets/LooneyTunesSchedule.css";
import schedule from "../Schedule";

export default function LooneyTunesSchedule({
  day,
  animationDelay = 900,
  animationInterval = 160,
}) {
  const [visible, setVisible] = useState([]);
  const [titleOn, setTitleOn] = useState(false);

  useEffect(() => {
    setTitleOn(false);
    const t = setTimeout(() => setTitleOn(true), animationDelay);
    return () => clearTimeout(t);
  }, [day, animationDelay]);

  useEffect(() => {
    const items = schedule[day] || [];
    setVisible([]);
    const timers = [];
    items.forEach((_, i) => {
      const t = setTimeout(
        () => setVisible((v) => [...v, i]),
        animationDelay + i * animationInterval
      );
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="lt-wrap">
      <div className="lt-rings" aria-hidden />
      <header className={`lt-head ${titleOn ? "lt-head--in" : ""}`}>
        <h1 className="lt-day">{(day || "").toUpperCase()}</h1>
      </header>

      <main className="lt-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div className="lt-card lt-in" key={i} style={{ animationDelay: `${i * 40}ms` }}>
              <div className="lt-left">
                <span className="lt-bullseye" aria-hidden />
                <span className="lt-name">
                  {cls.replacement ? (
                    <span className="lt-swap">
                      <span className="lt-old">{cls.name}</span>
                      <span className="lt-arrow" aria-hidden>→</span>
                      <span className="lt-new">{String(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </span>
                {cls.maple && <span className="lt-chip">📍 MAPLE</span>}
              </div>
              <time className="lt-time">{formatTime(cls.start)}</time>
            </div>
          ) : null
        )}
      </main>
    </div>
  );
}
