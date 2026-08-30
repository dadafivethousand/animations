// RhFiftyReviewsAd.js — Richmond Hill Jiu-Jitsu hits 50 five-star reviews.
//
// ── THE IDEA, AND WHY IT IS AN APPLE ──
//
// A milestone post is normally a number on a card, which is the least
// interesting thing a number can be. This one EARNS the number: an apple sits
// alone in a dark orchard, an arrow crosses the frame and takes it, and the
// fruit does not fall — it BURSTS INTO FIFTY GOLD STARS that fly outward,
// hang, and then lock themselves into the shape of the number 50. That is the
// whole point, and it is why nothing else in the ad states the figure: the
// digits are not drawn and then filled with stars, they are MADE of the fifty
// reviews, one star each, standing there to be counted. "50 reviews" as text
// asks you to believe it; fifty stars spelling it out does not have to ask.
//
// Then the 50 retreats into the background as a ghost of itself and the ad
// says the only thing it was ever for: thank you.
//
// ── ORCHARD DUSK, NOT ANOTHER GOLD ROOM ──
//
// The ad before this one was a black room with a gold rake, so this one is
// violet: a plum-indigo night with a cool key from the upper left and warm
// crimson bounce off the floor. Gold appears exactly ONCE, at the burst, and
// from then on it owns the frame. Holding the payoff colour out of the first
// three seconds is what makes the burst feel like a change of state rather
// than a change of shot.
//
// ── EVERYTHING IS ONE `.ap-go` CLASS ──
//
// There is no phase state machine here and there should not be. Every beat is
// a CSS animation with `animation-delay` and `fill-mode: both`, keyed off a
// single class that lands one frame after mount, so the whole eleven seconds
// is authored as a column of delays in one stylesheet and cannot drift out of
// sync with itself. React does exactly two things: it flips that class, and
// it ticks the counter, which is the one value CSS cannot produce.
//
// ── THE STARS KNOW WHERE THEY CAME FROM ──
//
// Each of the fifty stars is placed at a point on the numeral, so its FINAL
// position is free. The flight is authored backwards from there: `--sx/--sy`
// is the vector from that point back to the apple, `--ox/--oy` an overshoot
// past it, so one keyframe set carries fifty different trajectories that all
// begin at the same place in space — the place the apple was standing. `--dy0`
// is the gap between the apple's centre and the numeral's, which is why the
// apple can sit at the optical centre of the frame while the 50 sits lower.
//
// Those vectors come from a hashed PRNG, never `Math.random`: StrictMode
// mounts twice in dev, and a live random would deal a different scatter to the
// second mount than the one the first mount's animation started on.
//
//   MS=10600 HOLD=1.8 BG='#0b0718' URL='http://127.0.0.1:3000/' \
//     OUT=~/Downloads/rhbjj-50-reviews.mp4 \
//     NODE_PATH=/tmp/rec/node_modules node tools/record.js
//
// 127.0.0.1, NOT localhost: a Next.js dev server on this machine also binds
// :3000 on IPv6 and macOS resolves localhost to ::1 first, so the recorder
// cheerfully records the other site.
import React from "react";
import "../Stylesheets/RhFiftyReviewsAd.css";
import rhLogo from "../Images/rh-bjj-logo.png";

/* Deterministic noise. One sine, hashed on the index and a salt, so every
   scatter vector is a pure function of "which star is this" and survives a
   second StrictMode mount unchanged. */
const rnd = (i, salt) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ── THE FIFTY IS THE FIFTY ──
 *
 * The number is not typeset and then decorated with stars: it IS the stars,
 * all fifty of them, one per review. Nothing else in the ad has to claim the
 * count, because the count is standing there to be counted.
 *
 * Which means the digits have to be PATHS sampled at equal arc length, and not
 * glyphs from a font or cells of a dot-matrix. Two reasons, and both of them
 * are the whole readability of the thing:
 *
 *   · Even spacing is what makes a chain of stars read as a stroke. A matrix
 *     bunches them at corners and thins them out around the bowl of the 5, so
 *     the digit comes apart exactly where it is already hardest to read.
 *   · Sampling makes the star COUNT an input rather than a consequence. Fifty
 *     points, split between the two digits in proportion to their length, is
 *     the only way "there are exactly fifty of these" survives a change to the
 *     shape of the numerals.
 *
 * Local coordinates are design px, y down, each digit centred on its own
 * origin; DX then sets them either side of the frame's centre line.
 */
