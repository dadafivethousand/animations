// FreeTrialPassAd.jsx — Code Ninjas Woodbridge free-trial offer.
//
// A laminated pass, presented as a cinematic product drop on a dark stage:
//   0) SLIDE  — the card drops in foil-side up and settles
//   1) FLIP   — it turns over to the offer face
//   2) STAMP  — "1 FREE SESSION" slams on, card recoils
//   3) INFO   — headline, benefits and CTA rise in underneath
//
// The card stock (guilloche, grain, foil, chip, microtext) and the whole
// environment (ambient light, tron floor, drifting code glyphs, reflection)
// are pure CSS/SVG. React only advances the phase.
import React, { useEffect, useState } from "react";
import "../Stylesheets/FreeTrialPassAd.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";

const SLIDE = 0, FLIP = 1, STAMP = 2, INFO = 3;

// ms after mount that each phase begins. FLIP kicks off a ~1.4s multi-turn
// spin, so STAMP waits for it to settle before slamming on.
const CUES = { [FLIP]: 1150, [STAMP]: 2750, [INFO]: 3350 };

const BENEFITS = ["AGES 5–14", "NO COMMITMENT", "BOOK IN 60s"];
const META = ["6175 Hwy 7, Woodbridge", "647-887-9940"];

// irregular bar widths so the barcode doesn't read as a repeating gradient
const BARS = [3,1,2,1,1,3,2,1,3,1,1,2,3,1,2,2,1,3,1,1,2,1,3,2,1,1,3,1,2,1,2,3,1,2,1,1,3,2,1,3];

// security microtext, repeated along a hairline like real card stock
const MICRO = "CODENINJASWOODBRIDGE".repeat(6);

// code glyphs suspended in the background — fixed layout for design control.
// z (px) sets each glyph's depth in the perspective scene: nearer (bigger,
// brighter) to far (small, dim), so they parallax as the camera drifts.
// [char, left%, top%, size(em), driftDur(s), delay(s), opacity, z]
const GLYPHS = [
  ["{", 8, 22, 2.4, 15, 0, 0.13, -120], ["}", 90, 30, 2.2, 18, 3, 0.11, -220],
  ["<", 15, 74, 1.9, 16, 6, 0.09, -340], ["/", 82, 68, 2.6, 20, 1.5, 0.12, -80],
  [">", 72, 14, 1.6, 14, 4.5, 0.08, -420], [";", 26, 44, 1.7, 17, 8, 0.07, -500],
  ["(", 4, 52, 2.0, 19, 2, 0.10, -180], [")", 95, 55, 2.0, 15, 5.5, 0.07, -460],
  ["0", 40, 12, 1.5, 21, 7, 0.07, -560], ["1", 60, 86, 1.5, 16, 3.5, 0.09, -260],
  ["=", 34, 88, 1.8, 18, 9, 0.06, -600], ["[", 88, 84, 1.7, 20, 1, 0.11, -140],
];

// guilloche rosette — overlapping rotated ellipses, the engine-turned pattern
// used on banknotes. Cheap in SVG, reads as fine engraving at low opacity.
const Guilloche = ({ className, rings = 30 }) => (
  <svg className={className} viewBox="0 0 200 126" preserveAspectRatio="xMidYMid slice" aria-hidden>
    {Array.from({ length: rings }, (_, i) => (
      <ellipse
        key={i}
        cx="100" cy="63"
        rx={86 - i * 1.15} ry={46 - i * 1.05}
        transform={`rotate(${i * (180 / rings)} 100 63)`}
      />
    ))}
  </svg>
);

