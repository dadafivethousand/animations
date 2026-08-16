// BestInvestmentAd.jsx — "what is the best investment?" answered as education.
//
// The ad opens on an exchange wall — a dozen rows of symbols and arrows racing
// past — which drains into the ad's own two ticker strips. It then phases
// through four assets, stocks, bitcoin, real estate, gold, a card each and
// faster every time. Then the feed stops dead, asks the question, and the
// answer is the one asset that was never on the tape.
//
// ── The flash is the hook, so it has to accelerate ──
//
// Four cards at an even duration is a slideshow. The ones below shorten card
// over card (1000 → 920 → 840 → 770) so the sequence reads as a run-up rather
// than a list, and the stop before the question lands as a stop. That is the
// entire attention mechanic of the opening: a thumb scrolling past registers
// motion changing speed long before it registers what any card said.
//
// THE ACCELERATION IS THE SHAPE, THE ABSOLUTE VALUES ARE NOT. An earlier pass
// ran the same curve about a third faster and the cards were past before they
// could be read — the emoji landed, the word did not. Retiming the run means
// scaling all four and keeping the gaps between them; flattening them to one
// number is what actually breaks this.
//
// ── The cards phase, they do not cut ──
//
// Each card breaks up as it leaves — chromatic split, scanlines, blur — and
// the next one resolves out of the same interference. Holographic rather than
// a dissolve: the card comes APART, it does not fade.
//
// THE TWO NEVER OVERLAP. The outgoing card is completely gone before the
// incoming one starts, which is done with an animation-delay on the entrance
// equal to the exit's duration. Two half-transparent cards on screen together
// read as one muddy double-exposure, and at four cards in a row it turns the
// whole opening to soup.
//
// That is what sets the card durations. Every slot has to pay for the exit
// delay AND the entrance before the card is even fully up — about 660ms of the
// slot is gone before anyone can read it — so CARD_MS is much longer than the
// on-screen hold it buys. Shortening those numbers without shortening the
// phase is what would cut a card off mid-arrival.
//
// It also requires BOTH CARDS MOUNTED AT ONCE, so all four are on the whole
// time and the live one is chosen by class. An earlier pass rendered a single
// card keyed by index; it remounted on every beat, so the outgoing card left
// the DOM the instant the new one arrived and could only ever vanish.
//
// Each asset owns the whole frame while it is up: its colour is pushed into
// --tint and the glow, the rule, the index and the tape all take it. Four
// distinct washes is what makes the fifth card read as a different kind of
// answer rather than as a fifth item.
//
// ── The answer is green, and that is the joke ──
//
// Green is the market's own colour for up, so the answer arrives in the one
// colour every contender was trying to be. It is NOT the green the stocks card
// used: that one is a deeper working green, and the answer's is electric and
// lit, brighter than anything the market managed. Same hue, different claim.
//
// Which is also why stocks had to move off pure green. Two greens a few
// seconds apart, at the same intensity, read as the same card coming back.
//
// ── The tape is the argument ──
//
// A ticker runs the four contenders across the top and bottom for the whole
// opening, with arrows that disagree with each other. On the reveal it flips
// to EDUCATION ▲ over and over, every symbol pointing the same way. Nothing
// says it; the tape just stops being a market and starts being a position.
//
// ── The chart belongs to the answer ──
//
// THE AD HAS EXACTLY ONE CHART AND IT ONLY EVER APPEARS UNDER "EDUCATION". A
// candlestick bull run, printing left to right from the bottom of the frame to
// the top of it, green and red with pullbacks on the way up — it builds behind
// the word while the word is landing.
//
// It used to run under the OPENING instead, and giving it to the answer is
// most of what this ad is now. When every beat had a chart, the chart said
// nothing; when only the answer has one, the four contenders are names on
// cards and the answer is the one thing with the numbers behind it. None of
// that costs a line of copy.
//
// The opening gets the board instead — see SYMBOLS. Two different textures,
// which also stops the ad repeating itself: the board is dense type racing
// sideways, the chart is sparse geometry climbing.
//
// Nothing else lives back there. A pass once built the reveal out into a fan
// of eight traces over a rotating ray burst, drifting motes and a moving
// aura; it was far more detailed and far worse, because the reveal is the beat
// where a single word has to land.
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
//   mark   a drawn mark instead of an emoji, for the two assets no emoji gets
//          right: bitcoin has a logo people recognise, and gold's only emoji
//          is a first-place medal. See BitcoinMark / GoldMark.
//
// A NAME AND A MARK, NOTHING ELSE. An earlier pass hung a caveat off each card
// — "volatile", "markets turn" — and it argued against the contenders one at a
// time. The ad does not need to: the answer wins by being a different kind of
// thing, not by these four being talked down, and a card that is on screen for
// well under a second cannot afford a second line to read anyway.
//
// Stocks lead, because the ad opens on a stock chart and the first card should
// name what the viewer is already looking at.
const ASSETS = [
  // Deeper than the answer's green on purpose — see the header. Stocks are
  // drawn green in every market there has ever been, so this card keeps the
  // hue and gives up the brightness.
  { name: ["STOCKS"],         emoji: "📈", tint: "#1f9d5c" },
  { name: ["BITCOIN"],        mark: "btc", tint: "#f7931a" },
  { name: ["REAL", "ESTATE"], emoji: "🏠", tint: "#5b86ff" },
  { name: ["GOLD"],           mark: "gold", tint: "#e3ab27" },
];

