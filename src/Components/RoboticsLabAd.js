// RoboticsLabAd.jsx — Code Ninjas Woodbridge ROBOTICS.
// A high-tech HUD scene: a hovering mech-ninja floats over a 3D neon grid and
// energizes a CPU chip through animated circuit traces + weld sparks, wrapped in
// a glassmorphism heads-up display (scan-line, corner brackets, live gauges).
// EVERY line of copy is typed out in sequence with a blinking caret, then the
// whole thing loops. Copy is JS-driven (reliable); the "wow" is pure CSS.
// PORTRAIT / iPhone-first. Self-contained.
import React, { useEffect, useState } from "react";
import "../Stylesheets/RoboticsLabAd.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";

// Ordered typewriter script. spd = ms per character, pause = ms held after the line.
const SCRIPT = [
  { id: "kicker", text: "// CODE NINJAS · ROBOTICS LAB", spd: 26, pause: 260 },
  { id: "h1", text: "BUILD REAL ROBOTS.", spd: 52, pause: 170 },
  { id: "h2", text: "CODE THEM TO LIFE.", spd: 52, pause: 440 },
  { id: "sub", text: "Motors, sensors & real code — hands-on, every class.", spd: 22, pause: 520 },
  { id: "f1", text: "▹ Design & build working bots", spd: 24, pause: 110 },
  { id: "f2", text: "▹ Program in blocks + JavaScript", spd: 24, pause: 110 },
  { id: "f3", text: "▹ Sensors · motors · real logic", spd: 24, pause: 460 },
  { id: "cta", text: "▶ Book a FREE intro class", spd: 32, pause: 420 },
  { id: "contact", text: "6175 Hwy 7, Woodbridge · 647-887-9940 · cnwoodbridge.com", spd: 15, pause: 1500 },
];

