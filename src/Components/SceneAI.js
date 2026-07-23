// SceneAI.jsx — reel scene: "AI".
// A neural-network brain: wires feed in, the outline and synapses draw
// themselves, nodes light up, and signals pulse through the connections.
// Violet + cyan palette.
import React from "react";
import "../Stylesheets/CodeNinjasReel.css";

// nodes in a brain-shaped layout (viewBox 0 0 240 220)
const N = [
  [120, 40], [88, 54], [152, 54], [62, 82], [100, 76], [140, 76], [178, 82],
  [72, 114], [104, 112], [136, 112], [168, 114], [96, 144], [144, 144], [120, 98],
];
// synapse connections between nodes
const E = [
  [0, 1], [0, 2], [1, 4], [2, 5], [1, 3], [2, 6], [4, 13], [5, 13], [3, 7], [6, 10],
  [7, 8], [10, 9], [8, 13], [9, 13], [8, 11], [9, 12], [11, 13], [12, 13], [4, 8], [5, 9], [0, 13],
];
// which edges carry a travelling signal pulse
const PULSES = [0, 6, 8, 13, 18, 3, 10];

const BRAIN = "M120 22C152 14 180 26 190 52C212 58 216 92 198 112C210 132 192 158 164 158C158 176 128 180 120 164C112 180 82 176 76 158C48 158 30 132 42 112C24 92 28 58 50 52C60 26 88 14 120 22Z";
const FISSURE = "M120 26C112 62 128 92 120 122C114 148 124 156 120 164";
const FOLDS = [
  "M70 68C92 80 92 102 72 110", "M170 68C148 80 148 102 168 110",
  "M98 132C110 122 130 122 142 132",
];
const WIRES = [
  "M28 214C54 186 92 178 112 162", "M212 214C186 186 148 178 128 162", "M120 220C120 194 120 178 120 164",
];
const PLUGS = [[28, 214], [212, 214], [120, 220]];

export default function SceneAI() {
  return (
    <div className="sc sc-ai">
      <div className="ai-amb" aria-hidden />
      <div className="ai-grid" aria-hidden />

      <div className="sc-head">
        <span className="sc-num">04</span>
        <span className="sc-title">AI</span>
        <span className="sc-rule" />
        <span className="sc-desc">Kids teach machines to think.</span>
      </div>

      <div className="ai-stage">
        <svg className="ai-svg" viewBox="0 0 240 232" aria-hidden>
          <defs>
            <filter id="ai-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="ai-core">
              <stop offset="0" stopColor="rgba(150,90,255,.45)" />
              <stop offset="100%" stopColor="rgba(150,90,255,0)" />
            </radialGradient>
          </defs>

          <ellipse className="ai-core" cx="120" cy="96" rx="104" ry="82" fill="url(#ai-core)" />

          <g filter="url(#ai-glow)">
            {/* wires feeding in */}
            {WIRES.map((d, i) => (
              <path key={`w${i}`} className="ai-wire" d={d} pathLength="1" style={{ "--d": `${0.5 + i * 0.12}s` }} />
            ))}
            {PLUGS.map(([x, y], i) => <circle key={`p${i}`} className="ai-plug" cx={x} cy={y} r="4" style={{ "--d": `${0.5 + i * 0.12}s` }} />)}

            {/* brain outline + folds */}
            <path className="ai-brain" d={BRAIN} pathLength="1" />
            <path className="ai-fold" d={FISSURE} pathLength="1" style={{ "--d": "1.1s" }} />
            {FOLDS.map((d, i) => <path key={`f${i}`} className="ai-fold" d={d} pathLength="1" style={{ "--d": `${1.2 + i * 0.1}s` }} />)}

            {/* synapses */}
            {E.map(([a, b], i) => (
              <line key={`e${i}`} className="ai-edge" x1={N[a][0]} y1={N[a][1]} x2={N[b][0]} y2={N[b][1]} pathLength="1" style={{ "--d": `${0.9 + i * 0.045}s` }} />
            ))}

            {/* nodes */}
            {N.map(([x, y], i) => (
              <circle key={`n${i}`} className="ai-node" cx={x} cy={y} r="3.6" style={{ "--d": `${1.1 + i * 0.05}s` }} />
            ))}

            {/* travelling signals (hidden until they begin) */}
            {PULSES.map((ei, i) => {
              const [a, b] = E[ei];
              const begin = `${(2.2 + i * 0.22).toFixed(2)}s`;
              return (
                <circle key={`s${i}`} className="ai-pulse" r="2.6">
                  <set attributeName="opacity" to="1" begin={begin} />
                  <animateMotion dur="1.5s" begin={begin} repeatCount="indefinite"
                    path={`M${N[a][0]} ${N[a][1]} L${N[b][0]} ${N[b][1]}`} />
                </circle>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
