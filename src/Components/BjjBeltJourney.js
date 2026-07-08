// BjjBeltJourney.jsx — generic Brazilian Jiu-Jitsu belt-progression promo clip.
// No brand marks; placeholder academy text so any BJJ gym can drop in their own.
import React, { useEffect, useState } from "react";
import "../Stylesheets/BjjBeltJourney.css";

const BELTS = [
  { name: "WHITE",  color: "#eef1f4", ink: "#1c2129", skill: "Learn the fundamentals" },
  { name: "BLUE",   color: "#2f6fd6", ink: "#eaf1ff", skill: "Build your game" },
  { name: "PURPLE", color: "#7a3fb8", ink: "#f5eaff", skill: "Develop your style" },
  { name: "BROWN",  color: "#6e4423", ink: "#ffe9d6", skill: "Refine every detail" },
  { name: "BLACK",  color: "#141414", ink: "#f0b429", skill: "Mastery & mentorship" },
];

// steps 0..4 = belts, 5 = finale
const DUR = [1600, 1450, 1450, 1450, 2200, 4600];

export default function BjjBeltJourney({
  academy = "JIU-JITSU",
  academySub = "ACADEMY",
  contact = "YOUR ACADEMY  ·  yourgym.com",
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setTimeout(
      () => setStep((s) => (s + 1) % (BELTS.length + 1)),
      DUR[step] ?? 1450
    );
    return () => clearTimeout(t);
  }, [step]);

  const isFinale = step >= BELTS.length;
  const belt = BELTS[Math.min(step, BELTS.length - 1)];

  return (
    <div className={`jj-stage${isFinale ? " jj-finale-on" : ""}`}>
      <div className="jj-bg" />
      <div className="jj-spot" />
      <div className="jj-tex" />
      <div className="jj-vig" />

      {/* wordmark (replaceable) */}
      <div className="jj-mark">
        <span className="jj-mark-main">{academy}</span>
        <span className="jj-mark-sub">{academySub}</span>
      </div>

      {!isFinale ? (
        <>
          <div className="jj-kicker">THE&nbsp;JOURNEY</div>
          <div key={step} className="jj-center" style={{ "--belt": belt.color, "--pink": belt.ink }}>
            <div className="jj-flash" />
            <div className="jj-name">{belt.name} BELT</div>
            <div className="jj-belt">
              <span className="jj-band" />
              <span className={`jj-bar${belt.name === "BLACK" ? " jj-bar--red" : ""}`}><i /><i /><i /><i /></span>
              <span className="jj-knot" />
              <span className="jj-tail jj-tail--l" />
              <span className="jj-tail jj-tail--r" />
            </div>
            <div className="jj-skill">{belt.skill}</div>
          </div>
        </>
      ) : (
        <div className="jj-final">
          <div className="jj-final-belt">
            <span className="jj-band" />
            <span className="jj-bar jj-bar--red"><i /><i /><i /><i /></span>
            <span className="jj-knot" />
            <span className="jj-tail jj-tail--l" />
            <span className="jj-tail jj-tail--r" />
          </div>
          <blockquote className="jj-quote">
            <span className="jj-line">A black belt is a white belt</span>
            <span className="jj-line">who <em>never&nbsp;quit</em>.</span>
          </blockquote>
          <div className="jj-cta">
            <span className="jj-btn">START YOUR JOURNEY</span>
            <span className="jj-contact">{contact}</span>
          </div>
        </div>
      )}

      <div className="jj-track">
        {BELTS.map((b, i) => (
          <span
            key={b.name}
            className={`jj-pip${i <= step || isFinale ? " on" : ""}${i === step && !isFinale ? " cur" : ""}`}
            style={{ background: b.color }}
          />
        ))}
      </div>
    </div>
  );
}
