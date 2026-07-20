// RobotHeadAd.jsx — Code Ninjas Woodbridge ROBOTICS.
// Sequenced reveal, looping:
//   1. the 🤖 robot head floats up from the bottom at ~80% width,
//   2. reaches center and shrinks 2x,
//   3. the logo flickers in holographically ABOVE the robot,
//   4. "WOODBRIDGE" + robotics info type in under the logo,
//   5. address / website / phone type in BELOW the robot head.
// The robot's float+shrink is CSS (replayed each cycle via key); the phase
// timing and all typing are orchestrated in JS. PORTRAIT / iPhone-first.
import React, { useEffect, useState } from "react";
import "../Stylesheets/RobotHeadAd.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";

// typed AFTER the robot settles. spd = ms/char, pause = ms held after the line.
const SCRIPT = [
  { id: "woodbridge", text: "WOODBRIDGE", spd: 58, pause: 380 },
  { id: "prog", text: "ROBOTICS PROGRAM", spd: 44, pause: 240 },
  { id: "tag", text: "Build · code · control real robots", spd: 22, pause: 520 },
  { id: "addr", text: "📍  6175 Hwy 7, Woodbridge", spd: 26, pause: 200 },
  { id: "web", text: "🌐  cnwoodbridge.com", spd: 28, pause: 200 },
  { id: "phone", text: "📞  647-887-9940", spd: 28, pause: 1500 },
];

const ENTER_MS = 2600;   // robot float + shrink duration (matches CSS)
const LOGO_AT = 2200;    // holographic logo flickers in as the robot settles
const TYPE_AT = 3200;    // typing begins after the logo appears

export default function RobotHeadAd() {
  const [cycle, setCycle] = useState(0);
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [typing, setTyping] = useState(false);
  const [logoIn, setLogoIn] = useState(false);

  // phase orchestration — resets and re-arms every cycle
  useEffect(() => {
    setI(0); setN(0); setTyping(false); setLogoIn(false);
    const t1 = setTimeout(() => setLogoIn(true), LOGO_AT);
    const t2 = setTimeout(() => setTyping(true), TYPE_AT);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [cycle]);

  // typewriter
  useEffect(() => {
    if (!typing) return;
    if (i >= SCRIPT.length) {
      const t = setTimeout(() => setCycle((c) => c + 1), 1600);
      return () => clearTimeout(t);
    }
    const line = SCRIPT[i];
    if (n < line.text.length) {
      const t = setTimeout(() => setN((c) => c + 1), line.spd);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setI((x) => x + 1); setN(0); }, line.pause);
    return () => clearTimeout(t);
  }, [i, n, typing]);

  const shown = (id) => {
    const idx = SCRIPT.findIndex((s) => s.id === id);
    if (idx < i) return SCRIPT[idx].text;
    if (idx === i) return SCRIPT[idx].text.slice(0, n);
    return "";
  };
  const on = (id) => typing && SCRIPT.findIndex((s) => s.id === id) === i && i < SCRIPT.length;

  const Slot = ({ id, tag: T = "span", className = "" }) => (
    <T className={`rh-slot ${className}`} data-on={on(id)}>
      {shown(id)}<i className="rh-caret" />
    </T>
  );

  return (
    <div className="rh-stage">
      <div className="rh-grid" />

      {/* robot head layer — absolute so its size never pushes the text */}
      <div className="rh-robot-layer">
        <div className="rh-halo" />
        <div className="rh-halo rh-halo--2" />
        <div className="rh-robot-hover">
          <span className="rh-robot" key={cycle} role="img" aria-label="robot head">🤖</span>
        </div>
      </div>

      {/* ABOVE the robot: holographic logo + WOODBRIDGE + robotics info */}
      <header className="rh-top">
        <span className={`rh-logo-wrap ${logoIn ? "rh-in" : ""}`} key={"logo" + cycle}>
          <img className="rh-logo" src={cnLogo} alt="Code Ninjas" />
        </span>
        <Slot id="woodbridge" tag="h2" className="rh-woodbridge" />
        <Slot id="prog" tag="h1" className="rh-prog" />
        <Slot id="tag" tag="p" className="rh-tag" />
      </header>

      <div className="rh-spacer" />

      {/* BELOW the robot: address, website, phone */}
      <footer className="rh-bottom">
        <Slot id="addr" className="rh-info" />
        <Slot id="web" className="rh-info rh-info--web" />
        <Slot id="phone" className="rh-info" />
      </footer>
    </div>
  );
}
