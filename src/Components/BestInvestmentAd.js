// BestInvestmentAd.jsx — "what is the best investment?" answered as education.
//
// The ad opens as a market feed and hard-cuts through four assets — real
// estate, bitcoin, stocks, gold — a card each, faster every time. Then the
// feed stops dead, asks the question, and the answer is the one asset that
// was never on the tape.
//
// ── The flash is the hook, so it has to accelerate ──
//
// Four cards at an even 550ms is a slideshow. The durations below shorten card
// over card (640 → 580 → 520 → 470) so the sequence reads as a run-up rather
// than a list, and the stop before the question lands as a stop. That is the
// entire attention mechanic of the opening: a thumb scrolling past registers
// motion changing speed long before it registers what any card said.
//
// The cards are HARD CUTS. No cross-fade, no slide — each one is keyed by its
// index so React remounts it and its entrance animation restarts from frame
// one. A dissolve between two full-frame colour washes turns four beats into
// one long muddy one.
//
// Each asset owns the whole frame while it is up: its colour is pushed into
// --tint and the glow, the rule, the index and the tape all take it. Four
// distinct washes in two seconds is what makes the fifth card — brand red —
// read as a different kind of answer rather than a fifth item.
//
// ── The tape is the argument ──
//
// A ticker runs the four contenders across the top and bottom for the whole
// opening, with arrows that disagree with each other. On the reveal it flips
// to EDUCATION ▲ over and over, every symbol pointing the same way. Nothing
// says it; the tape just stops being a market and starts being a position.
//
// ── The candles never come back ──
//
// The chart behind the opening is a candlestick field — up and down, in the
// two colours a market is always drawn in. On the reveal it is replaced by a
// single line that ascends and leaves the top of the frame. The whole claim of
// the ad is "this one only goes up", and the two chart shapes are that claim
// without a sentence spent on it.
//
// JS owns the timeline and nothing else: a step counter walking TIMELINE, its
// kind exposed as a class on the root. Every movement is CSS keyed off that.
import React from "react";
import "../Stylesheets/BestInvestmentAd.css";

import cnLogo from "../Images/cn-woodbridge-logo.png";

// ── the contenders ────────────────────────────────────────────────────────
// One entry per flash card.
//   name   the lines as they are set — authored breaks, never wrapped, because
//          "REAL ESTATE" on one line at this size runs into the crop guard
//   tint   the colour the whole frame takes while this card is up
//   note   the caveat, in muted type. Two or three words: at 470ms a longer
//          line is texture rather than copy, and the eye only ever catches one
//          or two of these across the run — which is enough, they are a mood
//   ms     how long the card holds. SHORTENING, card over card — see the header
const ASSETS = [
  { name: ["REAL", "ESTATE"], emoji: "🏠", tint: "#5b86ff", note: "markets turn",     ms: 640 },
  { name: ["BITCOIN"],        emoji: "🪙", tint: "#f7931a", note: "volatile",         ms: 580 },
  { name: ["STOCKS"],         emoji: "📈", tint: "#2fd07a", note: "corrections come", ms: 520 },
  { name: ["GOLD"],           emoji: "🥇", tint: "#e3ab27", note: "sits in a vault",  ms: 470 },
];

// Brand red. The answer's tint, and the only one in the ad that is ours.
const RED = "#e4002b";

// The whole take, in order. `end` has no duration — it is where the ad rests.
const TIMELINE = [
  ...ASSETS.map((a, i) => ({ k: "asset", i, ms: a.ms })),
  { k: "ask",    ms: 1550 },
  { k: "reveal", ms: 1750 },
  { k: "end",    ms: 0 },
];

// A beat of feed before the first card, so the ad starts as a market rather
// than as a title. Short — anything past ~400ms is a thumb's worth of nothing.
const LEAD = 320;

/**
 * A deterministic hash: an integer in, a well-scattered number in [0,1) out.
 *
 * The candle field has to look like a market and be identical in every take of
 * the recording, and there is no randomness anywhere in this repo. Arithmetic
 * variety — (i * 7) % n and friends — is a cycle, not a scatter, and a cycle
 * in a candlestick chart reads instantly as wallpaper.
 */
