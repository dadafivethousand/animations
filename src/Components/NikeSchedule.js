// NikeSchedule.jsx — mobile-first, sleek Nike styling with MAPLE + replacement support
import React, { useEffect, useState } from "react";
import "../Stylesheets/NikeSchedule.css";
import schedule from "../Schedule";

export default function NikeSchedule({
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
    <div className="nike-wrap">
      <header className={`nike-head ${titleOn ? "nike-head--in" : ""}`}>
        <h1 className="nike-day">{(day || "").toUpperCase()}</h1>
        <div className="nike-volt-bar" aria-hidden />
      </header>

      <main className="nike-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div className="nike-card nike-in" key={i} style={{ animationDelay: `${i * 35}ms` }}>
              <div className="nike-left">
                <span className="nike-bullet" aria-hidden />
                <span className="nike-name">
                  {cls.replacement ? (
                    <span className="nike-swap">
                      <span className="nike-old">{cls.name}</span>
                      <span className="nike-arrow" aria-hidden>→</span>
                      <span className="nike-new">{String(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </span>
                {cls.maple && <span className="nike-chip">📍 MAPLE</span>}
              </div>
              <time className="nike-time">{formatTime(cls.start)}</time>
            </div>
          ) : null
        )}
      </main>
    </div>
  );
}
