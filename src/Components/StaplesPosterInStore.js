// StaplesPosterInStore.jsx — a STATIC print poster, not a film.
//
// Everything else in this repo is a 9:16 animation that gets screen-recorded
// and posted to Instagram. This is not that. This is one flat page, 8.5x11
// portrait, meant to be printed and hung at a Staples, and it is governed by
// print rules instead of IG ones:
//
//   · no animation, no timeline, no state — it renders to a single frame
//   · the page is a FIXED 850x1100 box (100 units per inch), so screenshotting
//     it at deviceScaleFactor 3 lands exactly 2550x3300 = 8.5x11" @ 300dpi
//   · the IG "crop guard" in CLAUDE.md does not apply; what applies instead is
//     a print margin, and nothing bleeds off the sheet, so this runs on an
//     office printer that cannot do full bleed
//
// ── THE SHEET IS TWO HALVES, AND THAT IS THE WHOLE DESIGN ──
//
// The first pass at this was a centred stack of blocks on white: correct,
// legible, and indistinguishable from a form. What makes a printed sheet read
// as a POSTER rather than a printout is one committed block of colour and one
// subject, so:
//
//   WHITE HALF — the offer. Big number, the ninja, and the one line that says
//   who this is for. This half is doing the selling and it is the half you can
//   read from across an aisle.
//
//   RED HALF — the mechanics. Three steps, the code. Reversed out of Staples
//   red, which is a colour both brands own, so the sheet matches the signage
//   already on that wall instead of competing with it.
//
// The band is inset to the margin rather than bled to the page edge, on
// purpose: bleed needs a trimmer, and this has to survive being run off on the
// store's own copier.
//
// ── WHY THE NINJA IS HERE ──
//
// The earlier version had no character on it at all, so nothing told a passing
// shopper in under a second that this was for their kid. The ninja with the
// laptop and the handheld IS the pitch — learn to code by building games — and
// it is the brand's own art, used as supplied.
//
// ── CO-BRAND HANDLING (same rules as StaplesLockupAd) ──
//
// This hangs inside a partner's store, so it has to look like the partner
// approved it. Both marks are used AS SUPPLIED — no recolour, no crop, no
// rotation, no drop shadow, no filter, and no knocking one back to a
// watermark. Neither sits in front of the other. The separator in the header
// is a hairline, because a hairline says "with"; an ampersand or an X implies
// an owner. Red is the only colour on the sheet and both brands own it.
import React from "react";
import "../Stylesheets/StaplesPosterInStore.css";

// The Staples horizontal logo as supplied by the brand (the current campaign
// artwork, not the duller CMYK version lifted out of the print promo PDF).
import staplesLogo from "../Images/staples-easy-logo.png";
// Code Ninjas horizontal logo AS VECTOR — an <img src> to an .svg, so it stays
// sharp at 300dpi. A raster wordmark blown up to poster size is the single
// most obvious tell of an unapproved print piece.
import cnLogo from "../Images/cn-logo-horizontal.svg";
// The easy button, keyed out of the official campaign image. It marks the
// STAPLES half of the mechanic — it sits on the "spend $100 at Staples" line
// and nowhere else, so it reads as a label rather than a sticker.
import easyBtn from "../Images/staples-easy.png";
// The subject. Laptop plus handheld in one pose: the whole proposition as an
// image, which is what the sheet needs in the second before anybody reads a
// word of it.
import ninja from "../Images/b2s-ninja-handheld.png";
// Generated with segno at error-correction level H, which tolerates ~30% of
// the symbol being unreadable — this sheet ends up taped to a counter, folded
// into a bag, or photocopied by the store, and a level-L code stops scanning
// after any of those.
//
// IT POINTS AT THE WOODBRIDGE CENTRE and the printed address beside it is the
// national one, and now that the two sit side by side THAT IS A LIVE ISSUE. It
// used to be defensible on the grounds that nothing was printed next to the
// code promising where it went; the code now sits against codeninjas.com, and a
// reader will reasonably read the pair as "this code opens that address". It
// does not — it opens cnwoodbridge.com.
//
// Nobody is misled about anything that matters (both are Code Ninjas, and the
// offer is good at either), but it is a mismatch somebody will eventually
// notice, and it wants one of two decisions from the owner: print
// cnwoodbridge.com as the address, or caption the code with where it goes. Do
// not "fix" it by silently repointing the QR at codeninjas.com — the scans
// coming to the local centre is the entire reason the code is on the sheet.
//
// No tracking parameters, so it cannot rot.
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
  who: "Coding for kids ages 5–14 — they learn by building real video games.",
  code: "STAPLES2026",
  // Set on the sheet, not only in the fine print. A dated offer whose date is
  // reachable at 8pt is a dated offer nobody reads as urgent — and this one
  // hangs on a wall for months, so "is this still on?" is the question it has
  // to answer without anybody crouching.
  ends: "Offer ends October 31, 2026",
  site: "codeninjas.com",
  terms:
    "Requires a $100+ (before tax) single-transaction in-store purchase at any Staples in Canada. " +
    "New Code Ninjas members only. Applies to a 3-month membership paid in full. " +
    "One redemption per customer per 3-month period. Cannot be combined with other offers. " +
    "Offer valid through October 31, 2026.",
};

