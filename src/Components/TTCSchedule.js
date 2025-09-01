// TTCSchedule.jsx — improved TTC-styled schedule (pure JS, mobile-first)
import React, { useEffect, useRef, useState } from "react";
import "../Stylesheets/TTCSchedule.css";
import schedule from "../Schedule";

export default function TTCSchedule({
  day,
  animationDelay = 800,
  animationInterval = 160,
}) {
  const [visible, setVisible] = useState([]);
  const timersRef = useRef([]);

  useEffect(() => {
    // clear any prior timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setVisible([]);

    const items = schedule[day] || [];
    items.forEach((_, i) => {
      const t = setTimeout(
        () => setVisible((v) => [...v, i]),
        animationDelay + i * animationInterval
      );
      timersRef.current.push(t);
    });
    return () => timersRef.current.forEach(clearTimeout);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="ttc-wrap">
 

      <div className="ttc-daysign">
        <span className="ttc-daytext">{(day || "").toUpperCase()}</span>
      </div>

      <section className="ttc-list" aria-label={`${day} schedule`}>
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="ttc-card ttc-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="ttc-left">
                <span className="ttc-bullet" aria-hidden />
                <div className="ttc-info">
                  <span className="ttc-name">
                    {cls.replacement ? (
                      <span className="ttc-swap">
                        <span className="ttc-old">{cls.name}</span>
                        <span className="ttc-arrow" aria-hidden>→</span>
                        <span className="ttc-new">{String(cls.replacement)}</span>
                      </span>
                    ) : (
                      cls.name
                    )}
                  </span>
                  {cls.maple && <span className="ttc-chip">📍 Maple</span>}
                </div>
              </div>
              <time className="ttc-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </section>
    </div>
  );
}
