// FinalWeekCampAd.js — the last week of summer camp, as a stack of solid blocks.
//
// ── WHY A TOWER, AND NOT ANOTHER SHEET ──
//
// The open house ad is a POSTER: bands of content stacked down a flat page
// with a chess floor behind them. This one is a SCENE. The five things the
// week teaches are five extruded blocks floating one above the other, and the
// offer is a sixth slab that flies in from the back of the room and stops in
// front of them. Nothing about the layout repeats the previous ad — no white
// slab, no chip row, no programs grid, no mascot, and the type is a third of
// the frame instead of half.
//
// ── THE 3D IS REAL, AND THE CAMERA IS THE ONLY THING THAT MOVES ──
//
// Every block is a genuine cuboid: four faces in `transform-style: preserve-3d`
// with a front, a top and two sides. What sells the depth is not a rotation on
// the world — it is `perspective-origin` DRIFTING across the run. Moving the
// camera instead of the objects means the front faces stay perfectly
// axis-aligned rectangles, so the type on them never keystones and never goes
// soft, while the top and side faces open and close as the camera travels. A
// rotateY on the world would have bought the same parallax and cost every word
// its edges.
//
// Consequence worth knowing: `opacity` and `filter` FLATTEN a preserve-3d
// subtree, so nothing in the scene may fade. The blocks are hidden by being
// off-frame instead — they fall in from above the stage — and the offer slab
// is hidden by `visibility`, which does not flatten. Anything that needs to
// fade fades on a flat child INSIDE a face, never on a box that has depth.
//
// ── THE OFFER IS THE POINT ──
//
// The ad exists to say: come to the last week, and you qualify for a free
// month of Create. So the week is the setup (the five blocks build a tower)
// and the offer is the payoff (a gold slab lands in front of the tower and
// crowns the shot). The blocks build BOTTOM UP, like a real stack.
//
//   MS=9600 HOLD=1.8 BG='#170430' OUT=~/Downloads/cn-final-week.mp4 \
//     NODE_PATH=/tmp/rec/node_modules node tools/record.js
//
// BG is not optional: the recorder's default is near-white, and the page is
// that colour for the ~150ms before React mounts — a white flash on frame one.
import React from "react";
import "../Stylesheets/FinalWeekCampAd.css";
import cnLogo from "../Images/cn-logo-horizontal.svg";
import qrCode from "../Images/qr-cnwoodbridge.svg";
import { Chess, Cube, Blocks, Printer, Pin, Phone } from "./OpenHouseIcons";

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

const ICONS = { robotics: Robot, chess: Chess, printing: Printer, minecraft: Cube, roblox: Blocks };

export default function FinalWeekCampAd({
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
  finePrint = "Camp attendees only. Ask us at pickup — offer ends Fri, Aug 28.",

  centre = "CODE NINJAS WOODBRIDGE",
  address = "6175 Hwy 7, Woodbridge, ON",
  phone = "647-887-9940",
}) {
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

  return (
    <div className="fw-frame">
      <div className={`fw-stage fw${go ? " fw-go" : ""}${reduce ? " fw-still" : ""}`}>
        {/* The dolly and the impact are separate boxes because a CSS transform
            REPLACES a transform — one element cannot hold both a nine second
            push and a 500ms hit. */}
        <div className="fw-push">
          <div className="fw-shake">
            <div className="fw-sky" aria-hidden />
            <div className="fw-sun" aria-hidden />
            <div className="fw-floor" aria-hidden />
            <div className="fw-horizon" aria-hidden />

            {/* ---------- the lockup ---------- */}
            <div className="fw-lock">
              <img className="fw-lock-logo" src={cnLogo} alt="Code Ninjas" />
              <span className="fw-lock-city">WOODBRIDGE</span>
            </div>

            {/* ---------- the headline ----------
                Split into letters so the word can arrive as nine separate
                objects turning into place, and so the shimmer at the end has
                something to walk across. */}
            <p className="fw-kicker">{kicker}</p>
            <h1 className="fw-title">
              {title.split("").map((c, i) => (
                <i key={i} style={{ "--n": i }}>{c === " " ? " " : c}</i>
              ))}
            </h1>
            <div className="fw-when">
              <b>{when}</b>
              <span aria-hidden />
              <em>{ages}</em>
            </div>

            {/* ---------- the tower ----------
                One perspective camera over the whole scene. The blocks live in
                a preserve-3d world; nothing else does, because nothing else
                benefits from depth and everything else benefits from being
                rasterised flat. */}
            <div className="fw-scene">
              <div className="fw-world">
                {blocks.map((b, i) => {
                  const Icon = ICONS[b.key];
                  return (
                    <div
                      className={`fw-blk fw-blk--${b.key}`}
                      key={b.key}
                      /* --i places it; --d orders the DROP, which runs bottom
                         up so the tower builds like a real stack instead of
                         raining top down onto nothing. */
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
                          {/* the light that runs across the face as it lands */}
                          <span className="fw-blk-sheen" aria-hidden />
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* ---------- the offer ----------
                    Inside the world, so it shares the camera and can fly in
                    from the back of the room rather than sliding up the page.
                    It stops IN FRONT of the tower on +Z, which is the whole
                    reason the scene is 3D: the payoff is nearer than the
                    setup. */}
                <div className="fw-offer">
                  <div className="fw-offer-in">
                    <span className="fw-face fw-face--top" />
                    <span className="fw-face fw-face--left" />
                    <span className="fw-face fw-face--right" />
                    <span className="fw-face fw-face--front">
                      <span className="fw-offer-lead">{offerLead}</span>
                      <span className="fw-offer-big">{offerBig}</span>
                      <span className="fw-offer-tail">{offerTail}</span>
                      <span className="fw-offer-sheen" aria-hidden />
                    </span>
                  </div>
                </div>
              </div>
            </div>

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

            <div className="fw-grain" aria-hidden />
            <div className="fw-vig" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
