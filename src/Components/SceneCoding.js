// SceneCoding.jsx — reel scene 2: "CODING".
// A floating editor types a syntax-highlighted JS snippet character by
// character, with a blinking caret, over a black stage with an emerald glow
// and a faint code-rain backdrop.
import React, { useEffect, useMemo, useRef, useState } from "react";
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

const LINE_LENS = CODE.map((line) => line.reduce((s, [, t]) => s + t.length, 0));
const TOTAL = LINE_LENS.reduce((a, b) => a + b, 0);
const RAIN = Array.from({ length: 11 }, (_, i) => i);

export default function SceneCoding() {
  const [shown, setShown] = useState(0);
  const ref = useRef();

  useEffect(() => {
    let n = 0, id;
    const start = setTimeout(() => {
      id = setInterval(() => { n += 1; setShown(n); if (n >= TOTAL) clearInterval(id); }, 34);
    }, 650);
    return () => { clearTimeout(start); clearInterval(id); };
  }, []);

  // which line the caret is currently on
  const activeLine = useMemo(() => {
    let acc = 0;
    for (let i = 0; i < LINE_LENS.length; i++) {
      acc += LINE_LENS[i];
      if (shown <= acc) return i;
    }
    return LINE_LENS.length - 1;
  }, [shown]);

  let remaining = shown;
  return (
    <div className="sc sc-code" ref={ref}>
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
        <span className="sc-desc">Kids write real code.</span>
      </div>

      <div className="cd-editor">
        <div className="cd-bar"><i /><i /><i /><span className="cd-file">ninja.js</span></div>
        <div className="cd-body">
          {CODE.map((line, li) => {
            const lineChars = line.map(([c, t]) => {
              const take = Math.max(0, Math.min(t.length, remaining));
              remaining -= t.length;
              return [c, t.slice(0, take)];
            });
            return (
              <div className="cd-line" key={li}>
                <span className="cd-ln">{li + 1}</span>
                <code className="cd-src">
                  {lineChars.map(([c, t], ti) => <span className={`t-${c}`} key={ti}>{t}</span>)}
                  {li === activeLine && <span className="cd-caret" />}
                </code>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
