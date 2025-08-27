// ZenSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/ZenSchedule.css";
import schedule from "../Schedule";

export default function ZenSchedule({
  day,
  animationDelay = 1200,
  animationInterval = 220,
}) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const items = schedule[day] || [];
    const timers = [];
    setVisibleArray([]);
    items.forEach((_, idx) => {
      const t = setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const h = Math.floor(decimalTime);
    const m = Math.round((decimalTime - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="zen-wrap">
      <h1 className="zen-day">{(day || "").toUpperCase()}</h1>

      <div className="zen-list">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div
              key={idx}
              className="zen-card zen-in"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="zen-left">
                {cls.replacement ? (
                  <span className="zen-nameblock">
                    <span className="zen-class zen-old">{cls.name}</span>
                    <span className="zen-arrow" aria-hidden>→</span>
                    <span className="zen-class zen-new">{String(cls.replacement)}</span>
                  </span>
                ) : (
                  <span className="zen-class">{cls.name}</span>
                )}

                {cls.maple && (
                  <span className="zen-badge">
                    <span className="zen-pin" aria-hidden>📍</span>
                    Maple
                  </span>
                )}
              </div>

              <time className="zen-time">{formatTime(cls.start)}</time>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
