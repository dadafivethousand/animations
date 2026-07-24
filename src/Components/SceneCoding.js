// SceneCoding.jsx — reel scene 2: "CODING".
// A floating editor shows a syntax-highlighted JS snippet — the lines cascade
// in quickly (no slow typewriter) over a black stage with an emerald glow and
// a faint code-rain backdrop.
import React from "react";
import "../Stylesheets/CodeNinjasReel.css";

// each line is a list of [tokenClass, text]
const CODE = [
  [["kw", "class"], ["sp", " "], ["cls", "Ninja"], ["sp", " "], ["pun", "{"]],
  [["ind", "  "], ["prop", "level"], ["sp", " "], ["op", "="], ["sp", " "], ["num", "1"], ["pun", ";"]],
  [],
  [["ind", "  "], ["fn", "train"], ["pun", "() {"]],
  [["ind", "    "], ["kw", "this"], ["pun", "."], ["prop", "level"], ["op", "++"], ["pun", ";"]],
  [["ind", "    "], ["kw", "return"], ["sp", " "], ["str", "\"leveled up!\""], ["pun", ";"]],
  [["ind", "  "], ["pun", "}"]],
  [["pun", "}"]],
];
const RAIN = Array.from({ length: 11 }, (_, i) => i);

export default function SceneCoding() {
  return (
    <div className="sc sc-code">
      <div className="cd-rain" aria-hidden>
        {RAIN.map((i) => (
          <span key={i} style={{ left: `${(i / (RAIN.length - 1)) * 100}%`, animationDelay: `${(i % 5) * -1.3}s`, animationDuration: `${6 + (i % 4)}s` }}>
            {"01<>{}=;()".repeat(6)}
          </span>
        ))}
      </div>

      <div className="sc-head">
        <span className="sc-num">01</span>
        <span className="sc-title">CODING</span>
        <span className="sc-rule" />
      </div>

      <div className="cd-editor">
        <div className="cd-bar"><i /><i /><i /><span className="cd-file">ninja.js</span></div>
        <div className="cd-body">
          {CODE.map((line, li) => (
            <div className="cd-line" key={li} style={{ animationDelay: `${0.5 + li * 0.07}s` }}>
              <span className="cd-ln">{li + 1}</span>
              <code className="cd-src">
                {line.map(([c, t], ti) => <span className={`t-${c}`} key={ti}>{t}</span>)}
                {li === CODE.length - 1 && <span className="cd-caret" />}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
