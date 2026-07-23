// SceneAI.jsx — reel scene: "AI".
// A glowing brain (🧠 emoji, so it reads everywhere) powered by a rotating
// energy aura, with cables plugging in from below and signals travelling up
// into it. Violet + cyan palette.
import React from "react";
import "../Stylesheets/CodeNinjasReel.css";

// wires converge at the brain base (100,12) and fan down to plugs
const WIRES = [
  "M100 12 C100 50 42 88 22 138",
  "M100 12 C100 56 72 96 60 138",
  "M100 12 C100 62 100 102 100 144",
  "M100 12 C100 56 128 96 140 138",
  "M100 12 C100 50 158 88 178 138",
];
const PLUGS = [[22, 138], [60, 138], [100, 144], [140, 138], [178, 138]];
// a mid-wire node network (more nodes) with cross-links
const NODES = [[52, 78], [76, 84], [100, 84], [124, 84], [148, 78]];
const LINKS = [[0, 1], [1, 2], [2, 3], [3, 4]];
// signals travel plug -> brain (bottom to top)
const PULSES = [
  "M22 138 C42 88 100 50 100 12",
  "M100 144 C100 102 100 62 100 12",
  "M178 138 C158 88 100 50 100 12",
  "M60 138 C72 96 100 56 100 12",
  "M140 138 C128 96 100 56 100 12",
];
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

        <svg className="ai-wires" viewBox="0 0 200 150" aria-hidden>
          <defs>
            <filter id="ai-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g filter="url(#ai-glow)">
            {WIRES.map((d, i) => (
              <path key={`w${i}`} className="ai-wire" d={d} pathLength="1" style={{ "--d": `${0.7 + i * 0.1}s` }} />
            ))}
            {LINKS.map(([a, b], i) => (
              <line key={`l${i}`} className="ai-link" x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} pathLength="1" style={{ "--d": `${1.1 + i * 0.08}s` }} />
            ))}
            {PLUGS.map(([x, y], i) => (
              <circle key={`p${i}`} className="ai-plug" cx={x} cy={y} r="5" style={{ "--d": `${0.7 + i * 0.1}s` }} />
            ))}
            {NODES.map(([x, y], i) => (
              <circle key={`n${i}`} className="ai-node" cx={x} cy={y} r="3.4" style={{ "--d": `${1 + i * 0.08}s` }} />
            ))}
            {PULSES.map((d, i) => {
              const begin = `${(1.7 + i * 0.4).toFixed(2)}s`;
              return (
                <circle key={`s${i}`} className="ai-pulse" r="3">
                  <set attributeName="opacity" to="1" begin={begin} />
                  <animateMotion dur="1.3s" begin={begin} repeatCount="indefinite" path={d} />
                </circle>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
