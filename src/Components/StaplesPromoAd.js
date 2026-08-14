// StaplesPromoAd.jsx — the Staples partnership, typed onto two coupons.
//
// Two offers pointing opposite ways: a Staples customer gets $50 off joining
// Code Ninjas, a Code Ninjas family gets $20 off shopping at Staples. Each
// block leads with who it is for, because a reader sorts themselves in about a
// second if you let them and never if you don't.
//
// ── Two coupons, not one notice ──
//
// They are separate pieces of stock, stacked. An earlier pass ran both offers
// down one sheet with a perforation between them, and a perforation is a line:
// the two offers read as one list that happened to have a rule through it. Two
// cards read as two things, and a reader can see which one is theirs before
// reading either.
//
// The letterhead sits on the desk rather than on stock of its own — the marks
// arrive before any paper does, and a third card in a frame meant to hold two
// coupons is a third card.
//
// ── The desk ──
//
// School and office supply falls through the frame behind the coupons.
// Staples sells the things a school year is made of, so the ad's weather is
// those things — the one place in this layout where the partnership is shown
// rather than stated. Faint and behind, because it is the room the offer is
// standing in, not a second thing to read.
//
// ── Typed, not laid out ──
//
// Every line of the notice is struck on screen, left-aligned inside a centred
// block: centred monospace is a poster, left-aligned monospace is a document,
// and a document is what a coupon is. Line breaks are authored, not wrapped —
// every string below is one line as it will appear, measured to fit the
// column, which is the other half of setting a typed page and the reason
// nothing here ends in a widow.
//
// Speed carries the emphasis. The detail lines are brisk and the two amounts
// are struck slowly enough to be read as they arrive. Same idea as varying
// weight, except this ad has one typeface to vary.
//
// ── The opening ──
//
// SCENE ONE IS THE TWO MARKS AND NOTHING ELSE. They come in from opposite
// edges of an empty desk, INFLATING as they travel, and meet dead centre at
// nearly twice their final size. They do not stop politely apart either: the
// gap closes to nothing, so they arrive touching. That is also what pays for
// the inflation — set apart the pair is 181px wide and 1.75 would put it
// through the crop guard; closed up it is 167px, and 1.75 of that clears with
// 49px to spare.
//
// Contact combusts, and what comes out of it is a school year: a flash, two
// shockwave rings, shards off the seam, and a dozen pencils, laptops and
// scissors thrown clear. The two coupons are thrown out of the same point, one
// up and one down, while the pair rides into the letterhead.
//
// The approach is a keyframe on a fixed delay, so JS carries only the one beat
// it cannot express: the moment of contact, which everything the impact causes
// hangs off. HIT below and the 54% in the stylesheet's spLockup/spInL/spInR
// are the same instant written twice — a 90ms delay + .54 x 1350ms = 819ms.
// Move one and move the other.
//
// JS owns the typewriter and nothing else. It has to: a caret that follows the
// text needs the text to actually grow, so it cannot be a keyframe.
import React from "react";
import "../Stylesheets/StaplesPromoAd.css";

import cnLogo from "../Images/cn-woodbridge-logo.png";

// ── The Staples mark ─────────────────────────────────────────────────────
// SWAP POINT. Drop the supplied logo into src/Images/ (a transparent PNG or an
// SVG), import it here, and set USE_LOGO to true — the wordmark below is a
// stand-in, correct in colour and weight but not their actual letterforms, and
// it should not ship if the real mark is available.
//
//   import staplesLogo from "../Images/staples-logo.png";
//
const USE_LOGO = false;
const staplesLogo = null;

// One entry per printed line.
//   t  the line, exactly as it appears — breaks are authored, never wrapped
//   k  what kind of line it is, for styling
//   z  which offer block it belongs to
//   s  milliseconds per character
//   a  the pause after the line lands, i.e. the carriage return
//
// PLACEHOLDER COPY. The amounts, the thresholds, the code and both dates are
// the offer itself and are public-facing — confirm them before a take is
// posted (repo rule, and this one carries a partner's name as well as ours).
const LINES = [
  { t: "NEW TO CODE NINJAS", k: "who", z: 0, s: 26, a: 200 },

  { t: "$50 OFF", k: "amt", z: 0, s: 95, a: 260 },
  { t: "a new 3-month membership,", k: "what", z: 0, s: 16, a: 50 },
  { t: "paid in full", k: "what", z: 0, s: 16, a: 200 },

  { t: "Spend $100 or more at Staples", k: "meta", z: 0, s: 11, a: 70 },
  { t: "Through October 31, 2026", k: "meta", z: 0, s: 11, a: 620 },

  { t: "ALREADY A CODE NINJAS FAMILY?", k: "who", z: 1, s: 26, a: 200 },

  { t: "$20 OFF", k: "amt", z: 1, s: 95, a: 260 },
  { t: "a $75 Staples order,", k: "what", z: 1, s: 16, a: 50 },
  { t: "at any Canadian location", k: "what", z: 1, s: 16, a: 200 },

  { t: "Through September 14, 2026", k: "meta", z: 1, s: 11, a: 0 },
];