// THREE COLUMNS, not three stacked rows. Stacked, these ate a third of the
// sheet and pushed the offer up into the top corner; side by side they read as
// one sequence at a glance and give the hero its room back. It also forces the
// copy to stay short, which is the right discipline for something read
// standing up.
const STEPS = [
  {
    n: "1",
    head: "Shop $100 at Staples",
    body: "Any single in-store purchase of $100 or more, before tax. Keep the receipt.",
  },
  {
    n: "2",
    // One line at this column width. "Show it at Code Ninjas" wrapped to two
    // and pushed step 2's body a line lower than its neighbours', which is
    // what makes three columns stop reading as one row.
    head: "Visit Code Ninjas",
    body: "Bring the receipt and quote the code when you sign your child up.",
  },
  {
    n: "3",
    head: "Take $50 off",
    body: "It comes straight off a 3-month membership, paid in full.",
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

        {/* ---- the white half: the offer ----
            A two-column hero. The type owns the left, the subject owns the
            right, and the number is set big enough to be the thing that stops
            somebody walking past. */}
        <section className="pz-hero">
          <div className="pz-hero-copy">
            {/* The trigger sits ABOVE the number on purpose: the number is
                meaningless until the reader knows it is attached to a purchase
                they are already making. The easy button labels it as the
                Staples side of the deal. */}
            <p className="pz-trigger">
              <img src={easyBtn} alt="" aria-hidden />
              <span>{OFFER.trigger}</span>
            </p>

            <p className="pz-amount">
              <span className="pz-amount-n">{OFFER.amount}</span>
              <span className="pz-amount-x">{OFFER.amountLabel}</span>
            </p>

            <p className="pz-what">{OFFER.what}</p>
          </div>

          <img
            className="pz-ninja"
            src={ninja}
            alt="A Code Ninjas ninja building a game on a laptop"
          />
        </section>

        {/* One line for the reader who has never heard of the brand. The age
            range and "real video games" are the two facts that decide whether
            this is for them, so they are the two facts on the sheet. */}
        <p className="pz-who">{OFFER.who}</p>

        {/* ---- the red half: the mechanics ----
            An in-store poster that does not say what to do at the register is
            decoration. */}
        <section className="pz-band">
          {/* The expiry rides on the section label's own line rather than
              getting a line of its own — it costs no vertical space at all,
              and a right-aligned date opposite a left-aligned label is what
              makes the band read as a designed block instead of a stack. */}
          <div className="pz-band-h">
            <h2>How it works</h2>
            <p>{OFFER.ends}</p>
          </div>

          <ol className="pz-steps">
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className="pz-step-n" aria-hidden>{s.n}</span>
                <b>{s.head}</b>
                <i>{s.body}</i>
              </li>
            ))}
          </ol>

          {/* The one thing the reader has to carry out of the store, so it gets
              the only reversed block inside the band and the only monospace. */}
          <p className="pz-code">
            <span className="pz-code-k">Offer code</span>
            <span className="pz-code-v">{OFFER.code}</span>
          </p>
        </section>

        {/* ---- where ----
            NO FRANCHISE NAMED IN THE TYPE — same reason the lockup ad names
            none. The offer is good at Code Ninjas centres across Canada and
            this sheet prints for all of them, so a centre's name set in the
            footer would be wrong in every store but that centre's own. The
            printed address is the brand's; only the QR is ours. */}
        <footer className="pz-foot">
          {/* The code and the address are one object, centred together — see
              .pz-foot-pair. A scannable thing marooned in the corner reads as a
              printer's mark; beside the address it reads as "scan this". */}
          <div className="pz-foot-pair">
            <img className="pz-qr" src={qr} alt="" aria-hidden />
            {/* The inner span exists so the red rule under the address stops at
                the end of the word; on the <p> it would run the whole column. */}
            <p className="pz-site"><span>{OFFER.site}</span></p>
          </div>
          <p className="pz-terms">{OFFER.terms}</p>
        </footer>
      </div>
    </div>
  );
}
