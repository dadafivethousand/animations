// StaplesPromoAd.jsx — the Staples partnership, typed out.
//
// Two offers pointing opposite ways: a Staples customer gets $50 off joining
// Code Ninjas, a Code Ninjas family gets $20 off shopping at Staples. Each
// block leads with who it is for, because a reader sorts themselves in about a
// second if you let them and never if you don't.
//
// ── Typed, not laid out ──
//
// The whole notice is monospace and every line of it is typed on screen, rules
// included — a rule is a run of "=" here, which is how you drew one on a
// typewriter and the only version of a rule that can be typed rather than
// drawn. That is also why the copy is left-aligned inside a centred block:
// centred monospace is a poster, left-aligned monospace is a document, and a
// document is what this is.
//
// Line breaks are authored, not wrapped. Every string below is one line as it
// will appear, measured to fit the column — which is the other half of setting
// a typed page, and the reason nothing here ends in a widow.
//
// Speed carries the emphasis. The rules rattle out, the detail lines are brisk,
// and the two amounts are typed slowly enough to be read as they arrive. Same
// idea as varying weight, except this ad only has one weight to vary.
//
// JS owns the typewriter and nothing else. It has to: a caret that follows the
// text needs the text to actually grow, so it cannot be a keyframe. Everything
// else — the marks resolving, the caret itself — is CSS.
import React from "react";
import "../Stylesheets/StaplesPromoAd.css";

import cnLogo from "../Images/cn-woodbridge-logo.png";

// ── The Staples mark ─────────────────────────────────────────────────────
// SWAP POINT. Drop the supplied logo into src/Images/ (a transparent PNG or an
// SVG), import it here, and set USE_LOGO to true — the wordmark below is a
// stand-in set in type, correct in colour and tracking but not their actual
// letterforms, and it should not ship if the real mark is available.
//
//   import staplesLogo from "../Images/staples-logo.png";
//
const USE_LOGO = false;
const staplesLogo = null;

// 32 characters, which is the longest line in the script — a typed rule runs
// the measure of the block it heads, never past it.
const RULE = "=".repeat(32);

// One entry per printed line.
//   t  the line, exactly as it appears — breaks are authored, never wrapped
//   c  what kind of line it is, for styling
//   s  milliseconds per character
//   a  the pause after the line lands, i.e. the carriage return
const LINES = [
  { t: RULE, c: "rule", s: 7, a: 90 },
  { t: "01  NEW TO CODE NINJAS", c: "who", s: 34, a: 110 },
  { t: RULE, c: "rule", s: 7, a: 260 },

  { t: "$50 OFF", c: "amt", s: 115, a: 300 },
  { t: "a new 3-month membership,", c: "what", s: 19, a: 60 },
  { t: "paid in full", c: "what", s: 19, a: 240 },

  { t: "· Spend $100 or more at Staples", c: "meta", s: 13, a: 90 },
  { t: "· Code STAPLES2026", c: "meta", s: 13, a: 90 },
  { t: "· Through October 31, 2026", c: "meta", s: 13, a: 620 },

  { t: RULE, c: "rule rule--gap", s: 7, a: 90 },
  { t: "02  ALREADY A CODE NINJAS FAMILY", c: "who", s: 34, a: 110 },
  { t: RULE, c: "rule", s: 7, a: 260 },

  { t: "$20 OFF", c: "amt", s: 115, a: 300 },
  { t: "a $75 Staples order,", c: "what", s: 19, a: 60 },
  { t: "at any Canadian location", c: "what", s: 19, a: 240 },

  { t: "· Through September 14, 2026", c: "meta", s: 13, a: 0 },
];

// The marks resolve before a key is struck.
const OPEN = 620;

export default function StaplesPromoAd() {
  const reduce = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // -1 is the beat before the first key; LINES.length is the finished page.
  const [li, setLi] = React.useState(-1);
  const [ch, setCh] = React.useState(0);

  React.useEffect(() => {
    if (reduce) {
      setLi(LINES.length);
      return undefined;
    }
    const t = setTimeout(() => setLi(0), OPEN);
    return () => clearTimeout(t);
  }, [reduce]);

  React.useEffect(() => {
    if (reduce || li < 0 || li >= LINES.length) return undefined;
    const line = LINES[li];

    // Mid-line: strike the next character.
    if (ch < line.t.length) {
      const t = setTimeout(() => setCh((c) => c + 1), line.s);
      return () => clearTimeout(t);
    }

    // End of line: hold, then return.
    const t = setTimeout(() => {
      setLi((l) => l + 1);
      setCh(0);
    }, line.a);
    return () => clearTimeout(t);
  }, [li, ch, reduce]);

  const done = li >= LINES.length;

  return (
    <div className={`sp-stage${done ? " sp-done" : ""}`}>
      <div className="sp-card">
        {/* A hairline between two marks is the standard way to say "with", and
            it keeps either brand from looking like it owns the other. The two
            logos are the only thing on the page that is not typed, because
            they are pictures — everything else is struck. */}
        <div className="sp-lockup">
          <div className="sp-partner">
            {USE_LOGO ? (
              <img className="sp-partner-img" src={staplesLogo} alt="Staples" />
            ) : (
              <span className="sp-partner-type">STAPLES</span>
            )}
          </div>

          <span className="sp-hair" aria-hidden />

          <div className="sp-cn">
            <img src={cnLogo} alt="Code Ninjas" />
          </div>
        </div>

        {/* Every line is present from frame one as a hidden ghost holding its
            own width and height, with the struck text laid over it. Without
            that the block grows a line at a time and, because it is centred,
            the whole page creeps upward on every carriage return. */}
        <div className="sp-page">
          {LINES.map((line, i) => (
            <div className={`sp-line sp-${line.c}`} key={`${line.c}-${i}`}>
              <span className="sp-ghost" aria-hidden>
                {line.t}
              </span>
              <span className="sp-live">
                {i < li ? line.t : i === li ? line.t.slice(0, ch) : ""}
                {i === li && <i className="sp-caret" aria-hidden />}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
