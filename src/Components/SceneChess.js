// SceneChess.jsx — reel scene: "CHESS".
// Full starting position drops into place, then the Italian Game plays out:
//   1. e4 e5  2. Nf3 Nc6  3. Bc4 Bc5
// Pieces are drawn as SVG (uniform size, real white/black colours — unicode
// chess glyphs render inconsistently across devices).
import React from "react";
import "../Stylesheets/CodeNinjasReel.css";

const BACK = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

// full starting position. row 0 = top (black back rank), row 7 = white back rank.
const PIECES = [];
BACK.forEach((t, c) => PIECES.push({ t, s: "black", c, r: 0 }));
for (let c = 0; c < 8; c++) PIECES.push({ t: "pawn", s: "black", c, r: 1 });
for (let c = 0; c < 8; c++) PIECES.push({ t: "pawn", s: "white", c, r: 6 });
BACK.forEach((t, c) => PIECES.push({ t, s: "white", c, r: 7 }));

// moves keyed by the piece's START square "c,r" -> { c,r: destination, d: delay(s) }
// The line is 1.e4 e5 2.Nf3 Nc6 — the scene ends here, before the bishops move.
const MOVES = {
  "4,6": { c: 4, r: 4, d: 1.0 }, // e2-e4
  "4,1": { c: 4, r: 3, d: 1.6 }, // e7-e5
  "6,7": { c: 5, r: 5, d: 2.2 }, // Ng1-f3
  "1,0": { c: 2, r: 2, d: 2.8 }, // Nb8-c6
};

const pc = (n) => `${((n + 0.5) / 8) * 100}%`;

// --- SVG piece shapes (viewBox 0 0 45 45) ---
const SHAPES = {
  pawn: (
    <>
      <circle cx="22.5" cy="13.5" r="5.4" />
      <path d="M17 19c-1 5-3 9-4.6 12h20.2c-1.6-3-3.6-7-4.6-12z" />
      <rect x="10.5" y="30.5" width="24" height="4" rx="2" />
    </>
  ),
  rook: (
    <>
      <path d="M12 18v-5h4v3h3.6v-3h5.8v3H29v-3h4v5l-2.4 2.5v9l2.9 3v2.5H11.5V32l2.9-3v-9z" />
      <rect x="10" y="34.5" width="25" height="4" rx="2" />
    </>
  ),
  knight: (
    <>
      <path d="M23 8.6c2.5-.5 4.4 1.1 5 3.4c2.5 1.4 3.6 3.8 4 6.4L31 33H15c-.4-4 0-6 1.3-7.6c-2.4.6-4.6 0-5.6-2c-.8-1.7-.5-3.4 1.1-5c2-3.9 4.8-6.5 8.2-7.8z" />
      <circle cx="18.6" cy="15.2" r="1.15" className="ch-eye" />
      <rect x="11.5" y="32" width="22" height="4.6" rx="2" />
    </>
  ),
  bishop: (
    <>
      <circle cx="22.5" cy="8.6" r="2.3" />
      <path d="M22.5 11c-7 4.2-8 14-5 19h10c3-5 2-14.8-5-19z" />
      <rect x="13" y="29.5" width="19" height="3.4" rx="1.6" />
      <rect x="10.5" y="33" width="24" height="4" rx="2" />
    </>
  ),
  queen: (
    <>
      <circle cx="9" cy="12" r="2" /><circle cx="16.3" cy="9.6" r="2" />
      <circle cx="22.5" cy="8.6" r="2.2" /><circle cx="28.7" cy="9.6" r="2" />
      <circle cx="36" cy="12" r="2" />
      <path d="M9 13l4 17h19l4-17-6 7-3.6-10-3.9 10-4-10-3.6 10z" />
      <rect x="11" y="32.5" width="23" height="4" rx="2" />
    </>
  ),
  king: (
    <>
      <rect x="21" y="4" width="3" height="8.5" rx="1.2" />
      <rect x="18.4" y="6.6" width="8.2" height="3" rx="1.2" />
      <path d="M12 18c0-5 5.2-6.8 10.5-2.8C27.8 11.2 33 13 33 18c0 5-4 8.2-5 13H17c-1-4.8-5-8-5-13z" />
      <rect x="10.5" y="30.5" width="24" height="4" rx="2" />
    </>
  ),
};

const Piece = ({ type }) => (
  <svg className="ch-svg" viewBox="0 0 45 45" aria-hidden>{SHAPES[type]}</svg>
);

export default function SceneChess() {
  return (
    <div className="sc sc-chess">
      <div className="ch-spot" aria-hidden />

      <div className="sc-head">
        <span className="sc-num">02</span>
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

          {PIECES.map((p, i) => {
            const mv = MOVES[`${p.c},${p.r}`];
            const style = { left: pc(p.c), top: pc(p.r) };
            let cls = `ch-piece side-${p.s}`;
            if (mv) {
              Object.assign(style, { "--fx": pc(p.c), "--fy": pc(p.r), "--tx": pc(mv.c), "--ty": pc(mv.r), "--d": `${mv.d}s` });
              cls += p.t === "knight" ? " ch-mover ch-knight" : " ch-mover";
            }
            return (
              <span key={i} className={cls} style={style}>
                <span className="ch-lift">
                  <span className="ch-pi" style={{ animationDelay: `${(0.3 + p.r * 0.05 + p.c * 0.012).toFixed(3)}s` }}>
                    <Piece type={p.t} />
                  </span>
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
