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

// copper traces (viewBox 1600x900) with 45° bends. Kept OUT of the plaque
// (top-left) and the info panel (lower-left) — routed dense elsewhere.
const TRACES = [
  // top band
  "M600 40 H760 L810 100 H960 L1010 60 H1180",
  "M840 30 H980 L1040 90 H1180 L1240 60 H1440",
  "M1330 30 H1180 L1130 90 H1010",
  "M1600 130 H1470 L1410 70 H1280",
  "M980 300 H1120 L1170 360 H1330 L1380 320 H1520",
  // right side
  "M1600 240 H1470 L1410 180 H1250 L1200 240 H1090",
  "M1600 440 H1500 L1450 380 H1320 L1270 440 H1160",
  "M1600 620 H1460 L1400 680 H1250 L1200 620 H1120",
  "M1560 850 H1360 L1300 790 H1180",
  // bottom-center / right
  "M980 770 H1140 L1200 830 H1360",
  "M900 880 H1080 L1140 820 H1300 L1350 880 H1520",
  "M1040 620 H1180 L1230 690 H1400",
  // left edge
  "M0 250 H60 L100 290", "M0 470 H50", "M0 690 H70 L110 650",
  // parallel data bus (top-right)
  "M1000 120 H1210 L1268 178 H1470", "M1000 133 H1203 L1261 191 H1463", "M1000 146 H1196 L1254 204 H1456",
  // parallel data bus (bottom-right)
  "M1050 700 H1250 L1308 760 H1510", "M1050 713 H1243 L1301 773 H1503", "M1050 726 H1236 L1294 786 H1496",
];
const VIAS = [ [92,23],[78,23],[75,17],[97,48],[82,41],[91,68],[78,74],[74,90],[63,12],[72,20],[86,10],[55,7],[66,80],[72,93],[89,84],[2,28],[2,52],[2,77],[68,40],[95,34] ];
const SOLDER = [ [66,10],[72,17],[95,68],[62,73],[88,44],[70,34],[97,78],[60,86] ];
const CAPS = [ {x:76,y:15,r:34}, {x:91,y:53,r:26}, {x:65,y:66,r:22}, {x:70,y:30,r:20} ];
const SILK = [ {x:70,y:9,t:"C1"},{x:96,y:41,t:"L4"},{x:59,y:63,t:"U3"},{x:73,y:70,t:"D2"},{x:83,y:80,t:"Q8"},{x:63,y:36,t:"R7"},{x:90,y:19,t:"C4"},{x:52,y:6,t:"J2"} ];
const SMD = [ {x:88,y:47,w:26,h:11},{x:62,y:88,w:24,h:10},{x:97,y:20,w:11,h:26},{x:47,y:6,w:24,h:10},{x:68,y:52,w:22,h:10} ];
// glowing activity LEDs at trace ends (green, staggered pulse)
const LEDS = [ [63,12],[97,48],[66,80],[55,7],[89,84],[68,40],[95,34],[72,93] ];

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
          <linearGradient id="rb-mask" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3f9060" /><stop offset=".45" stopColor="#1f5e3c" /><stop offset="1" stopColor="#0c3823" />
          </linearGradient>
        </defs>
        <g className="rb-tr-shadow">{TRACES.map((d, i) => <path key={i} d={d} />)}</g>
        <g className="rb-tr-cu">{TRACES.map((d, i) => <path key={i} d={d} />)}</g>
        <g className="rb-tr-hi">{TRACES.map((d, i) => <path key={i} d={d} />)}</g>
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
        {LEDS.map(([x, y], i) => <span key={"e" + i} className="rb-led" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${-(i * 0.5)}s` }} />)}
        {/* small SOIC chip */}
        <span className="rb-soic"><b /><b /></span>
        {/* gold edge-connector fingers */}
        <span className="rb-fingers">{Array.from({ length: 12 }).map((_, i) => <i key={i} />)}</span>
      </div>

      {/* realistic QFP chip */}
      <div className="rb-qfp" aria-hidden>
        <span className="rb-qfp-silk" />
        <span className="rb-qfp-pins rb-qfp-pins--t" /><span className="rb-qfp-pins rb-qfp-pins--b" />
        <span className="rb-qfp-pins rb-qfp-pins--l" /><span className="rb-qfp-pins rb-qfp-pins--r" />
        <div className="rb-qfp-body">
          <span className="rb-qfp-dot" />
          <span className="rb-qfp-glint" />
          <span className="rb-qfp-etch">CN-2600<br />ROBOTICS</span>
        </div>
      </div>

      <div className="rb-hud" aria-hidden><i /><i /><i /><i /></div>

      {/* ---- brand column: plaque + info panel share one fixed width ---- */}
      <div className="rb-brand-col">
      <div className="rb-plaque">
        <span className="rb-screw" /><span className="rb-screw" /><span className="rb-screw" /><span className="rb-screw" />
        <span className="rb-plaque-gloss" aria-hidden />
        <img className="rb-plaque-logo" src={plaqueLogo} alt="Code Ninjas Woodbridge" />
      </div>

      {/* ---- hero details — the frame boots in first, text types in after ---- */}
      <div className="rb-text">
        {LINES.map((ln, i) => {
          const started = phase >= TYPE;
          const done = started && i < li;
          const active = started && i === li;
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
      </div>
    </div>
  );
}
