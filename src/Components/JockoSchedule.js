// JockoSchedule.js
import React, { useEffect, useState } from "react";
import "../Stylesheets/JockoSchedule.css";
import schedule from "../Schedule";

export default function JockoSchedule({
  day,
  animationDelay = 800,
  animationInterval = 220,
}) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    const timers = [];
    const items = schedule[day] || [];
    items.forEach((_, i) => {
      const t = setTimeout(() => setVisible((v) => [...v, i]), animationDelay + i * animationInterval);
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
    <div className="jocko-wrap">
      <h1 className="jocko-day">{(day || "").toUpperCase()}</h1>

      <div className="jocko-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div className="jocko-card-wrap" key={i} style={{ animationDelay: `${i * 40}ms` }}>
              <article className="jocko-card">
                <div className="jocko-left">
                  {cls.replacement ? (
                    <span className="jocko-name-block">
                      <span className="jocko-name old">{cls.name}</span>
                      <span className="jocko-name new">→ {String(cls.replacement)}</span>
                    </span>
                  ) : (
                    <span className="jocko-name">{cls.name}</span>
                  )}
                </div>
                <div className="jocko-time">{formatTime(cls.start)}</div>

                {/* metal corners */}
                <i className="jc-corner tl" aria-hidden />
                <i className="jc-corner tr" aria-hidden />
                <i className="jc-corner bl" aria-hidden />
                <i className="jc-corner br" aria-hidden />
              </article>

              {cls.maple && <div className="jocko-maple">📍 MAPLE LOCATION</div>}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
