// SceneGames.jsx — reel scene: "GAMES" (Minecraft & Roblox).
// An isometric voxel island builds itself — grass/dirt terrain and a tree
// (Minecraft) — then a blocky Roblox character (with the classic smiley face)
// pops in and hops. Twilight sky.
import React from "react";
import "../Stylesheets/CodeNinjasReel.css";

const TW = 24, TH = 12, CH = 24, OX = 110, OY = 60;
const iso = (gx, gy, gz) => [OX + (gx - gy) * TW, OY + (gx + gy) * TH - gz * CH];

const Cube = ({ gx, gy, gz, top, left, right, d }) => {
  const [x, y] = iso(gx, gy, gz);
  const topP = `${x},${y} ${x + TW},${y + TH} ${x},${y + 2 * TH} ${x - TW},${y + TH}`;
  const leftP = `${x - TW},${y + TH} ${x},${y + 2 * TH} ${x},${y + 2 * TH + CH} ${x - TW},${y + TH + CH}`;
  const rightP = `${x + TW},${y + TH} ${x},${y + 2 * TH} ${x},${y + 2 * TH + CH} ${x + TW},${y + TH + CH}`;
  return (
    <g className="gm-cube" style={{ "--d": `${d.toFixed(2)}s` }}>
      <polygon points={leftP} fill={left} />
      <polygon points={rightP} fill={right} />
      <polygon points={topP} fill={top} />
    </g>
  );
};

const GRASS = { top: "#7cc44e", left: "#7a5230", right: "#5f3f22" };
const WOOD = { top: "#9a743e", left: "#6b4a22", right: "#523818" };
const LEAF = { top: "#5cbf3f", left: "#479330", right: "#356f24" };
const R_LEG = { top: "#4fbf63", left: "#379049", right: "#2a7a3c" };
const R_TOR = { top: "#3f86e6", left: "#2f6fd6", right: "#245bb0" };
const R_HEAD = { top: "#ffd84a", left: "#e6b52e", right: "#c99a1f" };

// terrain (ground + tree), painter-sorted
const TERRAIN = [];
for (let gx = 0; gx < 3; gx++) for (let gy = 0; gy < 3; gy++) TERRAIN.push({ gx, gy, gz: 0, ...GRASS });
TERRAIN.push({ gx: 1, gy: 2, gz: 1, ...WOOD }, { gx: 1, gy: 2, gz: 2, ...WOOD });
[[0, 2], [1, 2], [2, 2], [1, 1]].forEach(([gx, gy]) => TERRAIN.push({ gx, gy, gz: 3, ...LEAF }));
TERRAIN.push({ gx: 1, gy: 2, gz: 4, ...LEAF });
const TERR = TERRAIN
  .map((c) => ({ ...c, key: (c.gx + c.gy) * 10 + c.gz }))
  .sort((a, b) => a.key - b.key)
  .map((c, i) => ({ ...c, d: 0.4 + i * 0.05 }));

// Roblox character at (2,0): legs -> torso -> head (drawn last, on top)
const CHAR = [
  { gx: 2, gy: 0, gz: 1, ...R_LEG, d: 1.0 },
  { gx: 2, gy: 0, gz: 2, ...R_TOR, d: 1.1 },
  { gx: 2, gy: 0, gz: 3, ...R_HEAD, d: 1.2 },
];
// face on the head's right (front) face — project onto the iso plane
const HEAD = iso(2, 0, 3);
const FACE_M = `matrix(${TW} ${-TH} 0 ${CH} ${HEAD[0]} ${HEAD[1] + 2 * TH})`;

const STARS = Array.from({ length: 14 }, (_, i) => i);

export default function SceneGames() {
  return (
    <div className="sc sc-gm">
      <div className="gm-sky" aria-hidden />
      <div className="gm-stars" aria-hidden>
        {STARS.map((i) => (
          <span key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 60}%`, animationDelay: `${(i % 5) * 0.4}s` }} />
        ))}
      </div>
      <div className="gm-glow" aria-hidden />

      <div className="sc-head">
        <span className="sc-num">06</span>
        <span className="sc-title">GAMES</span>
        <span className="sc-rule" />
        <span className="sc-desc">Minecraft &amp; Roblox.</span>
      </div>

      <div className="gm-stage">
        <svg className="gm-svg" viewBox="48 -14 124 180" aria-hidden>
          {TERR.map((c, i) => <Cube key={`t${i}`} {...c} />)}

          {/* Roblox character — hops after it builds */}
          <g className="gm-char">
            {CHAR.map((c, i) => <Cube key={`c${i}`} {...c} />)}
            <g className="gm-face" transform={FACE_M}>
              <rect x="0.28" y="0.24" width="0.11" height="0.2" rx="0.05" fill="#2a2018" />
              <rect x="0.55" y="0.22" width="0.11" height="0.2" rx="0.05" fill="#2a2018" />
              <path d="M0.27 0.5 Q0.47 0.68 0.66 0.48" stroke="#2a2018" strokeWidth="0.05" fill="none" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
