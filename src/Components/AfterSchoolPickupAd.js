// AfterSchoolPickupAd.jsx — Code Ninjas Woodbridge after-school PICKUP.
// PORTRAIT / iPhone layout: a clean vertical stack — headline, then a
// top-down navigation MAP where a Code Ninjas minivan drives a vertical GPS
// route from SCHOOL (bottom) up to CODE NINJAS WOODBRIDGE (top), then an
// info card. No overlapping absolute layers; everything flows in a column.
import React, { useEffect, useState } from "react";
import "../Stylesheets/AfterSchoolPickupAd.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";

// vertical GPS route (viewBox 0 0 400 640): school (bottom) -> stops -> CN (top)
const ROUTE =
  "M 84 590 C 110 528 196 532 196 470 C 196 408 104 402 130 336 " +
  "C 154 274 312 300 312 232 C 312 178 314 140 322 110";

const STOPS = [
  { x: 196, y: 470 },
  { x: 312, y: 232 },
];

const LINES = [
  { id: "kicker", text: "// CODE NINJAS WOODBRIDGE",              cls: "mp-kicker", cps: 30, pause: 220 },
  { id: "head",   text: "AFTER-SCHOOL PICKUP",                   cls: "mp-head",   cps: 52, pause: 340 },
  { id: "tag",    text: "School pick-up, straight to code",      cls: "mp-tag",    cps: 30, pause: 500 },
];

// top-down Code Ninjas minivan (drawn pointing +x; rotate="auto" turns it)
const Minivan = () => (
  <g className="mp-van-group">
    <animateMotion dur="9s" repeatCount="indefinite" rotate="auto" calcMode="linear"
      keyPoints="0;0.30;0.30;0.62;0.62;1;1" keyTimes="0;0.26;0.39;0.60;0.73;0.96;1">
      <mpath href="#mp-route" />
    </animateMotion>
    <circle className="mp-van-pulse" r="26" fill="#e4002b" />
    <g className="mp-van">
      <ellipse cx="0" cy="3" rx="34" ry="18" fill="rgba(0,0,0,0.22)" />
      <rect x="-32" y="-17" width="64" height="34" rx="12" fill="#e4002b" stroke="#9c001d" strokeWidth="2" />
      <rect x="-25" y="-12" width="46" height="24" rx="9" fill="#c60026" />
      <path d="M20 -11 L30 -6 L30 6 L20 11 Z" fill="#20303f" />
      <rect x="-26" y="-9" width="7" height="18" rx="2.5" fill="#20303f" />
      <rect x="-16" y="-17" width="32" height="5" rx="2" fill="#26384a" />
      <rect x="-16" y="12" width="32" height="5" rx="2" fill="#26384a" />
      <g transform="translate(-2 0)">
        <circle r="6.4" fill="#14181f" />
        <rect x="-6.4" y="-2" width="12.8" height="4" rx="1.3" fill="#e9c9a6" />
      </g>
      <rect x="13" y="-20" width="10" height="6" rx="2" fill="#14181f" />
      <rect x="13" y="14" width="10" height="6" rx="2" fill="#14181f" />
      <rect x="-23" y="-20" width="10" height="6" rx="2" fill="#14181f" />
      <rect x="-23" y="14" width="10" height="6" rx="2" fill="#14181f" />
      <circle cx="31" cy="-7" r="2" fill="#fff2a8" />
      <circle cx="31" cy="7" r="2" fill="#fff2a8" />
    </g>
  </g>
);

