// FreeTrialPassAd.jsx — Code Ninjas Woodbridge free-trial offer.
// A laminated pass treated as a real manufactured object:
//   0) SLIDE  — the card drops in foil-side up and settles
//   1) FLIP   — it turns over to the offer face
//   2) STAMP  — "1 FREE SESSION" slams on, card recoils
//   3) INFO   — contact details rise in underneath
// Card stock detail (guilloche, grain, foil, chip, microtext) is all
// CSS/SVG; React only advances the phase.
import React, { useEffect, useState } from "react";
import "../Stylesheets/FreeTrialPassAd.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";

const SLIDE = 0, FLIP = 1, STAMP = 2, INFO = 3;

// ms after mount that each phase begins
const CUES = { [FLIP]: 1250, [STAMP]: 2400, [INFO]: 3000 };

const DETAILS = [
  { k: "WHERE", v: "6175 Hwy 7, Woodbridge" },
  { k: "CALL",  v: "647-887-9940" },
  { k: "BOOK",  v: "cnwoodbridge.com" },
];

// irregular bar widths so the barcode doesn't read as a repeating gradient
const BARS = [3,1,2,1,1,3,2,1,3,1,1,2,3,1,2,2,1,3,1,1,2,1,3,2,1,1,3,1,2,1,2,3,1,2,1,1,3,2,1,3];

// security microtext, repeated along a hairline like real card stock
const MICRO = "CODENINJASWOODBRIDGE".repeat(6);

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
      <div className="ft-room" aria-hidden />

      {/* film grain, shared by both faces via .ft-grain */}
      <svg className="ft-defs" aria-hidden>
        <filter id="ft-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      <div className="ft-card-wrap">
        <div className="ft-tilt">
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
                <img className="ft-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
                <span className="ft-serial">PASS No. CN-WB-001</span>
              </div>

              <div className="ft-mid">
                <div className="ft-chip" aria-hidden><i /><b /></div>
                <div className="ft-title">
                  <span className="ft-title-sm">FREE TRIAL</span>
                  <span className="ft-title-lg">PASS</span>
                </div>
              </div>

              {/* NAME is left blank on purpose — it's a pass you fill in */}
              <div className="ft-foot">
                <div className="ft-field"><span>ADMIT ONE — NAME</span><i /></div>
                <div className="ft-barcode" aria-hidden>
                  {BARS.map((w, i) => <i key={i} style={{ width: `${w}px` }} />)}
                </div>
              </div>

              <div className="ft-stamp" aria-hidden={phase < STAMP}>
                <span className="ft-stamp-top">1 FREE</span>
                <span className="ft-stamp-big">SESSION</span>
                <span className="ft-stamp-bot">NO CHARGE</span>
              </div>

              <span className="ft-gloss" aria-hidden />
              <div className="ft-spec" aria-hidden />
              <div className="ft-grain" aria-hidden />
            </div>

            {/* card stock thickness, visible as the tilt swings */}
            <div className="ft-edge" aria-hidden />
          </div>
        </div>

        <div className="ft-shadow" aria-hidden />
      </div>

      <div className="ft-details">
        {DETAILS.map((d, i) => (
          <div className="ft-detail" key={d.k} style={{ transitionDelay: `${i * 110}ms` }}>
            <span className="ft-detail-k">{d.k}</span>
            <span className="ft-detail-v">{d.v}</span>
          </div>
        ))}
        <div className="ft-cta" style={{ transitionDelay: `${DETAILS.length * 110}ms` }}>
          Claim your free session
        </div>
      </div>
    </div>
  );
}
