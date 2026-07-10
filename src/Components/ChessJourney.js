// ChessJourney.jsx — "Chess at Code Ninjas Woodbridge" promo.
// Clean black & white: a slowly spinning perspective chessboard, the CN
// Woodbridge logo (no pill needed on the light backdrop), a bold headline,
// a rotating tagline, and a CTA + contact. Self-contained, loops.
import React, { useEffect, useState } from "react";
import "../Stylesheets/ChessJourney.css";
import cnLogo from "../Images/cn-wb-logo.png";

const CONTACT = {
  address: "6175 Hwy 7, Woodbridge",
  website: "cnwoodbridge.com",
  phone: "(647) 887-9940",
};

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
  { g: "♞", w: true,  x: 17, y: 82, s: 152, dur: 5.5, delay: 0,    dx0: -60, dy0: 24,  dx2: 44,  dy2: -32, r0: -14, r2: 10,  blur: 0,   op: 1 },
  { g: "♞", w: false, x: 83, y: 80, s: 150, dur: 6,   delay: -2.5, dx0: 60,  dy0: 24,  dx2: -44, dy2: -32, r0: 14,  r2: -10, blur: 0,   op: 1 },
  { g: "♛", w: true,  x: 50, y: 87, s: 122, dur: 6.5, delay: -1.2, dx0: 0,   dy0: 52,  dx2: 0,   dy2: -42, r0: -8,  r2: 8,   blur: 0,   op: 1 },
  // mid
  { g: "♟", w: false, x: 33, y: 71, s: 86,  dur: 5,   delay: -3.6, dx0: -46, dy0: 30,  dx2: 46,  dy2: -26, r0: 13,  r2: -13, blur: 0,   op: .96 },
  { g: "♝", w: true,  x: 67, y: 72, s: 92,  dur: 5.8, delay: -4.4, dx0: 46,  dy0: 30,  dx2: -46, dy2: -26, r0: -13, r2: 13,  blur: 0,   op: .96 },
  // far (smaller, gentle depth-of-field)
  { g: "♜", w: false, x: 41, y: 61, s: 60,  dur: 7,   delay: -2,   dx0: -32, dy0: -30, dx2: 32,  dy2: 30,  r0: -16, r2: 14,  blur: 1.5, op: .6 },
  { g: "♟", w: true,  x: 60, y: 62, s: 58,  dur: 7.5, delay: -5,   dx0: 32,  dy0: -30, dx2: -32, dy2: 30,  r0: 16,  r2: -14, blur: 1.5, op: .6 },
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

      {/* brand — logo + contact grouped, on the clean light top, no pill */}
      <div className="cj-head">
        <img className="cj-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
        <div className="cj-contact">
          <span className="cj-chip">📍 {CONTACT.address}</span>
          <span className="cj-chip">🌐 {CONTACT.website}</span>
          <span className="cj-chip">📞 {CONTACT.phone}</span>
        </div>
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
