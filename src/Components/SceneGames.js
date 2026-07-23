// SceneGames.jsx — reel scene: "GAMES" (Minecraft & Roblox).
// An isometric voxel island builds itself block by block — grass/dirt terrain,
// a tree, and a blocky Roblox-style character — over a twilight sky.
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

// colours
const GRASS = { top: "#7cc44e", left: "#7a5230", right: "#5f3f22" };
const WOOD = { top: "#9a743e", left: "#6b4a22", right: "#523818" };
const LEAF = { top: "#5cbf3f", left: "#479330", right: "#356f24" };
const R_LEG = { top: "#4fbf63", left: "#379049", right: "#2a7a3c" };
const R_TOR = { top: "#3f86e6", left: "#2f6fd6", right: "#245bb0" };
const R_HEAD = { top: "#ffd84a", left: "#e6b52e", right: "#c99a1f" };

// scene cubes (grid coords). build order by (gx+gy) then gz.
const CUBES = [];
// 3x3 grass ground
for (let gx = 0; gx < 3; gx++) for (let gy = 0; gy < 3; gy++) CUBES.push({ gx, gy, gz: 0, ...GRASS });
// tree trunk + leaves at (1,2)
CUBES.push({ gx: 1, gy: 2, gz: 1, ...WOOD }, { gx: 1, gy: 2, gz: 2, ...WOOD });
[[0, 2], [1, 2], [2, 2], [1, 1]].forEach(([gx, gy]) => CUBES.push({ gx, gy, gz: 3, ...LEAF }));
CUBES.push({ gx: 1, gy: 2, gz: 4, ...LEAF });
// blocky character at (2,0)
CUBES.push({ gx: 2, gy: 0, gz: 1, ...R_LEG }, { gx: 2, gy: 0, gz: 2, ...R_TOR }, { gx: 2, gy: 0, gz: 3, ...R_HEAD });

// painter's order + staggered build delay
const ORDERED = CUBES
  .map((c) => ({ ...c, key: (c.gx + c.gy) * 10 + c.gz }))
  .sort((a, b) => a.key - b.key)
  .map((c, i) => ({ ...c, d: 0.5 + i * 0.075 }));

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
          {ORDERED.map((c, i) => <Cube key={i} {...c} />)}
        </svg>
      </div>
    </div>
  );
}