function hash(n) {
  let x = Math.imul(n ^ 61, 0x27d4eb2d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  return (x >>> 0) / 4294967296;
}

/**
 * The candlestick field behind the opening.
 *
 * Percentages of the chart box, so the whole thing scales with the frame. Each
 * candle gets a body and a wick, and the walk is cumulative — a candle opens
 * where the last one closed — because a field of independently placed bars is
 * a bar chart, not a market. It drifts down across the run, which is what
 * makes the ascending line on the reveal read as a reversal.
 */
const CANDLES = (() => {
  const n = 26;
  let y = 62;
  return Array.from({ length: n }, (_, i) => {
    const move = (hash(i * 17 + 5) - 0.46) * 17;
    const open = y;
    const close = Math.min(88, Math.max(12, y + move));
    y = close;
    const wick = 3 + hash(i * 31 + 9) * 9;
    return {
      up: close < open,                       // screen coords: smaller y is higher
      top: Math.min(open, close),
      h: Math.max(1.6, Math.abs(close - open)),
      wickTop: Math.min(open, close) - wick * 0.5,
      wickH: Math.abs(close - open) + wick,
      // a slow, staggered breathe so the field is alive under the cuts
      delay: -(hash(i * 53 + 3) * 4).toFixed(2),
    };
  });
})();

// The tape. One pass of the contenders, rendered twice so the scroll has no
// seam. Arrows disagree — a tape where everything points the same way is not a
// market, it is the reveal, and the reveal is where that happens.
const TAPE = [
  ["REAL ESTATE", "▲"], ["BITCOIN", "▼"], ["GOLD", "▲"], ["STOCKS", "▼"],
  ["BITCOIN", "▲"], ["REAL ESTATE", "▼"], ["STOCKS", "▲"], ["GOLD", "▼"],
];

// What it becomes. Same length, one symbol, one direction.
const TAPE_END = Array.from({ length: 8 }, () => ["EDUCATION", "▲"]);

export default function BestInvestmentAd() {
  const reduce = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // -1 is the beat of feed before the first card.
  const [step, setStep] = React.useState(-1);

  React.useEffect(() => {
    if (reduce) {
      setStep(TIMELINE.length - 1);
      return undefined;
    }
    if (step >= TIMELINE.length - 1) return undefined;      // `end` holds
    const ms = step < 0 ? LEAD : TIMELINE[step].ms;
    const t = setTimeout(() => setStep((s) => s + 1), ms);
    return () => clearTimeout(t);
  }, [step, reduce]);

  const beat = step >= 0 ? TIMELINE[step] : null;
  const kind = beat ? beat.k : "lead";
  const asset = beat && beat.k === "asset" ? ASSETS[beat.i] : null;

  // Past the question the frame belongs to us, so the tint is brand red from
  // the reveal onward — the answer card, the tape and the line all take it.
  const answered = kind === "reveal" || kind === "end";
  const tint = asset ? asset.tint : answered ? RED : "#7c8b9a";

  return (
    <div
      className={`bi-stage bi-k-${kind}${asset ? ` bi-a${beat.i}` : ""}`}
      style={{ "--tint": tint }}
    >
      {/* ---- the terminal ----
          Grid, glow and candles sit under everything and never move with the
          cuts. The cards flash; the room they flash in does not. */}
      <div className="bi-grid" aria-hidden />
      <div className="bi-glow" aria-hidden />

      <div className="bi-chart" aria-hidden>
        {CANDLES.map((c, i) => (
          <span
            key={i}
            className={`bi-candle${c.up ? " is-up" : " is-down"}`}
            style={{
              left: `${(i + 0.5) * (100 / CANDLES.length)}%`,
              "--delay": `${c.delay}s`,
            }}
          >
            <i className="bi-wick" style={{ top: `${c.wickTop}%`, height: `${c.wickH}%` }} />
            <i className="bi-body" style={{ top: `${c.top}%`, height: `${c.h}%` }} />
          </span>
        ))}
      </div>

      {/* ---- the line that only goes up ----
          Replaces the candles on the reveal and draws itself across, leaving
          the top of the frame rather than resolving inside it. It is the
          claim; nothing else in the ad has to make it. */}
      {/* pathLength normalises the draw to 100 units. The stroke is
          non-scaling — its dash pattern is therefore measured in SCREEN px,
          not in this 100x100 user space — so a hand-counted dasharray is
          wrong on every phone by a different amount. */}
      <svg className="bi-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <polyline pathLength="100" points="-2,86 14,79 28,72 42,61 56,49 70,33 84,14 102,-8" />
      </svg>

      {/* ---- the tape ----
          Two strips, running opposite ways so the frame reads as a feed rather
          than as one banner. Both flip to EDUCATION on the reveal. */}
      <Tape className="bi-tape bi-tape-top" answered={answered} />
      <Tape className="bi-tape bi-tape-bot" answered={answered} />

      <div className="bi-card">
        {/* ---- the flash ----
            Keyed by index: React remounts on every cut so the entrance
            animation restarts. Without the key it would tween between two
            cards, and a tween is not a cut. */}
        {asset && (
          <div className="bi-flash" key={beat.i}>
            <div className="bi-idx">{`0${beat.i + 1}`}</div>
            <div className="bi-emoji">{asset.emoji}</div>
            <div className="bi-name">
              {asset.name.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
            <span className="bi-rule" aria-hidden />
            <div className="bi-note">{asset.note}</div>
          </div>
        )}

        {/* ---- the question ----
            The feed stops and asks it. Set small and quiet on purpose: four
            shouted cards then a fifth shouted line is no change at all, and
            the drop in volume is what makes the room go still. */}
        {kind === "ask" && (
          <div className="bi-ask">
            <div className="bi-ask-k">SO</div>
            <div className="bi-ask-q">
              <span>WHAT'S THE BEST</span>
              <span>INVESTMENT?</span>
            </div>
            <span className="bi-blink" aria-hidden />
          </div>
        )}

        {/* ---- the answer ---- */}
        {kind === "reveal" && (
          <div className="bi-reveal">
            <div className="bi-emoji bi-emoji-big">🧠</div>
            <div className="bi-name bi-name-big">
              <span>EDUCATION</span>
            </div>
            <span className="bi-rule bi-rule-wide" aria-hidden />
            <div className="bi-claim">
              <span>It compounds.</span>
              <span>It never crashes.</span>
            </div>
          </div>
        )}

        {/* ---- who the answer belongs to ----
            EDUCATION comes back as a kicker over the mark, so the last frame
            is one sentence: the answer, then whose it is. The wordmark has no
            light-on-dark art, so it is foiled — a flat invert flattens the
            ninja head to a white disc. */}
        {kind === "end" && (
          <div className="bi-end">
            <div className="bi-kicker">
              <span className="bi-kicker-a">🧠</span>
              EDUCATION
              <span className="bi-kicker-a">▲</span>
            </div>

            <img className="bi-logo" src={cnLogo} alt="Code Ninjas" />
            <div className="bi-loc">WOODBRIDGE</div>

            <span className="bi-rule bi-rule-wide" aria-hidden />

            <div className="bi-sub">
              <span>Kids ages 5&ndash;14 learn to code</span>
              <span>by building real games</span>
            </div>

            <div className="bi-cta">BOOK A FREE SESSION</div>
          </div>
        )}
      </div>

      <div className="bi-vignette" aria-hidden />
      <div className="bi-grain" aria-hidden />
    </div>
  );
}

/**
 * One ticker strip.
 *
 * The row is rendered twice and translated exactly -50%, so the second copy
 * arrives where the first one was and the loop has no seam. Both copies come
 * from the same array, so swapping the array on the reveal swaps the whole
 * tape in one frame — which is the point of the beat.
 */
function Tape({ className, answered }) {
  const items = answered ? TAPE_END : TAPE;
  return (
    <div className={className} aria-hidden>
      <div className="bi-tape-run">
        {items.concat(items).map(([label, dir], i) => (
          <span key={i} className={`bi-tick${dir === "▲" ? " is-up" : " is-down"}`}>
            {label}
            <i>{dir}</i>
          </span>
        ))}
      </div>
    </div>
  );
}