export default function RoboticsLabAd() {
  const [i, setI] = useState(0); // current script line
  const [n, setN] = useState(0); // chars revealed of current line
  const [tick, setTick] = useState(0); // drives live HUD gauges

  // typewriter loop
  useEffect(() => {
    if (i >= SCRIPT.length) {
      const t = setTimeout(() => { setI(0); setN(0); }, 1400);
      return () => clearTimeout(t);
    }
    const line = SCRIPT[i];
    if (n < line.text.length) {
      const t = setTimeout(() => setN((c) => c + 1), line.spd);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setI((x) => x + 1); setN(0); }, line.pause);
    return () => clearTimeout(t);
  }, [i, n]);

  // live telemetry ticker (numbers only — all *words* go through the typewriter)
  useEffect(() => {
    const t = setInterval(() => setTick((v) => (v + 1) % 360), 90);
    return () => clearInterval(t);
  }, []);

  const shown = (id) => {
    const idx = SCRIPT.findIndex((s) => s.id === id);
    if (idx < i) return SCRIPT[idx].text;
    if (idx === i) return SCRIPT[idx].text.slice(0, n);
    return "";
  };
  const on = (id) => SCRIPT.findIndex((s) => s.id === id) === i && i < SCRIPT.length;

  const Slot = ({ id, tag: T = "span", className = "" }) => (
    <T className={`rb-slot ${className}`} data-on={on(id)}>
      {shown(id)}
      <i className="rb-caret" />
    </T>
  );

  const torque = 74 + (tick % 22);
  const power = 60 + Math.round(38 * (0.5 + 0.5 * Math.sin(tick / 12)));
  const servo = (tick * 4) % 360;

  return (
    <div className="rb-stage">
      {/* ----- background field ----- */}
      <div className="rb-vignette" />
      <div className="rb-grid" />
      <div className="rb-scan" />
      <span className="rb-corner rb-corner--tl" />
      <span className="rb-corner rb-corner--tr" />
      <span className="rb-corner rb-corner--bl" />
      <span className="rb-corner rb-corner--br" />

      {/* ----- top HUD ----- */}
      <header className="rb-top">
        <Slot id="kicker" className="rb-kicker" />
        <span className="rb-online"><i className="rb-online-dot" />SYS&nbsp;ONLINE</span>
      </header>

      {/* ----- headline ----- */}
      <div className="rb-headline">
        <Slot id="h1" tag="h1" className="rb-h1" />
        <Slot id="h2" tag="h1" className="rb-h2" />
        <Slot id="sub" tag="p" className="rb-sub" />
      </div>

      {/* ----- 3D robotics scene ----- */}
      <div className="rb-scene">
        {/* live gauges (numeric only) */}
        <div className="rb-gauges">
          <div className="rb-gauge">
            <svg viewBox="0 0 44 44" className="rb-dial">
              <circle cx="22" cy="22" r="18" className="rb-dial-track" />
              <circle cx="22" cy="22" r="18" className="rb-dial-fill"
                style={{ strokeDashoffset: 113 - (113 * torque) / 100 }} />
            </svg>
            <span className="rb-gauge-v">{torque}<i>%</i></span>
            <span className="rb-gauge-ico">⚙</span>
          </div>
          <div className="rb-bars">
            <span className="rb-bar"><i style={{ width: `${power}%` }} /></span>
            <span className="rb-bar"><i style={{ width: `${torque}%` }} /></span>
            <span className="rb-bar"><i style={{ width: `${40 + (tick % 55)}%` }} /></span>
          </div>
        </div>

        <svg className="rb-svg" viewBox="0 0 300 250" preserveAspectRatio="xMidYMid meet" aria-hidden>
          <defs>
            <linearGradient id="rb-metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2b3646" />
              <stop offset="0.5" stopColor="#141c28" />
              <stop offset="1" stopColor="#0a121c" />
            </linearGradient>
            <radialGradient id="rb-thrust" cx="0.5" cy="0" r="0.9">
              <stop offset="0" stopColor="#8ff2ff" />
              <stop offset="0.5" stopColor="#22e0ff" />
              <stop offset="1" stopColor="rgba(34,224,255,0)" />
            </radialGradient>
          </defs>

          {/* circuit traces feeding the chip */}
          <g className="rb-traces" fill="none" stroke="#123a44" strokeWidth="2">
            <path className="rb-trace" d="M60 210 H120 V180" />
            <path className="rb-trace" d="M240 210 H180 V180" />
            <path className="rb-trace" d="M150 236 V196" />
          </g>
          <g className="rb-trace-nodes" fill="#22e0ff">
            <circle cx="60" cy="210" r="3" /><circle cx="240" cy="210" r="3" /><circle cx="150" cy="236" r="3" />
          </g>

          {/* CPU chip on the grid */}
          <g className="rb-chip">
            <g stroke="#1c4a55" strokeWidth="2">
              {[124, 138, 152, 166].map((x) => <line key={"t" + x} x1={x} y1="176" x2={x} y2="168" />)}
              {[124, 138, 152, 166].map((x) => <line key={"b" + x} x1={x} y1="196" x2={x} y2="204" />)}
            </g>
            <rect x="118" y="176" width="54" height="20" rx="4" fill="#0c1420" stroke="#22e0ff" strokeWidth="1.5" />
            <rect x="118" y="176" width="54" height="20" rx="4" className="rb-chip-glow" />
            <text x="145" y="190" textAnchor="middle" className="rb-chip-tx">{"</>"}</text>
          </g>

          {/* energy beam from the mech's hand to the chip */}
          <path className="rb-beam" d="M150 150 L145 176 L150 176 L155 150 Z" fill="url(#rb-thrust)" />

          {/* ---- hovering mech-ninja ---- */}
          <g className="rb-mech">
            <ellipse className="rb-mech-shadow" cx="150" cy="228" rx="34" ry="6" />
            {/* thruster */}
            <path className="rb-thruster" d="M136 120 L164 120 L156 150 L144 150 Z" fill="url(#rb-thrust)" />
            {/* arms */}
            <g className="rb-arm-l"><rect x="96" y="70" width="14" height="34" rx="7" fill="url(#rb-metal)" stroke="#3a4a5e" /></g>
            <rect x="190" y="72" width="14" height="30" rx="7" fill="url(#rb-metal)" stroke="#3a4a5e" />
            {/* pointing hand toward chip */}
            <circle cx="150" cy="150" r="4" className="rb-hand" />
            {/* torso */}
            <rect x="108" y="58" width="84" height="62" rx="18" fill="url(#rb-metal)" stroke="#3a4a5e" strokeWidth="2" />
            {/* rotating core gear */}
            <g className="rb-gear" transform={`rotate(${servo} 150 90)`}>
              <path className="rb-gear-p" d="M150 74 l5 3 6 -1 2 6 5 4 -2 6 2 6 -5 4 -2 6 -6 -1 -5 3 -5 -3 -6 1 -2 -6 -5 -4 2 -6 -2 -6 5 -4 2 -6 6 1 z" />
              <circle cx="150" cy="90" r="7" fill="#0a121c" stroke="#22e0ff" strokeWidth="1.5" />
            </g>
            {/* head */}
            <rect x="120" y="20" width="60" height="42" rx="14" fill="url(#rb-metal)" stroke="#3a4a5e" strokeWidth="2" />
            {/* ninja headband */}
            <rect x="116" y="26" width="68" height="11" rx="3" className="rb-band" />
            <path className="rb-band" d="M182 28 L206 20 L201 36 Z" />
            <path className="rb-band rb-band--dk" d="M182 33 L207 38 L200 46 Z" />
            {/* glowing visor with scanning eye */}
            <rect x="128" y="40" width="44" height="12" rx="6" fill="#040a12" />
            <rect x="128" y="40" width="44" height="12" rx="6" className="rb-visor" />
            <rect className="rb-eye" x="132" y="43" width="10" height="6" rx="3" />
            {/* antenna */}
            <line x1="150" y1="20" x2="150" y2="8" stroke="#3a4a5e" strokeWidth="2" />
            <circle className="rb-antenna" cx="150" cy="7" r="3.5" />
          </g>

          {/* weld sparks at the chip */}
          {[0, 1, 2, 3, 4].map((k) => (
            <circle key={k} className="rb-spark" cx="145" cy="176" r="1.6"
              style={{ "--sx": `${(k - 2) * 12}px`, "--sy": `${-8 - (k % 3) * 7}px`, "--sd": `${k * 0.24}s` }} />
          ))}
        </svg>
      </div>

      {/* ----- features ----- */}
      <ul className="rb-feats">
        <li><Slot id="f1" className="rb-feat" /></li>
        <li><Slot id="f2" className="rb-feat" /></li>
        <li><Slot id="f3" className="rb-feat" /></li>
      </ul>

      {/* ----- CTA ----- */}
      <div className="rb-cta-wrap">
        <Slot id="cta" className="rb-cta" />
      </div>

      {/* ----- footer ----- */}
      <footer className="rb-foot">
        <img className="rb-foot-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
        <Slot id="contact" className="rb-contact" />
      </footer>
    </div>
  );
}
