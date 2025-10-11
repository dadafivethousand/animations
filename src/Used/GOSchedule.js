// GOSchedule.jsx — GO Transit–styled schedule (mobile-first, MAPLE + replacement)
import React, { useEffect, useRef, useState } from "react";
import "../Stylesheets/GOSchedule.css";
import schedule from "../Schedule";

export default function GOSchedule({
  day,
  animationDelay = 700,
  animationInterval = 140,
}) {
  const [visible, setVisible] = useState([]);
  const timersRef = useRef([]);

  useEffect(() => {
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
    <div className="go-wrap">
      {/* GO bar with logo */}
      <header className="go-bar">
        <div className="go-logo" aria-label="GO Transit"> 
          <span className="go-logo-left" />
          <span className="go-logo-right" />
          <span className="go-logo-rect" />
        </div>
      </header>

      {/* LED day sign */}
      <div className="go-day">
        <span className="go-daytext">{(day || "").toUpperCase()}</span>
      </div>

      {/* Schedule list */}
      <section className="go-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className="go-card go-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="go-left">
                <span className="go-dot" aria-hidden />
                <div className="go-info">
                  <span className="go-name">
                    {cls.replacement ? (
                      <span className="go-swap">
                        <span className="go-old">{cls.name}</span>
                        <span className="go-arrow" aria-hidden>→</span>
                        <span className="go-new">{String(cls.replacement)}</span>
                      </span>
                    ) : (
                      cls.name
                    )}
                  </span>
                  {cls.maple && <span className="go-chip">📍 Maple</span>}
                </div>
              </div>
              <time className="go-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </section>
    </div>
  );
}
