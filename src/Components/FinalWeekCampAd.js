// FinalWeekCampAd.js — the last week of summer camp, as a stack of solid blocks.
//
// ── WHY A TOWER, AND NOT ANOTHER SHEET ──
//
// The open house ad is a POSTER: bands of content stacked down a flat page
// with a chess floor behind them. This one is a SCENE, shot in a room. The
// five things the week teaches are five extruded blocks floating one above
// the other, and the offer is a sixth slab that flies in from the back of the
// room and stops in front of them. Nothing about the layout repeats the
// previous ad — no white slab, no chip row, no programs grid, no mascot.
//
// ── THE 3D IS REAL, AND THE CAMERA IS THE ONLY THING THAT MOVES ──
//
// Every block is a genuine cuboid: four faces in `transform-style: preserve-3d`
// with a front, a top and two sides. What sells the depth is not a rotation on
// the world — it is `perspective-origin` DRIFTING across the run. Moving the
// camera instead of the objects means the front faces stay perfectly
// axis-aligned rectangles, so the type on them never keystones and never goes
// soft, while the top and side faces open and close as the camera travels.
//
// Consequence worth knowing: `opacity` and `filter` FLATTEN a preserve-3d
// subtree, so nothing in the scene may fade or blur. The blocks are hidden by
// being off-frame; the offer is hidden with `visibility`, which does not
// flatten. EVERY atmospheric — the key light, the shafts, the haze, the motes,
// the flare — therefore lives OUTSIDE `.fw-scene` as a flat sibling, which is
// also where it belongs: those are lens and air, not objects.
//
// ── THREE ROOMS, ONE AD ──
//
// `?theme=obsidian|arctic|studio` (or the `theme` prop) swaps the room. The
// whole palette is custom properties on `.fw`, so a theme is one block of
// variable overrides and nothing else — the geometry, the timing and the copy
// are shared, which is the only way three cuts stay comparable.
//
// OBSIDIAN IS THE APPROVED CUT and is what THEMES[0] means: the delivered file
// is `~/Downloads/cn-final-week.mp4`, recorded off the default with no query
// string. Arctic and studio were the other two options and stay in the sheet —
// they cost one block of variables each, and the next ad on this feed needs a
// palette that is not this one.
//
//   MS=9900 HOLD=1.7 BG='#07090d' URL='http://127.0.0.1:3000/' \
//     OUT=~/Downloads/cn-final-week.mp4 \
//     NODE_PATH=/tmp/rec/node_modules node tools/record.js
//
// 127.0.0.1, NOT localhost: there is a Next.js dev server on this machine that
// also binds :3000, on IPv6, and macOS resolves localhost to ::1 first — point
// the recorder at the name and it cheerfully records the other site.
//
// BG is not optional and it is PER THEME: the recorder paints it for the
// ~150ms before React mounts, so the wrong one is a flash of the wrong room on
// frame one — and on the studio cut the right one is nearly white.
import React from "react";
import "../Stylesheets/FinalWeekCampAd.css";
import cnLogo from "../Images/cn-logo-horizontal.svg";
import qrCode from "../Images/qr-cnwoodbridge.svg";
import { Chess, Cube, Blocks, Pin, Phone } from "./OpenHouseIcons";

/* A ROBOT, which the open house set had no need for.
 *
 * Drawn to the same rules as that file: one idea, flat, on a 64 grid, mass in
 * `currentColor` and the detail cut in `--icon-ink`, so it takes its colour
 * from the block it sits on like every other icon in the row. A head with two
 * eyes and an antenna reads at 48px; a full body with arms does not. */
export const Robot = () => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 3v7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <circle cx="32" cy="4" r="4" fill="currentColor" />
    <rect x="8" y="12" width="48" height="38" rx="10" fill="currentColor" />
    <rect x="16" y="21" width="32" height="18" rx="6" fill="var(--icon-ink, #0b2a5b)" />
    <circle cx="25" cy="30" r="4.2" fill="currentColor" />
    <circle cx="39" cy="30" r="4.2" fill="currentColor" />
    {/* ears and feet, so the head is a machine and not a rounded square */}
    <rect x="1" y="24" width="6" height="15" rx="3" fill="currentColor" />
    <rect x="57" y="24" width="6" height="15" rx="3" fill="currentColor" />
    <rect x="14" y="53" width="14" height="8" rx="4" fill="currentColor" />
    <rect x="36" y="53" width="14" height="8" rx="4" fill="currentColor" />
  </svg>
);

