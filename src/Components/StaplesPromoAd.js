// StaplesPromoAd.jsx — the Staples partnership, both directions.
//
// It is two offers, not one, and they point opposite ways: a Staples customer
// gets $50 off joining Code Ninjas, and a Code Ninjas family gets $20 off
// shopping at Staples. That is the whole idea of the partnership and the
// earlier builds only carried half of it. So the ad is two blocks, labelled by
// who each one is for, because a reader sorts themselves in about a second if
// you let them and never if you don't.
//
// Flat white. No card, no border, no band, no grey desk — the composition sits
// directly on the scene. Nothing is boxed, so the only structure is type,
// rules and space, which is also the most official a thing can look.
//
// Beat sheet (plays once, then holds the final frame):
//   p1  the two marks resolve either side of the hairline
//   p2  the first offer's rule draws and its block wipes up
//   p3  the second offer follows it, and that is the whole ad
//
// JS owns the phase integer and nothing else; every movement is CSS keyed off
// .sp-p0..p3.
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

// Two offers, each labelled by who it is for. The audience label leads because
// it is the only thing a reader needs in order to know which half to read.
//
// The $100 threshold on the first one is off the national SOP (v2), which
// states $100+ before tax in a single transaction; the later note restating
// this offer gives the code and the window without repeating the threshold.
const OFFERS = [
  {
    who: "New to Code Ninjas",
    amount: "$50",
    what: "a new 3-month membership, paid in full",
    meta: [
      "Spend $100 or more at Staples",
      "Code STAPLES2026",
      "Through October 31, 2026",
    ],
  },
  {
    who: "Already a Code Ninjas family",
    amount: "$20",
    what: "a $75 Staples order, at any Canadian location",
    meta: ["Through September 14, 2026"],
  },
];

const CUES = [240, 1020, 1900];

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
      <div className="sp-card">
        {/* A hairline between two marks is the standard way to say "with", and
            it keeps either brand from looking like it owns the other. */}
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

        <div className="sp-eyebrow">National partnership · Canada</div>

        <div className="sp-offers">
          {OFFERS.map((o, i) => (
            <section className="sp-offer" key={o.who} style={{ "--i": i }}>
              <span className="sp-rule" aria-hidden />

              <h2 className="sp-who">{o.who}</h2>

              <div className="sp-amount">
                <span className="sp-amount-n">{o.amount}</span>
                <span className="sp-amount-off">OFF</span>
              </div>

              <p className="sp-what">{o.what}</p>

              <ul className="sp-meta">
                {o.meta.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Nothing follows the two offers. The pooled terms block and the Tech
            Talk line are gone: neither was a promotion, both were competing
            for the room the amounts wanted, and the conditions that actually
            matter to a customer already sit inside the offer they belong to.
            What is left off the ad entirely — new-members-only, one per
            customer per 3-month period, no stacking, the MyStudio rollout — is
            front-desk business and is in the SOP where staff will look. */}
      </div>
    </div>
  );
}