const line = (a, b) => (t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const arc = (c, rx, ry, d0, d1) => (t) => {
  const th = ((d0 + (d1 - d0) * t) * Math.PI) / 180;
  return [c[0] + rx * Math.cos(th), c[1] + ry * Math.sin(th)];
};

/* "0" is one closed ring; "5" is an open stroke — top bar drawn right to left,
   down the stem, back out along the waist, then the bowl. The waist ENDS where
   the bowl begins rather than at a number I picked, so the two cannot drift
   apart when the bowl is retuned. */
const ZERO = [arc([0, 0], 128, 210, -90, 270)];
const BOWL = arc([-6, 62], 112, 140, -72, 150);
const FIVE = [
  line([96, -210], [-96, -210]),
  line([-96, -210], [-96, -46]),
  line([-96, -46], BOWL(0)),
  BOWL,
];

/* Flatten to a dense polyline, then walk it at equal arc length. `closed`
   divides by n rather than n-1, so a ring does not put its last star on top of
   its first. */
const trace = (segs, n, closed) => {
  const pts = [];
  for (const seg of segs) for (let i = 0; i <= 240; i++) pts.push(seg(i / 240));
  const cum = [0];
  for (let i = 1; i < pts.length; i++)
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const len = cum[cum.length - 1];
  const out = [];
  let j = 0;
  for (let k = 0; k < n; k++) {
    const want = (len * k) / (closed ? n : n - 1);
    while (j < cum.length - 2 && cum[j + 1] < want) j++;
    out.push(pts[j]);
  }
  return { pts: out, len };
};

const TOTAL = 50;
const DX = 150;                                     // half the gap between digits
const LEN0 = trace(ZERO, 2, true).len;
const LEN5 = trace(FIVE, 2, false).len;
const N0 = Math.round(TOTAL * (LEN0 / (LEN0 + LEN5)));
const PLACED = [
  ...trace(FIVE, TOTAL - N0, false).pts.map(([x, y]) => [x - DX, y]),
  ...trace(ZERO, N0, true).pts.map(([x, y]) => [x + DX, y]),
];

/* Centre on the INK, not on the two origins. A 5 is narrower than a 0 and its
   bowl bulges right, so hanging both digits off symmetric origins leaves the
   pair sitting a dozen pixels right of the frame's centre line — which is
   exactly the kind of small constant offset that looks like nothing on its own
   and like a mistake next to a logo that is properly centred. */
const MID = (() => {
  const xs = PLACED.map((p) => p[0]);
  return (Math.min(...xs) + Math.max(...xs)) / 2;
})();
const GLYPH = PLACED.map(([x, y]) => [x - MID, y]);

const STARS = GLYPH.map(([gx, gy], i) => {
  const a = rnd(i, 1) * Math.PI * 2;
  const j = 44 + rnd(i, 2) * 130;     // how far past its place it overshoots
  return {
    gx,                               // where in the numeral this star lives
    gy,
    sx: -gx,                          // start: back at the burst point
    sy: -gy,
    ox: gx * 0.46 + Math.cos(a) * j,  // overshoot, then it settles home
    oy: gy * 0.46 + Math.sin(a) * j,
    sr: (rnd(i, 3) * 2 - 1) * 320,    // tumble
    d: rnd(i, 4) * 0.24,              // stagger, seconds
  };
});

/* Debris. Eighteen shards of skin and flesh and sixteen beads of juice, all
   on the same hash so the burst is the same burst every render. */
const SHARDS = Array.from({ length: 18 }, (_, i) => {
  const a = (i / 18) * Math.PI * 2 + rnd(i, 5) * 0.5;
  const r = 190 + rnd(i, 6) * 300;
  return {
    dx: Math.cos(a) * r,
    dy: Math.sin(a) * r * 0.82 - 40,  // biased upward: it was hit, not dropped
    r: (rnd(i, 7) * 2 - 1) * 540,
    w: 16 + rnd(i, 8) * 30,
    h: 14 + rnd(i, 9) * 26,
    d: rnd(i, 10) * 0.06,
  };
});

const DROPS = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2 + rnd(i, 11) * 0.8;
  const r = 130 + rnd(i, 12) * 260;
  return {
    dx: Math.cos(a) * r,
    dy: Math.sin(a) * r * 0.7 - 20,
    s: 5 + rnd(i, 13) * 9,
    d: rnd(i, 14) * 0.09,
  };
});

