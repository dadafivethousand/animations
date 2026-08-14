// StaplesPromoAd.jsx — a Staples receipt prints out, and $50 OFF lands on it.
//
// The offer is a mechanic, not a slogan: spend $100 at Staples, get $50 off a
// new 3-month Code Ninjas membership. So the ad performs the mechanic rather
// than announcing it — the receipt is the qualifying purchase, and the stamp is
// what the receipt buys you. Nothing has to be read to be understood.
//
// Palette is paper: warm stock, red ink, grey ink, nothing dark. That keeps it
// off the navy/cyan ads and off the near-white Google-sheet ads, both of which
// are already on the grid. The only saturated thing in frame is red, which
// happens to be both brands' colour — which is the point of the partnership.
//
// Beat sheet (plays once, then holds the final frame):
//   p1  the receipt feeds out of the top, printing as it goes
//   p2  the $50 OFF stamp thumps down across it, off-axis
//   p3  the line and the mark rise under it
//   p4  the fine print fades up
//
// JS owns the phase integer and nothing else; every movement is CSS keyed off
// .sp-p0..p4.
import React from "react";
import "../Stylesheets/StaplesPromoAd.css";

import cnLogo from "../Images/cn-woodbridge-logo.png";

// Two items that actually add up to the total, and a total that actually
// clears $100 — the receipt is on screen long enough to be read.
const ITEMS = [
  { name: "SCHOOL SUPPLIES", price: "62.40" },
  { name: "BACKPACK", price: "39.99" },
];
const TOTAL = "102.39";

const CUES = [260, 1680, 2320, 2980];

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
        {/* The receipt and the stamp are one unit: the stamp is positioned on
            the paper, not stacked under it, so the composition stays short
            enough to sit centred with real margin on every edge. */}
        <div className="sp-slip">
          <div className="sp-receipt">
            <div className="sp-brand">STAPLES</div>

            <div className="sp-rule" aria-hidden />

            <ul className="sp-items">
              {ITEMS.map((it) => (
                <li key={it.name}>
                  <span className="sp-name">{it.name}</span>
                  <span className="sp-dots" aria-hidden />
                  <span className="sp-price">{it.price}</span>
                </li>
              ))}
            </ul>

            <div className="sp-rule" aria-hidden />

            <div className="sp-total">
              <span>TOTAL</span>
              <span className="sp-total-num">${TOTAL}</span>
            </div>
          </div>

          <div className="sp-stamp" aria-label="50 dollars off">
            <span className="sp-stamp-amt">$50</span>
            <span className="sp-stamp-off">OFF</span>
          </div>
        </div>

        <div className="sp-say">a new 3-month membership at</div>

        <div className="sp-mark">
          <img src={cnLogo} alt="Code Ninjas" />
        </div>

        {/* Everything here is off the national SOP. The promo code and the
            pending in-store / Quebec conditions are deliberately not on the
            ad — they are staff-side, or not confirmed. */}
        <div className="sp-fine">
          New members only · one per customer · valid through Oct 31, 2026
          <br />
          at all Canadian Code Ninjas centres
        </div>
      </div>
    </div>
  );
}
