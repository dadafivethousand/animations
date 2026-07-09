// ChessJourney.jsx — chess-academy rank-progression promo clip.
// Steps through ranks Beginner -> Grandmaster (~2.5s each), each showing a
// levelled-up piece + a milestone, then a King finale with a quote + CTA.
// Self-contained, loops cleanly.
import React, { useEffect, useState } from "react";
import "../Stylesheets/ChessJourney.css";

// Branding placeholders — swap these in Prompt 2.
const ACADEMY = {
  name: "GRANDMASTER CHESS ACADEMY",
  address: "123 Chess St, Your City",
  website: "yourchessacademy.com",
  phone: "(555) 123-4567",
};

const RANKS = [
  { name: "BEGINNER",    piece: "♙", color: "#57c785", ink: "#06311c", milestone: "Learn how every piece moves" },
  { name: "CLUB PLAYER", piece: "♘", color: "#4aa3ff", ink: "#04233f", milestone: "Openings & principles" },
  { name: "ADVANCED",    piece: "♗", color: "#a982ff", ink: "#210a4a", milestone: "Tactics & combinations" },
  { name: "EXPERT",      piece: "♖", color: "#ff6f9c", ink: "#43021d", milestone: "Positional play" },
  { name: "MASTER",      piece: "♕", color: "#ff9d3c", ink: "#3d1c00", milestone: "Endgame mastery" },
  { name: "GRANDMASTER", piece: "♔", color: "#ffce54", ink: "#3a2900", milestone: "Think like a Grandmaster" },
];

// steps 0..5 = ranks (~2.5s), 6 = finale (longer hold)
const DUR = [2500, 2500, 2500, 2500, 2500, 2500, 5400];

export default function ChessJourney() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setTimeout(
      () => setStep((s) => (s + 1) % (RANKS.length + 1)),
      DUR[step] ?? 2500
    );
    return () => clearTimeout(t);
  }, [step]);

  const isFinale = step >= RANKS.length;
  const rank = RANKS[Math.min(step, RANKS.length - 1)];

  return (
    <div className={`cj-stage${isFinale ? " cj-finale-on" : ""}`}>
      <div className="cj-board" aria-hidden />
      <div className="cj-spot" aria-hidden />
      <div className="cj-vignette" aria-hidden />

      {!isFinale ? (
        <>
          <div className="cj-kicker">THE&nbsp;CHESS&nbsp;JOURNEY</div>

          {/* rank name pill + levelled-up piece + milestone, replays each step */}
          <div key={step} className="cj-center" style={{ "--rk": rank.color, "--ink": rank.ink }}>
            <div className="cj-name">{rank.name}</div>

            <div className="cj-piece-wrap">
              <span className="cj-flash" />
              <span className="cj-ring" />
              <span className="cj-piece">{rank.piece}</span>
            </div>

            <div className="cj-milestone">{rank.milestone}</div>
          </div>
        </>
      ) : (
        <div className="cj-final">
          <div className="cj-final-piece">{"♔"}</div>
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

      {/* progress track — hidden on the finale */}
      {!isFinale && (
        <div className="cj-track">
          {RANKS.map((r, i) => (
            <span
              key={r.name}
              className={`cj-pip${i <= step ? " on" : ""}${i === step ? " cur" : ""}`}
              style={{ "--rk": r.color }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
