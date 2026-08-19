// StaplesPosterInStore.jsx — a STATIC print poster, not a film.
//
// Everything else in this repo is a 9:16 animation that gets screen-recorded
// and posted to Instagram. This is not that. This is one flat page, 8.5x11
// portrait, meant to be printed and taped to a Staples counter / stanchion /
// endcap, and it is governed by print rules instead of IG ones:
//
//   · no animation, no timeline, no state — it renders to a single frame
//   · the page is a FIXED 850x1100 box (100 units per inch), so screenshotting
//     it at deviceScaleFactor 3 lands exactly 2550x3300 = 8.5x11" @ 300dpi
//   · the IG "crop guard" in CLAUDE.md does not apply; what applies instead is
//     a 0.45" print margin, because a home/office trimmer and a Staples copy
//     centre both eat the edge
//
// ── WHO THIS IS FOR ──
//
// The reader is a Staples customer standing at a till with a $90 cart, who has
// possibly never heard of Code Ninjas. That dictates the whole hierarchy:
//
//   1. the OFFER, because it is the only reason to stop walking
//   2. HOW to get it, in three numbered steps, because an in-store poster that
//      does not say what to do at the register is decoration
//   3. WHAT Code Ninjas is, in one line, because half this audience does not
//      know and will not scan a code to find out
//
// ── CO-BRAND HANDLING (same rules as StaplesLockupAd) ──
//
// This hangs inside a partner's store, so it has to look like the partner
// approved it. Both marks are used AS SUPPLIED — no recolour, no crop, no
// rotation, no drop shadow, no filter of any kind, and neither sits in front
// of the other. The separator between them is a hairline, because a hairline
// says "with"; an ampersand or an X implies an owner. Red is the only colour
// on the page and both brands own it.
//
// ── WHY IT IS PLAIN ──
//
// Staples in-store signage is white, red, and set in a plain grotesque. A
// poster with a gradient sky, an arcade font and a starburst reads as a flyer
// somebody's dad printed, and a store manager takes it down. Restraint is what
// makes it look like it belongs on that wall.
import React from "react";
import "../Stylesheets/StaplesPosterInStore.css";

// The Staples horizontal logo as supplied by the brand (the current campaign
// artwork, not the duller CMYK version lifted out of the print promo PDF).
import staplesLogo from "../Images/staples-easy-logo.png";
// Code Ninjas horizontal logo AS VECTOR — an <img src> to an .svg, so it stays
// sharp at 300dpi. A raster wordmark blown up to poster size is the single
// most obvious tell of an unapproved print piece.
import cnLogo from "../Images/cn-logo-horizontal.svg";
// The easy button, keyed out of the official campaign image. Used once, at
// small size, as a quiet mark beside step 1 — not as a punchline.
import easyBtn from "../Images/staples-easy.png";
// Generated with segno at error-correction level H, which tolerates ~30% of
// the symbol being unreadable — this sheet ends up taped to a counter, folded
// into a bag, or photocopied by the store, and a level-L code stops scanning
// after any of those. Regenerate it if the URL ever changes; it encodes
// https://cnwoodbridge.com and nothing else (no tracking parameters, so it
// cannot rot).
import qr from "../Images/qr-cnwoodbridge.svg";

// Lifted from the Staples Canada owner SOP for this promotion, not paraphrased
// from memory. Every clause is a condition somebody can be turned away at the
// front desk for, so none of them are optional — and on a printed poster there
// is no "swipe up" to correct them later.
const OFFER = {
  trigger: "Spend $100 at Staples",
  amount: "$50",
  amountLabel: "off",
  what: "your first 3 months at Code Ninjas",
  code: "STAPLES2026",
  site: "cnwoodbridge.com",
  terms:
    "Requires a $100+ (before tax) single-transaction in-store purchase at any Staples in Canada. " +
    "New Code Ninjas members only. Applies to a 3-month membership paid in full. " +
    "One redemption per customer per 3-month period. Cannot be combined with other offers. " +
    "Offer valid through October 31, 2026.",
};