const Pin = ({ x, y, color, scale = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx="0" cy="2" rx="8" ry="3" fill="rgba(0,0,0,0.18)" />
    <path d="M0 0 C -13 -19 -13 -33 0 -33 C 13 -33 13 -19 0 0 Z" fill={color} stroke="rgba(0,0,0,.15)" strokeWidth="1.4" />
    <circle cx="0" cy="-21" r="8.6" fill="#fff" />
    {children}
  </g>
);

export default function AfterSchoolPickupAd() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 650);
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
      {/* ---------- header ---------- */}
      <header className="mp-top">
        <Slot id="kicker" tag="p" />
        <Slot id="head" tag="h1" />
        <Slot id="tag" tag="p" />
      </header>

      {/* ---------- map ---------- */}
      <div className="mp-map-wrap">
        <svg className="mp-map" viewBox="0 0 400 640" preserveAspectRatio="xMidYMid meet" aria-hidden>
          <rect x="0" y="0" width="400" height="640" fill="#e9eef0" />
          {/* park + water + blocks */}
          <circle cx="360" cy="60" r="90" fill="#bfe0f2" />
          <rect x="24" y="360" width="150" height="150" rx="20" fill="#c7e4b6" />
          <g fill="#dfe6e2">
            <rect x="40" y="60" width="120" height="120" rx="12" />
            <rect x="250" y="120" width="120" height="120" rx="12" />
            <rect x="40" y="540" width="120" height="90" rx="12" />
            <rect x="250" y="470" width="120" height="140" rx="12" />
            <rect x="230" y="330" width="150" height="100" rx="12" />
          </g>
          {/* roads */}
          <g stroke="#cfd8d6" strokeWidth="34" strokeLinecap="round" fill="none">
            <path d="M0 220 H400" /><path d="M0 430 H400" />
            <path d="M110 0 V640" /><path d="M300 0 V640" />
          </g>
          <g stroke="#ffffff" strokeWidth="25" strokeLinecap="round" fill="none">
            <path d="M0 220 H400" /><path d="M0 430 H400" />
            <path d="M110 0 V640" /><path d="M300 0 V640" />
          </g>
          {/* GPS route */}
          <path id="mp-route" d={ROUTE} fill="none" stroke="#ffffff" strokeWidth="16" strokeLinecap="round" />
          <path d={ROUTE} fill="none" stroke="#e4002b" strokeWidth="11" strokeLinecap="round" opacity="0.95" />
          <path className="mp-route-flow" d={ROUTE} fill="none" stroke="#ffd3db" strokeWidth="11"
            strokeLinecap="round" strokeDasharray="2 30" />
          {/* pick-up stops */}
          {STOPS.map((s, i) => (
            <g key={i}>
              <circle className="mp-stop-pulse" cx={s.x} cy={s.y} r="8" fill="#0a84ff" />
              <circle cx={s.x} cy={s.y} r="8" fill="#fff" stroke="#0a84ff" strokeWidth="3.5" />
            </g>
          ))}
          {/* SCHOOL pin (bottom) */}
          <Pin x={84} y={590} color="#f59e0b">
            <g transform="translate(0 -21)">
              <path d="M-5 -1 L0 -5 L5 -1 Z" fill="#b26a00" />
              <rect x="-4" y="-1" width="8" height="6" fill="#b26a00" />
            </g>
          </Pin>
          {/* CODE NINJAS pin (top) */}
          <Pin x={322} y={110} color="#e4002b" scale={1.2}>
            <g transform="translate(0 -21)">
              <circle r="7.4" fill="#14181f" />
              <rect x="-7.4" y="-2.3" width="14.8" height="4.6" rx="1.4" fill="#e9c9a6" />
              <circle cx="-2.6" cy="0" r="1.1" fill="#14181f" />
              <circle cx="2.6" cy="0" r="1.1" fill="#14181f" />
            </g>
          </Pin>

          {/* SVG pin label (tracks the pin, never clips) */}
          <text className="mp-svglbl mp-svglbl--school" x="84" y="616" textAnchor="middle">School</text>

          <Minivan />
        </svg>

        {/* status chip (centered, fits) */}
        <div className="mp-status"><span className="mp-status-dot" /> Heading to Code Ninjas · <b>3 onboard</b></div>
      </div>

      {/* ---------- info card ---------- */}
      <div className="mp-card">
        <img className="mp-card-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
        <div className="mp-card-rows">
          <div className="mp-row"><span className="mp-ico">📍</span>6175 Hwy 7, Woodbridge</div>
          <div className="mp-row"><span className="mp-ico">📞</span>647-887-9940</div>
          <div className="mp-row mp-row--web"><span className="mp-ico">🌐</span>cnwoodbridge.com</div>
        </div>
      </div>
    </div>
  );
}
