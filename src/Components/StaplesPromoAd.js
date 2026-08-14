// StaplesPromoAd.jsx — the national Staples offer, as a co-branded notice.
//
// This replaced a mock till receipt with a $50 OFF stamp thumping onto it. The
// receipt was the better joke and the wrong register: the promotion is a real
// national partnership, so the ad has to look like something both companies
// would put their name on rather than like a gag about one of them.
//
// So: a white notice with a red rule at its head, the two marks locked up
// across a hairline, one number, and terms set as terms. The motion is
// restrained for the same reason — official things do not bounce. Everything
// wipes, fades or draws; nothing overshoots.
//
// Code Ninjas is the sender and Staples is the partner, which is both the
// honest arrangement and the useful one: your centre is what a reader has to
// walk into to redeem this.
//
// Beat sheet (plays once, then holds the final frame):
//   p1  the notice rises in and the red head rule draws across it
//   p2  the two marks resolve either side of the hairline
//   p3  the offer wipes up, line by line
//   p4  the terms rule draws and the small print fades
//
// JS owns the phase integer and nothing else; every movement is CSS keyed off
// .sp-p0..p4.
import React from "react";
import "../Stylesheets/StaplesPromoAd.css";

import cnLogo from "../Images/cn-woodbridge-logo.png";

// ── The Staples mark ─────────────────────────────────────────────────────
// SWAP POINT. Drop the supplied logo into src/Images/ (a transparent PNG or
// an SVG), import it here, and set USE_LOGO to true — the wordmark below is a
// stand-in set in type, correct in colour and tracking but not their actual
// letterforms, and it should not ship if the real mark is available.
//
//   import staplesLogo from "../Images/staples-logo.png";
//
const USE_LOGO = false;
const staplesLogo = null;

const CUES = [240, 1180, 1760, 2640];

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
          <div className="sp-head" aria-hidden />

          {/* The lockup. A hairline between two marks is the standard way to
              say "with", and it keeps either brand from looking like it owns
              the other. */}
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

          <div className="sp-eyebrow">National partner offer</div>

          {/* One number, and everything else is a caption to it. */}
          <div className="sp-offer">
            <span className="sp-amount">$50</span>
            <span className="sp-off">OFF</span>
          </div>

          <div className="sp-qualify">
            when you spend <strong>$100 or more</strong> at Staples
          </div>

          <div className="sp-what">on a new 3-month Code&nbsp;Ninjas membership</div>

          <div className="sp-divider" aria-hidden />

          {/* Set as terms, not as a disclaimer to be hidden — an official
              notice is one that tells you the conditions. Everything here is
              off the national SOP. The promo code is staff-side and stays off,
              as do the in-store and Quebec conditions, which the SOP still
              lists as pending. */}
          <ul className="sp-terms">
            <li>New members only</li>
            <li>One redemption per customer</li>
            <li>Valid at all Canadian Code Ninjas centres</li>
          </ul>

          <div className="sp-until">Offer valid through October 31, 2026</div>
        </div>
      </div>
    </div>
  );
}
