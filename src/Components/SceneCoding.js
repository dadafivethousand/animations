// SceneCoding.jsx — reel scene: "CODING".
// A polished editor window types a syntax-highlighted JS snippet character by
// character (real monospace typewriter — each line reveals in `steps()` with a
// blinking caret that rides the end of the current line), over a black stage
// with an emerald glow and a faint code-rain backdrop. Chrome: traffic lights,
// filename tab, JS badge, and a VS-Code-style status bar.
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

// pre-compute a typewriter timeline: each line types over (chars * PER_CHAR)s,
// starting when the previous line finished + a short pause.
const PER_CHAR = 0.022, GAP = 0.05, START = 0.4;
let t = START;
const TIMED = CODE.map((line) => {
  const chars = line.reduce((s, [, txt]) => s + txt.length, 0);
  const n = Math.max(chars, 1);            // steps() needs >= 1
  const dur = Math.max(chars * PER_CHAR, 0.05);
  const start = t;
  t = start + dur + GAP;
  return { line, n, dur, start };
});

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
      </div>

      <div className="cd-editor">
        <div className="cd-bar">
          <i /><i /><i />
          <span className="cd-file">ninja.js</span>
          <span className="cd-badge">JS</span>
        </div>

        <div className="cd-body">
          {TIMED.map(({ line, n, dur, start }, li) => {
            const last = li === CODE.length - 1;
            return (
              <div className={`cd-line${last ? " cd-last" : ""}`} key={li} style={{ "--start": `${start}s` }}>
                <span className="cd-ln">{li + 1}</span>
                <code className="cd-src" style={{ "--n": n, "--dur": `${dur}s` }}>
                  {line.map(([c, txt], ti) => <span className={`t-${c}`} key={ti}>{txt}</span>)}
                </code>
              </div>
            );
          })}
        </div>

        <div className="cd-status" aria-hidden>
          <span className="cd-st-l"><b className="cd-git">⎇ main</b><span className="cd-ok">✓ 0</span></span>
          <span className="cd-st-r"><span className="cd-dot" />JavaScript<span className="cd-sep">·</span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}
