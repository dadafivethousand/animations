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

/* The room's wallpaper: a WebGL render loop and a physics integrator, typing
 * itself for the whole run. Lower level than the toy it replaced — buffers,
 * uniforms, a matrix, a fixed-step integrate/collide pair — because "a kid
 * writes a game" is a smaller claim than "this is what the work looks like",
 * and nothing here reads as a made-up API. Tokens rather than strings so the
 * colouring is structural. */
const CODE = [
  [["const", "k"], [" gl ", "v"], ["=", "o"], [" canvas", "v"], [".getContext", "f"], ["(", "p"], ['"webgl2"', "s"], [")", "p"]],
  [["const", "k"], [" prog ", "v"], ["=", "o"], [" gl", "v"], [".createProgram", "f"], ["()", "p"]],
  [],
  [["gl", "v"], [".attachShader", "f"], ["(", "p"], ["prog, vs", "v"], [")", "p"]],
  [["gl", "v"], [".attachShader", "f"], ["(", "p"], ["prog, fs", "v"], [")", "p"]],
  [["gl", "v"], [".linkProgram", "f"], ["(", "p"], ["prog", "v"], [")", "p"]],
  [],
  [["const", "k"], [" vbo ", "v"], ["=", "o"], [" gl", "v"], [".createBuffer", "f"], ["()", "p"]],
  [["gl", "v"], [".bindBuffer", "f"], ["(", "p"], ["gl", "v"], [".ARRAY_BUFFER", "pr"], [", vbo", "v"], [")", "p"]],
  [["gl", "v"], [".bufferData", "f"], ["(", "p"], ["gl", "v"], [".ARRAY_BUFFER", "pr"], [", mesh, gl", "v"], [".STATIC_DRAW", "pr"], [")", "p"]],
  [],
  [["const", "k"], [" u_mvp ", "v"], ["=", "o"], [" gl", "v"], [".getUniformLocation", "f"], ["(", "p"], ["prog, ", "v"], ['"u_mvp"', "s"], [")", "p"]],
  [],
  [["function ", "k"], ["integrate", "f"], ["(", "p"], ["b, dt", "v"], [") {", "p"]],
  [["  b", "v"], [".vel", "pr"], ["[", "p"], ["1", "n"], ["] ", "p"], ["+=", "o"], [" GRAVITY ", "v"], ["*", "o"], [" dt", "v"]],
  [["  b", "v"], [".pos", "pr"], ["[", "p"], ["0", "n"], ["] ", "p"], ["+=", "o"], [" b", "v"], [".vel", "pr"], ["[", "p"], ["0", "n"], ["] ", "p"], ["*", "o"], [" dt", "v"]],
  [["  b", "v"], [".pos", "pr"], ["[", "p"], ["1", "n"], ["] ", "p"], ["+=", "o"], [" b", "v"], [".vel", "pr"], ["[", "p"], ["1", "n"], ["] ", "p"], ["*", "o"], [" dt", "v"]],
  [["}", "p"]],
  [],
  [["function ", "k"], ["collide", "f"], ["(", "p"], ["a, b", "v"], [") {", "p"]],
  [["  const", "k"], [" dx ", "v"], ["=", "o"], [" b", "v"], [".pos", "pr"], ["[", "p"], ["0", "n"], ["] ", "p"], ["-", "o"], [" a", "v"], [".pos", "pr"], ["[", "p"], ["0", "n"], ["]", "p"]],
  [["  const", "k"], [" dy ", "v"], ["=", "o"], [" b", "v"], [".pos", "pr"], ["[", "p"], ["1", "n"], ["] ", "p"], ["-", "o"], [" a", "v"], [".pos", "pr"], ["[", "p"], ["1", "n"], ["]", "p"]],
  [["  return", "k"], [" dx ", "v"], ["*", "o"], [" dx ", "v"], ["+", "o"], [" dy ", "v"], ["*", "o"], [" dy ", "v"], ["<", "o"], [" a", "v"], [".r2 ", "pr"], ["+", "o"], [" b", "v"], [".r2", "pr"]],
  [["}", "p"]],
  [],
  [["function ", "k"], ["frame", "f"], ["(", "p"], ["now", "v"], [") {", "p"]],
  [["  const", "k"], [" dt ", "v"], ["=", "o"], [" (now ", "v"], ["-", "o"], [" last) ", "v"], ["*", "o"], [" 0.001", "n"]],
  [["  for", "k"], [" (", "p"], ["const", "k"], [" b ", "v"], ["of", "k"], [" bodies", "v"], [") ", "p"], ["integrate", "f"], ["(", "p"], ["b, dt", "v"], [")", "p"]],
  [["  mat4", "t"], [".perspective", "f"], ["(", "p"], ["proj, FOV, aspect, ", "v"], ["0.1", "n"], [", ", "p"], ["100", "n"], [")", "p"]],
  [["  gl", "v"], [".uniformMatrix4fv", "f"], ["(", "p"], ["u_mvp, ", "v"], ["false", "k"], [", mvp", "v"], [")", "p"]],
  [["  gl", "v"], [".clear", "f"], ["(", "p"], ["gl", "v"], [".COLOR_BUFFER_BIT", "pr"], [")", "p"]],
  [["  gl", "v"], [".drawArrays", "f"], ["(", "p"], ["gl", "v"], [".TRIANGLES", "pr"], [", ", "p"], ["0", "n"], [", count", "v"], [")", "p"]],
  [["  last ", "v"], ["=", "o"], [" now", "v"]],
  [["  requestAnimationFrame", "f"], ["(", "p"], ["frame", "v"], [")", "p"]],
  [["}", "p"]],
  [],
  [["requestAnimationFrame", "f"], ["(", "p"], ["frame", "v"], [")", "p"]],
];


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

            {/* ---------- the room's wallpaper ---------- */}
            <div className="md-code" aria-hidden>
              {/* The scroll lives on an inner box because the outer one already
                  animates opacity and brightness — one transform per element,
                  or they overwrite each other. */}
              <div className="md-code-in">
              {CODE.map((tokens, i) => {
                const n = tokens.reduce((a, [t]) => a + t.length, 0);
                return (
                  <p className="md-ln" key={i} style={{ "--i": i, "--n": n }}>
                    <span className="md-num">{i + 1}</span>
                    <span className="md-txt">
                      {tokens.map(([t, k], j) => (
                        <span className={`md-tk-${k}`} key={j}>{t}</span>
                      ))}
                    </span>
                  </p>
                );
              })}
              </div>
            </div>
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
