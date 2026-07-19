// CodeBuildsGame.jsx — Code Ninjas Woodbridge.
// A seamless, oddly-satisfying LOOP built for social rewatch:
//   code types line-by-line in an editor  ->  each line assembles a piece of a
//   playable level (ground, blocks, coin, flag)  ->  a ninja runs across, jumps,
//   collects the coin  ->  "LEVEL COMPLETE" pops  ->  a branded red wipe sweeps
//   across and hides an instant reset, so it loops forever with no visible seam.
// PORTRAIT / iPhone-first, single fixed column: header -> code -> game -> footer.
// Everything is driven by CSS keyframes on one shared --loop clock (see the CSS),
// so it stays in sync and rewatches cleanly. No JS timers, no state.
import React from "react";
import "../Stylesheets/CodeBuildsGame.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";

// each line reveals in sync with the piece it builds (timings live in the CSS)
const CODE = [
  "// code ninjas · build mode",
  "const game = new Level();",
  "game.ground();",
  "game.blocks(3);",
  "game.coin();",
  "game.flag();",
  "ninja.run().jump();",
  "game.complete();  // ✓",
];

// a few confetti chips for the LEVEL COMPLETE pop (dx/dy/rot vary per chip)
const CONFETTI = [
  { x: 150, y: 108, c: "#e4002b", dx: -46, dy: -34, r: -140 },
  { x: 176, y: 104, c: "#ffcf3f", dx: -14, dy: -52, r: 120 },
  { x: 190, y: 106, c: "#22c1ff", dx: 20, dy: -46, r: 200 },
  { x: 205, y: 108, c: "#3ddc84", dx: 48, dy: -30, r: -180 },
  { x: 168, y: 110, c: "#ff7ac0", dx: -30, dy: -20, r: 90 },
  { x: 198, y: 110, c: "#ffcf3f", dx: 34, dy: -14, r: -100 },
];

