// MarkDropAd.js — the mark as a machined object, dropped into a lit room.
//
// ── WHY A MEDALLION AND NOT THE MARK ON ITS OWN ──
//
// The Code Ninjas head is near-black artwork. Spun as a bare object in a dark
// room it is a black shape on a black field with nothing to catch light on,
// and extruding it just makes a bigger black shape. So the mark is not the
// object here — it is PRINTED ON one. The object is a brand-red medallion, and
// the red is what the room lights: the rim, the bevel and the specular all
// happen on the disc while the mark stays exactly as drawn on its face.
//
// It also fixes the spin. A disc seen edge-on is a bar, which is what a coin
// actually looks like turning; a flat PNG seen edge-on is nothing at all.
//
// ── HOW THE DEPTH IS BUILT ──
//
// Sixteen circles stacked back along Z, each a step darker than the one in
// front. That is the whole extrusion: at any rotation the stack reads as a
// solid rim, and because every layer is a real element in the same preserve-3d
// space, it stays solid through the turn rather than collapsing at 90 degrees.
// Both faces carry the mark, so the back of the coin is never a mirror-image
// mistake mid-spin.
//
//   MS=8800 HOLD=1.6 BG='#08060a' OUT=~/Downloads/cn-mark-drop.mp4 \
//     NODE_PATH=/tmp/rec/node_modules node tools/record.js
import React from "react";
import "../Stylesheets/MarkDropAd.css";
import headMark from "../Images/cn-head-mark.png";
import cnLogo from "../Images/cn-logo-horizontal.svg";

const LAYERS = 16;

/* Air in the light. Fixed rather than random — a take that differs from the one
 * before it cannot be compared to it. [x%, y%, size, blur, drift-s, delay-s] */
const MOTES = [
  [10, 22, 6, 2, 15, 0], [22, 68, 5, 1, 18, 2], [31, 34, 8, 3, 13, 5],
  [40, 80, 4, 1, 20, 1], [49, 16, 6, 2, 17, 7], [58, 56, 5, 1, 14, 3],
  [67, 86, 7, 2, 19, 6], [76, 28, 5, 1, 16, 9], [85, 62, 6, 2, 12, 4],
  [93, 40, 5, 2, 21, 8], [6, 50, 24, 9, 24, 0], [95, 74, 27, 10, 27, 6],
];

export default function MarkDropAd({
  beats = ["CODE.", "BUILD.", "PUBLISH."],
  lineA = "GAMES BUILT",
  lineB = "BY KIDS.",
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

  const [go, setGo] = React.useState(false);
  React.useEffect(() => {
    if (reduce) return undefined;
    const r = requestAnimationFrame(() => setGo(true));
    return () => cancelAnimationFrame(r);
  }, [reduce]);

  return (
    <div className="md-frame">
      <div className={`md-stage md${go ? " md-go" : ""}${reduce ? " md-still" : ""}`}>
        <div className="md-push">
          <div className="md-shake">
            <div className="md-room" aria-hidden />
            <div className="md-key" aria-hidden />
            <div className="md-floor" aria-hidden />

            {/* the pool the object stands over — it arrives with the object */}
            <div className="md-pool" aria-hidden />

            {/* ---------- the object ---------- */}
            <div className="md-scene">
              {/* Three wrappers, three jobs. The arrival spins and scales, the
                  idle turns it a few degrees back and forth forever, and the
                  lift gets it out of the endcard's way. One transform each —
                  stacked they compose, shared they would overwrite. */}
              <div className="md-lift">
                <div className="md-arrive">
                  <div className="md-idle">
                    <div className="md-coin">
                      {Array.from({ length: LAYERS }, (_, i) => (
                        <span className="md-layer" key={i} style={{ "--i": i }} />
                      ))}

                      <span className="md-facefront">
                        <img src={headMark} alt="Code Ninjas" />
                        <span className="md-spec" aria-hidden />
                      </span>

                      <span className="md-faceback">
                        <img src={headMark} alt="" aria-hidden />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md-flash" aria-hidden />
            <div className="md-ring" aria-hidden />

            {/* ---------- the beats ---------- */}
            <div className="md-beats">
              {beats.map((w, i) => (
                <span className="md-beat" key={w} style={{ "--i": i }}>{w}</span>
              ))}
            </div>

            {/* ---------- the line ---------- */}
            <div className="md-lines">
              <p className="md-line-a">{lineA}</p>
              <p className="md-line-b">{lineB}</p>
            </div>

            {/* ---------- the endcard ---------- */}
            <div className="md-end">
              <img className="md-logo" src={cnLogo} alt="Code Ninjas" />
              <p className="md-city">WOODBRIDGE</p>
              <p className="md-where"><b>{centre}</b><i>{address}</i></p>
              <p className="md-tel">{phone}</p>
            </div>

            <div className="md-motes" aria-hidden>
              {MOTES.map(([x, y, s, b, d, dl], i) => (
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
                  }}
                />
              ))}
            </div>

            <div className="md-grain" aria-hidden />
            <div className="md-vig" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
