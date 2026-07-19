// AfterSchoolPickupAd.jsx — Code Ninjas Woodbridge after-school PICKUP program.
// A branded Code Ninjas car drives from the SCHOOL (left), picks up ninja
// kids, and drops them at CODE NINJAS WOODBRIDGE (right): wheels spin, car
// bobs, exhaust puffs, road dashes scroll. Every line of copy is typed out
// in sequence with a blinking caret. Self-contained; the drive loops.
import React, { useEffect, useState } from "react";
import "../Stylesheets/AfterSchoolPickupAd.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";

// Ordered typewriter script — each line types once, in order, into its slot.
const LINES = [
  { id: "kicker", text: "// CODE NINJAS WOODBRIDGE",             cls: "pk-kicker", cps: 32, pause: 240 },
  { id: "head",   text: "AFTER-SCHOOL PICKUP",                  cls: "pk-head",   cps: 60, pause: 400 },
  { id: "tag",    text: "We pick up · They code · You relax",   cls: "pk-tag",    cps: 34, pause: 360 },
  { id: "f1",     text: "> We grab your kids right from school", cls: "pk-feat",  cps: 24, pause: 150 },
  { id: "f2",     text: "> Safe ride to Code Ninjas Woodbridge", cls: "pk-feat",  cps: 24, pause: 150 },
  { id: "f3",     text: "> They build, code & game till pickup", cls: "pk-feat",  cps: 24, pause: 380 },
  { id: "web",    text: "cnwoodbridge.com",                     cls: "pk-c-web",  cps: 30, pause: 170 },
  { id: "phone",  text: "647-887-9940",                         cls: "pk-c-item", cps: 30, pause: 170 },
  { id: "addr",   text: "6175 Hwy 7, Woodbridge",               cls: "pk-c-item", cps: 28, pause: 900 },
];

// small chibi ninja head (passenger / waiting kid)
const NinjaHead = ({ x = 0, y = 0, s = 1, cls = "" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} className={cls}>
    <path d="M-6 -14 L-20 -20 L-10 -6 Z" fill="#12161d" />
    <path d="M-4 -18 L-16 -30 L-4 -20 Z" fill="#12161d" />
    <circle cx="0" cy="0" r="16" fill="#14181f" />
    <rect x="-16" y="-6" width="32" height="11" rx="3" fill="#e9c9a6" />
    <circle cx="-6" cy="0" r="2.2" fill="#12161d" />
    <circle cx="6" cy="0" r="2.2" fill="#12161d" />
  </g>
);