// Three steps, because that is the number a person reads standing up. Each one
// is an instruction the reader can act on today, in this store.
const STEPS = [
  {
    n: "1",
    head: "Shop $100 at Staples",
    body: "Any single in-store purchase of $100 or more, before tax. Keep your receipt.",
  },
  {
    n: "2",
    head: "Bring it to Code Ninjas",
    body: "Show the receipt and quote code STAPLES2026 when you sign your child up.",
  },
  {
    n: "3",
    head: "Take $50 off",
    body: "$50 comes straight off a 3-month membership — weekly sessions, paid in full.",
  },
];

export default function StaplesPosterInStore() {
  return (
    <div className="pz-sheet">
      <div className="pz-page">
        {/* ---- the co-brand lockup ----
            Equal weight, equal optical size, a hairline between them. This is
            the first thing a store manager checks and the first thing a brand
            team rejects, so it is the first thing on the page. */}
        <header className="pz-lockup">
          <img className="pz-lockup-s" src={staplesLogo} alt="Staples" />
          <span className="pz-lockup-bar" aria-hidden />
          <img className="pz-lockup-c" src={cnLogo} alt="Code Ninjas" />
        </header>

        {/* ---- the offer ----
            The trigger line sits ABOVE the number on purpose: the number is
            meaningless until the reader knows it is attached to a purchase
            they are already making. */}
        <section className="pz-offer">
          <p className="pz-trigger">{OFFER.trigger} today and get</p>

          <p className="pz-amount">
            <span className="pz-amount-n">{OFFER.amount}</span>
            <span className="pz-amount-x">{OFFER.amountLabel}</span>
          </p>

          <p className="pz-what">{OFFER.what}</p>

          {/* One line for the reader who has never heard of the brand. Ages
              and the "build real games" promise are the two facts that decide
              whether this is for them. */}
          <p className="pz-who">
            After-school coding for kids ages 7&ndash;14 &mdash; they learn by building real games.
          </p>
        </section>

        <span className="pz-rule" aria-hidden />

        {/* ---- how to redeem ----
            An in-store poster that does not say what to do at the register is
            decoration. */}
        <section className="pz-steps">
          <h2 className="pz-steps-h">How it works</h2>
          <ol>
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className="pz-step-n" aria-hidden>{s.n}</span>
                <span className="pz-step-t">
                  <b>{s.head}</b>
                  <i>{s.body}</i>
                </span>
              </li>
            ))}
          </ol>
          {/* The easy button, once, small, sitting with the steps rather than
              floating over the headline. */}
          <img className="pz-easy" src={easyBtn} alt="" aria-hidden />
        </section>

        {/* ---- the code ----
            The one thing the reader has to carry out of the store, so it gets
            its own band and the only monospace on the page. Between two rules
            rather than inside a dashed coupon box: a coupon border is
            discount-retail, and this is a partnership that carries an offer. */}
        <section className="pz-code">
          <span className="pz-code-k">Offer code</span>
          <span className="pz-code-v">{OFFER.code}</span>
        </section>

        {/* ---- where ----
            The lockup ad deliberately carries no URL, because it is written to
            be adopted nationally. A printed sheet on one store's wall is the
            opposite case: the reader is standing in a specific plaza and needs
            a specific place to go. */}
        <footer className="pz-foot">
          {/* The QR earns its place here specifically because the reader is
              standing up with their hands full: it is the only element on the
              sheet that turns "interesting" into a booking without asking them
              to remember anything. The URL stays set large next to it for the
              half of this audience who will not scan a code in a store. */}
          <img className="pz-qr" src={qr} alt="" aria-hidden />
          <p className="pz-site">{OFFER.site}</p>
          {/* The lockup ad deliberately names no franchise, because it is written
              to be adopted nationally. This sheet is the opposite case again:
              the reader is in one plaza and needs to know which centre, and
              the supplied Code Ninjas wordmark carries no location text. */}
          <p className="pz-scan">Scan to book a first session at Code Ninjas Woodbridge</p>
          <p className="pz-terms">{OFFER.terms}</p>
        </footer>
      </div>
    </div>
  );
}
