// RoboticsProgramAd.jsx — Code Ninjas Woodbridge ROBOTICS PROGRAM ad.
// Dark robotics-lab scene. Two articulated robot arms swing in and idle while
// the logo powers on and EVERY line of copy is typed out in sequence with a
// blinking caret. Turning gears, circuit traces, scanlines and weld sparks
// keep the scene alive. Self-contained; loops after a hold.
import React, { useEffect, useRef, useState } from "react";
import "../Stylesheets/RoboticsProgramAd.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";

// Ordered typewriter script. Each line types once, in order, into its slot.
// cps = ms per character, pause = ms to hold before the next line starts.
const LINES = [
  { id: "kicker",  text: "// CODE NINJAS WOODBRIDGE",        cls: "rb-kicker",  cps: 34, pause: 260 },
  { id: "head",    text: "ROBOTICS PROGRAM",                 cls: "rb-head",    cps: 70, pause: 420 },
  { id: "tag",     text: "Build · Program · Compete",        cls: "rb-tag",     cps: 40, pause: 420 },
  { id: "f1",      text: "> Assemble real working robots",   cls: "rb-feat",    cps: 26, pause: 160 },
  { id: "f2",      text: "> Motors, sensors & smart logic",  cls: "rb-feat",    cps: 26, pause: 160 },
  { id: "f3",      text: "> Kids code them to move & think", cls: "rb-feat",    cps: 26, pause: 420 },
  { id: "web",     text: "cnwoodbridge.com",                 cls: "rb-c-web",   cps: 32, pause: 180 },
  { id: "phone",   text: "647-887-9940",                     cls: "rb-c-item",  cps: 32, pause: 180 },
  { id: "addr",    text: "6175 Hwy 7, Woodbridge",           cls: "rb-c-item",  cps: 30, pause: 900 },
];

// floating binary / circuit glyphs behind the scene
const PARTICLES = ["1010", "01", "</>", "{}", "0x1F", "10", "011", "AI", "//", "1101"].map(
  (t, i) => ({
    t,
    x: (i * 41 + 5) % 96,
    dur: 12 + (i % 5) * 2.4,
    delay: -((i * 2.3) % 15),
    size: 0.85 + (i % 4) * 0.28,
  })
);

