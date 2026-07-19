// AfterSchoolPickupAd.jsx — Code Ninjas Woodbridge after-school PICKUP.
// Top-down navigation / map view: a Code Ninjas MINIVAN drives a live GPS
// route from SCHOOL, pausing at pick-up stops, to CODE NINJAS WOODBRIDGE.
// Animated route flow, current-location pulse, pin pulses + typed nav copy.
// Self-contained; the drive loops like turn-by-turn navigation.
import React, { useEffect, useState } from "react";
import "../Stylesheets/AfterSchoolPickupAd.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";

// The GPS route (SVG user units, viewBox 0 0 1200 720). School -> stops -> CN.
const ROUTE =
  "M 150 610 C 150 512 214 496 330 496 C 470 496 476 372 560 352 " +
  "C 664 328 700 236 820 236 C 958 236 986 168 1064 150";

// pins along the route
const STOPS = [
  { x: 330, y: 496, r: 9, label: "Pick-up", kind: "stop" },
  { x: 620, y: 300, r: 9, label: "Pick-up", kind: "stop" },
];

// typed navigation copy (kicker, headline, tagline)
const LINES = [
  { id: "kicker", text: "// CODE NINJAS WOODBRIDGE",                         cls: "mp-kicker", cps: 32, pause: 240 },
  { id: "head",   text: "AFTER-SCHOOL PICKUP",                              cls: "mp-head",   cps: 58, pause: 380 },
  { id: "tag",    text: "We grab your kids from school & drive them to code", cls: "mp-tag",   cps: 26, pause: 500 },
];

// top-down Code Ninjas minivan (drawn pointing +x; rotate="auto" turns it)
const Minivan = () => (
  <g className="mp-van-group">
    <animateMotion dur="9s" repeatCount="indefinite" rotate="auto"
      calcMode="linear"
      keyPoints="0;0.30;0.30;0.62;0.62;1;1"
      keyTimes="0;0.26;0.39;0.60;0.73;0.96;1">
      <mpath href="#mp-route" />
    </animateMotion>
    {/* location pulse */}
    <circle className="mp-van-pulse" r="30" fill="#e4002b" />
    <g className="mp-van">
      <ellipse cx="0" cy="4" rx="42" ry="22" fill="rgba(0,0,0,0.22)" />
      <rect x="-40" y="-21" width="80" height="42" rx="15" fill="#e4002b" stroke="#9c001d" strokeWidth="2.5" />
      <rect x="-31" y="-15" width="58" height="30" rx="11" fill="#c60026" />
      {/* windshield (front/right) + rear window (left) */}
      <path d="M25 -14 L38 -8 L38 8 L25 14 Z" fill="#20303f" />
      <rect x="-33" y="-11" width="9" height="22" rx="3" fill="#20303f" />
      {/* side windows */}
      <rect x="-20" y="-21" width="40" height="6" rx="2.5" fill="#26384a" />
      <rect x="-20" y="15" width="40" height="6" rx="2.5" fill="#26384a" />
      {/* roof rails + emblem */}
      <rect x="-26" y="-18" width="52" height="2.6" rx="1.3" fill="#7c0018" />
      <rect x="-26" y="15.4" width="52" height="2.6" rx="1.3" fill="#7c0018" />
      <g transform="translate(-2 0)">
        <circle r="8" fill="#14181f" />
        <rect x="-8" y="-2.6" width="16" height="5.2" rx="1.6" fill="#e9c9a6" />
      </g>
      {/* wheels */}
      <rect x="16" y="-25" width="12" height="7" rx="2" fill="#14181f" />
      <rect x="16" y="18" width="12" height="7" rx="2" fill="#14181f" />
      <rect x="-28" y="-25" width="12" height="7" rx="2" fill="#14181f" />
      <rect x="-28" y="18" width="12" height="7" rx="2" fill="#14181f" />
      {/* headlights */}
      <circle cx="39" cy="-9" r="2.4" fill="#fff2a8" />
      <circle cx="39" cy="9" r="2.4" fill="#fff2a8" />
    </g>
  </g>
);

