// StaplesPromoAd.jsx — the Staples partnership, typed onto two coupons.
//
// Two offers pointing opposite ways: a Staples customer gets $50 off joining
// Code Ninjas, a Code Ninjas family gets $20 off shopping at Staples. Each
// block leads with who it is for, because a reader sorts themselves in about a
// second if you let them and never if you don't.
//
// ── The opening is the rain ──
//
// The ad opens in a downpour of school and office supply — dense, fast,
// full-frame, falling in columns with the bright head and fading tail of a
// Matrix rain. Then it calms: the storm thins out and settles to a faint
// weather behind the offers, and the coupons lay down out of it.
//
// Staples sells the things a school year is made of, so the ad's weather is
// those things. It is the one place in this layout where the partnership gets
// shown rather than stated, and it does the work an opening title would
// otherwise have to do.
//
// TWO RAIN LAYERS, NOT ONE RE-TIMED. The storm is dense and fast, the calm is
// sparse and slow, and they cross-fade. Changing an animation's duration
// mid-flight jumps it — the same glyph is suddenly somewhere else — so the
// only thing that ever animates on a running column here is its opacity.
//
// ── Two coupons, not one notice ──
//
// They are separate pieces of stock, stacked. An earlier pass ran both offers
// down one sheet with a perforation between them, and a perforation is a line:
// the two offers read as one list that happened to have a rule through it. Two
// cards read as two things, and a reader can see which one is theirs before
// reading either.
//
// The letterhead sits on the desk rather than on stock of its own — a third
// card in a frame meant to hold two coupons is a third card.
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
// JS owns the typewriter and the one beat CSS cannot know — when the storm
// calms — and nothing else. A caret that follows the text needs the text to
// actually grow, so it cannot be a keyframe.
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

// ── the weather ───────────────────────────────────────────────────────────
// The things a school year is made of.
const GLYPHS = ["✏️", "📎", "📐", "📏", "✂️", "📓", "💻", "🖍️", "🖊️", "📌", "🎒", "📚", "🖇️", "🧮", "⌨️", "📝", "🍎", "🔖"];

/**
 * A deterministic hash: an integer in, a well-scattered number in [0,1) out.
 *
 * The rain has to look random and be identical in every take of the
 * recording, and there is no randomness anywhere in this repo. The previous
 * pass got its variety from arithmetic — (i * 5 + j * 3) % n and friends —
 * which is not scattered, it is a cycle: every column ran the same glyphs in
 * the same order a few steps apart, and at a glance the field read as a
 * pattern rather than as weather. This is the cheapest thing that actually
 * scatters.
 */