// One articulated robot arm (base → shoulder → forearm → gripper), mirrored per side.
function RobotArm({ side }) {
  return (
    <svg className={`rb-arm rb-arm--${side}`} viewBox="0 0 260 380" aria-hidden>
      <defs>
        <linearGradient id={`metal-${side}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e8eef6" />
          <stop offset="0.35" stopColor="#aeb9c9" />
          <stop offset="0.65" stopColor="#7c8798" />
          <stop offset="1" stopColor="#4b5462" />
        </linearGradient>
        <linearGradient id={`seg-${side}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5b6572" />
          <stop offset="0.5" stopColor="#cdd6e2" />
          <stop offset="1" stopColor="#5b6572" />
        </linearGradient>
      </defs>

      {/* base */}
      <g className="rb-base">
        <rect x="70" y="352" width="120" height="24" rx="6" fill={`url(#metal-${side})`} />
        <rect x="86" y="338" width="88" height="20" rx="5" fill="#3a4250" />
        <circle cx="130" cy="348" r="4" fill="#22d3ee" className="rb-led" />
      </g>

      {/* shoulder pivots the whole arm */}
      <g className="rb-shoulder">
        {/* upper arm */}
        <rect x="116" y="196" width="28" height="150" rx="12" fill={`url(#seg-${side})`} />
        <rect x="122" y="210" width="16" height="120" rx="8" fill="#2b3340" opacity="0.5" />
        <circle cx="130" cy="344" r="15" fill={`url(#metal-${side})`} />
        <circle cx="130" cy="344" r="6" fill="#0b1220" />

        {/* elbow pivots forearm + gripper */}
        <g className="rb-elbow">
          <circle cx="130" cy="200" r="17" fill={`url(#metal-${side})`} />
          <circle cx="130" cy="200" r="7" fill="#0b1220" />
          {/* forearm */}
          <rect x="119" y="70" width="22" height="138" rx="10" fill={`url(#seg-${side})`} />
          {/* hydraulic piston */}
          <line x1="150" y1="196" x2="150" y2="120" className="rb-piston" />

          {/* wrist + gripper */}
          <g className="rb-wrist">
            <circle cx="130" cy="74" r="13" fill={`url(#metal-${side})`} />
            <circle cx="130" cy="74" r="5" fill="#0b1220" />
            <g className="rb-claw rb-claw--a">
              <path d="M130 66 L112 40 L120 34 L134 60 Z" fill={`url(#metal-${side})`} />
            </g>
            <g className="rb-claw rb-claw--b">
              <path d="M130 66 L148 40 L140 34 L126 60 Z" fill={`url(#metal-${side})`} />
            </g>
            {/* weld spark at the tip */}
            <g className="rb-spark">
              <circle cx="130" cy="40" r="3" fill="#fff6cf" />
              <line x1="130" y1="40" x2="130" y2="26" />
              <line x1="130" y1="40" x2="118" y2="32" />
              <line x1="130" y1="40" x2="142" y2="32" />
              <line x1="130" y1="40" x2="122" y2="50" />
              <line x1="130" y1="40" x2="138" y2="50" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

const Gear = ({ cls, teeth = 8 }) => (
  <svg className={`rb-gear ${cls}`} viewBox="0 0 100 100" aria-hidden>
    {Array.from({ length: teeth }).map((_, i) => (
      <rect
        key={i}
        x="46" y="2" width="8" height="18" rx="2" fill="currentColor"
        transform={`rotate(${(360 / teeth) * i} 50 50)`}
      />
    ))}
    <circle cx="50" cy="50" r="30" fill="currentColor" />
    <circle cx="50" cy="50" r="12" fill="#0b1220" />
  </svg>
);

export default function RoboticsProgramAd() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0); // which line is typing
  const [chars, setChars] = useState(0); // chars typed in current line
  const [done, setDone] = useState(false);
  const rootRef = useRef(null);

  // hold before typing so the arms swing in and the logo powers on
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 1700);
    return () => clearTimeout(t);
  }, []);

  // sequential typewriter across all LINES
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

  // text typed so far for a given line id (+ caret on the active line)
  const shownFor = (id) => {
    const i = LINES.findIndex((l) => l.id === id);
    if (i < index) return LINES[i].text;
    if (i === index) return LINES[i].text.slice(0, chars);
    return "";
  };
  const isActive = (id) => LINES.findIndex((l) => l.id === id) === index;
  // caret rests on the last line once everything is typed
  const caretOn = (id) => isActive(id) || (done && id === "addr");

  const Slot = ({ id, tag: Tag = "span" }) => (
    <Tag className={`${LINES.find((l) => l.id === id).cls} rb-slot`} data-on={caretOn(id)}>
      {shownFor(id)}
      <i className="rb-caret" />
    </Tag>
  );

  return (
    <div className={`rb-stage${started ? " is-typing" : ""}`} ref={rootRef}>
      {/* ambient tech background */}
      <div className="rb-grid" aria-hidden />
      <div className="rb-scan" aria-hidden />
      <div className="rb-glow" aria-hidden />
      <div className="rb-particles" aria-hidden>
        {PARTICLES.map((p, i) => (
          <span key={i} style={{ left: `${p.x}%`, fontSize: `${p.size}rem`,
            animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}>{p.t}</span>
        ))}
      </div>

      {/* turning gears */}
      <Gear cls="rb-gear--1" teeth={9} />
      <Gear cls="rb-gear--2" teeth={7} />

      {/* robot arms flank the scene */}
      <RobotArm side="left" />
      <RobotArm side="right" />

      {/* content */}
      <div className="rb-body">
        <Slot id="kicker" tag="p" />
        <img className="rb-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
        <Slot id="head" tag="h1" />
        <div className="rb-underline" aria-hidden />
        <Slot id="tag" tag="p" />

        <ul className="rb-feats">
          <li><Slot id="f1" /></li>
          <li><Slot id="f2" /></li>
          <li><Slot id="f3" /></li>
        </ul>

        <div className="rb-console">
          <Slot id="web" tag="span" />
          <span className="rb-c-sep" aria-hidden>▚</span>
          <Slot id="phone" tag="span" />
          <span className="rb-c-sep" aria-hidden>▚</span>
          <Slot id="addr" tag="span" />
        </div>
      </div>
    </div>
  );
}
