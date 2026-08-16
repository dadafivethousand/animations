// StaplesPowerUpAd.jsx — the ninja collects Staples easy buttons and levels up.
//
// A power-up sequence, played straight: a small ninja, three red "easy" buttons
// flying in, and a bigger ninja after each one. LEVEL 1 → 2 → 3 → MAX. Then the
// partnership offer.
//
// ── This one is built to be REPOSTED ──
//
// The audience for this ad is Staples' social team before it is anybody's
// parent, and that changes what it has to do. Their mark is the hero object —
// the thing the ninja is chasing, the thing that makes him stronger — and the
// easy button is used as itself, at full size, never cropped or recoloured.
// The offer is theirs as much as ours. A Code Ninjas ad with a Staples mention
// stapled to the end does not get shared by Staples.
//
// It is also why the payoff line is STOCK UP. LEVEL UP. — a sentence that is
// half theirs and half ours, and that neither brand would have to explain.
//
// ── The growth is one number ──
//
// The ninja's size comes from a level class on the stage and nothing else, with
// a transition DELAYED to the exact moment the button lands. That delay is why
// the growth reads as caused by the pickup rather than as happening near it,
// and it is the whole trick: no keyframe per level, no measuring, one scale
// stepping up four times.
//
// ── The offer terms are not decorative ──
//
// Everything in the fine print is lifted from the Staples Canada owner SOP for
// this promotion. It is a real, co-branded, dated offer with eligibility
// conditions, and getting any of it wrong is worse than not running the ad —
// it lands the centre and the partner in an argument at the front desk.
import React from "react";
import "../Stylesheets/StaplesPowerUpAd.css";

import cnLogo from "../Images/cn-woodbridge-logo.png";
import staplesLogo from "../Images/staples-logo.png";
import easyBtn from "../Images/staples-easy.png";
import ninjaPose from "../Images/b2s-ninja-jump.png";
import ninjaMax from "../Images/b2s-ninja-thumbs.png";

// Straight from the SOP. Do not paraphrase these without checking it again.
const OFFER = {
  amount: "$50 OFF",
  what: "your first 3 months",
  code: "STAPLES2026",
  terms:
    "Requires a $100+ (before tax) single-transaction in-store purchase at any Staples in Canada. " +
    "New Code Ninjas members only. Applies to a 3-month membership paid in full. " +
    "One redemption per customer per 3-month period. Cannot be combined with other offers. " +
    "Valid through October 31, 2026.",
};

const TIMELINE = [
  { k: "idle",  ms: 780 },
  { k: "pow",   ms: 1060 },   // level 1
  { k: "pow",   ms: 960 },    // level 2
  { k: "pow",   ms: 1240 },   // level 3 — held longer, it is the big one
  { k: "max",   ms: 1250 },
  { k: "offer", ms: 0 },      // holds
];

export default function StaplesPowerUpAd() {
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

  // How many buttons have been collected. Used for the level readout AND, via
  // the stage class, for the ninja's size — one number driving both is what
  // keeps them from ever disagreeing.
  const level = TIMELINE.slice(0, step + 1).filter((b) => b.k === "pow").length;
  const maxed = kind === "max" || kind === "offer";

  return (
    <div className={`sp-stage sp-k-${kind} sp-lv${level}`}>
      <div className="sp-floor" aria-hidden />

      {/* Speed lines behind the hero, faster and denser at every level — the
          cheapest way to say the power went up without a meter. */}
      <div className="sp-rays" aria-hidden>
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} style={{ "--r": `${i * 30}deg` }} />
        ))}
      </div>

      {/* ---- the level readout ---- */}
      <div className="sp-hud">
        <span className="sp-hud-k">POWER</span>
        {/* "LEVEL 0" reads as a fault rather than as a starting point. */}
        <span className="sp-hud-n">
          {maxed ? "MAX" : level === 0 ? "READY" : `LEVEL ${level}`}
        </span>
        <span className="sp-pips" aria-hidden>
          {[0, 1, 2].map((i) => (
            <i key={i} className={i < level ? "is-on" : undefined} />
          ))}
        </span>
      </div>

      {/* ---- the incoming button ----
          Keyed by step so it remounts on every power beat and its flight
          animation restarts from frame one. Without the key React would reuse
          the element and only the first one would ever fly. */}
      {kind === "pow" && (
        <img className="sp-token" key={step} src={easyBtn} alt="" />
      )}

      {/* ---- the impact ----
          Also keyed: a flash and two rings that fire once, timed to land with
          the button rather than with the beat. */}
      {kind === "pow" && (
        <React.Fragment key={`fx${step}`}>
          <div className="sp-flash" aria-hidden />
          <div className="sp-ring" aria-hidden />
          <div className="sp-ring sp-ring-2" aria-hidden />
        </React.Fragment>
      )}

      {/* ---- the ninja ----
          One scale, stepped by the level class, with the transition delayed to
          the frame the button lands on. */}
      <div className="sp-hero">
        <img className="sp-sprite sp-sprite-pose" src={ninjaPose} alt="" />
        <img className="sp-sprite sp-sprite-max" src={ninjaMax} alt="Code Ninjas ninja" />
      </div>

      {/* ---- the line ----
          Half theirs, half ours, and neither brand has to explain it. */}
      <div className="sp-punch">
        <span>STOCK UP.</span>
        <span>LEVEL UP.</span>
      </div>

      {/* ---- the offer ---- */}
      <div className="sp-offer">
        <div className="sp-lockup">
          <img className="sp-lockup-s" src={staplesLogo} alt="Staples" />
          <span className="sp-x" aria-hidden />
          <img className="sp-lockup-c" src={cnLogo} alt="Code Ninjas" />
        </div>

        <div className="sp-amount">{OFFER.amount}</div>
        <div className="sp-what">{OFFER.what}</div>

        {/* Set as a coupon code, because that is what it is and because it is
            the one string a viewer has to actually carry away. */}
        <div className="sp-code">
          <span className="sp-code-k">USE CODE</span>
          <span className="sp-code-n">{OFFER.code}</span>
        </div>

        <div className="sp-site">cnwoodbridge.com</div>
        <div className="sp-terms">{OFFER.terms}</div>
      </div>
    </div>
  );
}
