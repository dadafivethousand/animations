// RobloxMinecraftCamp.jsx — blocky summer-camp promo clip for Code Ninjas.
// Voxel blocks float over a bright pixel sky, grass ground, "20% OFF" burst,
// pixel title + CTA. Self-contained, loops.
import React, { useEffect, useState } from "react";
import "../Stylesheets/RobloxMinecraftCamp.css";
import cnLogo from "../Images/cn-wb-logo-2025.png";

const TAGLINES = [
  "Build worlds. Code games.",
  "Make your own mods & games",
  "Weekly sessions all summer",
  "Ages 7–14 · all skill levels",
];

// floating voxel blocks (kept around the edges, clear of the title)
const BLOCKS = [
  { t: "grass",   x: 10, y: 24, s: 104, dur: 5.0, delay: 0,    d: 24 },
  { t: "diamond", x: 84, y: 20, s: 92,  dur: 6.0, delay: -1.6, d: 28 },
  { t: "gold",    x: 20, y: 60, s: 84,  dur: 5.4, delay: -2.3, d: 20 },
  { t: "tnt",     x: 78, y: 58, s: 96,  dur: 6.3, delay: -0.8, d: 26 },
  { t: "emerald", x: 90, y: 42, s: 70,  dur: 5.8, delay: -3.1, d: 18 },
  { t: "diamond", x: 6,  y: 48, s: 72,  dur: 5.3, delay: -1.1, d: 18 },
  { t: "grass",   x: 70, y: 78, s: 76,  dur: 6.6, delay: -2.6, d: 16 },
  { t: "gold",    x: 30, y: 82, s: 68,  dur: 5.6, delay: -3.6, d: 16 },
];

const CLOUDS = [
  { y: 14, s: 150, dur: 46, delay: 0 },
  { y: 30, s: 110, dur: 60, delay: -22 },
  { y: 8,  s: 90,  dur: 54, delay: -38 },
];

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

      {/* floating voxel blocks */}
      <div className="mc-blocks" aria-hidden>
        {BLOCKS.map((b, i) => (
          <div
            key={i}
            className={`mc-cube mc-cube--${b.t}`}
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
        <h1 className="mc-title"><span>SUMMER</span><span>CAMP</span></h1>
        <div key={ti} className="mc-tag">{TAGLINES[ti]}</div>
        <div className="mc-cta">ENROL NOW</div>
        <div className="mc-web">cnwoodbridge.com · (647) 887-9940</div>
      </div>
    </div>
  );
}
