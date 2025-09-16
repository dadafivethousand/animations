// ZenSchedule.jsx — brighter cosmic/hippie zen (no big dark circles)
import React, { useEffect, useState } from "react";
import "../Stylesheets/ZenSchedule.css";
import schedule from "../RhSchedule";

export default function ZenSchedule({
  day,
  animationDelay = 1900,
  animationInterval = 180,
  typeSpeed = 80,
}) {
  const [typedDay, setTypedDay] = useState("");
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setTypedDay("");
    let i = 0;
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        setTypedDay(day.substring(0, i + 1));
        i++;
        if (i >= day.length) clearInterval(iv);
      }, typeSpeed);
    }, animationDelay * 0.6);
    return () => clearTimeout(start);
  }, [day, animationDelay, typeSpeed]);

  useEffect(() => {
    setVisible([]);
    const items = schedule[day] || [];
    const timers = [];
    items.forEach((_, idx) => {
      const t = setTimeout(
        () => setVisible((v) => [...v, idx]),
        animationDelay + idx * animationInterval
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
    <div className="zen2-wrap zen2-bright">
      <div className="zen2-sky" aria-hidden />
      <div className="zen2-grid" aria-hidden />
      <div className="zen2-aura" aria-hidden>
        <span className="ring r1" />
        <span className="ring r2" />
        <span className="ring r3" />
      </div>

      <header className="zen2-head">
        <h1 className="zen2-day">{typedDay}</h1>
      </header>

      <main className="zen2-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div
              key={i}
              className="zen2-card zen2-in"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="zen2-left">
                <span className="zen2-dot" aria-hidden />
                <span className="zen2-name">
                  {cls.replacement ? (
                    <span className="zen2-swap">
                      <span className="zen2-old">{cls.name}</span>
                      <span className="zen2-arrow" aria-hidden>→</span>
                      <span className="zen2-new">{String(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </span>
                {cls.maple && <span className="zen2-chip">📍 Maple</span>}
              </div>
              <time className="zen2-time">{formatTime(cls.start)}</time>
            </div>
          ) : null
        )}
      </main>
    </div>
  );
}