/* Ambient dust in the orchard air — flat, outside everything, pure lens. */
const MOTES = Array.from({ length: 22 }, (_, i) => ({
  x: rnd(i, 15) * 100,
  y: rnd(i, 16) * 100,
  s: 3 + rnd(i, 17) * 7,
  dur: 7 + rnd(i, 18) * 7,
  dl: -rnd(i, 19) * 9,
  o: 0.2 + rnd(i, 20) * 0.5,
}));

const Star = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden>
    <path d="M12 1.6 15.09 8.06 22.2 9.05 17.1 14.02 18.3 21.1 12 17.75 5.7 21.1 6.9 14.02 1.8 9.05 8.91 8.06Z" />
  </svg>
);

/* THE APPLE. Rendered three times — once whole, and once inside each of the
   two halves that come apart on the pierce line — so the gradients take an
   `id` prefix rather than colliding in the document. */
const Apple = ({ uid }) => (
  <svg className="ap-apple-svg" viewBox="0 0 200 210" aria-hidden>
    <defs>
      <radialGradient id={`${uid}-skin`} cx="34%" cy="26%" r="82%">
        <stop offset="0%" stopColor="#ff7a72" />
        <stop offset="30%" stopColor="#f82f42" />
        <stop offset="66%" stopColor="#c60f2c" />
        <stop offset="100%" stopColor="#5e0416" />
      </radialGradient>
      <linearGradient id={`${uid}-rim`} x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c9b0ff" stopOpacity=".72" />
        <stop offset="42%" stopColor="#c9b0ff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${uid}-leaf`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8fd66b" />
        <stop offset="100%" stopColor="#2f7a35" />
      </linearGradient>
      <radialGradient id={`${uid}-spec`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity=".86" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* the body: two lobes with a dimple at the stem and another under it */}
    <path
      className="ap-apple-body"
      d="M100 54C88 31 60 22 42 35 20 50 12 85 20 121c8 36 32 72 58 76 10 2 16-5 22-5s12 7 22 5c26-4 50-40 58-76 8-36 0-71-22-86-18-13-46-4-58 19Z"
      fill={`url(#${uid}-skin)`}
    />
    {/* the violet key light wrapping the far edge — the stage, on the fruit */}
    <path
      d="M100 54C88 31 60 22 42 35 20 50 12 85 20 121c8 36 32 72 58 76 10 2 16-5 22-5s12 7 22 5c26-4 50-40 58-76 8-36 0-71-22-86-18-13-46-4-58 19Z"
      fill={`url(#${uid}-rim)`}
    />
    <path
      d="M100 54C88 31 60 22 42 35 20 50 12 85 20 121c8 36 32 72 58 76 10 2 16-5 22-5s12 7 22 5c26-4 50-40 58-76 8-36 0-71-22-86-18-13-46-4-58 19Z"
      fill="none"
      stroke="rgba(255,150,150,.28)"
      strokeWidth="1.6"
    />
    <ellipse cx="63" cy="76" rx="21" ry="33" transform="rotate(-26 63 76)" fill={`url(#${uid}-spec)`} />
    <ellipse cx="132" cy="150" rx="26" ry="16" transform="rotate(18 132 150)" fill="#ffd0c6" opacity=".14" />

    <path d="M100 56c2-19 5-33 17-43" stroke="#6b3d1d" strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M111 27c19-18 48-16 56-3-15 22-45 24-56 3Z" fill={`url(#${uid}-leaf)`} />
    <path d="M113 26c14-4 32-4 44 3" stroke="#1f5d27" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity=".7" />
  </svg>
);

