// RoboticsCampAd.jsx — Code Ninjas Woodbridge robotics summer-camp ad.
// Realistic green PCB with a brushed-metal brand plaque. No robot graphic.
//   0) BOOT — the board powers up (copper traces energize, chip glints)
//   1) TYPE — camp details decode in as a terminal readout
import React, { useEffect, useState } from "react";
import "../Stylesheets/RoboticsCampAd.css";
import plaqueLogo from "../Images/cn-plaque-logo.png";

const BOOT = 0, TYPE = 1;

const LINES = [
  { t: "ROBOTICS SUMMER CAMP",         cls: "heading" },
  { t: "LOCATION : 6175 Hwy 7",        cls: "term" },
  { t: "WEBSITE  : cnwoodbridge.com",  cls: "term" },
  { t: "CONTACT  : 647-887-9940",      cls: "term" },
  { t: "STATUS   : NOW ENROLLING",     cls: "term status" },
];

// copper traces (viewBox 1600x900) routed with 45° bends in the margins
const TRACES = [
  "M0 250 H70 L120 300 H250 L300 250 H430",
  "M40 470 H150 L200 520 H360",
  "M30 690 H180 L230 640 H420 L470 690 H560",
  "M60 850 H240 L300 790 H470",
  "M1600 210 H1470 L1410 150 H1250 L1200 210 H1080",
  "M1600 430 H1500 L1450 370 H1320",
  "M1600 610 H1460 L1400 670 H1250",
  "M1560 850 H1360 L1300 790 H1180",
  "M840 30 H980 L1040 90 H1180",
  "M1330 30 H1180 L1130 90",
  "M260 40 H150 L110 90",
];
const VIAS = [ [4.5,28],[7.5,33],[16,33],[19,29],[9,52],[22,58],[3,77],[28,72],[92,23],[78,23],[75,17],[97,48],[82,41],[91,68],[78,74],[74,88] ];
const SOLDER = [ [26,52],[15,77],[36,29],[66,10],[72,17],[95,68],[8,58],[62,73] ];
const CAPS = [ {x:76,y:15,r:34}, {x:90,y:52,r:26}, {x:64,y:68,r:22} ];
const SILK = [ {x:9,y:24,t:"R7"},{x:25,y:47,t:"C11"},{x:18,y:73,t:"J2"},{x:70,y:9,t:"C1"},{x:96,y:41,t:"L4"},{x:59,y:64,t:"U3"},{x:73,y:70,t:"D2"},{x:83,y:80,t:"Q8"} ];
const SMD = [ {x:34,y:29,w:26,h:11},{x:12,y:60,w:11,h:26},{x:56,y:82,w:24,h:10} ];

export default function RoboticsCampAd() {
  const [phase, setPhase] = useState(BOOT);
  const [li, setLi] = useState(0);
  const [ci, setCi] = useState(0);

  useEffect(() => {
    if (phase !== TYPE) return;
    if (li >= LINES.length) return;
    const line = LINES[li].t;
    if (ci < line.length) {
      const t = setTimeout(() => setCi((v) => v + 1), 30);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setLi((v) => v + 1); setCi(0); }, 240);
    return () => clearTimeout(t);
  }, [phase, li, ci]);

  useEffect(() => {
    if (phase !== BOOT) return;
    const t = setTimeout(() => setPhase(TYPE), 1200);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className={`rb-stage rb-p${phase}`}>
      {/* ---- green PCB substrate ---- */}
      <div className="rb-bg" aria-hidden />
      <div className="rb-mask" aria-hidden />

      {/* copper traces with depth (shadow + copper + highlight) */}
      <svg className="rb-circuits" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="rb-cu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f0c27a" /><stop offset=".5" stopColor="#c98a3a" /><stop offset="1" stopColor="#8f5e22" />
          </linearGradient>
        </defs>
        <g className="rb-tr-shadow">{TRACES.map((d, i) => <path key={i} d={d} />)}</g>
        <g className="rb-tr-cu">{TRACES.map((d, i) => <path key={i} d={d} />)}</g>
        <g className="rb-tr-hi">{TRACES.map((d, i) => <path key={i} d={d} />)}</g>
        <g className="rb-tr-pulse">
          {TRACES.map((d, i) => (
            <path key={i} d={d} pathLength="240" style={{ animationDelay: `${-(i * 0.8)}s`, animationDuration: `${3.6 + (i % 4) * 0.7}s` }} />
          ))}
        </g>
      </svg>

      {/* discrete parts */}
      <div className="rb-parts" aria-hidden>
        {VIAS.map(([x, y], i) => <span key={"v" + i} className="rb-via" style={{ left: `${x}%`, top: `${y}%` }} />)}
        {SOLDER.map(([x, y], i) => <span key={"o" + i} className="rb-solder" style={{ left: `${x}%`, top: `${y}%` }} />)}
        {SMD.map((s, i) => <span key={"s" + i} className="rb-smd" style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}px`, height: `${s.h}px` }} />)}
        {CAPS.map((c, i) => (
          <span key={"c" + i} className="rb-cap" style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.r * 2}px`, height: `${c.r * 2}px` }}>
            <span className="rb-cap-vent" />
          </span>
        ))}
        {SILK.map((l, i) => <span key={"l" + i} className="rb-silk" style={{ left: `${l.x}%`, top: `${l.y}%` }}>{l.t}</span>)}
        {/* gold edge-connector fingers */}
        <span className="rb-fingers">{Array.from({ length: 12 }).map((_, i) => <i key={i} />)}</span>
      </div>

      {/* realistic QFP chip */}
      <div className="rb-qfp" aria-hidden>
        <span className="rb-qfp-pins rb-qfp-pins--t" /><span className="rb-qfp-pins rb-qfp-pins--b" />
        <span className="rb-qfp-pins rb-qfp-pins--l" /><span className="rb-qfp-pins rb-qfp-pins--r" />
        <div className="rb-qfp-body">
          <span className="rb-qfp-dot" />
          <span className="rb-qfp-glint" />
          <span className="rb-qfp-etch">CN-2600<br />ROBOTICS</span>
        </div>
      </div>

      <div className="rb-hud" aria-hidden><i /><i /><i /><i /></div>

      {/* ---- brushed-metal brand plaque ---- */}
      <div className="rb-plaque">
        <span className="rb-screw" /><span className="rb-screw" /><span className="rb-screw" /><span className="rb-screw" />
        <span className="rb-plaque-gloss" aria-hidden />
        <img className="rb-plaque-logo" src={plaqueLogo} alt="Code Ninjas Woodbridge" />
      </div>

      {/* ---- hero details (terminal readout) ---- */}
      {phase >= TYPE && (
        <div className="rb-text">
          {LINES.map((ln, i) => {
            const done = i < li;
            const active = i === li;
            const chars = done ? ln.t : active ? ln.t.slice(0, ci) : "";
            return (
              <div key={i} className={`rb-line rb-${ln.cls.split(" ").join(" rb-")}`}>
                <span className="rb-tx">
                  {[...chars].map((ch, k) => <span key={k} className="rb-ch">{ch === " " ? " " : ch}</span>)}
                </span>
                {phase === TYPE && active && <span className="rb-caret" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