// How long each SLOT holds — by position, not by asset. Shortening down the
// list; see the header for why the acceleration is the hook.
//
// Kept off the asset objects deliberately: these belong to the position in the
// run, so reordering the contenders must not carry a duration along with an
// asset and quietly flatten the curve.
//
// THESE ARE NOT HOLD TIMES. The cards phase in sequence rather than
// overlapping, so each slot spends PHASE_OUT waiting for the previous card to
// clear and then PHASE_IN arriving — roughly 660ms — before the card is fully
// up. What is left is the hold: about 590ms down to 350ms across the run.
// Trimming these without trimming the phase cuts a card off mid-arrival.
const CARD_MS = [1250, 1170, 1090, 1010];

// The answer's tint: the market's own colour for up, lit brighter than any
// contender managed. Bright enough that anything sitting ON it needs dark ink
// — see .bi-cta.
const GREEN = "#3ff09a";

// The whole take, in order. `end` has no duration — it is where the ad rests.
//
// The question and the answer both hold longer than any contender card. That
// ordering is the point: a beat that holds longer than the ones before it is
// how a run-up resolves, and if the answer flashed past at card speed it would
// read as a fifth contender.
const TIMELINE = [
  ...ASSETS.map((_, i) => ({ k: "asset", i, ms: CARD_MS[i] })),
  { k: "ask",    ms: 1800 },
  // 3360 = 460 of entrance delay + 2900 on screen. The scenes now wait for the
  // previous one to clear before they start arriving, so a beat's duration is
  // no longer the same thing as how long its content is up — raising the
  // visible time means raising this by the delay as well.
  { k: "reveal", ms: 3360 },
  { k: "end",    ms: 0 },
];

// The claim under the answer, typed rather than faded in. Authored lines: at
// this measure the whole sentence on one line runs past the crop guard.
const CLAIM = ["will always provide", "the best returns."];
const CLAIM_LEN = CLAIM.join("").length;

// Milliseconds per character, and the pause before the first one — the answer
// has to land and be read before anything starts printing under it.
// TYPE_LEAD is measured from the start of the reveal beat, and the answer is
// not fully up until ~900ms into it (460 delay + 440 fade). Typing before then
// prints under something still arriving.
const TYPE_MS = 44;
const TYPE_LEAD = 1000;

// ── the opening ───────────────────────────────────────────────────────────
// Before any card, the ad is an exchange wall that then drains into itself.
//
// The ad has to earn the question it is going to ask, and it cannot do that
// while it is still explaining what it is. Two seconds of a market shouting is
// the cheapest way to establish the subject, so that the four cards read as
// contenders in one rather than as four unrelated slides.
//
// LEAD IS NOT A FREE PARAMETER. It has to cover the whole drain — the rows
// leave in pairs from the middle out, and the last pair does not start until
// BOARD_HOLD + 4 * BOARD_STEP — or the first card arrives over a wall that is
// still standing. Those two numbers live in the stylesheet; this is what pays
// for them.
const LEAD = 2100;       // ≈ 1000 hold + 4 * 150 stagger + 360 fade + a beat

