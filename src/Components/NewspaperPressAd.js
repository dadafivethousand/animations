// NewspaperPressAd.jsx — "CODE NINJAS / WOODBRIDGE" typed into a newspaper.
//
// Palette is deliberately off the house dark-navy/cyan: warm newsprint grey,
// black ink, and a single muted spot red — the two-colour job an old letterpress
// shop could actually run. Everything that sells "old press" is texture:
// a halftone dot screen, paper fibres, fold creases, and type that sits a hair
// off the baseline because no two slugs strike the same.
//
// Beat sheet (plays once, then holds the final frame):
//   p1  the page furniture inks in — rules, masthead, dateline, greeked columns
//   p2  a type bar swings up under the line and hammers out "CODE NINJAS",
//       one character per strike; the reveal is a stepped clip, so the letters
//       land exactly when the slug hits
//   p3  carriage return — bell, the return sweep, the paper jerks on the feed
//   p4  the same bar types "WOODBRIDGE" on the line below
//   p5  the press comes down: deck, rule, printed mark, red rubber stamp
//
// The typing is pure CSS. Each headline line is exactly as wide as its own
// text, so a clip-path animated 100%->0% in steps(N) uncovers one monospace
// character per step, and the caret/type bar ride the same steps() on `left`.
// That keeps the machine in sync with the ink without measuring anything in JS.
//
// JS only advances the phase; every bit of motion is CSS keyed off .np-p0..p5.
import React from "react";
import "../Stylesheets/NewspaperPressAd.css";

import logo from "../Images/cn-woodbridge-logo.png";

const COPY = {
  line1: "CODE NINJAS",
  line2: "WOODBRIDGE",
  deck1: "LOCAL KIDS BUILD REAL GAMES",
  deck2: "AND LEARN TO CODE DOING IT",
  cta: "BOOK A FREE SESSION",
  url: "cnwoodbridge.com",
  foot: "PRESSED IN WOODBRIDGE, ONTARIO",
};

// phase cue sheet (ms from mount); index 1..5, index 0 is the initial state.
// p2/p4 windows are 11 and 10 strikes at 118ms — see --strike in the CSS.
const CUES = [240, 900, 2300, 2740, 4060];

// greeked body copy: column bars, in units of "how full is this line"
const COLUMNS = [
  [1, 0.94, 1, 0.88, 1, 0.62],
  [0.92, 1, 0.86, 1, 0.97, 0.44],
];

// Deterministic per-character ink jitter — same page every render, but no two
// letters land alike: a touch of rotation, a hair off the baseline, and the odd
// slug that inked heavy or came up starved.
function inked(text, seed) {
  return Array.from(text).map((ch, i) => {
    const h = (i * 2654435761 + text.charCodeAt(i) * 40503 + seed * 7919) >>> 0;
    const a = ((h >> 3) & 1023) / 1023;
    const b = ((h >> 13) & 1023) / 1023;
    const c = ((h >> 23) & 511) / 511;
    const weight = c > 0.86 ? " np-heavy" : c < 0.12 ? " np-starved" : "";
    return (
      <b
        key={i}
        className={`np-ch${weight}`}
        style={{
          "--rot": `${((a - 0.5) * 2.6).toFixed(2)}deg`,
          "--dy": `${((b - 0.5) * 1.8).toFixed(2)}px`,
        }}
      >
        {ch === " " ? " " : ch}
      </b>
    );
  });
}

export default function NewspaperPressAd() {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    // reduced motion: skip the machine entirely, print the finished page
    const still =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      setPhase(5);
      return undefined;
    }
    const timers = CUES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`np-stage np-p${phase}`}>
      {/* the sheet: colour, then everything that makes it read as newsprint */}
      <div className="np-paper">
        <div className="np-halftone" aria-hidden />
        <div className="np-fibres" aria-hidden />
        <div className="np-creases" aria-hidden />
        <div className="np-wear" aria-hidden />

        {/* press registration marks, kept inside the screen-record safe area */}
        <div className="np-regs" aria-hidden>
          <i /><i /><i /><i />
        </div>

        <div className="np-page">
          <header className="np-masthead">
            <div className="np-rule np-rule-heavy" />
            <div className="np-flag">Extra Edition</div>
            <div className="np-rule np-rule-hair" />
            <div className="np-dateline">
              <span>VOL. XII</span>
              <span>SATURDAY</span>
              <span>NO. 07</span>
            </div>
            <div className="np-rule np-rule-double" />
          </header>

          {/* the typed block: both lines start at the same left margin, the way
              a carriage return puts them */}
          <div className="np-headline">
            <div className="np-line np-l1">
              <span className="np-chars">{inked(COPY.line1, 3)}</span>
              <i className="np-caret" aria-hidden />
              <i className="np-hammer" aria-hidden>
                <i className="np-slug" />
                <i className="np-arm" />
              </i>
            </div>

            <div className="np-line np-l2">
              <span className="np-chars">{inked(COPY.line2, 11)}</span>
              <i className="np-caret" aria-hidden />
              <i className="np-hammer" aria-hidden>
                <i className="np-slug" />
                <i className="np-arm" />
              </i>
            </div>

            {/* carriage return: the sweep back to the left margin, and the bell */}
            <i className="np-return" aria-hidden />
            <span className="np-bell" aria-hidden>DING</span>
          </div>

          <div className="np-deck">
            <div className="np-rule np-rule-hair" />
            <p>{COPY.deck1}</p>
            <p>{COPY.deck2}</p>
            <div className="np-rule np-rule-hair" />
          </div>

          <div className="np-columns" aria-hidden>
            {COLUMNS.map((col, ci) => (
              <div className="np-col" key={ci}>
                {col.map((w, li) => (
                  <i
                    key={li}
                    style={{ "--w": `${w * 100}%`, "--i": ci * 6 + li }}
                  />
                ))}
              </div>
            ))}
          </div>

          <footer className="np-plate">
            <img className="np-logo" src={logo} alt="Code Ninjas Woodbridge" />
            <div className="np-stamp">
              <span>{COPY.cta}</span>
            </div>
            <div className="np-url">{COPY.url}</div>
            <div className="np-foot">{COPY.foot}</div>
          </footer>
        </div>
      </div>
    </div>
  );
}
