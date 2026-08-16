// StaplesLockupAd.jsx — two circles, coming together.
//
// Staples owns a red disc. Code Ninjas owns a dark one. Nobody had to invent a
// device for this partnership: both brands already own a circular mark, and
// the whole film is those two objects travelling toward each other and
// settling into a lockup.
//
// ── This is written to be approved, not just to be liked ──
//
// A national co-brand piece has to survive two brand teams and a legal read,
// and the things that get a promo rejected are almost never the idea. They are
// tone and handling: a partner's mark recoloured, cropped, tilted, animated
// into a punchline, or shouted over. So:
//
//   · both marks are used as supplied — no filter, no crop, no rotation
//   · they arrive with equal weight, at equal size, from opposite sides,
//     and neither is ever in front of the other
//   · the separator is a hairline, because a hairline says "with" and does
//     not belong to either party
//   · red is the only colour in the film, and both brands own it
//
// ── Why it is slow ──
//
// The version before this one was energetic: pop, flash, shake, arcade type.
// That is what a good local promo looks like, and it is exactly what marks a
// piece as franchisee-made. Expensive work is SLOWER and quieter — long
// decelerations, nothing that overshoots, long holds on the one frame that
// matters. Every ease in the stylesheet is a settle, and there is not a single
// bounce in the file. That restraint is the production value.
//
// The frame everything is built around is the lockup hold: two marks, a
// hairline, and a name. It is the frame that gets screenshotted, and it is
// what a partner reposts.
import React from "react";
import "../Stylesheets/StaplesLockupAd.css";

import cnMark from "../Images/cn-ninja-icon.png";
import easyBtn from "../Images/staples-easy.png";
// THE OFFICIAL PARTNER LOCKUP, lifted from the vector print artwork in the
// promo pack — not two logos arranged by us. It settles the divider, the
// relative sizes and the shared baseline the way the partnership already
// approved them, which is both the correct answer and one fewer thing for a
// brand team to object to.
import partnerLockup from "../Images/staples-cn-lockup.png";

// Lifted from the Staples Canada owner SOP for this promotion, not paraphrased
// from memory. Every clause here is a condition somebody can be turned away at
// the front desk for, so none of them are optional.
const OFFER = {
  amount: "$50 off",
  what: "your first 3 months at Code Ninjas",
  how: "with any $100 purchase at Staples",
  code: "STAPLES2026",
  terms:
    "Requires a $100+ (before tax) single-transaction in-store purchase at any Staples in Canada. " +
    "New Code Ninjas members only. Applies to a 3-month membership paid in full. " +
    "One redemption per customer per 3-month period. Cannot be combined with other offers. " +
    "Offer valid through October 31, 2026.",
};

// Long beats on purpose — see the header. The lockup hold is the longest thing
// in the film that is not the offer.
const TIMELINE = [
  // Short. A confident film can open on an empty frame, but this one is
  // scrolled past on a phone — a full second of white before anything moves is
  // a second of people leaving.
  { k: "open",   ms: 520 },    // an empty studio
  { k: "arrive", ms: 1650 },   // the two marks travel in
  { k: "meet",   ms: 1250 },   // they settle, the hairline draws
  { k: "name",   ms: 1750 },   // the lockup, named and held
  { k: "line",   ms: 2050 },   // the line
  { k: "offer",  ms: 0 },      // holds
];

export default function StaplesLockupAd() {
  const reduce = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    if (reduce) {
      setStep(TIMELINE.length - 1);
      return undefined;
    }
    if (step >= TIMELINE.length - 1) return undefined;   // the offer holds
    const t = setTimeout(() => setStep((n) => n + 1), TIMELINE[step].ms);
    return () => clearTimeout(t);
  }, [step, reduce]);

  const kind = TIMELINE[step].k;

  return (
    <div className={`sl-stage sl-k-${kind}`}>
      {/* A studio, not a background: one soft key from above and a floor that
          the marks cast onto. It is the difference between objects standing
          somewhere and graphics pasted on a colour. */}
      <div className="sl-key" aria-hidden />
      <div className="sl-floor" aria-hidden />

      {/* ---- the two marks ----
          Equal size, opposite sides, neither ever in front of the other. Each
          carries its own shadow, which tightens as it settles — a shadow that
          does not change is a drawing, one that does is a light. */}
      <div className="sl-marks">
        <div className="sl-mark sl-mark-s">
          <span className="sl-shadow" aria-hidden />
          <img src={easyBtn} alt="Staples" />
          <span className="sl-sweep" aria-hidden />
        </div>

        {/* The hairline says "with", and belongs to neither party. It draws
            down out of nothing once both marks have stopped moving. */}
        <span className="sl-hair" aria-hidden />

        <div className="sl-mark sl-mark-c">
          <span className="sl-shadow" aria-hidden />
          <img src={cnMark} alt="Code Ninjas" />
          <span className="sl-sweep" aria-hidden />
        </div>
      </div>

      {/* The frame that gets screenshotted. */}
      <div className="sl-names">
        <span>STAPLES</span>
        <i aria-hidden>&times;</i>
        <span>CODE NINJAS</span>
      </div>

      {/* One sentence, split so each brand owns a half and neither has to
          explain the other. */}
      <div className="sl-line">
        <span>Ready for the year.</span>
        <span>Built for what&rsquo;s next.</span>
      </div>

      {/* ---- the offer ----
          Set quietly. The code sits between two hairlines rather than inside a
          dashed coupon box: a coupon border is discount-retail, and this is
          meant to read as a partnership that happens to carry an offer. */}
      <div className="sl-offer">
        <img
          className="sl-lockup"
          src={partnerLockup}
          alt="Staples and Code Ninjas"
        />

        <div className="sl-amount">{OFFER.amount}</div>
        <div className="sl-what">
          <span>{OFFER.what}</span>
          <span>{OFFER.how}</span>
        </div>

        <div className="sl-code">
          <span className="sl-code-k">CODE</span>
          <span className="sl-code-n">{OFFER.code}</span>
        </div>

        {/* NO CENTRE URL. This is written to be adopted nationally and reposted
            by the partner, and one franchisee's web address is the single line
            that makes that impossible — it turns a national co-brand piece
            into a Woodbridge ad. The offer is valid at every Canadian centre,
            so the film names neither. */}
        <div className="sl-terms">{OFFER.terms}</div>
      </div>

      <div className="sl-grain" aria-hidden />
      <div className="sl-vignette" aria-hidden />
    </div>
  );
}
