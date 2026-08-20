// MapleBackToSchoolAd.jsx — the Maple Jiu Jitsu back-to-school offer.
//
// This started as a faithful rebuild of maple-back-to-school-post.png so the
// flat graphic could animate on. It is not that any more: the source ran its
// content to within two px of the sheet edge, stacked the leaf on top of the
// headline, and put its strongest fact — over $300 of gear, free — in a small
// circle off to one side. Those are the three things this pass fixes, so the
// layout is now its own thing that happens to carry the same offer.
//
// ── EVERY NUMBER STILL COMES FROM THE SOURCE ──
//
// The offer is somebody's live promotion. $120 + $50 + $169 is the "over $300",
// the address and the domain are real, and "new kids signups" is the
// eligibility. Restyling is free; changing any of that is not.
//
// ── THE ORDER THE EYE TAKES IT IN ──
//
// A feed post gets somewhere under a second. So the piece is built as four
// beats of decreasing size, and the animation delivers them in that order
// rather than top to bottom:
//
//   1. BACK TO SCHOOL      the biggest thing on it, and the only gradient
//   2. OVER $300 FREE      the hook, promoted out of its circle into a gold
//                          bar the full width of the composition
//   3. the three cards      what you actually get
//   4. how to get it        CTA, site, address
//
// ── IT IS 4:5 ──
//
//   W=360 H=450 MS=6000 HOLD=1.8 BG='#00091c' \
//     OUT=~/Downloads/maple-back-to-school.mp4 \
//     NODE_PATH=/tmp/rec/node_modules node tools/record.js
//
// 360x450 at deviceScaleFactor 3 is 1080x1350 exactly, with nothing resampled.
//
// ── THE FOUR CUT-OUTS ──
//
// The leaf, the gi, the glove and the Code Ninjas disc could not be rebuilt in
// CSS and were keyed out of the source PNG — flood-filled inward from the crop
// edge, because the gi has a black belt and the glove near-black shadows, and a
// fill that can only reach pixels connected to the edge cannot touch anything
// the subject encloses. They are cropped at source resolution, so at 3x they
// land 1:1 on their own pixels.
import React from "react";
import "../Stylesheets/MapleBackToSchoolAd.css";

import logo from "../Images/mbts-logo.png";
import gi from "../Images/mbts-gi.png";
import glove from "../Images/mbts-glove.png";
import cnDisc from "../Images/mbts-cn-disc.png";

const CARDS = [
  { n: "1", head: "FREE GI", sub: null, value: "$120", art: gi, cls: "mb-art-gi" },
  { n: "2", head: "FREE", sub: "BOXING GLOVES", value: "$50", art: glove, cls: "mb-art-glove" },
  {
    n: "3",
    head: "FREE",
    // One line, not four. The source set this as MONTH OF / CODE NINJAS /
    // WOODBRIDGE and had to shrink the whole card to fit it, which is why that
    // card read smaller than its neighbours. The disc underneath already says
    // Code Ninjas Woodbridge — repeating it in type was the reason the card was
    // crowded, so the type says the part the disc cannot.
    sub: "MONTH OF CODE NINJAS",
    value: "$169",
    art: cnDisc,
    cls: "mb-art-disc",
  },
];

export default function MapleBackToSchoolAd() {
  const reduce = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const [go, setGo] = React.useState(false);
  React.useEffect(() => {
    if (reduce) return undefined;
    const r = requestAnimationFrame(() => setGo(true));
    return () => cancelAnimationFrame(r);
  }, [reduce]);

  return (
    <div className={`mb-stage${go ? " mb-go" : ""}${reduce ? " mb-still" : ""}`}>
      {/* The room. Three layers, none of them flat: a warm key over the
          headline, a cold one under the cards, and a mat of fine diagonals so
          the navy has a surface instead of being a fill. */}
      <div className="mb-key" aria-hidden />
      <div className="mb-weave" aria-hidden />
      <div className="mb-vig" aria-hidden />

      <div className="mb-page">
        <header className="mb-top">
          <img className="mb-logo" src={logo} alt="Maple Jiu Jitsu" />
        </header>

        {/* The headline carries the only gradient in the piece, and one light
            passes over it — see .mb-head in the stylesheet. */}
        <h1 className="mb-head">
          <span className="mb-line"><i>BACK TO</i></span>
          <span className="mb-line"><i>SCHOOL</i></span>
        </h1>

        <div className="mb-special">
          <span>SPECIAL</span>
        </div>

        {/* THE HOOK, out of its circle. In the source this was small type in a
            ring beside the headline; it is the single most persuasive fact in
            the offer and it now runs the full width. */}
        <p className="mb-hook">
          <b>OVER $300</b>
          <span>IN FREE GEAR</span>
        </p>

        <p className="mb-eyebrow">For new kids signups</p>

        <ul className="mb-cards">
          {CARDS.map((c) => (
            <li className="mb-card" key={c.n}>
              <span className="mb-num" aria-hidden>{c.n}</span>
              <div className="mb-card-body">
                <p className="mb-card-head">
                  <b>{c.head}</b>
                  {c.sub && <i>{c.sub}</i>}
                </p>
                <p className="mb-value">
                  <b>{c.value}</b> value
                </p>
              </div>
              <span className="mb-art-slot">
                <img className={`mb-art ${c.cls}`} src={c.art} alt="" aria-hidden />
              </span>
            </li>
          ))}
        </ul>

        <footer className="mb-foot">
          <p className="mb-cta"><span>SIGN UP TODAY</span></p>
          <p className="mb-where">
            <b>maplebjj.com</b>
            <i aria-hidden />
            <span>20 Cranston Park Ave, Vaughan</span>
          </p>
        </footer>
      </div>

      <div className="mb-grain" aria-hidden />
    </div>
  );
}