const Arrow = () => (
  <svg className="ap-arrow-svg" viewBox="0 0 520 80" aria-hidden>
    <defs>
      <linearGradient id="ap-shaft" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f0d9a8" />
        <stop offset="38%" stopColor="#c9964f" />
        <stop offset="100%" stopColor="#6d4620" />
      </linearGradient>
      <linearGradient id="ap-steel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="45%" stopColor="#c9d4e6" />
        <stop offset="100%" stopColor="#66738c" />
      </linearGradient>
    </defs>
    {/* nock and two swept vanes */}
    <rect x="72" y="33" width="14" height="14" rx="3" fill="#2b2233" />
    <path d="M86 36c22-20 56-27 88-25l-24 25Z" fill="#fbbc05" />
    <path d="M86 44c22 20 56 27 88 25l-24-25Z" fill="#e2a600" />
    <path d="M118 36c18-14 44-19 66-18l-16 18Z" fill="#ffe08a" opacity=".8" />
    {/* shaft */}
    <rect x="86" y="36" width="344" height="8" rx="4" fill="url(#ap-shaft)" />
    {/* broadhead */}
    <path d="M418 27 518 40 418 53 436 40Z" fill="url(#ap-steel)" />
    <path d="M418 27 518 40 436 40Z" fill="#ffffff" opacity=".45" />
  </svg>
);

