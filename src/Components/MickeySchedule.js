// MickeySimpleSchedule.js
import React, { useEffect, useState } from "react";
import "../Stylesheets/MickeySchedule.css";
import schedule from "../Schedule";

export default function MickeySimpleSchedule({
  day,
  animationDelay = 700,
  animationInterval = 160,
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
    <div className="mk-wrap">
      <h1 className="mk-day">{(day || "").toUpperCase()}</h1>

      <div className="mk-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div className="mk-item" key={i}>
              <div className="mk-card" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="mk-left">
                  {cls.replacement ? (
                    <span className="mk-name">
                      <span className="old">{cls.name}</span>
                      <span className="arrow">→</span>
                      <span className="new">{String(cls.replacement)}</span>
                    </span>
                  ) : (
                    <span className="mk-name">{cls.name}</span>
                  )}
                </div>
                <span className="mk-time">{formatTime(cls.start)}</span>

                {/* two simple "buttons" like Mickey shorts */}
  
              </div>

              {cls.maple && <div className="mk-maple">MAPLE</div>}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
