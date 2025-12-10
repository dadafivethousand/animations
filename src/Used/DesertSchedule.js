// DesertSchedule.jsx — sandstorm theme with flying sand particles
import React, { useEffect, useState, useMemo } from "react";
import "../Stylesheets/DesertSchedule.css";
import schedule from "../Schedule";
import sandstorm from "../Images/965.jpg"


function Sandstorm({ count = 180 }) {
  const grains = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const size = 1 + Math.random() * 2.2;          // 1–3.2px
      const y = Math.random() * 100;                  // vh
      const delay = -Math.random() * 18;              // negative so it's already in-flight
      const duration = 8 + Math.random() * 16;        // 8–24s
      const blur = Math.random() * 1.5;               // 0–1.5px
      const opacity = 0.22 + Math.random() * 0.35;    // 0.22–0.57
      const drift = (Math.random() * 10 - 5);         // -5 to 5vh vertical drift
      const len = 2 + Math.random() * 8;              // trail length multiplier
      const depth = Math.random();                    // 0 (far) -> 1 (near)
      arr.push({ id: i, size, y, delay, duration, blur, opacity, drift, len, depth });
    }
    return arr;
  }, [count]);

  return (
    <div className="sandstorm" aria-hidden>
      {grains.map(g => (
        <span
          key={g.id}
          className={`grain ${g.depth > 0.66 ? "near" : g.depth > 0.33 ? "mid" : "far"}`}
          style={{
            "--size": `${g.size}px`,
            "--y": `${g.y}vh`,
            "--blur": `${g.blur}px`,
            "--opacity": g.opacity,
            "--dur": `${g.duration}s`,
            "--delay": `${g.delay}s`,
            "--drift": `${g.drift}vh`,
            "--len": g.len,
          }}
        />
      ))}
    </div>
  );
}

export default function DesertSchedule({
  day,
  animationDelay = 1000,
  animationInterval = 220,
}) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const items = schedule[day] || [];
    const timers = [];
    setVisible([]);
    items.forEach((_, i) => {
      const t = setTimeout(
        () => setVisible(v => [...v, i]),
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
    <div className="desert-wrap">
              <img src={sandstorm}/>
      {/* subtle layers */}
      <div className="sand-layer sand-streaks" aria-hidden />
      <div className="sand-layer sand-specks" aria-hidden />
      <div className="heat-haze" aria-hidden />

      {/* particle system */}
      <Sandstorm count={220} />

      <h1 className="desert-day">{(day || "").toUpperCase()}</h1>

      <div className="desert-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div
              key={i}
              className="desert-card desert-in"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="desert-left">
                {cls.replacement ? (
                  <span className="desert-nameblock">
                    <span className="desert-class desert-old">{cls.name}</span>
                    <span className="desert-arrow" aria-hidden>→</span>
                    <span className="desert-class desert-new">
                      {String(cls.replacement)}
                    </span>
                  </span>
                ) : (
                  <span className="desert-class">{cls.name}</span>
                )}

                {cls.maple && (
                  <span className="desert-badge">
                    <span className="desert-pin" aria-hidden>📍</span>
                    Maple
                  </span>
                )}
              </div>

              <time className="desert-time">{formatTime(cls.start)}</time>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
