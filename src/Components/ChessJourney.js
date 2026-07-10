// ChessJourney.jsx — "Chess at Code Ninjas Woodbridge" promo.
// Clean black & white: a slowly spinning perspective chessboard, the CN
// Woodbridge logo (no pill needed on the light backdrop), a bold headline,
// a rotating tagline, and a CTA + contact. Self-contained, loops.
import React, { useEffect, useState } from "react";
import "../Stylesheets/ChessJourney.css";
import cnLogo from "../Images/cn-wb-logo.png";

const TAGLINES = [
  "An ongoing program for all skill levels",
  "Weekly classes · beginner to advanced",
  "Structured curriculum & real coaching",
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
  // near / foreground (big)
  { g: "♞", w: true,  x: 14, y: 83, s: 152, dur: 6,   delay: 0,    dx0: -58, dy0: 26,  dx2: 40,  dy2: -34, r0: -12, r2: 9,   blur: 0,   op: 1 },
  { g: "♞", w: false, x: 86, y: 81, s: 150, dur: 6.4, delay: -2.4, dx0: 58,  dy0: 26,  dx2: -40, dy2: -34, r0: 12,  r2: -9,  blur: 0,   op: 1 },
  { g: "♚", w: true,  x: 50, y: 88, s: 128, dur: 6.8, delay: -1.2, dx0: 0,   dy0: 54,  dx2: 0,   dy2: -44, r0: -7,  r2: 7,   blur: 0,   op: 1 },
  { g: "♛", w: false, x: 31, y: 86, s: 112, dur: 6.2, delay: -4.1, dx0: -40, dy0: 34,  dx2: 44,  dy2: -28, r0: 10,  r2: -10, blur: 0,   op: 1 },
  { g: "♜", w: true,  x: 71, y: 85, s: 104, dur: 6.6, delay: -5.3, dx0: 44,  dy0: 34,  dx2: -42, dy2: -28, r0: -10, r2: 10,  blur: 0,   op: 1 },
  // mid
  { g: "♟", w: false, x: 23, y: 72, s: 80,  dur: 5.6, delay: -3,   dx0: -42, dy0: 28,  dx2: 42,  dy2: -24, r0: 12,  r2: -12, blur: 0,   op: .96 },
  { g: "♝", w: true,  x: 43, y: 70, s: 84,  dur: 5.9, delay: -4.7, dx0: 36,  dy0: 28,  dx2: -40, dy2: -24, r0: -11, r2: 11,  blur: .6,  op: .96 },
  { g: "♞", w: false, x: 59, y: 71, s: 82,  dur: 6.1, delay: -2,   dx0: 40,  dy0: 28,  dx2: -38, dy2: -24, r0: 11,  r2: -11, blur: .6,  op: .96 },
  { g: "♟", w: true,  x: 79, y: 70, s: 78,  dur: 5.7, delay: -6,   dx0: 44,  dy0: 28,  dx2: -40, dy2: -24, r0: -10, r2: 10,  blur: .6,  op: .96 },
  // far (smaller, depth-of-field)
  { g: "♜", w: false, x: 36, y: 61, s: 58,  dur: 7.2, delay: -1.8, dx0: -30, dy0: -28, dx2: 30,  dy2: 28,  r0: -15, r2: 13,  blur: 1.6, op: .6 },
  { g: "♝", w: true,  x: 54, y: 60, s: 56,  dur: 7.6, delay: -5,   dx0: 28,  dy0: -28, dx2: -28, dy2: 28,  r0: 15,  r2: -13, blur: 1.6, op: .6 },
  { g: "♛", w: false, x: 66, y: 62, s: 60,  dur: 7,   delay: -3.4, dx0: 30,  dy0: -26, dx2: -30, dy2: 26,  r0: -14, r2: 12,  blur: 1.6, op: .55 },
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
