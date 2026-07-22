// RoboticsCampAd.jsx — Code Ninjas Woodbridge robotics summer-camp ad.
// Choreographed sequence:
//   0) a robot vacuum sweeps a layer of dust off the screen, revealing the scene
//   1) a typewriter prints the camp info (title, address, site, phone)
//   2) a 20% OFF discount badge pops in
//   3) a robot hand slides up and circles the discount to draw attention
//   4) a rocket-robot flies across the screen to the right
//   5) an open-arms robot slides in from the right and stays
// Layout uses fixed zones so nothing overlaps (text lives on the left,
// the badge/robots on the right, the rocket flies above the text).
import React, { useEffect, useState } from "react";
import "../Stylesheets/RoboticsCampAd.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";

// phase levels (monotonic — elements stay visible once shown)
const SWEEP = 0, TYPE = 1, BADGE = 2, CIRCLE = 3, ROCKET = 4, GREET = 5;

const LINES = [
  { t: "CODE NINJAS WOODBRIDGE", cls: "title" },
  { t: "Robotics Summer Camp",   cls: "subtitle" },
  { t: "6175 Hwy 7",             cls: "info", icon: "📍" },
  { t: "cnwoodbridge.com",       cls: "info", icon: "🌐" },
  { t: "647-887-9940",           cls: "info", icon: "📞" },
];

// dust speckles scattered over the screen (deterministic)
const DUST = Array.from({ length: 46 }, (_, i) => ({
  x: (i * 53 + 7) % 100,
  y: (i * 37 + 11) % 100,
  s: 3 + (i % 5) * 2,
}));

export default function RoboticsCampAd() {
  const [phase, setPhase] = useState(SWEEP);
  const [li, setLi] = useState(0);
  const [ci, setCi] = useState(0);

  // typewriter (only while in TYPE phase)
  useEffect(() => {
    if (phase !== TYPE) return;
    if (li >= LINES.length) { setPhase(BADGE); return; }
    const line = LINES[li].t;
    if (ci < line.length) {
      const t = setTimeout(() => setCi((v) => v + 1), 34);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setLi((v) => v + 1); setCi(0); }, 260);
    return () => clearTimeout(t);
  }, [phase, li, ci]);

  // choreography timeline
  useEffect(() => {
    let t;
    if (phase === SWEEP)       t = setTimeout(() => setPhase(TYPE), 2600);
    else if (phase === BADGE)  t = setTimeout(() => setPhase(CIRCLE), 550);
    else if (phase === CIRCLE) t = setTimeout(() => setPhase(ROCKET), 2300);
    else if (phase === ROCKET) t = setTimeout(() => setPhase(GREET), 1500);
    return () => t && clearTimeout(t);
  }, [phase]);

  return (
    <div className="rb-stage">
      <div className="rb-bg" aria-hidden />
      <div className="rb-grid" aria-hidden />

      {/* brand */}
      {phase >= TYPE && <img className="rb-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />}

      {/* ---- text block (left zone) ---- */}
      {phase >= TYPE && (
        <div className="rb-text">
          {LINES.map((ln, i) => {
            const started = i < li || (i === li && ci > 0);
            const text = i < li ? ln.t : i === li ? ln.t.slice(0, ci) : "";
            return (
              <div key={i} className={`rb-line rb-${ln.cls}`}>
                {ln.icon && <span className="rb-ic" style={{ opacity: started ? 1 : 0 }}>{ln.icon}</span>}
                <span className="rb-tx">{text}</span>
                {phase === TYPE && i === li && <span className="rb-caret" />}
              </div>
            );
          })}
        </div>
      )}

      {/* ---- discount badge (right zone) ---- */}
      {phase >= BADGE && (
        <div className="rb-badge">
          <span className="rb-badge-big">20<span className="rb-badge-pct">%</span></span>
          <span className="rb-badge-off">OFF</span>
          <span className="rb-badge-sub">SUMMER CAMPS</span>
        </div>
      )}

      {/* hand-drawn circle around the badge */}
      {phase >= CIRCLE && (
        <svg className="rb-circle" viewBox="0 0 240 200" aria-hidden>
          <ellipse cx="120" cy="100" rx="112" ry="92" transform="rotate(-8 120 100)" />
        </svg>
      )}

      {/* ---- robot hand pointing + circling ---- */}
      {phase === CIRCLE && (
        <div className="rb-hand" aria-hidden>
          <div className="rb-hand-arm" />
          <div className="rb-hand-palm">
            <div className="rb-finger" />
            <div className="rb-thumb" />
          </div>
        </div>
      )}

      {/* ---- rocket robot flying left → right (above the text) ---- */}
      {phase === ROCKET && (
        <div className="rb-rocket" aria-hidden>
          <div className="rb-rocket-flame" />
          <div className="rb-rocket-body">
            <div className="rb-rocket-window" />
          </div>
          <div className="rb-rocket-fin rb-rocket-fin--t" />
          <div className="rb-rocket-fin rb-rocket-fin--b" />
        </div>
      )}

      {/* ---- open-arms greeter robot (slides in, stays) ---- */}
      {phase >= GREET && (
        <div className="rb-greeter" aria-hidden>
          <div className="rb-g-antenna" />
          <div className="rb-g-head">
            <div className="rb-g-eye rb-g-eye--l" />
            <div className="rb-g-eye rb-g-eye--r" />
            <div className="rb-g-smile" />
          </div>
          <div className="rb-g-body">
            <div className="rb-g-panel" />
          </div>
          <div className="rb-g-arm rb-g-arm--l" />
          <div className="rb-g-arm rb-g-arm--r" />
        </div>
      )}

      {/* ---- dust + vacuum (intro sweep) ---- */}
      {phase === SWEEP && (
        <>
          <div className="rb-dust" aria-hidden>
            {DUST.map((d, i) => (
              <span key={i} style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.s}px`, height: `${d.s}px` }} />
            ))}
          </div>
          <div className="rb-vacuum" aria-hidden>
            <div className="rb-vac-spray" />
            <div className="rb-vac-body">
              <div className="rb-vac-eye" />
              <div className="rb-vac-eye" />
            </div>
            <div className="rb-vac-brush" />
          </div>
        </>
      )}
    </div>
  );
}