// ── the desk ──────────────────────────────────────────────────────────────
// School and office supply, falling. Staples sells the things a school year is
// made of, so the ad's weather is those things — the one place in this layout
// where the partnership can be shown rather than stated.
//
// Deliberately behind the coupons and deliberately faint: this is the room the
// offer is standing in, not a second thing to read.
const GLYPHS = ["✏️", "📎", "📐", "📏", "✂️", "📓", "💻", "🖍️", "🖊️", "📌", "🎒", "📚", "🖇️", "🧮", "⌨️", "📝", "🍎", "🔖"];

// Seven columns. Every value comes off the index — no randomness anywhere in
// this repo, so every take of the recording is identical.
//
// Each column carries EIGHT glyphs and renders them twice, and the fall is a
// translate of exactly -50% to 0, so the second copy arrives where the first
// one was and the loop has no seam. The gap is in vh rather than em so a
// column's half-height clears the frame at any of the sizes below.
const RAIN = Array.from({ length: 7 }, (_, i) => ({
  x: (i + 0.5) * (100 / 7),                                    // % across
  size: 15 + ((i * 5) % 11),                                   // px
  dur: 15 + ((i * 3.4) % 9),                                   // seconds
  delay: -((i * 4.3) % 13),                                    // already falling at frame one
  op: 0.2 + ((i % 3) * 0.055),
  glyphs: Array.from({ length: 8 }, (_, j) => GLYPHS[(i * 5 + j * 3) % GLYPHS.length]),
}));

// What the impact throws. The shards are the physics; the supply thrown out
// with them is the point — the two marks hit each other and a school year
// comes out. x/y are computed here rather than with CSS cos()/sin(), which is
// recent enough to be worth not depending on.
const EJECT = Array.from({ length: 11 }, (_, i) => {
  const a = ((i / 11) * 360 + (i % 2) * 14) * (Math.PI / 180);
  const d = 92 + ((i * 29) % 54);
  return {
    g: GLYPHS[(i * 7) % GLYPHS.length],
    x: Math.round(Math.cos(a) * d),
    y: Math.round(Math.sin(a) * d),
    r: ((i * 47) % 120) - 60,        // degrees of spin
    s: 13 + ((i * 3) % 8),           // px
    t: (i % 3) * 26,                 // ms of stagger
  };
});

// The shards thrown out of the seam. Generated rather than hand-listed, but
// generated from the INDEX and nothing else — no randomness anywhere in this
// repo, so every take of the recording is identical. The small irregularities
// in angle, reach and size are what stop it reading as a starburst clip-art.
const SPARKS = Array.from({ length: 18 }, (_, i) => ({
  a: (i / 18) * 360 + (i % 3) * 6,   // degrees, nudged off the even spacing
  d: 74 + ((i * 37) % 66),           // how far it gets, in px
  w: 4 + ((i * 13) % 7),             // its length
  t: (i % 4) * 22,                   // and a stagger, so they do not leave as one
  ink: i % 3 === 0,                  // one in three is ink rather than red
}));

// Carry each line's index in the flat script with it, then split by block: the
// typewriter walks one list, the layout draws two columns of it.
const SCRIPT = LINES.map((l, i) => ({ ...l, i }));
const BLOCKS = [0, 1].map((z) => SCRIPT.filter((l) => l.z === z));

// The opening, in one timeline.
//
// SCENE ONE IS THE TWO MARKS AND NOTHING ELSE. They come in from opposite
// edges of an empty desk, INFLATING as they travel, and meet dead centre at
// nearly twice their final size. There is no voucher yet, no kicker, no
// divider — the frame holds two logos.
//
// They do not stop politely apart, either: the gap closes to nothing, so they
// arrive touching. That is also what pays for the inflation — set apart the
// pair is 181px wide and 1.75 would put it through the crop guard; closed up
// it is 167px, and 1.75 of that clears with 49px to spare.
//
// Contact combusts: a flash, a ring, and shards thrown out of the seam. The
// paper opens out of that same point, up and down at once, while the pair
// recoils to its resting gap and rides up into the letterhead. The marks
// BECOME the letterhead rather than having been sitting in it all along.
//
// The approach is a keyframe on a fixed delay, so JS carries only the one beat
// it cannot express: the moment of contact, which everything the impact causes
// hangs off. HIT below and the 54% in the stylesheet's spLockup/spInL/spInR
// are the same instant written twice — a 90ms delay + .54 x 1350ms = 819ms.
// Move one and move the other.
//
// HIT is when they touch. Everything the collision causes — the divider being
// struck between them, the marks settling out of their approach scale, the
// stock unfurling, the kicker — hangs off that single flag.
const HIT = 820;
const OPEN = 1240;