/**
 * The Bitcoin mark: the orange disc with the tilted ₿.
 *
 * The card used the 🪙 emoji, which is a gold coin and reads as "money" —
 * it named the category the other three cards are already in. Bitcoin is the
 * one contender here with a logo people actually recognise, and recognition is
 * the whole job of a card that is on screen for under a second.
 *
 * NOT THE ₿ CHARACTER (U+20BF). Setting it as type means depending on whatever
 * font happens to resolve, and a missing glyph on the recording machine is a
 * tofu box in the middle of the ad. It is drawn instead.
 *
 * DRAWN AS SOLIDS, WITH THE COUNTERS PAINTED BACK IN. The two holes in the B
 * are rects in the disc's own colour rather than an even-odd path — the disc
 * behind them is flat, so a repaint and a hole are the same picture, and this
 * way the whole mark is six rectangles with corner radii instead of one path
 * of bezier curves that has to be right the first time.
 *
 * Everything takes var(--tint), so the mark is the card's colour by
 * construction and cannot drift from it.
 */
function BitcoinMark() {
  return (
    <svg className="bi-btc" viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="50" r="49" fill="var(--tint)" />
      {/* The letter leans right by 14 degrees, as it does in the real mark —
          CLOCKWISE, which is positive here; the counter-clockwise version
          looks like a mistake rather than like Bitcoin. Rotated about the
          centre of the DISC, not of the letter, or it walks off-axis. The
          translate/scale pair shrinks the letter about that same centre so it
          sits inside the disc with air around it. */}
      <g transform="rotate(14 50 50) translate(6 6) scale(0.88)">
        <g fill="#fff">
          {/* the four strokes through the top and bottom of the letter */}
          <rect x="34" y="11" width="8" height="15" rx="2" />
          <rect x="48" y="11" width="8" height="15" rx="2" />
          <rect x="34" y="74" width="8" height="15" rx="2" />
          <rect x="48" y="74" width="8" height="15" rx="2" />
          {/* stem, then the two bowls — the stem squares off their left ends.
              The stem is only a little heavier than the 6-unit bowl strokes:
              at double the weight the letter reads as a slab with lumps on
              it rather than as a B. */}
          <rect x="30" y="23" width="10" height="54" rx="1" />
          <rect x="30" y="23" width="33" height="25" rx="10" />
          <rect x="30" y="52" width="38" height="25" rx="10" />
        </g>
        {/* The counters, sized so every bowl stroke comes out at 6 units. They
            have to be this open — a tighter pair closes the bowls up and the
            mark turns back into a coin with a scribble on it. */}
        <g fill="var(--tint)">
          <rect x="40" y="29.5" width="17" height="12" rx="5" />
          <rect x="40" y="58.5" width="22" height="12" rx="5" />
        </g>
      </g>
    </svg>
  );
}

/**
 * The gold mark: three cast bars, stacked two-and-one.
 *
 * The card used 🥇, which is a first-place medal — an award, not an asset. It
 * put the wrong noun on the one contender whose whole appeal is that it is a
 * physical lump of something, and next to a drawn Bitcoin disc it also read as
 * the odd card out.
 *
 * Each bar is three polygons: a pale top face, the tapered front, and a band
 * just under the lip. The taper is what does the work — sides that fall
 * straight down make a box, and the slight flare toward the base is the entire
 * reason a shape this simple reads as cast metal.
 *
 * Only the front faces take var(--tint); the lit faces are fixed. Mixing every
 * face from the tint would keep the drawing consistent under a colour change
 * the ad never makes, at the cost of the highlight that makes it look metal.
 */
