// SceneRobotics.jsx — reel scene: "ROBOTICS".
// A robot (🤖) powering up over a bed of meshing gears, with circuit traces
// and bolts. Amber + steel industrial palette.
import React from "react";
import "../Stylesheets/CodeNinjasReel.css";

// build a gear outline (absolute coords) with flat-topped teeth
function gear(teeth, rOut, rIn, cx, cy) {
  const step = 360 / teeth, t = step * 0.42;
  const pt = (r, deg) => { const a = (deg * Math.PI) / 180; return `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`; };
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    d += `${i ? "L" : "M"} ${pt(rIn, a - t)} L ${pt(rOut, a - t * 0.6)} L ${pt(rOut, a + t * 0.6)} L ${pt(rIn, a + t)} `;
  }
  return d + "Z";
}

const Gear = ({ cx, cy, teeth, rOut, rIn, rHub, dur, rev }) => (
  <g className="rob-gear" style={{ animationDuration: `${dur}s`, animationDirection: rev ? "reverse" : "normal" }}>
    <path className="rob-teeth" d={gear(teeth, rOut, rIn, cx, cy)} />
    <circle className="rob-hub" cx={cx} cy={cy} r={rHub} />
    <circle className="rob-hole" cx={cx} cy={cy} r={rHub * 0.42} />
  </g>
);

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
        <span className="sc-num">05</span>
        <span className="sc-title">ROBOTICS</span>
        <span className="sc-rule" />
        <span className="sc-desc">Kids build machines.</span>
      </div>

      <div className="rob-stage">
        <div className="rob-botwrap">
          <div className="rob-pulse" />
          <span className="rob-bot" role="img" aria-label="robot">🤖</span>
          <div className="rob-scan" />
        </div>

        <svg className="rob-gears" viewBox="0 0 220 204" aria-hidden>
          {/* circuit traces */}
          {TRACES.map((d, i) => (
            <path key={`t${i}`} className="rob-trace" d={d} pathLength="1" style={{ "--d": `${0.6 + i * 0.12}s` }} />
          ))}
          {BOLTS.map(([x, y], i) => <circle key={`b${i}`} className="rob-bolt" cx={x} cy={y} r="4.5" style={{ "--d": `${0.9 + i * 0.08}s` }} />)}

          <Gear cx={78} cy={112} teeth={12} rOut={40} rIn={31} rHub={13} dur={9} />
          <Gear cx={142} cy={92} teeth={10} rOut={31} rIn={24} rHub={10} dur={7} rev />
          <Gear cx={116} cy={162} teeth={8} rOut={25} rIn={19} rHub={8} dur={6} />
        </svg>
      </div>
    </div>
  );
}
