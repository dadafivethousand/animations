// NetflixSchedule.js
import React, { useEffect, useState } from "react";
import "../Stylesheets/NetflixSchedule.css";
import schedule from "../Schedule";

export default function NetflixSchedule({
  day,
  animationDelay = 1500,
  animationInterval = 140,
}) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    const timers = [];
    (schedule[day] || []).forEach((_, i) => {
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
    <div className="nfxx">
      <h1 className="nfxx-day">{(day || "").toUpperCase()}</h1>

      <div className="nfxx-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div
              key={i}
              className="nfxx-card show"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="nfxx-left">
                {cls.replacement ? (
                  <span className="nfxx-name">
                    <span className="old">{cls.name}</span>
                    <span className="new">→ {String(cls.replacement)}</span>
                  </span>
                ) : (
                  <span className="nfxx-name">{cls.name}</span>
                )}

                {cls.maple && <span className="nfxx-chip">MAPLE</span>}
              </div>

              <span className="nfxx-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
