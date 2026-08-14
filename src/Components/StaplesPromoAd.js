// StaplesPromoAd.jsx — the national Staples offer, as a co-branded notice.
//
// Three zones, the way a real piece of corporate communication is built: a red
// masthead that says what this is, a white body that carries the offer and how
// to claim it, and a grey footer that carries the conditions. A reader who
// stops after the masthead knows the category; one who stops after the body
// knows what to do; the footer is there for the one who checks. That hierarchy
// is what makes something look official — not ornament.
//
// The earlier build was one flat column of centred lines with no zones and no
// steps, so every line had equal weight and the offer read as a poster. This
// carries the whole mechanic: what to spend, what to bring, what you get.
//
// Code Ninjas is the sender and Staples is the partner. That is the honest
// arrangement and the useful one: the centre is what a reader has to walk into
// to redeem this. The marks lock up on white rather than on the red band —
// cn-woodbridge-logo.png has no light-on-dark variant, and the documented foil
// (grayscale + invert) is a compromise worth avoiding when white is available.
//
// Beat sheet (plays once, then holds the final frame):
//   p1  the sheet rises in and the red masthead wipes across it
//   p2  the two marks resolve either side of the hairline
//   p3  the offer wipes up, line by line
//   p4  the three steps rise in sequence
//   p5  the footer band fills and the terms fade up
//
// JS owns the phase integer and nothing else; every movement is CSS keyed off
// .sp-p0..p5.
import React from "react";
import "../Stylesheets/StaplesPromoAd.css";

import cnLogo from "../Images/cn-woodbridge-logo.png";

// ── The Staples mark ─────────────────────────────────────────────────────
// SWAP POINT. Drop the supplied logo into src/Images/ (a transparent PNG or an
// SVG), import it here, and set USE_LOGO to true — the wordmark below is a
// stand-in set in type, correct in colour and tracking but not their actual
// letterforms, and it should not ship if the real mark is available.
//
//   import staplesLogo from "../Images/staples-logo.png";
//
const USE_LOGO = false;
const staplesLogo = null;

// The mechanic, in the order a customer performs it. "Before tax" and "one
// transaction" are the two conditions that actually get people turned away at
// the desk, so they belong in the step rather than in the terms.
const STEPS = [
  ["Shop", "Spend $100 or more at Staples, before tax, in one transaction"],
  ["Bring", "Take your Staples receipt to your Code Ninjas centre"],
  ["Save", "$50 off a new 3-month membership, paid in full"],
];

const CUES = [240, 1120, 1660, 2560, 3480];

export default function StaplesPromoAd() {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase(CUES.length);
      return undefined;
    }
    const timers = CUES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`sp-stage sp-p${phase}`}>
      <div className="sp-wash" aria-hidden />
      <div className="sp-vignette" aria-hidden />

      <div className="sp-card">
        <div className="sp-notice">
          {/* ── masthead ── */}
          <div className="sp-masthead">
            <span className="sp-masthead-fill" aria-hidden />
            <span className="sp-masthead-text">National Partner Offer</span>
          </div>

          {/* ── body ── */}
          <div className="sp-body">
            {/* A hairline between two marks is the standard way to say "with",
                and it keeps either brand from looking like it owns the other. */}
            <div className="sp-lockup">
              <div className="sp-partner">
                {USE_LOGO ? (
                  <img className="sp-partner-img" src={staplesLogo} alt="Staples" />
                ) : (
                  <span className="sp-partner-type">STAPLES</span>
                )}
              </div>

              <span className="sp-hair" aria-hidden />

              <div className="sp-cn">
                <img src={cnLogo} alt="Code Ninjas" />
              </div>
            </div>

            {/* One number, and everything under it is a caption to it. */}
            <div className="sp-offer">
              <span className="sp-amount">$50</span>
              <span className="sp-off">OFF</span>
            </div>

            <div className="sp-what">
              a new <strong>3-month membership</strong> at Code&nbsp;Ninjas
            </div>

            <div className="sp-steps-label">How it works</div>

            <ol className="sp-steps">
              {STEPS.map(([lead, line], i) => (
                <li key={lead} style={{ "--i": i }}>
                  <span className="sp-step-n" aria-hidden>
                    {i + 1}
                  </span>
                  <span className="sp-step-text">
                    <span className="sp-step-lead">{lead}</span>
                    {line}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* ── footer ──
              Set as terms, not as a disclaimer to be hidden — an official
              notice is one that tells you the conditions. All of this is off
              the national SOP. The promo code is staff-side and stays off, as
              do the in-store and Quebec conditions, which the SOP still lists
              as pending. */}
          <div className="sp-foot">
            <span className="sp-foot-fill" aria-hidden />
            <div className="sp-foot-text">
              <div className="sp-terms">
                New members only · One redemption per customer per 3-month
                period · Cannot be combined with any other offer or discount
              </div>
              <div className="sp-until">
                Valid through October 31, 2026 · All Canadian Code Ninjas centres
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
