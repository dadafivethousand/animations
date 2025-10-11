import React, { useEffect, useMemo, useState } from "react";
import "../Stylesheets/MoneySchedule.css";
import schedule from "../RhSchedule"; // or "../RhSchedule"

export default function MoneySchedule({
  day,
  // existing knobs
  animationDelay = 2000,
  animationInterval = 160,
  // NEW knobs
  skyCount = 72,        // how many $ glyphs (perf-safe clamp inside)
  skyMaxOpacity = 1   // peak opacity during pulse/flicker
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  // Floating $ background: deterministic seeds so it doesn't jump on re-render
  const dollars = useMemo(() => {
    const N = Math.max(20, Math.min(128, skyCount));
    const arr = [];
    for (let i = 0; i < N; i++) {
      const x = (i * 37) % 100;                      // vw start
      const y = (i * 53) % 100;                      // vh start
      const dx = ((i % 2 ? 1 : -1) * (36 + (i * 7) % 60)); // vw drift
      const dy = (44 + (i * 11) % 76);               // vh drift
      const scale = 0.42 + ((i * 29) % 60) / 100;    // 0.42 → 1.02
      const dur = 11 + ((i * 7) % 12);               // 11s → 22s
      const delay = -((i * 113) % 1300) / 100;       // -13s..0 (desync)
      const hue = (i * 17) % 360;

      // pulse (scale & opacity) ranges per glyph
      const pMin = 0.85 + ((i * 13) % 12) / 100;     // 0.85–0.97
      const pMax = Math.min(1.22, pMin + 0.20);      // 1.05–1.22
      const oMin = 0.28 + ((i * 19) % 12) / 100;     // 0.28–0.40
      const oMax = Math.min(1, 0.70 + ((i * 23) % 25) / 100); // 0.70–0.95
      const pDur = 2.6 + ((i * 29) % 24) / 10;       // 2.6s–4.9s
      const pDelay = -((i * 71) % 900) / 100;        // -9s..0

      arr.push({ x, y, dx, dy, scale, dur, delay, hue, pMin, pMax, oMin, oMax, pDur, pDelay });
    }
    return arr;
  }, [skyCount]);

  useEffect(() => {
    const timers = [];
    setVisible([]);
    const startT = setTimeout(() => {
      items.forEach((_, i) => {
        const t = setTimeout(() => setVisible((v) => [...v, i]), i * animationInterval);
        timers.push(t);
      });
    }, animationDelay);
    timers.push(startT);
    return () => timers.forEach(clearTimeout);
  }, [safeDay, animationDelay, animationInterval, items.length]);

  const formatTime = (t) => {
    if (typeof t !== "number") return "";
    const h = Math.floor(t);
    let m = Math.round((t - h) * 60);
    let hh = h;
    if (m === 60) { m = 0; hh = (h + 1) % 24; }
    const hr = hh % 12 || 12;
    const ap = hh < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  const labelForReplacement = (rep) => {
    if (rep === true) return "Replacement";
    if (typeof rep === "string" && rep.trim()) return rep;
    return "";
  };

  return (
    <div className="cash-wrap">
      {/* Animated $ sky (behind content) */}
      <div className="cash-sky" aria-hidden="true">
        {dollars.map((d, i) => (
          <span
            key={i}
            className="cash-glyph"
            style={{
              "--x": `${d.x}vw`,
              "--y": `${d.y}vh`,
              "--dx": `${d.dx}vw`,
              "--dy": `${d.dy}vh`,
              "--s": d.scale,
              "--dur": `${d.dur}s`,
              "--delay": `${d.delay}s`,
              "--hue": d.hue,
              "--max": skyMaxOpacity,

              "--pMin": d.pMin,
              "--pMax": d.pMax,
              "--oMin": d.oMin,
              "--oMax": Math.min(1, d.oMax * skyMaxOpacity),
              "--pDur": `${d.pDur}s`,
              "--pDelay": `${d.pDelay}s`
            }}
          >
            <span className="cash-inner">$</span>
          </span>
        ))}
      </div>

      <header className="cash-header cash-header--center">
        <h1 className="cash-day">
          <span className="cash-day-inner">{safeDay.toUpperCase()}</span>
        </h1>
      </header>

      <main className="cash-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article className="cash-card cash-in" key={i} style={{ animationDelay: `${i * 40}ms` }}>
              <div className="cash-left">
                <div className="cash-title">
                  {cls.replacement ? (
                    <span className="cash-swap">
                      <span className="cash-old">{cls.name}</span>
                      <span className="cash-arrow" aria-hidden>→</span>
                      <span className="cash-new">{labelForReplacement(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <div className="cash-tags">
                    <span className="cash-chip cash-chip--maple">📍 Maple</span>
                  </div>
                )}
              </div>

              <time className="cash-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
