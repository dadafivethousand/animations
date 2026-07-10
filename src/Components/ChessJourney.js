// ChessJourney.jsx — "Chess at Code Ninjas Woodbridge" promo.
// Clean black & white: a slowly spinning perspective chessboard, the CN
// Woodbridge logo (no pill needed on the light backdrop), a bold headline,
// a rotating tagline, and a CTA + contact. Self-contained, loops.
import React, { useEffect, useState } from "react";
import "../Stylesheets/ChessJourney.css";
import cnLogo from "../Images/cn-wb-logo-2025.png";

const TAGLINES = [
  "Coached by a competitive tournament player",
  "Learn from a coach with real competitive experience",
  "An ongoing program for all skill levels",
  "Weekly classes · beginner to advanced",
  "From first moves to tournament play",
];

// 64 squares, built once
const SQUARES = Array.from({ length: 64 }, (_, i) => {
  const r = Math.floor(i / 8), c = i % 8;
  return (r + c) % 2 === 0 ? "l" : "d";
});

// cinematic floating pieces — all kept on the board (lower floor), spaced in
// their own lanes so they gently float in place without bumping. White army is
// flipped so its knights face the black knights. Far pieces sit higher/smaller
// on the board with a touch of depth blur.
const FLOATERS = [
  // front row (big, near the bottom)
  { g: "♞", w: true,  x: 12, y: 88, s: 150, dur: 6.0, delay: 0,    dx0: -56, dy0: 26, dx2: 40,  dy2: -32, r0: -12, r2: 9,   blur: 0,  op: 1 },
  { g: "♛", w: false, x: 33, y: 90, s: 118, dur: 6.3, delay: -3.8, dx0: -38, dy0: 32, dx2: 42,  dy2: -28, r0: 10,  r2: -10, blur: 0,  op: 1 },
  { g: "♚", w: true,  x: 52, y: 92, s: 132, dur: 6.8, delay: -1.1, dx0: 0,   dy0: 52, dx2: 0,   dy2: -44, r0: -7,  r2: 7,   blur: 0,  op: 1 },
  { g: "♜", w: false, x: 72, y: 89, s: 112, dur: 6.5, delay: -5.0, dx0: 44,  dy0: 30, dx2: -40, dy2: -28, r0: -10, r2: 10,  blur: 0,  op: 1 },
  { g: "♞", w: false, x: 90, y: 86, s: 150, dur: 6.1, delay: -2.4, dx0: 56,  dy0: 26, dx2: -40, dy2: -32, r0: 12,  r2: -9,  blur: 0,  op: 1 },
  // mid row
  { g: "♟", w: true,  x: 20, y: 78, s: 84,  dur: 5.5, delay: -2.9, dx0: -40, dy0: 26, dx2: 40,  dy2: -24, r0: -10, r2: 10,  blur: 0,  op: .97 },
  { g: "♝", w: false, x: 38, y: 76, s: 92,  dur: 5.9, delay: -4.6, dx0: 34,  dy0: 26, dx2: -38, dy2: -24, r0: 11,  r2: -11, blur: 0,  op: .97 },
  { g: "♞", w: true,  x: 56, y: 77, s: 94,  dur: 6.0, delay: -1.9, dx0: 38,  dy0: 26, dx2: -36, dy2: -24, r0: 11,  r2: -11, blur: 0,  op: .97 },
  { g: "♟", w: false, x: 74, y: 78, s: 84,  dur: 5.7, delay: -5.8, dx0: 42,  dy0: 26, dx2: -38, dy2: -24, r0: -10, r2: 10,  blur: 0,  op: .97 },
  { g: "♛", w: true,  x: 88, y: 75, s: 96,  dur: 6.2, delay: -3.3, dx0: 44,  dy0: 26, dx2: -40, dy2: -24, r0: -11, r2: 11,  blur: 0,  op: .97 },
  // back row (subtle depth)
  { g: "♜", w: false, x: 16, y: 70, s: 72,  dur: 7.0, delay: -1.6, dx0: -30, dy0: 24, dx2: 30,  dy2: -22, r0: -13, r2: 12,  blur: .8, op: .86 },
  { g: "♝", w: true,  x: 34, y: 68, s: 76,  dur: 7.4, delay: -4.9, dx0: 26,  dy0: 24, dx2: -28, dy2: -22, r0: 13,  r2: -12, blur: .8, op: .86 },
  { g: "♟", w: false, x: 50, y: 71, s: 70,  dur: 6.9, delay: -3.1, dx0: 28,  dy0: 24, dx2: -28, dy2: -22, r0: -12, r2: 11,  blur: .8, op: .86 },
  { g: "♞", w: false, x: 64, y: 69, s: 74,  dur: 7.2, delay: -6.2, dx0: 30,  dy0: 24, dx2: -28, dy2: -22, r0: 12,  r2: -11, blur: .8, op: .86 },
  { g: "♜", w: true,  x: 82, y: 70, s: 76,  dur: 7.1, delay: -2.2, dx0: 34,  dy0: 24, dx2: -30, dy2: -22, r0: -12, r2: 11,  blur: .8, op: .86 },
];

export default function ChessJourney() {
  const [ti, setTi] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setTi((v) => (v + 1) % TAGLINES.length), 2600);
    return () => clearTimeout(t);
  }, [ti]);

  return (
    <div className="cj-stage">
      {/* spinning perspective chessboard floor */}
      <div className="cj-boardwrap" aria-hidden>
        <div className="cj-board">
          {SQUARES.map((s, i) => (
            <span key={i} className={`cj-sq cj-sq--${s}`} style={{ "--i": i }} />
          ))}
        </div>
      </div>
      <div className="cj-haze" aria-hidden />

      {/* brand — logo only, on the clean light top, no pill */}
      <div className="cj-head">
        <img className="cj-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
      </div>

      {/* hero */}
      <div className="cj-hero">
        <h1 className="cj-title">CHESS PROGRAM</h1>
        <div className="cj-rule" aria-hidden />
        <div key={ti} className="cj-tag">{TAGLINES[ti]}</div>
      </div>

      {/* cinematic floating pieces drifting over the board */}
      <div className="cj-floats" aria-hidden>
        {FLOATERS.map((f, i) => (
          <span
            key={i}
            className="cj-float"
            style={{
              left: `${f.x}%`, top: `${f.y}%`,
              fontSize: `clamp(${Math.round(f.s * 0.52)}px, ${(f.s / 12).toFixed(1)}vw, ${f.s}px)`,
              animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s`,
              "--dx0": `${f.dx0}px`, "--dy0": `${f.dy0}px`, "--dx2": `${f.dx2}px`, "--dy2": `${f.dy2}px`,
              "--r0": `${f.r0}deg`, "--r2": `${f.r2}deg`,
            }}
          >
            <span
              className={`cj-fp${f.w ? " cj-fp--w" : " cj-fp--b"}`}
              style={{ filter: f.blur ? `blur(${f.blur}px)` : "none", opacity: f.op }}
            >
              {f.g}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
