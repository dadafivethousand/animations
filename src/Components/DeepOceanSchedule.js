// DeepOceanSchedule.js
import React, { useEffect, useState } from "react";
import "../Stylesheets/DeepOceanSchedule.css";
import schedule from "../Schedule";

export default function DeepOceanSchedule({
  day,
  animationDelay = 900,
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
    <div className="ocean-wrap">
      <h1 className="ocean-day">{(day || "").toUpperCase()}</h1>

      <div className="ocean-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div className="ocean-card-wrap" key={i} style={{ animationDelay: `${i * 60}ms` }}>
              <article className="ocean-card">
                <i className="oc-corner tl" aria-hidden />
                <i className="oc-corner tr" aria-hidden />
                <i className="oc-corner bl" aria-hidden />
                <i className="oc-corner br" aria-hidden />

                <div className="ocean-left">
                  {cls.replacement ? (
                    <span className="ocean-name-block">
                      <span className="ocean-name old">{cls.name}</span>
                      <span className="ocean-name new">→ {String(cls.replacement)}</span>
                    </span>
                  ) : (
                    <span className="ocean-name">{cls.name}</span>
                  )}
                </div>

                <span className="ocean-time">{formatTime(cls.start)}</span>
              </article>

              {cls.maple && <div className="ocean-maple">📍 MAPLE LOCATION</div>}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
