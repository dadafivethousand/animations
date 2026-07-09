// ChessJourney.jsx — cinematic promo for a chess academy.
// A tilted wood chessboard "floor", drifting pieces, and a marble medallion
// whose piece levels up Pawn -> King through the ranks, then a golden-king
// finale with a quote + CTA. Self-contained, loops cleanly.
import React, { useEffect, useState } from "react";
import "../Stylesheets/ChessJourney.css";

// Branding placeholders — swap these in Prompt 2.
const ACADEMY = {
  name: "GRANDMASTER CHESS ACADEMY",
  address: "123 Chess St, Your City",
  website: "yourchessacademy.com",
  phone: "(555) 123-4567",
};

// filled (dark) glyphs read boldly on the ivory medallion
const RANKS = [
  { name: "BEGINNER",    piece: "♟", milestone: "Learn how every piece moves" },
  { name: "CLUB PLAYER", piece: "♞", milestone: "Openings & principles" },
  { name: "ADVANCED",    piece: "♝", milestone: "Tactics & combinations" },
  { name: "EXPERT",      piece: "♜", milestone: "Positional play" },
  { name: "MASTER",      piece: "♛", milestone: "Endgame mastery" },
  { name: "GRANDMASTER", piece: "♚", milestone: "Think like a Grandmaster" },
];

// steps 0..5 = ranks (~2.6s), 6 = finale (longer hold)
const DUR = [2600, 2600, 2600, 2600, 2600, 2600, 5600];

// 64 squares, built once
const SQUARES = Array.from({ length: 64 }, (_, i) => {
  const r = Math.floor(i / 8), c = i % 8;
  return (r + c) % 2 === 0 ? "l" : "d";
});
const FLOATERS = ["♟", "♞", "♝", "♜", "♛", "♚", "♟", "♞"];

export default function ChessJourney() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setTimeout(
      () => setStep((s) => (s + 1) % (RANKS.length + 1)),
      DUR[step] ?? 2600
    );
    return () => clearTimeout(t);
  }, [step]);

  const isFinale = step >= RANKS.length;
  const rank = RANKS[Math.min(step, RANKS.length - 1)];

  return (
    <div className={`cj-stage${isFinale ? " cj-finale-on" : ""}`}>
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

      {!isFinale ? (
        <>
          <div className="cj-kicker">THE&nbsp;ROAD&nbsp;TO&nbsp;MASTERY</div>

          {/* medallion piece + rank + milestone, replays each step */}
          <div key={step} className="cj-hero">
            <div className="cj-medallion">
              <span className="cj-flash" />
              <span className="cj-piece">{rank.piece}</span>
            </div>
            <div className="cj-rank">{rank.name}</div>
            <div className="cj-milestone">{rank.milestone}</div>
          </div>

          {/* piece-row progress — lights up gold as you advance */}
          <div className="cj-progress">
            {RANKS.map((r, i) => (
              <span
                key={r.name}
                className={`cj-pp${i < step ? " done" : ""}${i === step ? " cur" : ""}`}
              >
                {r.piece}
              </span>
            ))}
          </div>
        </>
      ) : (
        <div className="cj-final">
          <div className="cj-crown">♚</div>
          <blockquote className="cj-quote">
            Every <em>master</em> was once a beginner.
          </blockquote>
          <span className="cj-cta">START YOUR JOURNEY</span>
          <div className="cj-footer">
            <div className="cj-academy">{ACADEMY.name}</div>
            <div className="cj-chips">
              <span className="cj-chip">📍 {ACADEMY.address}</span>
              <span className="cj-chip">🌐 {ACADEMY.website}</span>
              <span className="cj-chip">📞 {ACADEMY.phone}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