/* A PRINT IN PROGRESS, drawn here rather than borrowed from the open house set.
 *
 * That file's printer narrows as it rises — three layers, each wider than the
 * one above — and at 62px on a coloured bar the taper reads as an hourglass or
 * a trophy, which is a disaster directly under the word CHESS. The fix is to
 * stop drawing a shape and start drawing a PROCESS: a nozzle on a gantry, a
 * strand of filament in the air, and a plain block being built up out of
 * even layers on a bed. Equal widths are the whole point — the layer lines are
 * what say "printed", and a silhouette that changes width steals attention
 * from them. */
export const Print3D = () => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    {/* the gantry rail, and the nozzle hanging off it */}
    <rect x="8" y="3" width="48" height="5" rx="2.5" fill="currentColor" />
    <rect x="28" y="8" width="8" height="4" rx="1.5" fill="currentColor" />
    <path d="M27 12h10l-4 7h-2z" fill="currentColor" />
    {/* the strand, mid-air between the nozzle and the top of the print */}
    <path d="M32 19v5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    {/* THE PRINT IS A BLOCK, AND THE LAYERS ARE CUT INTO IT. Drawing the layers
        as separate stacked bars gives the object a stepped silhouette, and at
        this size a stepped silhouette is read as a taper — which is how the
        borrowed icon ended up looking like a trophy. One solid mass with seams
        across it keeps the outline square and still says "built up". */}
    <rect x="17" y="25" width="30" height="30" rx="2.5" fill="currentColor" />
    <rect x="17" y="32.4" width="30" height="2" fill="var(--icon-ink, #0b2a5b)" opacity=".45" />
    <rect x="17" y="39.8" width="30" height="2" fill="var(--icon-ink, #0b2a5b)" opacity=".45" />
    <rect x="17" y="47.2" width="30" height="2" fill="var(--icon-ink, #0b2a5b)" opacity=".45" />
    {/* the bed */}
    <rect x="8" y="57" width="48" height="5" rx="2.5" fill="currentColor" />
  </svg>
);

const ICONS = { robotics: Robot, chess: Chess, printing: Print3D, minecraft: Cube, roblox: Blocks };
const THEMES = ["obsidian", "arctic", "studio"];

/* AIR, WRITTEN DOWN RATHER THAN ROLLED.
 * [x%, y%, size, blur, drift-seconds, delay-seconds, brightness]
 * Fixed, because a render that differs between takes cannot be checked against
 * the take before it — and because two of these sit deliberately in the near
 * plane, big and soft, to give the lens something to be out of focus about. */
const MOTES = [
  [ 8, 18,  7, 2, 15,  0, 0.55], [17, 62,  5, 1, 18,  2, 0.42],
  [27, 30,  9, 3, 13,  5, 0.60], [35, 76,  4, 1, 20,  1, 0.36],
  [44, 12,  6, 2, 17,  7, 0.50], [52, 52,  5, 1, 14,  3, 0.44],
  [61, 84,  8, 3, 19,  6, 0.52], [69, 26,  5, 1, 16,  9, 0.40],
  [77, 66,  7, 2, 12,  4, 0.56], [86, 40,  6, 2, 21,  8, 0.46],
  [93, 74,  5, 1, 15, 11, 0.38], [ 4, 46,  6, 2, 18, 10, 0.44],
  [22, 90,  5, 1, 16, 13, 0.40], [58,  8,  4, 1, 19, 12, 0.34],
  /* the near plane — large, soft, and kept to the margins so a blurred lump
     never sits on a word */
  [ 6, 70, 26, 9, 24,  0, 0.30], [95, 22, 30, 11, 27,  6, 0.26],
  [11, 34, 22, 8, 22, 14, 0.24], [90, 88, 24, 9, 26, 18, 0.22],
];

