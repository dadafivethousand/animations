// RobotBuilderAd.jsx — Code Ninjas Woodbridge ROBOTICS.
// The 🤖 robot emoji is the focal point: huge, centered, glowing and bobbing,
// with 🦾 mechanical-arm emoji as its two hands that "build" — raising and
// lowering in alternation, tossing a spinning ⚙️ and ✨ sparks, then both hands
// throw up in a celebration beat. All copy types out with a caret, then loops.
// PORTRAIT / iPhone-first. Self-contained.
import React, { useEffect, useState } from "react";
import "../Stylesheets/RobotBuilderAd.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";

const SCRIPT = [
  { id: "kicker", text: "// CODE NINJAS · ROBOTICS", spd: 26, pause: 300 },
  { id: "h1", text: "BUILD YOUR OWN ROBOT.", spd: 48, pause: 460 },
  { id: "sub", text: "Real bots. Real code. Real fun — every class.", spd: 24, pause: 560 },
  { id: "cta", text: "▶ Book a FREE intro class", spd: 32, pause: 460 },
  { id: "contact", text: "6175 Hwy 7, Woodbridge · 647-887-9940 · cnwoodbridge.com", spd: 15, pause: 1500 },
];

export default function RobotBuilderAd() {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);

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

  const shown = (id) => {
    const idx = SCRIPT.findIndex((s) => s.id === id);
    if (idx < i) return SCRIPT[idx].text;
    if (idx === i) return SCRIPT[idx].text.slice(0, n);
    return "";
  };
  const on = (id) => SCRIPT.findIndex((s) => s.id === id) === i && i < SCRIPT.length;

  const Slot = ({ id, tag: T = "span", className = "" }) => (
    <T className={`rw-slot ${className}`} data-on={on(id)}>
      {shown(id)}<i className="rw-caret" />
    </T>
  );

  return (
    <div className="rw-stage">
      <div className="rw-grid" />

      <header className="rw-top">
        <Slot id="kicker" className="rw-kicker" />
      </header>

      <div className="rw-headline">
        <Slot id="h1" tag="h1" className="rw-h1" />
      </div>

      {/* ---------- FOCAL POINT: the robot + its hands ---------- */}
      <div className="rw-scene">
        <div className="rw-robot-wrap">
          <div className="rw-halo" />
          <div className="rw-halo rw-halo--2" />

          {/* what the hands are building */}
          <span className="rw-gear" role="img" aria-label="gear">⚙️</span>
          <span className="rw-spark rw-spark--1">✨</span>
          <span className="rw-spark rw-spark--2">⚡</span>
          <span className="rw-spark rw-spark--3">🔩</span>

          {/* the star */}
          <span className="rw-robot" role="img" aria-label="robot">🤖</span>

          {/* mechanical hands */}
          <span className="rw-hand rw-hand--l" role="img" aria-label="mechanical arm">🦾</span>
          <span className="rw-hand rw-hand--r" role="img" aria-label="mechanical arm">🦾</span>
        </div>
      </div>

      <div className="rw-sub-wrap">
        <Slot id="sub" tag="p" className="rw-sub" />
      </div>

      <div className="rw-cta-wrap">
        <Slot id="cta" className="rw-cta" />
      </div>

      <footer className="rw-foot">
        <img className="rw-foot-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
        <Slot id="contact" className="rw-contact" />
      </footer>
    </div>
  );
}
