// ChessJourney.jsx — "Chess at Code Ninjas Woodbridge" promo clip.
// A cinematic wood chessboard, the CN Woodbridge logo, a bobbing chess set,
// a rotating benefits tagline, and a CTA + contact. Self-contained, loops.
import React, { useEffect, useState } from "react";
import "../Stylesheets/ChessJourney.css";
import cnLogo from "../Images/cn-wb-logo.png";

const CONTACT = {
  website: "cnwoodbridge.com",
  phone: "(647) 887-9940",
};

const TAGLINES = [
  "Strategy, focus & critical thinking",
  "For all ages & every skill level",
  "Openings, tactics & endgames",
  "Play, compete & level up",
];

const HERO_PIECES = ["♚", "♛", "♜", "♝", "♞", "♟"];

// 64 squares, built once
const SQUARES = Array.from({ length: 64 }, (_, i) => {
  const r = Math.floor(i / 8), c = i % 8;
  return (r + c) % 2 === 0 ? "l" : "d";
});
const FLOATERS = ["♟", "♞", "♝", "♜", "♛", "♚", "♟", "♞"];

export default function ChessJourney() {
  const [ti, setTi] = useState(0);

  // cycle the benefit tagline for a little life (not a rank machine)
  useEffect(() => {
    const t = setTimeout(() => setTi((v) => (v + 1) % TAGLINES.length), 2600);
    return () => clearTimeout(t);
  }, [ti]);

  return (
    <div className="cj-stage">
      {/* layered chess-wood background */}
      <div className="cj-bg" aria-hidden />
      <div className="cj-boardwrap" aria-hidden>
        <div className="cj-board">
          {SQUARES.map((s, i) => (
            <span key={i} className={`cj-sq cj-sq--${s}`} style={{ "--i": i }} />
          ))}
        </div>
      </div>
      <div className="cj-spot" aria-hidden />
      <div className="cj-floaters" aria-hidden>
        {FLOATERS.map((g, i) => (
          <span
            key={i}
            className="cj-float"
            style={{
              left: `${(i * 37 + 6) % 92}%`,
              animationDelay: `${((i * 1.3) % 9) - 9}s`,
              animationDuration: `${13 + (i % 5) * 2}s`,
              fontSize: `${40 + (i % 3) * 24}px`,
            }}
          >
            {g}
          </span>
        ))}
      </div>
      <div className="cj-vignette" aria-hidden />

      {/* brand */}
      <img className="cj-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />

      {/* hero */}
      <div className="cj-hero">
        <div className="cj-kicker">NOW&nbsp;AT&nbsp;CODE&nbsp;NINJAS&nbsp;WOODBRIDGE</div>
        <div className="cj-pieces">
          {HERO_PIECES.map((p, i) => (
            <span key={i} className="cj-pc" style={{ "--d": `${i * 0.16}s` }}>{p}</span>
          ))}
        </div>
        <h1 className="cj-title">CHESS <span>CLUB</span></h1>
        <div key={ti} className="cj-tag">{TAGLINES[ti]}</div>
      </div>

      {/* footer */}
      <div className="cj-footer">
        <span className="cj-cta">JOIN THE CHESS CLUB</span>
        <div className="cj-chips">
          <span className="cj-chip">🌐 {CONTACT.website}</span>
          <span className="cj-chip">📞 {CONTACT.phone}</span>
        </div>
      </div>
    </div>
  );
}
