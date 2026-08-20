// MapleBackToSchoolAd.jsx — the Maple Jiu Jitsu back-to-school post, animated on.
//
// This one starts from a finished artefact rather than a brief: the user had
// maple-back-to-school-post.png, a flat 1080x1350 graphic, and wanted it to
// assemble itself. So the job is not "design a back-to-school ad", it is
// "rebuild THAT poster as live elements and bring each one on", and every
// judgement here is subordinate to matching the source.
//
// ── IT IS 4:5, NOT 9:16 ──
//
// Every other ad in this repo is a 1080x1920 Reel. This is a FEED POST, because
// the source art is 1080x1350 and reflowing it to 9:16 would mean redesigning
// the thing the user asked to see animated. The stage is therefore 360x450,
// which is exactly 1080x1350 at deviceScaleFactor 3, and tools/record.js takes
// W and H for it:
//
//   W=360 H=450 MS=7000 HOLD=1.6 OUT=~/Downloads/maple-back-to-school.mp4 \
//     NODE_PATH=/tmp/rec/node_modules node tools/record.js
//
// The CLAUDE.md crop guard is also not in force: a feed post is not re-fit by a
// screen recording, and the source runs its address to within a few px of the
// bottom edge. Matching the source wins.
//
// ── WHAT IS ARTWORK AND WHAT IS TYPE ──
//
// Four things could not be rebuilt and were cut out of the source PNG instead —
// the leaf lockup, the gi, the glove and the Code Ninjas disc. They were keyed
// by flood-filling the navy INWARD FROM THE CROP EDGE rather than by thresholding
// on colour, because the gi has a black belt and the glove has near-black
// shadows: any global "remove dark blue" rule either eats those or leaves a navy
// fringe, while a fill that can only reach pixels connected to the edge cannot
// touch anything the subject encloses.
//
// They are cropped at the source's own resolution, so at 3x they land 1:1 on
// their own pixels — no upscale anywhere in the piece.
//
// Everything else is type and CSS, which is the point: a poster whose headline
// is a picture of a headline cannot animate a line at a time.
import React from "react";
import "../Stylesheets/MapleBackToSchoolAd.css";

import logo from "../Images/mbts-logo.png";
import gi from "../Images/mbts-gi.png";
import glove from "../Images/mbts-glove.png";
import cnDisc from "../Images/mbts-cn-disc.png";

// Straight off the artwork. These are somebody's live offer terms, so they are
// transcribed rather than rewritten — the values in particular ($120 / $50 /
// $169, summing to the "over $300" on the badge) have to keep agreeing with
// each other and with the badge.
const CARDS = [
  { n: "1", head: ["FREE GI"], value: "$120", art: gi, artClass: "mb-art-gi" },
  {
    n: "2",
    head: ["FREE", "BOXING GLOVES"],
    value: "$50",
    art: glove,
    artClass: "mb-art-glove",
  },
  {
    n: "3",
    head: ["FREE", "MONTH OF", "CODE NINJAS", "WOODBRIDGE"],
    value: "$169",
    art: cnDisc,
    artClass: "mb-art-disc",
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

  // One cascade rather than a phase machine: nothing here REPLACES anything
  // else, every element simply arrives and stays, so the choreography is a set
  // of delays and belongs in the stylesheet next to the durations. Mount paints
  // the empty stage; the class lands on the next frame so the film opens on it
  // instead of a third of the way through the first move.
  const [go, setGo] = React.useState(false);
  React.useEffect(() => {
    if (reduce) return undefined;
    const r = requestAnimationFrame(() => setGo(true));
    return () => cancelAnimationFrame(r);
  }, [reduce]);

  return (
    <div className={`mb-stage${go ? " mb-go" : ""}${reduce ? " mb-still" : ""}`}>
      <div className="mb-wash" aria-hidden />

      <img className="mb-logo" src={logo} alt="Maple Jiu Jitsu" />

      {/* The headline arrives a LINE at a time, which is the one thing a flat
          poster cannot do and the reason for rebuilding it as type. */}
      <h1 className="mb-head">
        <span>BACK TO</span>
        <span>SCHOOL</span>
      </h1>

      {/* The badge lands last of the top group and is the only element in the
          piece allowed to overshoot — it is a stamp, and a stamp that settles
          gently is not being stamped. */}
      <div className="mb-badge" aria-hidden={false}>
        <span className="mb-badge-over">OVER</span>
        <span className="mb-badge-n">$300</span>
        <span className="mb-badge-in">
          IN BONUS
          <br />
          VALUE
        </span>
      </div>

      {/* Both white bars WIPE rather than fade: they are slabs of ink, and ink
          arrives by being laid down. The inner span carries the type so the
          wipe reveals the word with the bar instead of the word fading on top
          of a bar that is already there. */}
      <div className="mb-special">
        <span>SPECIAL</span>
      </div>

      <p className="mb-eyebrow">
        <i aria-hidden />
        <span>For New Kids Signups</span>
        <i aria-hidden />
      </p>

      <ul className="mb-cards">
        {CARDS.map((c) => (
          <li className="mb-card" key={c.n}>
            <span className="mb-num" aria-hidden>{c.n}</span>
            <div className="mb-card-head">
              {c.head.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
            <p className="mb-value">
              <b>{c.value}</b> Value
            </p>
            <img className={`mb-art ${c.artClass}`} src={c.art} alt="" aria-hidden />
          </li>
        ))}
      </ul>

      <div className="mb-cta">
        <span>SIGN UP TODAY</span>
      </div>

      <p className="mb-site">
        <svg viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="9.2" />
          <ellipse cx="12" cy="12" rx="4" ry="9.2" />
          <path d="M2.8 12h18.4M4.4 6.8h15.2M4.4 17.2h15.2" />
        </svg>
        <span>maplebjj.com</span>
      </p>

      <p className="mb-addr">
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M12 22s7-7.1 7-12a7 7 0 1 0-14 0c0 4.9 7 12 7 12z" />
          <circle cx="12" cy="10" r="2.6" />
        </svg>
        <span>20 Cranston Park Ave, Vaughan</span>
      </p>
    </div>
  );
}
