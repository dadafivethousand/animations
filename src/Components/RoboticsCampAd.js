// RoboticsCampAd.jsx — Code Ninjas Woodbridge robotics summer-camp ad.
// High-tech, detailed sequence:
//   0) BOOT  — the circuit-board background energizes, HUD frame + logo boot in
//   1) TYPE  — camp info decodes in with a per-character glitch/typewriter
//   2) BADGE — a 20% OFF badge powers up with a shockwave + energy ring + orbiters
//   3) GREET — the open-arms robot materializes (teleport scan-in) and hovers
// Fixed zones keep text (left), badge (upper-right) and greeter (lower-right) apart.
import React, { useEffect, useState } from "react";
import "../Stylesheets/RoboticsCampAd.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";
import greeterImg from "../Images/robot-openarms.png";

const BOOT = 0, TYPE = 1, BADGE = 2, GREET = 3;

const LINES = [
  { t: "CODE NINJAS WOODBRIDGE", cls: "title" },
  { t: "Robotics Summer Camp",   cls: "subtitle" },
  { t: "6175 Hwy 7",             cls: "info", icon: "📍" },
  { t: "cnwoodbridge.com",       cls: "info", icon: "🌐" },
  { t: "647-887-9940",           cls: "info", icon: "📞" },
];

// circuit-board traces (viewBox 1600x900) kept in the margins around the content
const TRACES = [
  "M10 70 H230 V150 H340",
  "M0 230 H110 V310 H250 V370",
  "M40 780 H210 V700 H360",
  "M60 870 H250 V820 H430 V750",
  "M1590 70 H1360 V170 H1180",
  "M1600 320 H1500 V240 H1360",
  "M1560 850 H1380 V890",
  "M820 30 H980 V110 H1140",
  "M1320 30 H1170 V100 H1050",
  "M300 40 H150 V120",
];
// node dots at trace junctions
const NODES = [
  [230, 70], [340, 150], [110, 230], [250, 310], [210, 780], [360, 700],
  [1360, 170], [1180, 170], [1500, 320], [1360, 240], [980, 110], [1140, 110],
  [1170, 100], [1050, 100], [150, 120], [430, 750],
];

// floating data particles
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  x: (i * 53 + 9) % 100,
  s: 3 + (i % 4) * 2,
  dur: 9 + (i % 6) * 2.2,
  delay: -((i * 1.3) % 12),
  glyph: ["1", "0", "·", "+", "×"][i % 5],
  data: i % 3 === 0,
}));

export default function RoboticsCampAd() {
  const [phase, setPhase] = useState(BOOT);
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
    const t = setTimeout(() => { setLi((v) => v + 1); setCi(0); }, 240);
    return () => clearTimeout(t);
  }, [phase, li, ci]);

  // choreography timeline
  useEffect(() => {
    let t;
    if (phase === BOOT)       t = setTimeout(() => setPhase(TYPE), 1300);
    else if (phase === BADGE) t = setTimeout(() => setPhase(GREET), 1000);
    return () => t && clearTimeout(t);
  }, [phase]);

  return (
    <div className={`rb-stage rb-p${phase}`}>
      {/* ---- energized background ---- */}
      <div className="rb-bg" aria-hidden />
      <div className="rb-aurora" aria-hidden />
      <svg className="rb-circuits" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <g className="rb-trace-base">
          {TRACES.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g className="rb-trace-pulse">
          {TRACES.map((d, i) => (
            <path key={i} d={d} pathLength="240" style={{ animationDelay: `${-(i * 0.9)}s`, animationDuration: `${3.6 + (i % 4) * 0.8}s` }} />
          ))}
        </g>
        <g className="rb-nodes">
          {NODES.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" style={{ animationDelay: `${-(i * 0.4)}s` }} />)}
        </g>
      </svg>
      <div className="rb-particles" aria-hidden>
        {PARTICLES.map((p, i) => (
          <span key={i} className={p.data ? "rb-pt rb-pt--data" : "rb-pt"} style={{ left: `${p.x}%`, width: `${p.s}px`, height: `${p.s}px`, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}>{p.data ? p.glyph : ""}</span>
        ))}
      </div>
      <div className="rb-scan" aria-hidden />
      <div className="rb-hud" aria-hidden><i /><i /><i /><i /></div>

      {/* ---- brand ---- */}
      <div className="rb-logo-wrap">
        <img className="rb-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
        <span className="rb-logo-scan" style={{ WebkitMaskImage: `url(${cnLogo})`, maskImage: `url(${cnLogo})` }} aria-hidden />
      </div>

      {/* ---- text block (left zone) ---- */}
      {phase >= TYPE && (
        <div className="rb-text">
          {LINES.map((ln, i) => {
            const done = i < li;
            const active = i === li;
            const chars = done ? ln.t : active ? ln.t.slice(0, ci) : "";
            const started = done || (active && ci > 0);
            return (
              <div key={i} className={`rb-line rb-${ln.cls}`}>
                {ln.icon && <span className="rb-ic" style={{ opacity: started ? 1 : 0 }}>{ln.icon}</span>}
                <span className="rb-tx">
                  {[...chars].map((ch, k) => (
                    <span key={k} className="rb-ch">{ch === " " ? " " : ch}</span>
                  ))}
                </span>
                {phase === TYPE && active && <span className="rb-caret" />}
              </div>
            );
          })}
        </div>
      )}

      {/* ---- discount badge (upper-right) ---- */}
      {phase >= BADGE && (
        <div className="rb-badge-zone">
          <span className="rb-shock" aria-hidden />
          <svg className="rb-ring" viewBox="0 0 260 260" aria-hidden>
            <circle className="rb-ring-track" cx="130" cy="130" r="120" />
            <circle className="rb-ring-draw" cx="130" cy="130" r="120" pathLength="100" />
          </svg>
          <div className="rb-orbit" aria-hidden><i /><i /><i /></div>
          <div className="rb-badge">
            <span className="rb-badge-big">20<span className="rb-badge-pct">%</span></span>
            <span className="rb-badge-off">OFF</span>
            <span className="rb-badge-sub">SUMMER CAMPS</span>
          </div>
        </div>
      )}

      {/* ---- open-arms greeter — materializes and hovers ---- */}
      {phase >= GREET && (
        <div className="rb-greeter" aria-hidden>
          <span className="rb-greet-aura" />
          <span className="rb-greet-ring" />
          <img src={greeterImg} alt="" />
          <span className="rb-greet-scan" />
        </div>
      )}
    </div>
  );
}
