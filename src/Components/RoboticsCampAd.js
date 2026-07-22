// RoboticsCampAd.jsx — Code Ninjas Woodbridge robotics summer-camp ad.
// Green printed-circuit-board (motherboard) theme. The camp info is the hero:
// it decodes in like a silkscreen / terminal readout printed on the board.
//   0) BOOT  — the board powers up (copper traces energize, chip core glows)
//   1) TYPE  — camp info decodes in (terminal readout)
//   2) GREET — the open-arms robot materializes over the board and hovers
import React, { useEffect, useState } from "react";
import "../Stylesheets/RoboticsCampAd.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";
import greeterImg from "../Images/robot-openarms.png";

const BOOT = 0, TYPE = 1, GREET = 2;

const LINES = [
  { t: "CODE NINJAS WOODBRIDGE",       cls: "title" },
  { t: "ROBOTICS SUMMER CAMP",         cls: "subtitle" },
  { t: "LOCATION : 6175 Hwy 7",        cls: "term" },
  { t: "WEBSITE  : cnwoodbridge.com",  cls: "term" },
  { t: "CONTACT  : 647-887-9940",      cls: "term" },
  { t: "STATUS   : NOW ENROLLING",     cls: "term status" },
];

// copper traces (viewBox 1600x900) routed in the margins around the content
const TRACES = [
  "M10 70 H230 V150 L300 220 H430",
  "M0 250 H90 V330 H240 L300 390 H420",
  "M40 800 H210 V720 L270 660 H400",
  "M60 870 H250 V820 H430 V760",
  "M1590 70 H1360 V170 L1300 230 H1180",
  "M1600 330 H1500 V250 H1360 L1300 190",
  "M1560 860 H1380 V890",
  "M820 30 H980 V110 L1050 180 H1160",
  "M1330 30 H1170 V100 H1050",
  "M300 40 H150 V120 L210 180",
  "M1600 620 H1470 V560 H1360",
];
const VIAS = [ [15,10],[22,17],[7,28],[15,36],[13,88],[22,80],[85,19],[74,19],[94,36],[85,28],[61,12],[72,20],[73,11],[97,69],[92,62],[27,72] ];
const PADS = [ [34,17],[26,43],[19,74],[66,20],[81,10],[97,20],[47,4],[95,97],[4,58] ];
const SMD  = [ {x:30,y:24,w:26,h:11},{x:20,y:63,w:11,h:26},{x:88,y:44,w:26,h:11},{x:64,y:86,w:24,h:10},{x:8,y:47,w:10,h:24} ];
const LABELS = [ {x:33,y:14,t:"R12"},{x:24,y:40,t:"C4"},{x:17,y:70,t:"J1"},{x:69,y:16,t:"U2"},{x:90,y:40,t:"L3"},{x:6,y:52,t:"D1"},{x:62,y:82,t:"Q5"} ];

// glowing current pulses that travel down the traces
export default function RoboticsCampAd() {
  const [phase, setPhase] = useState(BOOT);
  const [li, setLi] = useState(0);
  const [ci, setCi] = useState(0);

  useEffect(() => {
    if (phase !== TYPE) return;
    if (li >= LINES.length) { setPhase(GREET); return; }
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
    const t = setTimeout(() => setPhase(TYPE), 1300);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className={`rb-stage rb-p${phase}`}>
      {/* ---- green PCB ---- */}
      <div className="rb-bg" aria-hidden />
      <div className="rb-mask" aria-hidden />
      <svg className="rb-circuits" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <g className="rb-trace-base">{TRACES.map((d, i) => <path key={i} d={d} />)}</g>
        <g className="rb-trace-pulse">
          {TRACES.map((d, i) => (
            <path key={i} d={d} pathLength="240" style={{ animationDelay: `${-(i * 0.8)}s`, animationDuration: `${3.4 + (i % 4) * 0.7}s` }} />
          ))}
        </g>
      </svg>

      <div className="rb-parts" aria-hidden>
        {VIAS.map(([x, y], i) => <span key={"v" + i} className="rb-via" style={{ left: `${x}%`, top: `${y}%` }} />)}
        {PADS.map(([x, y], i) => <span key={"p" + i} className="rb-pad" style={{ left: `${x}%`, top: `${y}%` }} />)}
        {SMD.map((s, i) => <span key={"s" + i} className="rb-smd" style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}px`, height: `${s.h}px` }} />)}
        {LABELS.map((l, i) => <span key={"l" + i} className="rb-silk" style={{ left: `${l.x}%`, top: `${l.y}%` }}>{l.t}</span>)}
      </div>

      <div className="rb-hud" aria-hidden><i /><i /><i /><i /></div>

      {/* ---- CPU chip (upper-right) ---- */}
      <div className="rb-chip" aria-hidden>
        <span className="rb-pins rb-pins--t" /><span className="rb-pins rb-pins--b" />
        <span className="rb-pins rb-pins--l" /><span className="rb-pins rb-pins--r" />
        <div className="rb-chip-body">
          <span className="rb-chip-notch" />
          <div className="rb-chip-core" />
          <span className="rb-chip-label">CN·ROBOTICS</span>
        </div>
      </div>

      {/* ---- brand on an IC label plate ---- */}
      <div className="rb-logo-wrap">
        <span className="rb-hole" /><span className="rb-hole" /><span className="rb-hole" /><span className="rb-hole" />
        <img className="rb-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
      </div>

      {/* ---- text (hero, left) ---- */}
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

      {/* ---- open-arms greeter — materializes and hovers ---- */}
      {phase >= GREET && (
        <div className="rb-greeter" aria-hidden>
          <span className="rb-greet-aura" />
          <span className="rb-greet-ring" />
          <img src={greeterImg} alt="" />
          <span className="rb-greet-scan" />
        </div>
      )}
    </div>
  );
}
