// SceneRobotics.jsx — reel scene: "ROBOTICS".
// A detailed robotic hand pointing, over a bed of meshing metallic gears with
// spokes, rivets and hub bolts, plus circuit traces and panel bolts.
// Amber + steel industrial palette.
import React from "react";
import "../Stylesheets/CodeNinjasReel.css";
import handImg from "../Images/robot-hand.png";

// flat-topped gear outline (absolute coords)
function gearPath(teeth, rOut, rIn, cx, cy) {
  const step = 360 / teeth, t = step * 0.42;
  const p = (r, deg) => { const a = (deg * Math.PI) / 180; return `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`; };
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    d += `${i ? "L" : "M"} ${p(rIn, a - t)} L ${p(rOut, a - t * 0.6)} L ${p(rOut, a + t * 0.6)} L ${p(rIn, a + t)} `;
  }
  return d + "Z";
}
// tapered spoke trapezoid from hub to inner ring
function spoke(cx, cy, rHub, rOut, ang, wOut, wIn) {
  const p = (r, deg) => { const a = (deg * Math.PI) / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  const [a, b] = [p(rHub, ang - wIn), p(rHub, ang + wIn)];
  const [c, e] = [p(rOut, ang + wOut), p(rOut, ang - wOut)];
  return `M${a} L${b} L${c} L${e} Z`.replace(/,/g, " ");
}
const ring = (cx, cy, r, n, deg0 = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = ((deg0 + (i * 360) / n) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });

const Gear = ({ cx, cy, teeth, rOut, rIn, dur, rev }) => {
  const rRim = rIn, rRec = rIn * 0.70, rHub = rIn * 0.34, rBolt = rIn * 0.14;
  const spokes = 5;
  return (
    <g className="rob-gear" style={{ animationDuration: `${dur}s`, animationDirection: rev ? "reverse" : "normal" }}>
      <path className="rob-teeth" d={gearPath(teeth, rOut, rRim + 1, cx, cy)} />
      <circle cx={cx} cy={cy} r={rRim} fill="url(#g-body)" stroke="#3b434f" strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r={rRec} fill="url(#g-recess)" />
      {ring(cx, cy, (rRim + rRec) / 2, teeth > 9 ? 8 : 6).map(([x, y], i) => (
        <circle key={`r${i}`} cx={x} cy={y} r={rIn * 0.05} fill="#2c333d" />
      ))}
      {Array.from({ length: spokes }, (_, i) => (
        <path key={`s${i}`} d={spoke(cx, cy, rHub - 1, rRec + 1, (i * 360) / spokes, spokes > 4 ? 14 : 18, 22)} fill="url(#g-spoke)" stroke="#3b434f" strokeWidth="0.5" />
      ))}
      <circle cx={cx} cy={cy} r={rHub} fill="url(#g-hub)" stroke="#3b434f" strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r={rBolt} fill="#454e5b" />
      <circle cx={cx - rBolt * 0.35} cy={cy - rBolt * 0.35} r={rBolt * 0.35} fill="#aab4c0" />
    </g>
  );
};

const BOLTS = [[16, 20], [204, 20], [16, 184], [204, 184]];
const TRACES = [
  "M0 60 H40 L52 72 H92", "M220 44 H176 L164 56 H120",
  "M0 150 H36 L48 138 H84", "M220 160 H180 L168 148 H128",
];

export default function SceneRobotics() {
  return (
    <div className="sc sc-rob">
      <div className="rob-amb" aria-hidden />

      <div className="sc-head">
        <span className="sc-num">04</span>
        <span className="sc-title">ROBOTICS</span>
      </div>

      <div className="rob-stage">
        <div className="rob-botwrap">
          <div className="rob-pulse" />
          <img className="rob-bot" src={handImg} alt="Robotic hand" />
        </div>

        <svg className="rob-gears" viewBox="0 0 220 204" aria-hidden>
          <defs>
            <radialGradient id="g-body" cx="0.36" cy="0.30" r="0.92">
              <stop offset="0" stopColor="#e6ecf3" /><stop offset=".5" stopColor="#aeb8c4" />
              <stop offset=".82" stopColor="#6d7684" /><stop offset="1" stopColor="#464e5a" />
            </radialGradient>
            <radialGradient id="g-hub" cx="0.36" cy="0.30" r="0.95">
              <stop offset="0" stopColor="#f1f5f9" /><stop offset="1" stopColor="#7b8592" />
            </radialGradient>
            <radialGradient id="g-recess" cx="0.5" cy="0.5" r="0.62">
              <stop offset="0" stopColor="#262d36" /><stop offset="1" stopColor="#3f4753" />
            </radialGradient>
            <linearGradient id="g-spoke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c6cfda" /><stop offset="1" stopColor="#79828f" />
            </linearGradient>
            <linearGradient id="g-teeth" x1="0" y1="0" x2="0.7" y2="1">
              <stop offset="0" stopColor="#dbe2ea" /><stop offset=".55" stopColor="#9aa4b1" /><stop offset="1" stopColor="#565f6c" />
            </linearGradient>
          </defs>

          {TRACES.map((d, i) => (
            <path key={`t${i}`} className="rob-trace" d={d} pathLength="1" style={{ "--d": `${0.6 + i * 0.12}s` }} />
          ))}
          {BOLTS.map(([x, y], i) => (
            <g key={`b${i}`} className="rob-bolt" style={{ "--d": `${0.9 + i * 0.08}s` }}>
              <circle cx={x} cy={y} r="5" fill="url(#g-hub)" stroke="#7a5a12" strokeWidth="1" />
              <rect x={x - 3.4} y={y - 0.9} width="6.8" height="1.8" rx="0.9" fill="#5a6472" />
            </g>
          ))}

          <Gear cx={78} cy={112} teeth={12} rOut={40} rIn={31} dur={9} />
          <Gear cx={142} cy={92} teeth={10} rOut={31} rIn={24} dur={7} rev />
          <Gear cx={116} cy={162} teeth={8} rOut={25} rIn={19} dur={6} rev />
        </svg>
      </div>
    </div>
  );
}