// the card itself — extracted so the stage can render it twice (hero + mirror).
// Nesting gives each motion its own 3D layer: tilt (idle wobble) > flip (the
// multi-turn spin) > card (the stamp recoil).
const Card = ({ phase }) => (
  <div className="ft-tilt">
   <div className="ft-flip">
    <div className="ft-card">
      {/* ---- back: foil side, what you see as it lands ---- */}
      <div className="ft-face ft-back">
        <Guilloche className="ft-guilloche ft-guilloche--dark" />
        <div className="ft-stripe" aria-hidden><i /></div>

        <div className="ft-back-body">
          <img className="ft-back-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
          <span className="ft-back-sub">WOODBRIDGE</span>
        </div>

        <div className="ft-back-foot">
          <span className="ft-back-terms">NON-TRANSFERABLE<br />ONE PER STUDENT</span>
          <div className="ft-holo" aria-hidden><span /></div>
        </div>

        <div className="ft-micro" aria-hidden>{MICRO}</div>
        <div className="ft-spec" aria-hidden />
        <div className="ft-grain" aria-hidden />
      </div>

      {/* ---- front: the offer ---- */}
      <div className="ft-face ft-front">
        <Guilloche className="ft-guilloche ft-guilloche--light" />
        <span className="ft-punch" aria-hidden />

        <div className="ft-head">
          <div className="ft-brandmark">
            <img className="ft-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
            <span className="ft-logo-sub">WOODBRIDGE</span>
          </div>
          <span className="ft-serial">PASS No. CN-WB-001</span>
        </div>

        <div className="ft-mid">
          <div className="ft-chip" aria-hidden><i /><b /></div>
          <div className="ft-title">
            <span className="ft-title-sm">FREE</span>
            <span className="ft-title-lg">TRIAL</span>
          </div>
        </div>

        <div className="ft-foot">
          <div className="ft-field"><span>ADMIT ONE</span></div>
          <div className="ft-barcode" aria-hidden>
            {BARS.map((w, i) => <i key={i} style={{ width: `${w}px` }} />)}
          </div>
        </div>

        <div className="ft-stamp" aria-hidden={phase < STAMP}>
          <span className="ft-stamp-top">1 FREE</span>
          <span className="ft-stamp-big">SESSION</span>
        </div>

        <div className="ft-spec" aria-hidden />
        <div className="ft-grain" aria-hidden />
      </div>

      <div className="ft-edge" aria-hidden />
    </div>
   </div>
  </div>
);

export default function FreeTrialPassAd() {
  const [phase, setPhase] = useState(SLIDE);

  useEffect(() => {
    const timers = Object.entries(CUES).map(([p, ms]) =>
      setTimeout(() => setPhase((cur) => Math.max(cur, Number(p))), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`ft-stage ft-p${phase}`}>
      {/* ---- environment, in a perspective scene so it has real depth ---- */}
      <div className="ft-space" aria-hidden>
        <div className="ft-ambient"><i className="ft-amb-red" /><i className="ft-amb-cyan" /></div>
        <div className="ft-floor" />
        <div className="ft-glyphs">
          {GLYPHS.map(([ch, l, t, s, d, dl, o, z], i) => (
            <span key={i} style={{
              left: `${l}%`, top: `${t}%`, fontSize: `${s}em`,
              opacity: o, animationDuration: `${d}s`, animationDelay: `${dl}s`,
              "--z": `${z}px`,
            }}>{ch}</span>
          ))}
        </div>
      </div>
      {/* volumetric key light from above, and the film grade on top */}
      <div className="ft-spotlight" aria-hidden />
      <div className="ft-vignette" aria-hidden />
      <div className="ft-stagegrain" aria-hidden />

      {/* shared filters */}
      <svg className="ft-defs" aria-hidden>
        <filter id="ft-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      {/* ---- hero card + its reflection on the floor ---- */}
      <div className="ft-card-wrap">
        <div className="ft-halo" aria-hidden />
        <Card phase={phase} />
        <div className="ft-reflection" aria-hidden><Card phase={phase} /></div>
      </div>

      {/* ---- pitch ---- */}
      <div className="ft-below">
        <h1 className="ft-headline" style={{ transitionDelay: "0ms" }}>
          Your first game-building session<br /><em>is on us.</em>
        </h1>

        <div className="ft-chips" style={{ transitionDelay: "90ms" }}>
          {BENEFITS.map((b) => <span className="ft-chip-pill" key={b}>{b}</span>)}
        </div>

        <div className="ft-cta" style={{ transitionDelay: "180ms" }}>
          <span className="ft-cta-label">cnwoodbridge.com</span>
          <svg className="ft-cta-arrow" viewBox="0 0 24 24" aria-hidden>
            <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor"
              strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="ft-cta-sheen" aria-hidden />
        </div>

        <div className="ft-meta" style={{ transitionDelay: "270ms" }}>
          {META.map((m, i) => (
            <React.Fragment key={m}>
              {i > 0 && <i aria-hidden />}
              <span>{m}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