function GoldMark() {
  return (
    <svg className="bi-gold" viewBox="6 22 88 56" aria-hidden>
      {[
        { x: 50, y: 25 },   // the one on top
        { x: 28, y: 51 },
        { x: 72, y: 51 },
      ].map((b, i) => (
        <g key={i}>
          <polygon
            points={`${b.x - 15.2},${b.y} ${b.x + 15.2},${b.y} ${b.x + 18.4},${b.y + 6} ${b.x - 18.4},${b.y + 6}`}
            fill="#f6dd93"
          />
          <polygon
            points={`${b.x - 18.4},${b.y + 6} ${b.x + 18.4},${b.y + 6} ${b.x + 20},${b.y + 24} ${b.x - 20},${b.y + 24}`}
            fill="var(--tint)"
          />
          <polygon
            points={`${b.x - 18.4},${b.y + 6} ${b.x + 18.4},${b.y + 6} ${b.x + 17.4},${b.y + 10} ${b.x - 17.4},${b.y + 10}`}
            fill="#eec254"
          />
        </g>
      ))}
    </svg>
  );
}

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
 * The candlestick field.
 *
 * Percentages of the chart box, so the whole thing scales with the frame. Each
 * candle gets a body and a wick, and the walk is cumulative — a candle opens
 * where the last one closed — because a field of independently placed bars is
 * a bar chart, not a market. It drifts down across the run, which is what
 * makes the ascending line on the reveal read as a reversal.
 *
 * THE FIELD PRINTS RATHER THAN APPEARING. Each candle carries its index, and
 * CSS staggers its growth off that, so the chart draws itself left to right the
 * way a live one does. It grows from the OPEN — up candles from the bottom,
 * down candles from the top — which is the difference between a market
 * printing and a bar chart wiping in. That is what --i and the .is-up/.is-down
 * classes are for; the transform-origin is not decorative.
 */
const CANDLES = (() => {
  const n = 26;
  // A BULL RUN. It opens at the bottom of the box and climbs to the top —
  // 19 green candles to 7 red, with pullbacks on the way up, because a line
  // that only ever ticks one way is not a market.
  //
  // FOUR numbers decide the shape: the open, the hash seed, the bias and the
  // amplitude. Between them they set how much of the box the walk uses and
  // whether it ever hits the clamp, and both failures look like a bug in the
  // drawing rather than a choice about the numbers:
  //   - too little range reads as a strip of decoration, not as a chart;
  //   - too much bias pins the walk against the clamp and the tail comes out
  //     as a flat row of stubs.
  // These four span 91 to 7 of the box and never clamp once.
  //
  // THE SEED IS PART OF THE TUNING, not a throwaway. The bias alone could not
  // get a rising walk past about half the box without pinning, because this
  // hash sequence happens to fall the wrong way early on. Changing the trend
  // means searching the seed with it rather than only adjusting the bias.
  let y = 90;
  return Array.from({ length: n }, (_, i) => {
    const move = (hash(i * 17 + 12) - 0.70) * 17;
    const open = y;
    const close = Math.min(93, Math.max(7, y + move));
    y = close;
    const wick = 3 + hash(i * 31 + 9) * 9;
    return {
      up: close < open,                       // screen coords: smaller y is higher
      top: Math.min(open, close),
      h: Math.max(1.6, Math.abs(close - open)),
      wickTop: Math.min(open, close) - wick * 0.5,
      wickH: Math.abs(close - open) + wick,
      // a slow, staggered breathe so the field is alive under the cuts. Its
      // period varies per candle too — one shared period is a pulse, and a
      // field that pulses in time reads as a decoration rather than as a feed.
      dur: (3.2 + hash(i * 71 + 13) * 2.6).toFixed(2),
      delay: -(hash(i * 53 + 3) * 4).toFixed(2),
    };
  });
})();

// ── the opening: the board ────────────────────────────────────────────────
//
// Asset classes, commodities and indices — deliberately NOT company tickers.
// A wall of "AAPL ▲" reads as a specific claim about a specific security even
// with no price beside it, and this ad is about categories of investment, not
// about any one company. These also happen to be the right nouns for it.
const SYMBOLS = [
  "GOLD", "OIL", "BTC", "ETH", "SILVER", "COPPER", "WHEAT", "REIT",
  "BONDS", "CASH", "S&P 500", "NASDAQ", "DOW", "CORN", "GAS", "PLATINUM",
  "RUSSELL", "EURO", "YEN", "COCOA", "SUGAR", "COTTON", "NICKEL", "ZINC",
  "URANIUM", "LITHIUM", "TIMBER", "CATTLE", "PALLADIUM", "SOYBEAN",
];

/**
 * The flood rows that fill the frame for the opening.
 *
 * Ten of them, between the ad's two permanent strips, scrolling in alternating
 * directions at different speeds. Together with those strips it reads as an
 * exchange wall: too much information, all of it shouting, none of it an
 * answer — which is the state the question is going to interrupt.
 *
 * THEY LEAVE FROM THE MIDDLE OUTWARD, IN PAIRS. `pair` is distance from the
 * centre of the stack, so the innermost two go first and the outermost two
 * last, and the wall collapses toward the top and bottom of the frame until
 * only the ad's own two strips are left running. The opening does not cut to
 * the ad; it drains into it.
 */