function hash(n) {
  let x = Math.imul(n ^ 61, 0x27d4eb2d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  return (x >>> 0) / 4294967296;
}

/**
 * One field of falling columns.
 *
 * Each column carries `n` glyphs and renders them TWICE, and the fall is a
 * translate of exactly -50% to 0, so the second copy arrives where the first
 * one was and the loop has no seam.
 *
 * THE GAP IS DERIVED, NOT CHOSEN. One copy of a column has to be taller than
 * the frame or the column runs out of glyphs on the way down and leaves a
 * hole — so the slot each glyph gets is `span / n`, and the gap is whatever is
 * left after the glyph itself. That is what lets `n` vary per column: a
 * sixteen-glyph column is a tight stream and a ten-glyph one is a loose one,
 * and both still cover the frame.
 *
 * Everything else varies per column too — x within its lane, size, speed,
 * phase, and which glyphs it carries. The phase matters most: a field whose
 * heads are level reads as a curtain coming down, not as rain.
 */
function field({ cols, n, size, span, dur, tail, seed }) {
  return Array.from({ length: cols }, (_, i) => {
    const r = (k) => hash(i * 31 + k + seed * 977);
    const count = n[0] + Math.floor(r(1) * (n[1] - n[0] + 1));
    const px = Math.round(size[0] + r(2) * (size[1] - size[0]));
    const lane = 100 / cols;

    return {
      // in its lane, but not centred in it — a perfect grid is a texture
      x: (i + 0.5) * lane + (r(3) - 0.5) * lane * 0.7,
      size: px,
      // bigger reads as nearer, and nearer falls faster
      dur: dur[1] - ((px - size[0]) / (size[1] - size[0])) * (dur[1] - dur[0]) + r(4) * 0.9,
      gap: Math.max(10, span / count - px),
      tail,
      glyphs: Array.from({ length: count }, (_, j) =>
        GLYPHS[Math.floor(r(10 + j) * GLYPHS.length)]
      ),
    };
  }).map((c) => ({
    ...c,
    // a full phase spread, so no two columns are ever in step
    delay: -(hash(c.size * 7919 + Math.round(c.x * 13)) * c.dur),
  }));
}

// The downpour. Sixteen lanes, streams of ten to nineteen, and a tail that
// dies off exponentially — a linear fade is a gradient, a curve is a trail.
// The exponent is worth tuning by eye: at 2.4 most of every stream sits under
// 0.2 and the field goes washy, and at 1 there is no head at all.
const STORM = field({
  cols: 16, n: [10, 19], size: [11, 21], span: 930, dur: [2.4, 5.2], tail: 1.8, seed: 3,
});

// What it settles to: the room the offer is standing in, not a second thing
// to read. Slower, sparser, and its glyphs hold their brightness — a dying
// tail at this opacity is just missing glyphs.
const CALM = field({
  cols: 6, n: [7, 10], size: [15, 26], span: 980, dur: [14, 24], tail: 0.7, seed: 11,
});


// Carry each line's index in the flat script with it, then split by block: the
// typewriter walks one list, the layout draws two coupons of it.
const SCRIPT = LINES.map((l, i) => ({ ...l, i }));
const BLOCKS = [0, 1].map((z) => SCRIPT.filter((l) => l.z === z));

// CALM_AT is when the downpour breaks: the storm fades out, the ambient rain
// fades in under it, the letterhead resolves and the coupons lay down out of
// it. OPEN follows close behind rather than after — at a wider gap the frame
// holds two blank cards for most of a second, which is a beat with nothing in
// it.
const CALM_AT = 900;
const OPEN = 1300;

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
  // the storm has broken. Everything the composition does keys off this.
  const [calm, setCalm] = React.useState(false);

  React.useEffect(() => {
    if (reduce) {
      setCalm(true);
      setLi(LINES.length);
      return undefined;
    }
    const a = setTimeout(() => setCalm(true), CALM_AT);
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
      className={`sp-stage${calm ? " is-calm" : ""}${done ? " sp-done" : ""}`}
    >
      {/* ---- the weather ----
          Two fields. The storm owns the opening and fades out; the calm one
          fades in under it and stays for the rest of the take. */}
      <Rain className="sp-rain sp-rain-storm" cols={STORM} />
      <Rain className="sp-rain sp-rain-calm" cols={CALM} />

      <div className="sp-card">
        {/* ---- letterhead ----
            On the desk itself, not on stock: a third card in a frame meant to
            hold two coupons is a third card. A hairline between two marks is
            the standard way to say "with", and it keeps either brand from
            looking like it owns the other. */}
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
            either. They lay down out of the rain, top edge first, one after
            the other. */}
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
      </div>

      {/* Over everything: the desk stays flat and the light arrives on top. */}
      <div className="sp-vignette" aria-hidden />
      <div className="sp-grain" aria-hidden />
    </div>
  );
}

/**
 * One field of falling columns. Each column renders its glyphs twice — the
 * fall is a translate of exactly -50% to 0, so the second copy arrives where
 * the first one was and the loop has no seam.
 *
 * The opacity ramp is applied per COPY, so the pattern repeats with the loop
 * rather than flashing at the wrap: every run of glyphs has a faint tail and a
 * bright head, which is the whole read of a Matrix rain.
 */
function Rain({ className, cols }) {
  return (
    <div className={className} aria-hidden>
      {cols.map((c, i) => (
        <span
          key={i}
          className="sp-rain-col"
          style={{
            left: `${c.x}%`,
            fontSize: `${c.size}px`,
            gap: `${c.gap}px`,
            "--dur": `${c.dur}s`,
            "--delay": `${c.delay}s`,
          }}
        >
          {c.glyphs.concat(c.glyphs).map((g, j) => {
            const k = j % c.glyphs.length;              // position within a copy
            const t = k / (c.glyphs.length - 1);        // 0 at the tail, 1 at the head
            const head = k === c.glyphs.length - 1;
            return (
              <i
                key={j}
                className={head ? "sp-drop-head" : undefined}
                style={{ opacity: 0.05 + 0.95 * Math.pow(t, c.tail) }}
              >
                {g}
              </i>
            );
          })}
        </span>
      ))}
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
