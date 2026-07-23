// SceneChess.jsx — reel scene: "CHESS".
// The full starting position drops into place, then white plays e4 and black
// replies e5 (the classic opening), with the moved squares highlighted and the
// move logged as "1. e4 e5". Tournament board, ivory vs obsidian pieces.
import React from "react";
import "../Stylesheets/CodeNinjasReel.css";

const GLYPH = { king: "♚", queen: "♛", rook: "♜", bishop: "♝", knight: "♞", pawn: "♟" };
const BACK = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

// full starting position. row 0 = top (black back rank), row 7 = white back rank.
const PIECES = [];
BACK.forEach((t, c) => PIECES.push({ t, s: "black", c, r: 0 }));
for (let c = 0; c < 8; c++) PIECES.push({ t: "pawn", s: "black", c, r: 1, mv: c === 4 ? "b" : null });
for (let c = 0; c < 8; c++) PIECES.push({ t: "pawn", s: "white", c, r: 6, mv: c === 4 ? "w" : null });
BACK.forEach((t, c) => PIECES.push({ t, s: "white", c, r: 7 }));

// e2, e4 (white move) and e7, e5 (black move) squares to highlight
const HILITE = [
  { c: 4, r: 6, w: "w" }, { c: 4, r: 4, w: "w" },
  { c: 4, r: 1, w: "b" }, { c: 4, r: 3, w: "b" },
];

const pc = (n) => `${((n + 0.5) / 8) * 100}%`;

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

          {HILITE.map((h, i) => (
            <span key={`h${i}`} className={`ch-hl ${h.w}`} style={{ left: pc(h.c), top: pc(h.r) }} />
          ))}

          {PIECES.map((p, i) => (
            <span
              key={i}
              className={`ch-piece side-${p.s} ${p.mv ? `ch-mv-${p.mv}` : ""}`}
              style={{ left: pc(p.c), top: pc(p.r) }}
            >
              <span className="ch-pi" style={{ animationDelay: `${(0.3 + p.r * 0.05 + p.c * 0.012).toFixed(3)}s` }}>
                {GLYPH[p.t]}
              </span>
            </span>
          ))}
        </div>

        <div className="ch-log" aria-hidden><b>1.</b> e4 e5</div>
      </div>
    </div>
  );
}
