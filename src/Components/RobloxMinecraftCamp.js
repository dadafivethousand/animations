// RobloxMinecraftCamp.jsx — blocky summer-camp promo clip for Code Ninjas.
// Voxel blocks (near + hazy far layer) float over a bright pixel sky with
// drifting clouds and rising pixel particles; title sits on a wood sign.
// Self-contained, loops.
import React, { useEffect, useState } from "react";
import "../Stylesheets/RobloxMinecraftCamp.css";
import cnLogo from "../Images/cn-wb-logo-2025.png";

const TAGLINES = [
  "Build worlds. Code games.",
  "Make your own mods & games",
  "Weekly sessions all summer",
  "Ages 7–14 · all skill levels",
];

// floating voxel blocks (kept clear of the title); far = hazy depth layer
const BLOCKS = [
  { t: "grass",   x: 9,  y: 28, s: 104, dur: 5.0, delay: 0,    d: 24 },
  { t: "diamond", x: 86, y: 24, s: 92,  dur: 6.0, delay: -1.6, d: 28 },
  { t: "gold",    x: 18, y: 62, s: 84,  dur: 5.4, delay: -2.3, d: 20 },
  { t: "tnt",     x: 80, y: 60, s: 96,  dur: 6.3, delay: -0.8, d: 26 },
  { t: "emerald", x: 92, y: 45, s: 70,  dur: 5.8, delay: -3.1, d: 18 },
  { t: "diamond", x: 4,  y: 49, s: 72,  dur: 5.3, delay: -1.1, d: 18 },
  { t: "grass",   x: 72, y: 80, s: 76,  dur: 6.6, delay: -2.6, d: 16 },
  { t: "gold",    x: 28, y: 83, s: 66,  dur: 5.6, delay: -3.6, d: 16 },
  { t: "emerald", x: 15, y: 13, s: 44,  dur: 7.5, delay: -2,   d: 12, far: true },
  { t: "tnt",     x: 89, y: 11, s: 46,  dur: 8.0, delay: -4,   d: 12, far: true },
  { t: "diamond", x: 63, y: 14, s: 40,  dur: 7.0, delay: -1,   d: 10, far: true },
];

const CLOUDS = [
  { y: 6,  s: 150, dur: 48, delay: 0 },
  { y: 15, s: 108, dur: 62, delay: -24 },
  { y: 4,  s: 88,  dur: 56, delay: -40 },
];

// rising pixel particles
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 61 + 7) % 100,
  s: 4 + (i % 3) * 3,
  dur: 9 + (i % 5) * 2,
  delay: -((i * 0.9) % 12),
  c: ["#ffffff", "#ffe14d", "#8ff2e8", "#8ed24f"][i % 4],
}));

export default function RobloxMinecraftCamp() {
  const [ti, setTi] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setTi((v) => (v + 1) % TAGLINES.length), 2400);
    return () => clearTimeout(t);
  }, [ti]);

  return (
    <div className="mc-stage">
      <div className="mc-sky" aria-hidden />
      <div className="mc-sun" aria-hidden />

      <div className="mc-clouds" aria-hidden>
        {CLOUDS.map((c, i) => (
          <div
            key={i}
            className="mc-cloud"
            style={{ top: `${c.y}%`, width: `${c.s}px`, height: `${c.s * 0.44}px`, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}
          />
        ))}
      </div>

      <div className="mc-particles" aria-hidden>
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="mc-particle"
            style={{ left: `${p.x}%`, width: `${p.s}px`, height: `${p.s}px`, background: p.c, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
          />
        ))}
      </div>

      {/* floating voxel blocks */}
      <div className="mc-blocks" aria-hidden>
        {BLOCKS.map((b, i) => (
          <div
            key={i}
            className={`mc-cube mc-cube--${b.t}${b.far ? " mc-cube--far" : ""}`}
            style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.s}px`, height: `${b.s}px`, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s`, "--d": `${b.d}px` }}
          >
            <span className="mc-face mc-top" />
            <span className="mc-face mc-left" />
            <span className="mc-face mc-right" />
          </div>
        ))}
      </div>

      <div className="mc-ground" aria-hidden />

      {/* brand + offer */}
      <img className="mc-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
      <div className="mc-badge"><span className="mc-badge-big">20%</span><span className="mc-badge-off">OFF</span></div>

      {/* hero */}
      <div className="mc-hero">
        <div className="mc-sub">ROBLOX · MINECRAFT · CODE</div>
        <div className="mc-sign">
          <h1 className="mc-title"><span>SUMMER</span><span>CAMP</span></h1>
        </div>
        <div key={ti} className="mc-tag">{TAGLINES[ti]}</div>
        <div className="mc-cta">ENROL NOW</div>
        <div className="mc-web">cnwoodbridge.com · (647) 887-9940</div>
      </div>
    </div>
  );
}