export default function CodeBuildsGame() {
  return (
    <div className="cb-stage">
      {/* ---------------- header ---------------- */}
      <header className="cb-head">
        <span className="cb-kicker">// CODE NINJAS WOODBRIDGE</span>
        <h1 className="cb-title">
          Kids don’t just play games.<b> They build them.</b>
        </h1>
      </header>

      {/* ---------------- code editor ---------------- */}
      <section className="cb-code" aria-hidden>
        <div className="cb-code-bar">
          <span className="cb-dot" /><span className="cb-dot" /><span className="cb-dot" />
          <span className="cb-file">level.js</span>
        </div>
        <div className="cb-code-body">
          {CODE.map((t, i) => (
            <div className="cb-line" key={i}>
              <span className="cb-ln">{i + 1}</span>
              <code className={`cb-txt cb-l${i + 1}${t.startsWith("//") ? " cb-comment" : ""}`}>
                {t}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- game canvas ---------------- */}
      <section className="cb-canvas">
        <svg className="cb-svg" viewBox="0 0 360 260" preserveAspectRatio="xMidYMid meet" aria-hidden>
          {/* sky */}
          <defs>
            <linearGradient id="cb-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#eaf3ff" />
              <stop offset="1" stopColor="#d7e8fb" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="360" height="260" fill="url(#cb-sky)" />

          {/* ground */}
          <g className="cb-ground">
            <rect x="-10" y="210" width="380" height="60" fill="#3ddc84" />
            <rect x="-10" y="210" width="380" height="10" fill="#2fbf70" />
            <g fill="#2fbf70" opacity="0.55">
              <rect x="30" y="230" width="16" height="6" rx="3" />
              <rect x="120" y="242" width="16" height="6" rx="3" />
              <rect x="235" y="232" width="16" height="6" rx="3" />
              <rect x="310" y="244" width="16" height="6" rx="3" />
            </g>
          </g>

          {/* floating question-blocks */}
          {[140, 176, 212].map((x, i) => (
            <g className={`cb-blk cb-blk${i + 1}`} key={x}>
              <rect x={x} y="150" width="30" height="30" rx="6" fill="#e4002b" stroke="#a80020" strokeWidth="2" />
              <text x={x + 15} y="171" textAnchor="middle" className="cb-blk-tx">{"<>"}</text>
            </g>
          ))}

          {/* coin (spins continuously, gets collected by the ninja) */}
          <g className="cb-coin">
            <g className="cb-coin-spin">
              <circle cx="191" cy="116" r="12" fill="#ffcf3f" stroke="#e0a200" strokeWidth="2.5" />
              <text x="191" y="120" textAnchor="middle" className="cb-coin-tx">{"</>"}</text>
            </g>
          </g>
          <text x="191" y="96" textAnchor="middle" className="cb-plus">+1</text>

          {/* flag */}
          <g className="cb-flag">
            <rect x="311" y="120" width="4" height="92" rx="2" fill="#3a4656" />
            <circle cx="313" cy="118" r="4" fill="#3a4656" />
            <path className="cb-flag-cloth" d="M315 124 L346 132 L315 142 Z" fill="#e4002b" />
          </g>

          {/* ninja (outer sets ground baseline; inner animates the run + jump) */}
          <g transform="translate(0 188)">
            <g className="cb-ninja-move">
              <ellipse cx="0" cy="23" rx="14" ry="4" fill="rgba(0,0,0,.18)" />
              <rect x="-9" y="12" width="7" height="12" rx="3" fill="#141b25" />
              <rect x="2" y="12" width="7" height="12" rx="3" fill="#141b25" />
              <rect x="-17" y="-2" width="7" height="14" rx="3.5" fill="#1b2430" />
              <rect x="10" y="-2" width="7" height="14" rx="3.5" fill="#1b2430" />
              <rect x="-13" y="-6" width="26" height="24" rx="10" fill="#1b2430" />
              <circle cx="0" cy="-16" r="13" fill="#1b2430" />
              <path d="M13 -19 L27 -23 L25 -14 Z" fill="#e4002b" />
              <path d="M13 -15 L28 -12 L24 -8 Z" fill="#c00020" />
              <rect x="-14" y="-20" width="28" height="9" rx="2" fill="#e4002b" />
              <rect x="-9" y="-18" width="7" height="5" rx="1.5" fill="#fff" />
              <rect x="2" y="-18" width="7" height="5" rx="1.5" fill="#fff" />
              <circle cx="-5" cy="-15.5" r="1.4" fill="#141b25" />
              <circle cx="6" cy="-15.5" r="1.4" fill="#141b25" />
            </g>
          </g>

          {/* confetti burst */}
          {CONFETTI.map((p, i) => (
            <rect
              key={i}
              className="cb-conf"
              x={p.x} y={p.y} width="7" height="7" rx="1.5" fill={p.c}
              style={{ "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, "--r": `${p.r}deg` }}
            />
          ))}

          {/* LEVEL COMPLETE payoff */}
          <g className="cb-badge">
            <rect x="92" y="92" width="176" height="52" rx="13" fill="#0c1220" stroke="#e4002b" strokeWidth="2.5" />
            <text x="180" y="115" textAnchor="middle" className="cb-badge-tx">LEVEL 1 COMPLETE</text>
            <text x="180" y="133" textAnchor="middle" className="cb-badge-sub">you built this ✓</text>
          </g>
        </svg>

        {/* branded wipe — covers the instant loop reset so it never seams */}
        <div className="cb-wipe">
          <img className="cb-wipe-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
          <span className="cb-wipe-tx">loading next level…</span>
        </div>
      </section>

      {/* ---------------- footer ---------------- */}
      <footer className="cb-foot">
        <img className="cb-foot-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
        <div className="cb-foot-rows">
          <span className="cb-foot-row"><span className="cb-ico">📍</span>6175 Hwy 7, Woodbridge</span>
          <span className="cb-foot-row"><span className="cb-ico">📞</span>647-887-9940</span>
          <span className="cb-foot-row cb-foot-web"><span className="cb-ico">🌐</span>cnwoodbridge.com</span>
        </div>
      </footer>
    </div>
  );
}
