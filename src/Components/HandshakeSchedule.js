// HandshakeSchedule.js
import React, { useEffect, useState } from "react";
import "../Stylesheets/HandshakeSchedule.css";
import schedule from "../Schedule";

export default function HandshakeSchedule({
  day,
  animationDelay = 800,
  animationInterval = 180,
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
    <div className="hs-wrap">
      <h1 className="hs-day">{(day || "").toUpperCase()}</h1>

      <div className="hs-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div className="hs-card-wrap" key={i}>
              <article className="hs-card">
                <div className="hs-name-time">
                  <span className="hs-name">
                    {cls.replacement ? (
                      <span className="hs-name-block">
                        <span className="old">{cls.name}</span>
                        <span className="new">→ {String(cls.replacement)}</span>
                      </span>
                    ) : (
                      cls.name
                    )}
                  </span>
                  <span className="hs-time">{formatTime(cls.start)}</span>
                </div>

                <i className="hs-corner tl" aria-hidden />
                <i className="hs-corner tr" aria-hidden />
                <i className="hs-corner bl" aria-hidden />
                <i className="hs-corner br" aria-hidden />
              </article>

              {cls.maple && <div className="hs-maple">📍 Maple Location</div>}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