// the Code Ninjas car (faces right)
function CnCar() {
  return (
    <div className="pk-car">
      <div className="pk-car-bob">
        <div className="pk-speed" aria-hidden>
          <span /><span /><span />
        </div>
        <div className="pk-exhaust" aria-hidden><span /><span /><span /></div>
        <svg className="pk-car-svg" viewBox="0 0 380 210" aria-hidden>
          <defs>
            <linearGradient id="pk-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff3b52" />
              <stop offset="0.55" stopColor="#e4002b" />
              <stop offset="1" stopColor="#b00021" />
            </linearGradient>
            <linearGradient id="pk-glass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#bfeaff" />
              <stop offset="1" stopColor="#5fb8e6" />
            </linearGradient>
          </defs>

          {/* body */}
          <path
            d="M22,150 Q22,120 58,116 L120,116 L156,74 Q164,66 178,66 L250,66
               Q266,66 276,80 L304,116 L338,120 Q360,124 360,150 L360,166
               Q360,182 344,182 L52,182 Q22,182 22,166 Z"
            fill="url(#pk-body)" stroke="#8f001c" strokeWidth="3" />
          {/* cabin glass */}
          <path d="M150,112 L168,80 Q172,74 182,74 L210,74 L210,112 Z" fill="url(#pk-glass)" />
          <path d="M222,74 L248,74 Q260,74 268,86 L288,112 L222,112 Z" fill="url(#pk-glass)" />
          {/* pillar */}
          <rect x="211" y="74" width="10" height="40" fill="#b00021" />

          {/* passengers (ninja kids) */}
          <NinjaHead x={186} y={98} s={0.82} />
          <NinjaHead x={252} y={100} s={0.78} />

          {/* door emblem: ninja mask */}
          <g transform="translate(120 150)">
            <circle r="20" fill="#14181f" />
            <rect x="-20" y="-6" width="40" height="12" rx="3" fill="#e9c9a6" />
            <circle cx="-7" cy="0" r="2.6" fill="#14181f" />
            <circle cx="7" cy="0" r="2.6" fill="#14181f" />
          </g>
          <text x="196" y="156" className="pk-car-word">CODE NINJAS</text>

          {/* lights */}
          <circle cx="352" cy="140" r="7" fill="#fff2a8" className="pk-headlight" />
          <rect x="24" y="132" width="8" height="16" rx="3" fill="#ffb3bd" />

          {/* wheels */}
          <g className="pk-wheel" style={{ transformOrigin: "104px 176px" }}>
            <circle cx="104" cy="176" r="34" fill="#15181d" />
            <circle cx="104" cy="176" r="15" fill="#c9d2dd" />
            <circle cx="104" cy="176" r="5" fill="#2b3340" />
            <rect x="101" y="150" width="6" height="52" fill="#8b95a3" />
            <rect x="78" y="173" width="52" height="6" fill="#8b95a3" />
          </g>
          <g className="pk-wheel" style={{ transformOrigin: "284px 176px" }}>
            <circle cx="284" cy="176" r="34" fill="#15181d" />
            <circle cx="284" cy="176" r="15" fill="#c9d2dd" />
            <circle cx="284" cy="176" r="5" fill="#2b3340" />
            <rect x="281" y="150" width="6" height="52" fill="#8b95a3" />
            <rect x="258" y="173" width="52" height="6" fill="#8b95a3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function AfterSchoolPickupAd() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started || done) return;
    const line = LINES[index];
    if (!line) { setDone(true); return; }
    if (chars < line.text.length) {
      const t = setTimeout(() => setChars((c) => c + 1), line.cps);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setIndex((i) => i + 1); setChars(0); }, line.pause);
    return () => clearTimeout(t);
  }, [started, index, chars, done]);

  const shownFor = (id) => {
    const i = LINES.findIndex((l) => l.id === id);
    if (i < index) return LINES[i].text;
    if (i === index) return LINES[i].text.slice(0, chars);
    return "";
  };
  const caretOn = (id) =>
    LINES.findIndex((l) => l.id === id) === index || (done && id === "addr");

  const Slot = ({ id, tag: Tag = "span" }) => (
    <Tag className={`${LINES.find((l) => l.id === id).cls} pk-slot`} data-on={caretOn(id)}>
      {shownFor(id)}
      <i className="pk-caret" />
    </Tag>
  );

  return (
    <div className="pk-stage">
      {/* ================= SCENE ================= */}
      <div className="pk-scene">
        <div className="pk-sun" aria-hidden />
        <div className="pk-cloud pk-cloud--1" aria-hidden />
        <div className="pk-cloud pk-cloud--2" aria-hidden />
        <div className="pk-hills" aria-hidden />

        {/* SCHOOL (left) */}
        <div className="pk-school">
          <div className="pk-pin pk-pin--school">PICK-UP</div>
          <div className="pk-school-roof" />
          <div className="pk-school-body">
            <div className="pk-flag" />
            <span className="pk-school-sign">SCHOOL</span>
            <div className="pk-windows"><i /><i /><i /><i /></div>
            <div className="pk-door" />
          </div>
          {/* waiting ninja kids */}
          <svg className="pk-kids" viewBox="0 0 120 90" aria-hidden>
            <g className="pk-wave"><NinjaHead x={26} y={44} s={1} />
              <rect x="20" y="58" width="12" height="26" rx="5" fill="#14181f" /></g>
            <g><NinjaHead x={64} y={48} s={0.9} />
              <rect x="59" y="60" width="11" height="24" rx="5" fill="#14181f" /></g>
          </svg>
        </div>

        {/* CODE NINJAS WOODBRIDGE (right) */}
        <div className="pk-cn">
          <div className="pk-pin pk-pin--cn">DROP-OFF</div>
          <div className="pk-cn-building">
            <img className="pk-cn-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
            <div className="pk-cn-door" />
            <div className="pk-cn-glow" />
          </div>
        </div>

        {/* road + car */}
        <div className="pk-road">
          <div className="pk-lane" aria-hidden />
        </div>
        <CnCar />
      </div>

      {/* ================= INFO PANEL ================= */}
      <div className="pk-panel">
        <Slot id="kicker" tag="p" />
        <Slot id="head" tag="h1" />
        <div className="pk-underline" aria-hidden />
        <Slot id="tag" tag="p" />
        <ul className="pk-feats">
          <li><Slot id="f1" /></li>
          <li><Slot id="f2" /></li>
          <li><Slot id="f3" /></li>
        </ul>
        <div className="pk-console">
          <Slot id="web" tag="span" />
          <span className="pk-c-sep" aria-hidden>›</span>
          <Slot id="phone" tag="span" />
          <span className="pk-c-sep" aria-hidden>›</span>
          <Slot id="addr" tag="span" />
        </div>
      </div>
    </div>
  );
}