export default function FinalWeekCampAd({
  theme,

  kicker = "CODE NINJAS SUMMER CAMP",
  title = "FINAL WEEK",

  // ONE STRING for the week, so nobody can update the month and leave the
  // weekdays. Aug 24 2026 is a Monday and Aug 28 is the Friday.
  when = "MON–FRI · AUG 24–28",
  ages = "AGES 5–14",

  // Top to bottom. The colours alternate around the wheel on purpose: five
  // adjacent blocks in one hue family read as a gradient, not as five things.
  blocks = [
    { key: "robotics",  title: "ROBOTICS",    line: "Build it. Code it. Battle it." },
    { key: "chess",     title: "CHESS",       line: "Openings, tactics, tournaments" },
    { key: "printing",  title: "3D PRINTING", line: "Design it, then hold it" },
    { key: "minecraft", title: "MINECRAFT®",  line: "Redstone, mods & mega-builds" },
    { key: "roblox",    title: "ROBLOX®",     line: "Publish a game of your own" },
  ],

  offerLead = "COME THIS WEEK & UNLOCK",
  offerBig = "1 FREE MONTH",
  offerTail = "OF THE CREATE PROGRAM",
  offerValue = "A $169/MO + HST VALUE",
  finePrint = "Camp attendees only · offer ends Fri, Aug 28",

  centre = "CODE NINJAS WOODBRIDGE",
  address = "6175 Hwy 7, Woodbridge, ON",
  phone = "647-887-9940",
}) {
  // The theme is a URL parameter first, so the recorder can shoot all three
  // cuts off one dev server without the file being edited between takes.
  const picked = React.useMemo(() => {
    if (theme && THEMES.includes(theme)) return theme;
    if (typeof window === "undefined") return THEMES[0];
    const q = new URLSearchParams(window.location.search).get("theme");
    return THEMES.includes(q) ? q : THEMES[0];
  }, [theme]);

  const reduce = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Mount paints the empty room; the class lands on the next frame so the ad
  // opens ON its first move rather than partway through it.
  const [go, setGo] = React.useState(false);
  React.useEffect(() => {
    if (reduce) return undefined;
    const r = requestAnimationFrame(() => setGo(true));
    return () => cancelAnimationFrame(r);
  }, [reduce]);

  const n = blocks.length;
  const letters = (word) =>
    word.split("").map((c, i) => (
      <i key={i} style={{ "--n": i }}>{c === " " ? " " : c}</i>
    ));

  return (
    <div className={`fw-frame fw-t-${picked}`}>
      <div className={`fw-stage fw${go ? " fw-go" : ""}${reduce ? " fw-still" : ""}`}>
        {/* The dolly and the impacts are separate boxes because a CSS transform
            REPLACES a transform — one element cannot hold both a nine second
            push and a 500ms hit. */}
        <div className="fw-push">
          <div className="fw-shake">

            {/* ---------- the room ----------
                Everything here is flat and lives outside the 3D scene: it is
                light and air, and both of them need the blur and the blend
                modes that a preserve-3d subtree cannot have. */}
            <div className="fw-room" aria-hidden />
            <div className="fw-key" aria-hidden />
            <div className="fw-shafts" aria-hidden>
              <span /><span /><span />
            </div>
            <div className="fw-floor" aria-hidden />
            <div className="fw-horizon" aria-hidden />
            <div className="fw-haze" aria-hidden />
            {/* the tower's colour spilling onto the floor it stands over */}
            <div className="fw-spill" aria-hidden />

            {/* ---------- the lockup ----------
                No rule between the mark and the city. The wordmark already
                ends in a hard vertical stem and the divider read as a second
                one two millimetres away; space does the same job. */}
            <div className="fw-lock">
              <img className="fw-lock-logo" src={cnLogo} alt="Code Ninjas" />
              <span className="fw-lock-city">WOODBRIDGE</span>
            </div>

            {/* ---------- the headline ---------- */}
            <p className="fw-kicker">{kicker}</p>
            <div className="fw-title-wrap">
              <h1 className="fw-title">{letters(title)}</h1>
              {/* A SECOND COPY, CLIPPED TO THE GLYPHS. The light that walks the
                  headline cannot live on the <h1> itself: that element is a
                  full-width block and a gradient on it paints a silver
                  rectangle in the empty margin beside the type. It cannot use
                  `background-clip:text` on the <h1> either, because clipping
                  the background to the glyphs throws away the seven-step
                  extrusion the letters are carrying. So the extrusion stays on
                  the base layer and the light is a transparent copy on top. */}
              <span className="fw-title-glint" aria-hidden>{letters(title)}</span>
            </div>
            <div className="fw-when">
              <b>{when}</b>
              <span aria-hidden />
              <em>{ages}</em>
            </div>

            {/* ---------- the tower ---------- */}
            <div className="fw-scene">
              <div className="fw-world">
                {blocks.map((b, i) => {
                  const Icon = ICONS[b.key];
                  return (
                    <div
                      className={`fw-blk fw-blk--${b.key}`}
                      key={b.key}
                      /* --i places it; --drop orders the BUILD, which runs
                         bottom up so the tower stacks like a real one instead
                         of raining top down onto nothing. */
                      style={{ "--i": i, "--drop": n - 1 - i }}
                    >
                      <div className="fw-blk-in">
                        <span className="fw-face fw-face--top" />
                        <span className="fw-face fw-face--left" />
                        <span className="fw-face fw-face--right" />
                        <span className="fw-face fw-face--front">
                          <span className="fw-blk-icon">{Icon ? <Icon /> : null}</span>
                          <span className="fw-blk-text">
                            <b>{b.title}</b>
                            <i>{b.line}</i>
                          </span>
                          {/* the raking key light, and the specular that runs
                              across the face as the block lands */}
                          <span className="fw-blk-rake" aria-hidden />
                          <span className="fw-blk-sheen" aria-hidden />
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* ---------- the offer ----------
                    Inside the world, so it shares the camera and can fly in
                    from the back of the room rather than sliding up the page.
                    It stops IN FRONT of the tower on +Z, and throws a shadow
                    UPWARD onto the bottom block — which is what actually says
                    "nearer" at this distance, more than the change of scale
                    does. */}
                <div className="fw-offer">
                  <div className="fw-offer-in">
                    <span className="fw-face fw-face--top" />
                    <span className="fw-face fw-face--left" />
                    <span className="fw-face fw-face--right" />
                    <span className="fw-face fw-face--front">
                      <span className="fw-offer-lead">{offerLead}</span>
                      <span className="fw-offer-big">{offerBig}</span>
                      <span className="fw-offer-tail">{offerTail}</span>
                      <span className="fw-offer-value">{offerValue}</span>
                      <span className="fw-offer-sheen" aria-hidden />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* the bloom the gold slab throws back into the room */}
            <div className="fw-bloom" aria-hidden />

            {/* ---------- the footer ---------- */}
            <div className="fw-foot">
              <span className="fw-foot-col">
                <b>
                  <span className="fw-foot-ic"><Pin /></span>
                  {centre}
                </b>
                <i>{address}</i>
                <u>
                  <span className="fw-foot-ic"><Phone /></span>
                  {phone}
                </u>
              </span>
              <span className="fw-qr">
                <img src={qrCode} alt="" aria-hidden />
                <b>SCAN</b>
              </span>
            </div>
            <p className="fw-fine">{finePrint}</p>

            {/* ---------- the lens ----------
                Air in front of the subject, then the two anamorphic streaks
                that fire on the impacts, then the grade. Last in the DOM
                because every one of them is something that happens to the
                picture after the picture exists. */}
            <div className="fw-motes" aria-hidden>
              {MOTES.map(([x, y, s, b, d, dl, o], i) => (
                <span
                  key={i}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `calc(${s} * var(--px))`,
                    height: `calc(${s} * var(--px))`,
                    filter: `blur(calc(${b} * var(--px)))`,
                    animationDuration: `${d}s`,
                    animationDelay: `${dl}s`,
                    opacity: o,
                  }}
                />
              ))}
            </div>
            <div className="fw-flare fw-flare--a" aria-hidden />
            <div className="fw-flare fw-flare--b" aria-hidden />
            <div className="fw-grade" aria-hidden />
            <div className="fw-grain" aria-hidden />
            <div className="fw-vig" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
