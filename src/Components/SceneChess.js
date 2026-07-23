// SceneChess.jsx — reel scene: "CHESS".
// A marble board under a spotlight; a gold knight hops an L-move to deliver
// mate, the black king topples, and CHECKMATE flashes in. Royal gold palette.
import React from "react";
import "../Stylesheets/CodeNinjasReel.css";

const GLYPH = { king: "♚", queen: "♛", rook: "♜", bishop: "♝", knight: "♞", pawn: "♟" };

// [type, side, col, row] — col/row 0..7 (row 0 = top). Squares (c+r) even = light.
const PIECES = [
  ["king", "black", 7, 1],
  ["queen", "gold", 2, 6],
  ["rook", "black", 1, 5],
  ["bishop", "black", 4, 6],
  ["knight", "gold", 5, 4, true], // the mover
];

const pct = (n) => `${((n + 0.5) / 8) * 100}%`;

export default function SceneChess() {
  return (
    <div className="sc sc-chess">
      <div className="ch-spot" aria-hidden />

      <div className="sc-head">
        <span className="sc-num">03</span>
        <span className="sc-title">CHESS</span>
        <span className="sc-rule" />
        <span className="sc-desc">Kids learn to think ahead.</span>
      </div>

      <div className="ch-stage">
        <div className="ch-board" aria-hidden>
          {Array.from({ length: 64 }, (_, i) => {
            const c = i % 8, r = (i / 8) | 0;
            return <span key={i} className={`ch-sq ${(c + r) % 2 ? "dk" : "lt"}`} />;
          })}

          {PIECES.map(([type, side, c, r, mover], i) => (
            <span
              key={i}
              className={`ch-piece side-${side} ${mover ? "ch-mover" : ""} ${type === "king" && side === "black" ? "ch-king" : ""}`}
              style={{ left: pct(c), top: pct(r) }}
            >
              <span className="ch-pi">{GLYPH[type]}</span>
            </span>
          ))}
        </div>

        <div className="ch-mate" aria-hidden>CHECKMATE</div>
      </div>
    </div>
  );
}