// teardrop pin
const Pin = ({ x, y, color, scale = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx="0" cy="2" rx="9" ry="3.4" fill="rgba(0,0,0,0.18)" />
    <path d="M0 0 C -15 -22 -15 -38 0 -38 C 15 -38 15 -22 0 0 Z" fill={color} stroke="rgba(0,0,0,.15)" strokeWidth="1.5" />
    <circle cx="0" cy="-24" r="10" fill="#fff" />
    {children}
  </g>
);

export default function AfterSchoolPickupAd() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 700);
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
    LINES.findIndex((l) => l.id === id) === index || (done && id === "tag");
  const Slot = ({ id, tag: Tag = "span" }) => (
    <Tag className={`${LINES.find((l) => l.id === id).cls} mp-slot`} data-on={caretOn(id)}>
      {shownFor(id)}<i className="mp-caret" />
    </Tag>
  );

  return (
    <div className="mp-stage">
      {/* ================= MAP ================= */}
      <svg className="mp-map" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <rect x="0" y="0" width="1200" height="720" fill="#e9eef0" />

        {/* park + water blocks for flavor */}
        <rect x="70" y="360" width="240" height="210" rx="26" fill="#c7e4b6" />
        <circle cx="1050" cy="70" r="150" fill="#bfe0f2" />
        <g fill="#dfe6e2">
          <rect x="360" y="90" width="180" height="150" rx="14" />
          <rect x="620" y="90" width="150" height="120" rx="14" />
          <rect x="880" y="300" width="150" height="150" rx="14" />
          <rect x="120" y="120" width="150" height="150" rx="14" />
          <rect x="470" y="470" width="200" height="150" rx="14" />
          <rect x="760" y="500" width="220" height="140" rx="14" />
        </g>

        {/* road grid (casing then surface) */}
        <g stroke="#cfd8d6" strokeWidth="40" strokeLinecap="round" fill="none">
          <path d="M0 300 H1200" /><path d="M0 560 H1200" /><path d="M0 70 H1200" />
          <path d="M330 0 V720" /><path d="M600 0 V720" /><path d="M880 0 V720" />
        </g>
        <g stroke="#ffffff" strokeWidth="30" strokeLinecap="round" fill="none">
          <path d="M0 300 H1200" /><path d="M0 560 H1200" /><path d="M0 70 H1200" />
          <path d="M330 0 V720" /><path d="M600 0 V720" /><path d="M880 0 V720" />
        </g>

        {/* ---- GPS ROUTE ---- */}
        <path id="mp-route" d={ROUTE} fill="none" stroke="#ffffff" strokeWidth="18" strokeLinecap="round" />
        <path d={ROUTE} fill="none" stroke="#e4002b" strokeWidth="12" strokeLinecap="round" opacity="0.95" />
        <path className="mp-route-flow" d={ROUTE} fill="none" stroke="#ffd3db" strokeWidth="12"
          strokeLinecap="round" strokeDasharray="2 34" />

        {/* pick-up stops */}
        {STOPS.map((s, i) => (
          <g key={i}>
            <circle className="mp-stop-pulse" cx={s.x} cy={s.y} r={s.r} fill="#0a84ff" />
            <circle cx={s.x} cy={s.y} r={s.r} fill="#fff" stroke="#0a84ff" strokeWidth="4" />
          </g>
        ))}

        {/* SCHOOL pin (start) */}
        <Pin x={150} y={610} color="#f59e0b">
          <g transform="translate(0 -24)">
            <path d="M-6 -1 L0 -6 L6 -1 Z" fill="#b26a00" />
            <rect x="-5" y="-1" width="10" height="7" fill="#b26a00" />
          </g>
        </Pin>

        {/* CODE NINJAS pin (destination) */}
        <Pin x={1064} y={150} color="#e4002b" scale={1.25}>
          <g transform="translate(0 -24)">
            <circle r="8.5" fill="#14181f" />
            <rect x="-8.5" y="-2.6" width="17" height="5.2" rx="1.6" fill="#e9c9a6" />
            <circle cx="-3" cy="0" r="1.3" fill="#14181f" />
            <circle cx="3" cy="0" r="1.3" fill="#14181f" />
          </g>
        </Pin>

        {/* the minivan drives the route */}
        <Minivan />
      </svg>

      {/* soft vignette for overlay contrast */}
      <div className="mp-vignette" aria-hidden />

      {/* ================= OVERLAYS ================= */}
      {/* top nav status */}
      <div className="mp-nav">
        <span className="mp-nav-dot" />
        <div className="mp-nav-txt">
          <b>PICK-UP IN PROGRESS</b>
          <span>Next stop · Code Ninjas Woodbridge</span>
        </div>
        <div className="mp-nav-eta"><b>3</b><span>ninjas<br/>onboard</span></div>
      </div>

      {/* labels near pins */}
      <div className="mp-tag-school">SCHOOL</div>
      <div className="mp-tag-cn"><img src={cnLogo} alt="Code Ninjas Woodbridge" /></div>

      {/* headline block */}
      <div className="mp-headline">
        <Slot id="kicker" tag="p" />
        <Slot id="head" tag="h1" />
        <Slot id="tag" tag="p" />
      </div>

      {/* trip / destination card */}
      <div className="mp-card">
        <div className="mp-card-route">
          <span className="mp-dot mp-dot--a" /> School
          <span className="mp-line" />
          <span className="mp-dot mp-dot--b" /> Code Ninjas Woodbridge
        </div>
        <div className="mp-card-info">
          <div className="mp-info"><span className="mp-i-ico">📍</span>6175 Hwy 7, Woodbridge</div>
          <div className="mp-info"><span className="mp-i-ico">📞</span>647-887-9940</div>
          <div className="mp-info mp-info--web"><span className="mp-i-ico">🌐</span>cnwoodbridge.com</div>
        </div>
      </div>
    </div>
  );
}
