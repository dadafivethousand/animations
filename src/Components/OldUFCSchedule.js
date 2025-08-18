// OldSchoolUFCSchedule.js
import React, { useEffect, useState } from "react";
import "../Stylesheets/OldUFCSchedule.css";
import schedule from "../Schedule";

export default function OldSchoolUFCSchedule({
  day,
  animationDelay = 800,
  animationInterval = 170,
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
    <div className="os-ufc-wrap">
      <div className="os-banner">
        <span className="os-ribbon-left" aria-hidden />
        <h1 className="os-day">{(day || "").toUpperCase()}</h1>
        <span className="os-ribbon-right" aria-hidden />
      </div>

      <div className="os-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div
              key={i}
              className={`os-card-wrap ${i % 2 ? "blue" : "red"}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <article className="os-card">
                <i className="os-corner tl" />
                <i className="os-corner tr" />
                <i className="os-corner bl" />
                <i className="os-corner br" />

                <div className="os-left">
                  {cls.replacement ? (
                    <span className="os-name-block">
                      <span className="os-name old">{cls.name}</span>
                      <span className="os-name new">→ {String(cls.replacement)}</span>
                    </span>
                  ) : (
                    <span className="os-name">{cls.name}</span>
                  )}
                </div>

                <span className="os-time">{formatTime(cls.start)}</span>
              </article>

              {cls.maple && <div className="os-maple">📍 MAPLE LOCATION</div>}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
