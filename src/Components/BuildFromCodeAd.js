// BuildFromCodeAd.js — code detonates, and the pieces build the game.
//
// ── THE SHAPE OF IT ──
//
//   0.0  black, one cursor blinking
//   0.4  a kid's game code types itself, accelerating, line after line
//   2.5  it detonates — flash, shake, the lines blown off the frame
//   2.7  the debris is VOXELS, scattered, tumbling
//   2.9  they swarm inward and land, BOTTOM ROW FIRST, so the character
//        builds upward out of its own feet
//   5.0  the last block lands; the whole figure squashes on impact
//   5.4  it jumps — the same jump() the code declared
//   6.4  "THEY DON'T PLAY THE GAME." / "THEY BUILD IT."
//   8.0  endcard
//
// The code is not decoration. It declares `jump()`, and the thing the code
// turns into is the thing that jumps. That is the entire ad: the abstraction
// on screen at second one becomes the character doing the thing at second six.
//
// ── WHY THE VOXELS ARE BUILT THE WAY THEY ARE ──
//
// Every block is a real cuboid in `transform-style: preserve-3d`, and the
// camera never rotates the world — `perspective-origin` sits up and to the
// left of the whole sprite instead. That means every front face stays exactly
// parallel to the screen (a pixel sprite has to read as square pixels, and a
// rotated world would keystone all forty of them) while the top and left faces
// open up on their own. It also means the camera has to stay OUTSIDE the
// sprite's bounds: a camera inside them shows some blocks their left face and
// others their right, and the light falls apart.
//
//   MS=9600 HOLD=1.6 BG='#07060d' OUT=~/Downloads/cn-build-from-code.mp4 \
//     NODE_PATH=/tmp/rec/node_modules node tools/record.js
import React from "react";
import "../Stylesheets/BuildFromCodeAd.css";
import cnLogo from "../Images/cn-logo-horizontal.svg";

/* A kid's game, written the way a kid writes one. Tokens rather than a string
 * so the colouring is structural — and short lines, because the frame is 1080
 * wide and a wrapped line breaks the typewriter illusion instantly. */
const CODE = [
  [["let", "k"], [" hero ", "v"], ["=", "o"], [" new ", "k"], ["Sprite", "t"], ["(", "p"], ['"ninja"', "s"], [")", "p"]],
  [["hero", "v"], [".speed ", "pr"], ["=", "o"], [" 7", "n"]],
  [],
  [["function ", "k"], ["jump", "f"], ["() {", "p"]],
  [["  hero", "v"], [".y ", "pr"], ["-=", "o"], [" 120", "n"]],
  [["  play", "f"], ["(", "p"], ['"whoosh"', "s"], [")", "p"]],
  [["}", "p"]],
  [],
  [["onKey", "f"], ["(", "p"], ['"space"', "s"], [", ", "p"], ["jump", "f"], [")", "p"]],
  [["world", "v"], [".add", "f"], ["(", "p"], ["hero", "v"], [")", "p"]],
  [["start", "f"], ["()", "p"]],
];

/* The sprite, one character per block. 7 wide, 8 tall.
 *   K suit   H headband   E eye   B belt
 * Deliberately generic — a hooded figure with a band and two eyes, not a
 * reproduction of anybody's character. */
const SPRITE = [
  "..KKK..",
  ".HHHHH.",
  ".KEKEK.",
  ".KKKKK.",
  "KKKKKKK",
  "KKBBBKK",
  ".KK.KK.",
  ".KK.KK.",
];

const PLATFORM = 9; // blocks wide, under the feet

/* Where each block comes from. Fixed, not random: a take that differs from the
 * take before it cannot be compared to it. The vector is read off the index so
 * the debris leaves the detonation in a fan rather than a clump. */
function scatter(i, total) {
  const a = (i / total) * Math.PI * 2 * 3.7 + 0.6;   // 3.7 turns over the set
  const r = 420 + ((i * 137) % 380);                  // 420-800 units out
  return {
    x: Math.cos(a) * r,
    y: Math.sin(a) * r * 0.72 - 260,                  // biased upward, toward the code
    z: 220 + ((i * 91) % 300),                        // toward the lens, so they read as debris
    rot: ((i * 47) % 120) - 60,
  };
}

export default function BuildFromCodeAd({
  lineA = "THEY DON'T PLAY THE GAME.",
  lineB = "THEY BUILD IT.",
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

  // Blocks, bottom row first — the figure has to build up out of its feet, not
  // rain down onto them.
  const blocks = React.useMemo(() => {
    const out = [];
    for (let r = SPRITE.length - 1; r >= 0; r--) {
      for (let c = 0; c < SPRITE[r].length; c++) {
        const ch = SPRITE[r][c];
        if (ch !== ".") out.push({ c, r, kind: ch, part: "body" });
      }
    }
    for (let c = 0; c < PLATFORM; c++) {
      out.push({ c: c - 1, r: SPRITE.length, kind: "P", part: "floor" });
    }
    return out;
  }, []);

  return (
    <div className="bf-frame">
      <div className={`bf-stage bf${go ? " bf-go" : ""}${reduce ? " bf-still" : ""}`}>
        <div className="bf-push">
          <div className="bf-shake">
            <div className="bf-room" aria-hidden />
            <div className="bf-grid" aria-hidden />

            {/* ---------- the code ---------- */}
            <div className="bf-code">
              {CODE.map((tokens, i) => {
                const n = tokens.reduce((a, [t]) => a + t.length, 0);
                return (
                  <p className="bf-ln" key={i} style={{ "--i": i, "--n": n }}>
                    <span className="bf-num">{i + 1}</span>
                    <span className="bf-txt">
                      {tokens.map(([t, k], j) => (
                        <span className={`bf-tk-${k}`} key={j}>{t}</span>
                      ))}
                    </span>
                  </p>
                );
              })}
              <span className="bf-caret" aria-hidden />
            </div>

            {/* ---------- the detonation ---------- */}
            <div className="bf-flash" aria-hidden />
            <div className="bf-ring" aria-hidden />

            {/* ---------- what it becomes ---------- */}
            <div className="bf-scene">
              <div className="bf-world">
                {blocks.map((b, i) => {
                  const s = scatter(i, blocks.length);
                  return (
                    <span
                      className={`bf-vx bf-vx--${b.kind}`}
                      key={`${b.part}-${b.r}-${b.c}`}
                      style={{ "--c": b.c, "--r": b.r }}
                    >
                      <span
                        className="bf-vx-in"
                        style={{
                          "--sx": `${s.x.toFixed(1)}px`,
                          "--sy": `${s.y.toFixed(1)}px`,
                          "--sz": `${s.z.toFixed(1)}px`,
                          "--sr": `${s.rot}deg`,
                          "--d": `${(2.9 + i * 0.036).toFixed(3)}s`,
                        }}
                      >
                        <i className="bf-face bf-face--top" />
                        <i className="bf-face bf-face--left" />
                        <i className="bf-face bf-face--front" />
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* ---------- the copy ---------- */}
            <div className="bf-lines">
              <p className="bf-line-a">{lineA}</p>
              <p className="bf-line-b">{lineB}</p>
            </div>

            {/* ---------- the endcard ---------- */}
            <div className="bf-end">
              <img className="bf-logo" src={cnLogo} alt="Code Ninjas" />
              <p className="bf-city">WOODBRIDGE</p>
              <p className="bf-where"><b>{centre}</b><i>{address}</i></p>
              <p className="bf-tel">{phone}</p>
            </div>

            <div className="bf-grain" aria-hidden />
            <div className="bf-vig" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
