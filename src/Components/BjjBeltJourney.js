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
const DUR = [5000, 5000, 5000, 5000, 5000, 5200];

export default function BjjBeltJourney({
  academy = "JIU-JITSU",
  academySub = "ACADEMY",
  address = "",
  website = "yourgym.com",
  phone = "",
  logo = null,
  lightTop = false,   // brighter top gradient so a dark/black logo reads
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
    <div className={`jj-stage${isFinale ? " jj-finale-on" : ""}${lightTop ? " jj-lighttop" : ""}`}>
      <div className="jj-bg" />
      <div className="jj-spot" />
      <div className="jj-tex" />
      <div className="jj-vig" />

      {!isFinale ? (
        <>
          {/* logo or wordmark (belt scenes only) */}
          {logo ? (
            <img className="jj-logo" src={logo} alt={academy} />
          ) : (
            <div className="jj-mark">
              <span className="jj-mark-main">{academy}</span>
              <span className="jj-mark-sub">{academySub}</span>
            </div>
          )}

          <div className="jj-kicker">THE&nbsp;JOURNEY</div>
          <div key={step} className="jj-center" style={{ "--belt": belt.color, "--pink": belt.ink }}>
            <div className="jj-flash" />
            <div className="jj-name">{belt.name} BELT</div>
            <div className="jj-belt">
              <span className="jj-band" />
              <span className="jj-knot" />
              <span className="jj-tail jj-tail--l" />
              <span className="jj-tail jj-tail--r" />
            </div>
            <div className="jj-skill">{belt.skill}</div>
          </div>

          <div className="jj-track">
            {BELTS.map((b, i) => (
              <span
                key={b.name}
                className={`jj-pip${i <= step ? " on" : ""}${i === step ? " cur" : ""}`}
                style={{ background: b.color }}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="jj-final">
          <div className="jj-final-belt">
            <span className="jj-band" />
            <span className="jj-knot" />
            <span className="jj-tail jj-tail--l" />
            <span className="jj-tail jj-tail--r" />
          </div>
          <blockquote className="jj-quote">
            <span className="jj-line">A black belt is a white belt</span>
            <span className="jj-line">who <em>never&nbsp;quit</em>.</span>
          </blockquote>

          <div className="jj-btn">START YOUR JOURNEY</div>

          {/* branded contact footer */}
          <div className="jj-footer">
            <div className="jj-brandline">{academy}</div>
            <div className="jj-contacts">
              {address && (
                <span className="jj-cinfo"><span className="jj-cico" aria-hidden>📍</span>{address}</span>
              )}
              {website && (
                <span className="jj-cinfo"><span className="jj-cico" aria-hidden>🌐</span>{website}</span>
              )}
              {phone && (
                <span className="jj-cinfo"><span className="jj-cico" aria-hidden>📞</span>{phone}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