export default function RhFiftyReviewsAd({
  academy = "RICHMOND HILL JIU-JITSU",
  total = TOTAL,
  address = "132 King Road",
  website = "rhbjj.ca",
  phone = "(416) 992-1169",
}) {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mount paints the empty orchard; the class lands on the next frame so the
     ad opens ON its first move instead of partway through it. */
  const [go, setGo] = React.useState(false);
  React.useEffect(() => {
    if (reduce) return undefined;
    const r = requestAnimationFrame(() => setGo(true));
    return () => cancelAnimationFrame(r);
  }, [reduce]);

  const lockup = (
    <div className="ap-lock">
      <img src={rhLogo} alt={academy} />
    </div>
  );

  return (
    <div className="ap-frame">
      <div className={`ap-stage ap${go ? " ap-go" : ""}${reduce ? " ap-still" : ""}`}>
        {/* ---------- the orchard ----------
            Light and air. All of it flat, all of it behind everything, none of
            it an object. */}
        <div className="ap-room" aria-hidden />
        <div className="ap-key" aria-hidden />
        <div className="ap-floor" aria-hidden />
        <div className="ap-haze" aria-hidden />

        {/* The camera. A transform REPLACES a transform, so the impact shake
            cannot share an element with anything else that moves. */}
        <div className="ap-shake">
          <div className="ap-band">

            {lockup}

            {/* ---------- the apple, and what happens to it ---------- */}
            <div className="ap-core" aria-hidden>
              <div className="ap-target" />
              <div className="ap-target ap-target--b" />

              <div className="ap-apple">
                <Apple uid="ap-w" />
              </div>

              {/* the two pieces the pierce line makes */}
              <div className="ap-half ap-half--t"><Apple uid="ap-t" /></div>
              <div className="ap-half ap-half--b"><Apple uid="ap-b" /></div>

              <div className="ap-debris">
                {SHARDS.map((s, i) => (
                  <i
                    key={i}
                    className="ap-shard"
                    style={{
                      "--dx": `calc(${s.dx} * var(--px))`,
                      "--dy": `calc(${s.dy} * var(--px))`,
                      "--r": `${s.r}deg`,
                      "--w": `calc(${s.w} * var(--px))`,
                      "--h": `calc(${s.h} * var(--px))`,
                      animationDelay: `calc(var(--t-burst) + ${s.d}s)`,
                    }}
                  />
                ))}
                {DROPS.map((s, i) => (
                  <i
                    key={`d${i}`}
                    className="ap-drop"
                    style={{
                      "--dx": `calc(${s.dx} * var(--px))`,
                      "--dy": `calc(${s.dy} * var(--px))`,
                      "--w": `calc(${s.s} * var(--px))`,
                      animationDelay: `calc(var(--t-burst) + ${s.d}s)`,
                    }}
                  />
                ))}
              </div>

              <div className="ap-flash" />
              <div className="ap-ring" />
              <div className="ap-ring ap-ring--b" />

              <div className="ap-arrow">
                <span className="ap-streak" />
                <Arrow />
              </div>
            </div>

            {/* ---------- the count ----------
                There is no numeral here and there must not be one: a typeset
                50 next to a 50 built out of stars is the same number said
                twice, and the weaker of the two wins the eye. */}
            <p className="ap-countline">
              FIVE-STAR REVIEWS <b>ON GOOGLE</b>
            </p>

            {/* ---------- fifty stars, which are the number ----------
                `--gx/--gy` place the star in the numeral, and they are spent
                on MARGINS rather than on a transform, which leaves the
                transform free for the whole flight. The flight is authored
                backwards from there: `--sx/--sy` is the vector home to the
                apple, and `--dy0` is the gap between the apple's centre and
                this constellation's. */}
            <div className="ap-glyph" aria-hidden>
              {STARS.map((s, i) => (
                <span
                  key={i}
                  className="ap-cell"
                  style={{
                    "--gx": `calc(${s.gx.toFixed(1)} * var(--px))`,
                    "--gy": `calc(${s.gy.toFixed(1)} * var(--px))`,
                    "--sx": `calc(${s.sx.toFixed(1)} * var(--px))`,
                    "--sy": `calc(${s.sy.toFixed(1)} * var(--px))`,
                    "--ox": `calc(${s.ox.toFixed(1)} * var(--px))`,
                    "--oy": `calc(${s.oy.toFixed(1)} * var(--px))`,
                    "--sr": `${s.sr.toFixed(0)}deg`,
                    animationDelay: `calc(var(--t-stars) + ${s.d.toFixed(3)}s)`,
                  }}
                >
                  <Star className="ap-star" />
                </span>
              ))}
            </div>

            {/* ---------- the thank you ---------- */}
            <div className="ap-thanks">
              <div className="ap-rating">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="ap-rating-star" />
                ))}
              </div>
              <h1 className="ap-ty">
                <i style={{ "--n": 0 }}>THANK</i> <i style={{ "--n": 1 }}>YOU</i>
              </h1>
              <span className="ap-rule" aria-hidden />
              <p className="ap-body">
                <span style={{ "--n": 0 }}>To every student, parent and</span>
                <span style={{ "--n": 1 }}>training partner who took the time</span>
                <span style={{ "--n": 2 }}>to leave a review — you built this.</span>
              </p>
              <div className="ap-chip">
                <b>{total}</b>
                <span>FIVE-STAR REVIEWS</span>
              </div>
              <p className="ap-foot">
                <b>{academy}</b>
                <span>
                  {address} <em>·</em> {website} <em>·</em> {phone}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ---------- the lens ----------
            Dust, then the grade, then the grain, then the vignette. Last in
            the DOM because each is something that happens to the picture
            after the picture exists. */}
        <div className="ap-motes" aria-hidden>
          {MOTES.map((m, i) => (
            <span
              key={i}
              style={{
                left: `${m.x}%`,
                top: `${m.y}%`,
                width: `calc(${m.s} * var(--px))`,
                height: `calc(${m.s} * var(--px))`,
                animationDuration: `${m.dur}s`,
                animationDelay: `${m.dl}s`,
                opacity: m.o,
              }}
            />
          ))}
        </div>
        <div className="ap-bloom" aria-hidden />
        <div className="ap-grade" aria-hidden />
        <div className="ap-grain" aria-hidden />
        <div className="ap-vig" aria-hidden />
      </div>
    </div>
  );
}
