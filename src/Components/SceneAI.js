// SceneAI.jsx — reel scene: "AI".
// A glowing brain (🧠 emoji) powered by a rotating energy aura, wired to a
// multi-layer neural network below it. Nodes are generated on a grid and every
// edge is drawn from those exact node coordinates, so dots always sit on the
// lines; the top layer funnels into a trunk that plugs into the brain.
import React from "react";
import "../Stylesheets/CodeNinjasReel.css";

// network layers, bottom -> top: [node count, y, half-width]
const CFG = [
  { n: 6, y: 168, hw: 94 },
  { n: 8, y: 130, hw: 84 },
  { n: 6, y: 92, hw: 60 },
  { n: 4, y: 56, hw: 34 },
];
const APEX = [110, 26];

// node coordinates per layer
const NET = CFG.map((L) =>
  Array.from({ length: L.n }, (_, j) => [
    L.n === 1 ? 110 : +(110 - L.hw + (j * 2 * L.hw) / (L.n - 1)).toFixed(1),
    L.y,
  ])
);
// flatten nodes with their layer index (for stagger + sizing)
const NODES = [];
NET.forEach((layer, li) => layer.forEach((p) => NODES.push({ p, li })));
NODES.push({ p: APEX, li: CFG.length });

// fully-connected edges between adjacent layers, then top layer -> apex
const EDGES = [];
for (let i = 0; i < NET.length - 1; i++)
  NET[i].forEach((a) => NET[i + 1].forEach((b) => EDGES.push({ a, b, li: i })));
NET[NET.length - 1].forEach((a) => EDGES.push({ a, b: APEX, li: NET.length - 1 }));

// a handful of edges carry a travelling signal (bottom -> top)
const PULSE_IDX = EDGES.map((_, i) => i).filter((i) => i % 11 === 4).slice(0, 10);
const BITS = Array.from({ length: 10 }, (_, i) => i);

export default function SceneAI() {
  return (
    <div className="sc sc-ai">
      <div className="ai-amb" aria-hidden />
      <div className="ai-grid" aria-hidden />
      <div className="ai-bits" aria-hidden>
        {BITS.map((i) => (
          <span key={i} style={{ left: `${8 + i * 9}%`, animationDelay: `${(i % 5) * -1.1}s`, animationDuration: `${5 + (i % 4)}s` }}>
            {i % 2 ? "1" : "0"}
          </span>
        ))}
      </div>

      <div className="sc-head">
        <span className="sc-num">04</span>
        <span className="sc-title">AI</span>
        <span className="sc-rule" />
        <span className="sc-desc">Kids teach machines to think.</span>
      </div>

      <div className="ai-stage">
        <div className="ai-brainpos">
          <div className="ai-aura" />
          <div className="ai-ring" />
          <span className="ai-brain" role="img" aria-label="brain">🧠</span>
        </div>

        <svg className="ai-net" viewBox="0 0 220 180" aria-hidden>
          <defs>
            <filter id="ai-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* edges (faint, un-glowed for perf on ~100 lines) */}
          <g>
            {EDGES.map((e, i) => (
              <line key={`e${i}`} className="ai-edge" x1={e.a[0]} y1={e.a[1]} x2={e.b[0]} y2={e.b[1]}
                pathLength="1" style={{ "--d": `${(0.7 + e.li * 0.22).toFixed(2)}s` }} />
            ))}
          </g>

          <g filter="url(#ai-glow)">
            {/* trunk into the brain */}
            <line className="ai-trunk" x1="110" y1="26" x2="110" y2="0" pathLength="1" />

            {/* nodes */}
            {NODES.map((nd, i) => (
              <circle key={`n${i}`} className={`ai-node ${nd.li === 0 ? "ai-node--in" : ""} ${nd.li === CFG.length ? "ai-node--apex" : ""}`}
                cx={nd.p[0]} cy={nd.p[1]} r={nd.li === 0 ? 3.8 : 3} style={{ "--d": `${(0.8 + nd.li * 0.22).toFixed(2)}s` }} />
            ))}

            {/* travelling signals */}
            {PULSE_IDX.map((ei, i) => {
              const e = EDGES[ei];
              const begin = `${(2 + i * 0.24).toFixed(2)}s`;
              return (
                <circle key={`s${i}`} className="ai-pulse" r="2.4">
                  <set attributeName="opacity" to="1" begin={begin} />
                  <animateMotion dur="1.1s" begin={begin} repeatCount="indefinite" path={`M${e.a[0]} ${e.a[1]} L${e.b[0]} ${e.b[1]}`} />
                </circle>
              );
            })}
            {/* signal up the trunk into the brain */}
            <circle className="ai-pulse" r="2.8">
              <set attributeName="opacity" to="1" begin="2.6s" />
              <animateMotion dur="0.8s" begin="2.6s" repeatCount="indefinite" path="M110 26 L110 0" />
            </circle>
          </g>
        </svg>
      </div>
    </div>
  );
}
