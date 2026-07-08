// BeltJourney.jsx — Code Ninjas belt-progression promo clip.
// A ninja climbs the belts white -> black, each flashing a skill unlocked,
// then a black-belt finale with a CTA. Self-contained, loops.
import React, { useEffect, useState } from "react";
import "../Stylesheets/BeltJourney.css";
import ninja from "../Images/ninja-cheer.png";
import logo from "../Images/cn-wb-logo.png";

const BELTS = [
  { name: "WHITE",  color: "#eef1f4", ink: "#12314a", skill: "Build your very first game" },
  { name: "YELLOW", color: "#f7d20a", ink: "#5a4600", skill: "Loops & variables" },
  { name: "ORANGE", color: "#ef7d21", ink: "#5a2c00", skill: "Game physics & motion" },
  { name: "GREEN",  color: "#33aa44", ink: "#eafff0", skill: "Write real JavaScript" },
  { name: "BLUE",   color: "#2f7bff", ink: "#eaf2ff", skill: "3D worlds & design" },
  { name: "PURPLE", color: "#8b46d6", ink: "#f5eaff", skill: "AI & game logic" },
  { name: "BROWN",  color: "#7a4a24", ink: "#ffeede", skill: "Advanced game dev" },
  { name: "RED",    color: "#e23636", ink: "#ffeaea", skill: "Build a mobile app" },
  { name: "BLACK",  color: "#171717", ink: "#ffd42f", skill: "Publish your own game" },
];

// steps 0..8 = belts, 9 = finale
const DUR = [1250, 1150, 1150, 1150, 1150, 1150, 1150, 1150, 2000, 4200];

export default function BeltJourney() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setTimeout(
      () => setStep((s) => (s + 1) % (BELTS.length + 1)),
      DUR[step] ?? 1200
    );
    return () => clearTimeout(t);
  }, [step]);

  const isFinale = step >= BELTS.length;
  const belt = BELTS[Math.min(step, BELTS.length - 1)];

  return (
    <div className={`bj-stage${isFinale ? " bj-finale-on" : ""}`}>
      <div className="bj-bg" />
      <div className="bj-blob bj-blob--1" />
      <div className="bj-blob bj-blob--2" />
      <div className="bj-blob bj-blob--3" />
      {/* drifting soft shapes */}
      <div className="bj-shapes" aria-hidden>
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            className={i % 3 === 0 ? "sq" : ""}
            style={{
              left: `${(i * 47 + 5) % 96}%`,
              animationDelay: `${(i * 0.7) % 8 - 8}s`,
              animationDuration: `${8 + (i % 5)}s`,
              width: `${8 + (i % 3) * 6}px`,
              height: `${8 + (i % 3) * 6}px`,
            }}
          />
        ))}
      </div>

      {/* logo */}
      <img className="bj-logo" src={logo} alt="Code Ninjas Woodbridge" />

      {!isFinale ? (
        <>
          <div className="bj-kicker">THE&nbsp;NINJA&nbsp;JOURNEY</div>

          {/* belt name + belt graphic + skill, replays on each step */}
          <div key={step} className="bj-center" style={{ "--belt": belt.color, "--ink": belt.ink }}>
            <div className="bj-flash" />
            <div className="bj-name">{belt.name} BELT</div>
            <div className="bj-belt">
              <span className="bj-band" />
              <span className="bj-knot" />
              <span className="bj-tail bj-tail--l" />
              <span className="bj-tail bj-tail--r" />
            </div>
            <div className="bj-skill">
              <span className="bj-check">✓</span> {belt.skill}
            </div>
          </div>

          <img className="bj-ninja" key={`n${step}`} src={ninja} alt="" />
        </>
      ) : (
        <div className="bj-final">
          <div className="bj-final-belt">
            <span className="bj-band" />
            <span className="bj-knot" />
            <span className="bj-tail bj-tail--l" />
            <span className="bj-tail bj-tail--r" />
          </div>
          <blockquote className="bj-final-head">
            <span className="bj-final-line">A black belt is a white belt</span>
            <span className="bj-final-line">who <em>never&nbsp;quit</em>.</span>
          </blockquote>
          <div className="bj-final-sub">Ages 5&ndash;14&nbsp;·&nbsp;Coding · Robotics · Game Design</div>
          <div className="bj-cta">
            <span className="bj-btn">START YOUR JOURNEY&nbsp;→</span>
            <span className="bj-contact">cnwoodbridge.com&nbsp;&nbsp;·&nbsp;&nbsp;(647) 887-9940</span>
          </div>
        </div>
      )}

      {/* progress track of belt swatches */}
      <div className="bj-track">
        {BELTS.map((b, i) => (
          <span
            key={b.name}
            className={`bj-pip${i <= step || isFinale ? " on" : ""}${i === step && !isFinale ? " cur" : ""}`}
            style={{ background: b.color }}
          />
        ))}
      </div>

      <div className="bj-crt" />
    </div>
  );
}
