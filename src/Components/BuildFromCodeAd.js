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

/* THE SPRITE. One character per block, 11 wide by 16 tall — near enough three
 * times the block count of the first pass, which is where the detail comes
 * from: a hood that tapers, a headband with a tail, an eye slit rather than two
 * squares, arms that are their own colour so they read in front of the chest,
 * a belt, hands, and shoes wider than the shins.
 *
 *   K suit   A arm   L leg   F shoe   H band   h band tail
 *   E eye    B belt  N hand
 *
 * Deliberately generic: a hooded figure with a band and an eye slit, not a
 * reproduction of anybody's character.
 */
const SPRITE = [
  "....KKK....",
  "...KKKKK...",
  "..KKKKKKK..",
  "..KKKKKKK..",
  ".HHHHHHHHHh",
  "..KEEKEEK..",
  "..KKKKKKK..",
  "...KKKKK...",
  "..AKKKKKA..",
  ".AAKKKKKAA.",
  ".AAKKKKKAA.",
  ".AABBBBBAA.",
  ".AAKKKKKAA.",
  "..NKKKKKN..",
  "...LL.LL...",
  "..FFF.FFF..",
];

const W = SPRITE[0].length;
const H = SPRITE.length;
const GROUND = 15;   // blocks in the scrolling strip

/* WHICH LIMB A BLOCK BELONGS TO, so the run cycle has something to swing.
 * Read off the character and the column rather than stored in a second map:
 * two parallel maps drift the moment somebody edits one row. */
function partOf(ch, col, row) {
  if (row <= 7) return "head";
  if (ch === "A" || ch === "N") return col < W / 2 ? "armL" : "armR";
  if (ch === "L" || ch === "F") return col < W / 2 ? "legL" : "legR";
  return "torso";
}

/* Where each limb pivots, in blocks. A leg swings from the hip and an arm from
 * the shoulder; swinging either from the middle of the sprite reads as the
 * whole figure shearing. */
const PIVOT = {
  head: [5.5, 8],
  torso: [5.5, 8],
  armL: [2.5, 8.5],
  armR: [8.5, 8.5],
  legL: [4, 13.5],
  legR: [7, 13.5],
};

/* Where each block comes from. Fixed, not random: a take that differs from the
 * take before it cannot be compared to it. The vector is read off the index so
 * the debris leaves the detonation in a fan rather than a clump. */
function scatter(i, total) {
  const a = (i / total) * Math.PI * 2 * 3.7 + 0.6;
  const r = 420 + ((i * 137) % 380);
  return {
    x: Math.cos(a) * r,
    y: Math.sin(a) * r * 0.72 - 260,
    z: 220 + ((i * 91) % 300),
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

  /* Blocks, bottom row first — the figure has to build up out of its feet, not
   * rain down onto them — grouped by limb, with hidden faces culled.
   *
   * THE CULL IS A PERFORMANCE FIX AND A CORRECTNESS ONE. A block with a
   * neighbour above it has its top face completely covered by that neighbour,
   * and a block with a neighbour to its left has its left face covered the same
   * way. Rendering them anyway costs a hundred-odd extra 3D-transformed
   * elements that are never seen — on a sprite this size that is the
   * difference between a smooth swarm and a juddering one — and they z-fight
   * with the neighbour that covers them. Only silhouette blocks get sides. */
  const parts = React.useMemo(() => {
    const at = (r, c2) =>
      r >= 0 && r < H && c2 >= 0 && c2 < W && SPRITE[r][c2] !== "." ? SPRITE[r][c2] : null;

    const groups = { head: [], torso: [], armL: [], armR: [], legL: [], legR: [] };
    let n = 0;
    for (let r = H - 1; r >= 0; r--) {
      for (let col = 0; col < W; col++) {
        const ch = SPRITE[r][col];
        if (ch === ".") continue;
        groups[partOf(ch, col, r)].push({
          c: col,
          r,
          kind: ch,
          top: !at(r - 1, col),
          left: !at(r, col - 1),
          i: n++,
        });
      }
    }
    return { groups, count: n };
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
                {/* The ground the run happens over. Uniform blocks, so shifting
                    the strip by exactly one block width loops seamlessly and
                    still reads as motion — the seams are the motion. */}
                <div className="bf-ground">
                  {Array.from({ length: GROUND }, (_, i) => (
                    <span className="bf-vx bf-vx--P" key={i} style={{ "--c": i - 3, "--r": H }}>
                      <span className="bf-vx-in bf-vx-in--static">
                        <i className="bf-face bf-face--top" />
                        <i className="bf-face bf-face--left" />
                        <i className="bf-face bf-face--front" />
                      </span>
                    </span>
                  ))}
                </div>

                <div className="bf-hero">
                  {Object.entries(parts.groups).map(([part, blocks]) => (
                    <div
                      className={`bf-part bf-part--${part}`}
                      key={part}
                      style={{ "--ox": PIVOT[part][0], "--oy": PIVOT[part][1] }}
                    >
                      {blocks.map((b) => {
                        const s = scatter(b.i, parts.count);
                        return (
                          <span
                            className={`bf-vx bf-vx--${b.kind}`}
                            key={`${b.r}-${b.c}`}
                            style={{ "--c": b.c, "--r": b.r }}
                          >
                            <span
                              className="bf-vx-in"
                              style={{
                                "--sx": `${s.x.toFixed(1)}px`,
                                "--sy": `${s.y.toFixed(1)}px`,
                                "--sz": `${s.z.toFixed(1)}px`,
                                "--sr": `${s.rot}deg`,
                                "--d": `${(2.62 + b.i * 0.0125).toFixed(3)}s`,
                              }}
                            >
                              {b.top && <i className="bf-face bf-face--top" />}
                              {b.left && <i className="bf-face bf-face--left" />}
                              <i className="bf-face bf-face--front" />
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
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
