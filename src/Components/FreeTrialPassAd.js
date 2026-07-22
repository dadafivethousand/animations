// FreeTrialPassAd.jsx — Code Ninjas Woodbridge free-trial offer.
// A laminated arcade/gym pass, shot like a physical object:
//   0) SLIDE  — the card drops into frame back-first and settles
//   1) FLIP   — it turns over to show the offer face
//   2) STAMP  — "1 FREE SESSION" slams on at an angle, card recoils
//   3) INFO   — contact details rise in underneath
import React, { useEffect, useState } from "react";
import "../Stylesheets/FreeTrialPassAd.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";

const SLIDE = 0, FLIP = 1, STAMP = 2, INFO = 3;

// ms after mount that each phase begins
const CUES = { [FLIP]: 1100, [STAMP]: 2150, [INFO]: 2750 };

const DETAILS = [
  { k: "WHERE", v: "6175 Hwy 7, Woodbridge" },
  { k: "CALL",  v: "647-887-9940" },
  { k: "BOOK",  v: "cnwoodbridge.com" },
];

// irregular bar widths so the barcode doesn't read as a repeating gradient
const BARS = [3,1,2,1,1,3,2,1,3,1,1,2,3,1,2,2,1,3,1,1,2,1,3,2,1,1,3,1,2,1,2,3,1,2,1,1,3,2,1,3];

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
      <div className="ft-glow" aria-hidden />

      <div className="ft-card-wrap">
        <div className="ft-card">
          {/* ---- back: what you see as it lands ---- */}
          <div className="ft-face ft-back">
            <div className="ft-stripe" aria-hidden />
            <div className="ft-back-body">
              <div className="ft-back-name">CODE NINJAS<span>WOODBRIDGE</span></div>
            </div>
            <div className="ft-back-foot">
              <span className="ft-back-terms">NON-TRANSFERABLE<br />ONE PER STUDENT</span>
              <div className="ft-holo" aria-hidden />
            </div>
          </div>

          {/* ---- front: the offer ---- */}
          <div className="ft-face ft-front">
            <span className="ft-punch" aria-hidden />
            <span className="ft-gloss" aria-hidden />

            <div className="ft-head">
              <img className="ft-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
              <span className="ft-serial">PASS No. CN-WB-001</span>
            </div>

            <div className="ft-title">
              <span className="ft-title-sm">FREE TRIAL</span>
              <span className="ft-title-lg">PASS</span>
              <span className="ft-admit">ADMIT ONE FUTURE CODER</span>
            </div>

            {/* NAME is left blank on purpose — it's a pass you fill in */}
            <div className="ft-foot">
              <div className="ft-field"><span>NAME</span><i /></div>
              <div className="ft-barcode" aria-hidden>
                {BARS.map((w, i) => <i key={i} style={{ width: `${w}px` }} />)}
              </div>
            </div>

            {/* stamped last, sits above the card artwork */}
            <div className="ft-stamp" aria-hidden={phase < STAMP}>
              <span className="ft-stamp-top">1 FREE</span>
              <span className="ft-stamp-big">SESSION</span>
              <span className="ft-stamp-bot">NO CHARGE</span>
            </div>
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
