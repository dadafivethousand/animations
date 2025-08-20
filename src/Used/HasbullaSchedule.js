// HasbullaSchedule.js
import React, { useEffect, useState } from "react";
import "../Stylesheets/HasbullaSchedule.css";
import schedule from "../Schedule";

export default function HasbullaSchedule({
  day,
  animationDelay = 800,
  animationInterval = 180,
}) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    const timers = [];
    const items = schedule[day] || [];
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
    <div className="hb-wrap">
      <h1 className="hb-day">{(day || "").toUpperCase()}</h1>

      <div className="hb-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div className="hb-card-wrap" key={i} style={{ animationDelay: `${i * 60}ms` }}>
              <article className="hb-card">
                {/* neon corners */}
                <i className="hb-corner tl" aria-hidden />
                <i className="hb-corner tr" aria-hidden />
                <i className="hb-corner bl" aria-hidden />
                <i className="hb-corner br" aria-hidden />

                <div className="hb-left">
                  {cls.replacement ? (
                    <span className="hb-name-block">
                      <span className="hb-name old">{cls.name}</span>
                      <span className="hb-name new">→ {String(cls.replacement)}</span>
                    </span>
                  ) : (
                    <span className="hb-name">{cls.name}</span>
                  )}
                </div>

                <span className="hb-time">{formatTime(cls.start)}</span>
              </article>

              {cls.maple && <div className="hb-maple">📍 MAPLE LOCATION</div>}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
