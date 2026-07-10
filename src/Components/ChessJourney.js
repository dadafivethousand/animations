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

// cinematic floating pieces — white army flipped so knights face the black ones.
// w = white (ivory), else black; blur/op give depth-of-field.
const FLOATERS = [
  { g: "♞", w: true,  x: 14, y: 60, s: 150, dur: 11, delay: 0,  dx: 14, dy: -22, r0: -6, r1: 5,  blur: 0,   op: 1 },
  { g: "♞", w: false, x: 85, y: 56, s: 138, dur: 12, delay: -4, dx: -14, dy: -18, r0: 6,  r1: -4, blur: 0,   op: 1 },
  { g: "♛", w: true,  x: 50, y: 77, s: 110, dur: 15, delay: -6, dx: 8,  dy: -15, r0: -3, r1: 4,  blur: 0,   op: .98 },
  { g: "♟", w: false, x: 30, y: 83, s: 82,  dur: 13, delay: -2, dx: 12, dy: -13, r0: 4,  r1: -6, blur: 0,   op: .95 },
  { g: "♝", w: true,  x: 70, y: 84, s: 92,  dur: 14, delay: -8, dx: -9, dy: -14, r0: 5,  r1: -3, blur: 0,   op: .95 },
  { g: "♜", w: false, x: 19, y: 34, s: 66,  dur: 17, delay: -5, dx: 16, dy: 18,  r0: -8, r1: 6,  blur: 3,   op: .38 },
  { g: "♟", w: true,  x: 87, y: 31, s: 62,  dur: 18, delay: -10, dx: -13, dy: 20, r0: 7,  r1: -5, blur: 3,   op: .38 },
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

      {/* brand — dark logo + contact sit on the clean light top, no pill */}
      <img className="cj-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
      <div className="cj-contact">
        <span className="cj-chip">📍 {CONTACT.address}</span>
        <span className="cj-chip">🌐 {CONTACT.website}</span>
        <span className="cj-chip">📞 {CONTACT.phone}</span>
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
              left: `${f.x}%`, top: `${f.y}%`, opacity: f.op,
              fontSize: `clamp(${Math.round(f.s * 0.52)}px, ${(f.s / 12).toFixed(1)}vw, ${f.s}px)`,
              animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s`,
              "--dx": `${f.dx}px`, "--dy": `${f.dy}px`, "--r0": `${f.r0}deg`, "--r1": `${f.r1}deg`,
            }}
          >
            <span
              className={`cj-fp${f.w ? " cj-fp--w" : " cj-fp--b"}`}
              style={{ filter: f.blur ? `blur(${f.blur}px)` : "none" }}
            >
              {f.g}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