const BOARD_N = 12;

const BOARD_ROWS = Array.from({ length: BOARD_N }, (_, r) => {
  const dur = 9 + hash(r * 89 + 3) * 7;
  return {
    items: Array.from({ length: 9 }, (_, j) => [
      SYMBOLS[Math.floor(hash(r * 131 + j * 7) * SYMBOLS.length)],
      hash(r * 53 + j * 11) > 0.42 ? "▲" : "▼",
    ]),
    back: r % 2 === 1,
    dur,
    // where in its own loop the row starts, so the wall is not in step with
    // itself on the first frame
    phase: hash(r * 197 + 23) * dur,
    pair: Math.abs(r - (BOARD_N - 1) / 2) - 0.5,
  };
});

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

  // ── the typewriter ──────────────────────────────────────────────────────
  // Characters printed so far, across the claim as one string. JS owns this
  // because a caret that follows the text needs the text to actually grow,
  // which no keyframe can do.
  const [typed, setTyped] = React.useState(0);

  React.useEffect(() => {
    if (reduce) {
      setTyped(CLAIM_LEN);
      return undefined;
    }
    if (kind !== "reveal" || typed >= CLAIM_LEN) return undefined;
    const t = setTimeout(
      () => setTyped((n) => n + 1),
      typed === 0 ? TYPE_LEAD : TYPE_MS
    );
    return () => clearTimeout(t);
  }, [kind, typed, reduce]);

  // From the reveal onward the frame belongs to the answer, so the tint is the
  // bright green — the answer card, the tape, the line and the CTA all take it.
  const answered = kind === "reveal" || kind === "end";
  const tint = asset ? asset.tint : answered ? GREEN : "#7c8b9a";

  // Which contender owns the frame. -1 before the first, ASSETS.length once
  // the run is over — so every card is "past" from the question onward and
  // the last one phases out into it rather than disappearing.
  const live = asset ? beat.i : kind === "lead" ? -1 : ASSETS.length;

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
            className={`bi-candle${c.up ? " is-up" : " is-down"}${
              i === CANDLES.length - 1 ? " is-last" : ""
            }`}
            style={{
              left: `${(i + 0.5) * (100 / CANDLES.length)}%`,
              "--i": i,
              "--dur": `${c.dur}s`,
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
      {/* ---- the tape ----
          Two strips, running opposite ways so the frame reads as a feed rather
          than as one banner. Both flip to EDUCATION on the reveal. */}
      <Tape className="bi-tape bi-tape-top" answered={answered} />
      <Tape className="bi-tape bi-tape-bot" answered={answered} />

      {/* ---- the opening ----
          Ten more rows between the two strips, flooding the frame and then
          draining out of the middle in pairs until only those two are left. */}
      <div className="bi-board" aria-hidden>
        {BOARD_ROWS.map((row, r) => (
          <div
            className={`bi-board-row${row.back ? " is-back" : ""}`}
            key={r}
            style={{
              top: `${((r + 1) * 100) / (BOARD_N + 1)}%`,
              "--dur": `${row.dur.toFixed(1)}s`,
              "--phase": row.phase.toFixed(2),
              "--pair": row.pair,
            }}
          >
            <div className="bi-board-run">
              {row.items.concat(row.items).map(([sym, dir], i) => (
                <span
                  key={i}
                  className={`bi-tick${dir === "▲" ? " is-up" : " is-down"}`}
                >
                  {sym}
                  <i>{dir}</i>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ---- the cut ----
          A bloom in the card's own colour, keyed by index so it remounts and
          fires once per cut. The cards are hard cuts and should stay hard —
          this does not soften the join, it punctuates it, which is the
          difference between an edit that reads as deliberate and one that
          reads as a dropped frame. */}
      {asset && <span className="bi-blast" key={`x${beat.i}`} aria-hidden />}

      <div className="bi-card">
        {/* ---- the contenders ----
            ALL FOUR ARE MOUNTED, stacked on each other, and the one that owns
            the frame is picked by class. They used to be a single card keyed
            by index, remounted on every beat — which meant the outgoing card
            was gone from the DOM the instant the new one arrived, so there was
            never anything to animate out. A conditionally-rendered element can
            only vanish.

            With both on screen the join can be a real dissolve: the outgoing
            card phases out while the incoming one phases in, and the two
            overlap. See biPhaseOut / biPhaseIn.

            THE CLASS IS WHAT RETRIGGERS THE ANIMATION. These elements never
            unmount, so an entrance animation would only ever run once, at
            load. Each state carries a DIFFERENT animation-name — that change
            is what makes the browser start it again. Two states sharing one
            name would silently play nothing. */}
        {ASSETS.map((a, i) => (
          <div
            className={`bi-flash${
              i === live ? " is-live" : i < live ? " is-past" : ""
            }`}
            style={{ "--tint": a.tint }}
            key={i}
          >
            <div className="bi-idx">{`0${i + 1}`}</div>
            <div className="bi-emoji">
              {a.mark === "btc" ? (
                <BitcoinMark />
              ) : a.mark === "gold" ? (
                <GoldMark />
              ) : (
                a.emoji
              )}
            </div>
            <div className="bi-name">
              {a.name.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
            <span className="bi-rule" aria-hidden />
          </div>
        ))}

        {/* ---- the three story scenes ----
            These are ALWAYS MOUNTED and stacked on each other, unlike the
            flash cards above. The cards want remounting because they are hard
            cuts; these want to move into one another, and a scene that
            unmounts cannot animate out — it can only vanish, which is what
            made the answer→endcard join read as a dropped frame.

            So each is an absolutely-positioned layer whose opacity and
            transform are CSS transitions driven by the root's beat class. Only
            one is ever lit, and every join between them is a real move. */}

        {/* The feed stops and asks it. Set small and quiet on purpose: four
            shouted cards then a fifth shouted line is no change at all, and
            the drop in volume is what makes the room go still. */}
        <div className="bi-scene bi-scene-ask">
          <div className="bi-ask-k">SO</div>
          <div className="bi-ask-q">
            <span>WHAT'S THE BEST</span>
            <span>INVESTMENT?</span>
          </div>
          <span className="bi-blink" aria-hidden />
        </div>

        {/* The answer. On the way out it shrinks and rises toward where the
            endcard's kicker appears, so the two frames read as one move
            rather than as a swap. */}
        <div className="bi-scene bi-scene-reveal">
          <div className="bi-emoji bi-emoji-big">🧠</div>
          <div className="bi-name bi-name-big">
            <span>EDUCATION</span>
          </div>
          <span className="bi-rule bi-rule-wide" aria-hidden />
          {/* Typed, not faded. The frame reads as one sentence — "EDUCATION
              will always provide the best returns" — so the claim starts
              lowercase and carries no stop until the end, and printing it
              under the answer is the ad finishing its own thought.

              LEFT-ALIGNED inside a centred block. Centred text that grows a
              character at a time slides sideways on every keystroke; against
              a left edge it only ever grows rightward, which is also what a
              terminal does and what this stage already is.

              Every line is a hidden ghost holding its own box with the struck
              text laid over it — without that the block grows a line at a time
              and, because the scene is centred, the whole answer creeps upward
              on the carriage return. */}
          <div className="bi-claim">
            {CLAIM.map((line, i) => {
              const from = CLAIM.slice(0, i).join("").length;
              const shown = Math.min(line.length, Math.max(0, typed - from));
              return (
                <div className="bi-claim-line" key={line}>
                  <span className="bi-ghost" aria-hidden>
                    {line}
                  </span>
                  <span className="bi-struck">
                    {line.slice(0, shown)}
                    {typed >= from && typed < from + line.length && (
                      <i className="bi-caret" aria-hidden />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- who the answer belongs to ----
            EDUCATION comes back as a kicker over the mark, so the last frame
            is one sentence: the answer, then whose it is. The wordmark has no
            light-on-dark art, so it is foiled — a flat invert flattens the
            ninja head to a white disc. */}
        <div className="bi-scene bi-scene-end">
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
      </div>

      {/* One pass of a scanline down the frame as the market halts — the
          terminal redrawing, and the only motion in a beat that is otherwise
          the ad standing still. */}
      <div className="bi-sweep" aria-hidden />

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
