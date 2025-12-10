// PaintItBlack.jsx — advanced "paint pouring" blackout schedule
// Behaviors: staggered reveals, MAPLE chip, replacement swap, equal-width time pills
// Styling in: ../Stylesheets/PaintItBlack.css

import React, { useEffect, useState } from "react";
import "../Stylesheets/PaintItBlack.css";
import schedule from "../Schedule";

export default function PaintItBlack({
  day,
  animationDelay = 900,
  animationInterval = 170,
  paintDelay = 600,       // when the pour starts
  paintDuration = 1600,   // how long until fully painted
}) {
  const [visible, setVisible] = useState([]);
  const [titleOn, setTitleOn] = useState(false);
  const [paintOn, setPaintOn] = useState(false);
  const [painted, setPainted] = useState(false);

  // title reveal
  useEffect(() => {
    setTitleOn(false);
    const t = setTimeout(() => setTitleOn(true), animationDelay * 0.7);
    return () => clearTimeout(t);
  }, [day, animationDelay]);

  // rows reveal
  useEffect(() => {
    const items = schedule[day] || [];
    setVisible([]);
    const timers = items.map((_, i) =>
      setTimeout(() => setVisible((v) => [...v, i]), animationDelay + i * animationInterval)
    );
    return () => timers.forEach(clearTimeout);
  }, [day, animationDelay, animationInterval]);

  // paint sequence
  useEffect(() => {
    setPaintOn(false);
    setPainted(false);
    const start = setTimeout(() => setPaintOn(true), paintDelay);
    const finish = setTimeout(() => setPainted(true), paintDelay + paintDuration);
    return () => { clearTimeout(start); clearTimeout(finish); };
  }, [day, paintDelay, paintDuration]);

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className={`pib-wrap ${painted ? "pib--painted" : ""}`}>
      {/* pre-paint background */}
      <div className="pib-bg" aria-hidden />

      {/* glossy paint pour overlay (drips + sheen) */}
      <div className={`pib-pour ${paintOn ? "pib-pour--on" : ""}`} aria-hidden>
        <div className="pib-sheen" />
        <div className="pib-drips" />
      </div>

      <header className={`pib-head ${titleOn ? "pib-head--in" : ""}`}>
        <h1 className="pib-day">{(day || "").toUpperCase()}</h1>
      </header>

      <main className="pib-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div
              className="pib-card pib-in"
              key={i}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="pib-left">
                <span className="pib-dot" aria-hidden />
                <span className="pib-name">
                  {cls.replacement ? (
                    <span className="pib-swap">
                      <span className="pib-old">{cls.name}</span>
                      <span className="pib-arrow" aria-hidden>→</span>
                      <span className="pib-new">{String(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </span>
                {cls.maple && <span className="pib-chip">MAPLE</span>}
              </div>
              <time className="pib-time">{formatTime(cls.start)}</time>
            </div>
          ) : null
        )}
      </main>
    </div>
  );
}
