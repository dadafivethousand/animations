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

      {/* cinematic piece battle — pieces charge in and get captured, on loop */}
      <div className="cj-battle" aria-hidden>
        <div className="cj-duel cj-duel--main">
          <span className="cj-clash" />
          <span className="cj-atk">♞</span>
          <span className="cj-vic">♟</span>
        </div>
        <div className="cj-duel cj-duel--left">
          <span className="cj-clash" />
          <span className="cj-atk">♜</span>
          <span className="cj-vic">♞</span>
        </div>
        <div className="cj-duel cj-duel--right">
          <span className="cj-clash" />
          <span className="cj-atk">♝</span>
          <span className="cj-vic">♟</span>
        </div>
      </div>
    </div>
  );
}