export default function StaplesPromoAd() {
  const reduce = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // -1 is the beat before the first key; LINES.length is the finished page.
  const [li, setLi] = React.useState(-1);
  const [ch, setCh] = React.useState(0);
  // the marks have met. Everything the impact sets off keys off this.
  const [hit, setHit] = React.useState(false);

  React.useEffect(() => {
    if (reduce) {
      setHit(true);
      setLi(LINES.length);
      return undefined;
    }
    const a = setTimeout(() => setHit(true), HIT);
    const b = setTimeout(() => setLi(0), OPEN);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [reduce]);

  React.useEffect(() => {
    if (reduce || li < 0 || li >= LINES.length) return undefined;
    const line = LINES[li];

    // Mid-line: strike the next character.
    if (ch < line.t.length) {
      const t = setTimeout(() => setCh((c) => c + 1), line.s);
      return () => clearTimeout(t);
    }

    // End of line: hold, then return.
    const t = setTimeout(() => {
      setLi((l) => l + 1);
      setCh(0);
    }, line.a);
    return () => clearTimeout(t);
  }, [li, ch, reduce]);

  const done = li >= LINES.length;

  return (
    <div
      className={`sp-stage${hit ? " is-hit" : ""}${done ? " sp-done" : ""}`}
    >
      {/* the weather, behind everything */}
      <div className="sp-rain" aria-hidden>
        {RAIN.map((c, i) => (
          <span
            key={i}
            className="sp-rain-col"
            style={{
              left: `${c.x}%`,
              fontSize: `${c.size}px`,
              opacity: c.op,
              "--dur": `${c.dur}s`,
              "--delay": `${c.delay}s`,
            }}
          >
            {c.glyphs.concat(c.glyphs).map((g, j) => (
              <i key={j}>{g}</i>
            ))}
          </span>
        ))}
      </div>

      <div className="sp-card">
        {/* ---- letterhead ----
            On the desk itself, not on stock: the marks arrive before any paper
            does, and giving them a card of their own would make three cards in
            a frame that is meant to hold two coupons. A hairline between two
            marks is the standard way to say "with", and it keeps either brand
            from looking like it owns the other. */}
        <div className="sp-head">
          <div className="sp-kicker">PARTNER OFFER</div>
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
        </div>

        {/* ---- two coupons, stacked ----
            Separate pieces of stock rather than one sheet with a perforation
            through it. Two offers to two different people are two coupons, and
            the reader should be able to see which one is theirs before reading
            either. Each is thrown out of the impact — the first upward, the
            second downward — so the pair lands as a consequence of the clash. */}
        {BLOCKS.map((lines, z) => (
          <div
            className={`sp-coupon sp-coupon-${z + 1}${
              lines[0].i <= li ? " is-open" : ""
            }`}
            key={z}
          >
            {/* the cut line, which is most of what says "coupon" */}
            <span className="sp-cut" aria-hidden />

            <div className="sp-blockhead">
              <span className="sp-num">{`0${z + 1}`}</span>
              <Line line={lines[0]} li={li} ch={ch} />
            </div>
            <span className="sp-hrule" aria-hidden />

            {lines.slice(1).map((line) => (
              <Line key={line.i} line={line} li={li} ch={ch} />
            ))}
          </div>
        ))}

        {/* The contact, pinned to the middle of the card — where the two marks
            meet, and where both coupons are thrown from. */}
        <div className="sp-burst" aria-hidden>
          <span className="sp-flash" />
          <span className="sp-ring" />
          <span className="sp-ring sp-ring-2" />
          {SPARKS.map((s, i) => (
            <span
              key={i}
              className={`sp-spark${s.ink ? " sp-spark-ink" : ""}`}
              style={{ "--a": s.a, "--d": s.d, "--w": s.w, "--t": `${s.t}ms` }}
            />
          ))}
          {EJECT.map((e, i) => (
            <span
              key={`e${i}`}
              className="sp-eject"
              style={{
                fontSize: `${e.s}px`,
                "--x": `${e.x}px`,
                "--y": `${e.y}px`,
                "--r": `${e.r}deg`,
                "--t": `${e.t}ms`,
              }}
            >
              {e.g}
            </span>
          ))}
        </div>
      </div>

      {/* Over everything: the desk stays flat and the light arrives on top. */}
      <div className="sp-vignette" aria-hidden />
      <div className="sp-grain" aria-hidden />
    </div>
  );
}

/**
 * One printed line. Every line is present from frame one as a hidden ghost
 * holding its own width and height, with the struck text laid over it —
 * without that the block grows a line at a time and, because it is centred,
 * the whole page creeps upward on every carriage return.
 */
function Line({ line, li, ch }) {
  const started = line.i <= li;
  return (
    <div className={`sp-line sp-${line.k}${started ? " is-typed" : ""}`}>
      <span className="sp-ghost" aria-hidden>
        {line.t}
      </span>
      <span className="sp-live">
        {line.i < li ? line.t : line.i === li ? line.t.slice(0, ch) : ""}
        {line.i === li && <i className="sp-caret" aria-hidden />}
      </span>
    </div>
  );
}
