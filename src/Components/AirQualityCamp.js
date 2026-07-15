// AirQualityCamp.jsx — "Escape the smog" promo clip for Code Ninjas.
// Opens on a hazy, polluted city (smog sky, factory smoke, drifting soot),
// then ZOOMS through a glowing Code Ninjas window into a clean, bright
// indoor coding room (monitors running code, a cheering ninja, fresh air).
// Self-contained, loops.  out → zoom → inside → (loop)
import React, { useEffect, useState } from "react";
import "../Stylesheets/AirQualityCamp.css";
import cnLogo from "../Images/cn-wb-logo-2025.png";
import ninja from "../Images/ninja-thumbs.png";

// phase machine: [nextPhase, holdMs]
const NEXT = {
  out:  ["zoom", 4800],
  zoom: ["in",   1300],
  in:   ["out",  6400],
};

// city skyline silhouettes (left → right), heights as % of stage
const BUILDINGS = [
  { x: 2,  w: 9,  h: 34 }, { x: 12, w: 7,  h: 46 }, { x: 20, w: 8, h: 28 },
  { x: 29, w: 6,  h: 52 }, { x: 66, w: 7,  h: 40 }, { x: 74, w: 9, h: 55 },
  { x: 84, w: 7,  h: 30 }, { x: 91, w: 8,  h: 44 },
];

// factory smoke stacks — each spawns rising puffs
const STACKS = [
  { x: 6,  puffs: [0, -1.4, -2.8, -4.1] },
  { x: 88, puffs: [-0.7, -2.1, -3.5, -4.9] },
];

// drifting soot / dust specks
const SOOT = Array.from({ length: 26 }, (_, i) => ({
  x: (i * 53 + 11) % 100,
  y: (i * 37 + 7) % 100,
  s: 3 + (i % 4) * 2,
  dur: 7 + (i % 6) * 1.6,
  delay: -((i * 0.8) % 9),
}));

// lines of "code" on the indoor monitors
const CODE = [
  [58, "#7ee787"], [40, "#79c0ff"], [72, "#ffa657"],
  [50, "#d2a8ff"], [64, "#7ee787"], [34, "#79c0ff"],
];

export default function AirQualityCamp() {
  const [phase, setPhase] = useState("out");

  useEffect(() => {
    const [next, ms] = NEXT[phase];
    const t = setTimeout(() => setPhase(next), ms);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className={`aq-stage aq-${phase}`}>
      {/* ================= OUTDOOR : POLLUTION ================= */}
      <div className="aq-outside" aria-hidden>
        <div className="aq-smogsky" />
        <div className="aq-sun" />
        <div className="aq-smog aq-smog--1" />
        <div className="aq-smog aq-smog--2" />

        {/* soot / dust */}
        <div className="aq-soot">
          {SOOT.map((p, i) => (
            <span
              key={i}
              style={{
                left: `${p.x}%`, top: `${p.y}%`, width: `${p.s}px`, height: `${p.s}px`,
                animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* city skyline */}
        <div className="aq-skyline">
          {BUILDINGS.map((b, i) => (
            <div key={i} className="aq-building" style={{ left: `${b.x}%`, width: `${b.w}%`, height: `${b.h}%` }} />
          ))}
        </div>

        {/* smoke stacks */}
        {STACKS.map((s, i) => (
          <div key={i} className="aq-stack" style={{ left: `${s.x}%` }}>
            {s.puffs.map((d, j) => (
              <span key={j} className="aq-puff" style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
        ))}

        {/* the Code Ninjas building — glowing window is the zoom target */}
        <div className="aq-cn-building">
          <div className="aq-cn-roof" />
          <div className="aq-cn-window">
            <span className="aq-cn-glow" />
          </div>
          <div className="aq-cn-sign">CODE NINJAS</div>
        </div>

        {/* AQI warning */}
        <div className="aq-aqi aq-aqi--bad">
          <span className="aq-aqi-dot" />
          AIR QUALITY&nbsp;·&nbsp;<b>UNHEALTHY</b>&nbsp;<span className="aq-aqi-num">178</span>
        </div>

        <div className="aq-out-copy">
          <div className="aq-out-sub">SMOKE&nbsp;·&nbsp;SMOG&nbsp;·&nbsp;BAD AIR OUTSIDE?</div>
          <h1 className="aq-out-title">KEEP THE KIDS<span>INSIDE.</span></h1>
        </div>
      </div>

      {/* ================= INDOOR : CLEAN CODING ROOM ================= */}
      <div className="aq-inside" aria-hidden>
        <div className="aq-room-wall" />
        {/* back window: smog stays outside the glass */}
        <div className="aq-room-window"><span className="aq-room-window-haze" /></div>
        <div className="aq-freshair"><span /><span /><span /></div>
        <div className="aq-room-floor" />

        {/* desks + monitors running code */}
        <div className="aq-desks">
          {[0, 1, 2].map((k) => (
            <div key={k} className={`aq-desk aq-desk--${k}`}>
              <div className="aq-monitor">
                <div className="aq-screen">
                  {CODE.map((c, i) => (
                    <span
                      key={i}
                      className="aq-code"
                      style={{ width: `${c[0]}%`, background: c[1], animationDelay: `${(k * 6 + i) * 0.18}s` }}
                    />
                  ))}
                </div>
                <div className="aq-stand" />
              </div>
              <div className="aq-deskbar" />
            </div>
          ))}
        </div>

        <img className="aq-ninja" src={ninja} alt="" />

        <div className="aq-fresh-badge"><b>FRESH AIR</b><span>AQI 12 · GOOD</span></div>
      </div>

      {/* ================= PERSISTENT BRAND / OFFER OVERLAY ================= */}
      <img className="aq-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
      <div className="aq-badge"><span className="aq-badge-big">20%</span><span className="aq-badge-off">OFF</span></div>

      <div className="aq-hero">
        <h2 className="aq-hero-title">CODE INDOORS THIS<span>SUMMER</span></h2>
        <div className="aq-hero-tag">Air-conditioned camp · clean air · real coding &amp; games</div>
        <div className="aq-cta">ENROL NOW</div>
        <div className="aq-web">cnwoodbridge.com · (647) 887-9940</div>
      </div>
    </div>
  );
}
