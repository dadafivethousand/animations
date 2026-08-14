// StaplesPromoAd.jsx — the Staples partnership, typed onto a voucher.
//
// Two offers pointing opposite ways: a Staples customer gets $50 off joining
// Code Ninjas, a Code Ninjas family gets $20 off shopping at Staples. Each
// block leads with who it is for, because a reader sorts themselves in about a
// second if you let them and never if you don't.
//
// ── The voucher ──
//
// The earlier pass set this as loose type on a flat white screen. Everything
// about it was right except that it had nothing to sit on: type alone in the
// middle of a white frame reads as a document someone forgot to design, and on
// a feed it reads as nothing at all. Now the notice is printed on a voucher —
// white stock on a lit desk, a perforated tear between the two offers, a stub
// at the foot. The object is what makes it legible at thumbnail size, before a
// single word is read, and a voucher is also just what this is.
//
// Staples sells paper, so paper is the right material for the partnership to
// live on. That is the whole colour story: warm neutral desk, white stock,
// black ink, one red. No second accent — both brands are red, so a red voucher
// needs no help.
//
// ── Typed, not laid out ──
//
// Every line of the notice is struck on screen, left-aligned inside a centred
// block: centred monospace is a poster, left-aligned monospace is a document,
// and a document is what a voucher is. Line breaks are authored, not wrapped —
// every string below is one line as it will appear, measured to fit the
// column, which is the other half of setting a typed page and the reason
// nothing here ends in a widow.
//
// Speed carries the emphasis. The detail lines are brisk and the two amounts
// are struck slowly enough to be read as they arrive. Same idea as varying
// weight, except this ad has one typeface to vary.
//
// What is NOT typed: the letterhead, the rules and the stub. The rules were a
// run of "=" before — correct to the conceit, and the ugliest thing on the
// page: two red dashed bars per offer, four in a frame, shouting over the
// amounts they were supposed to introduce. A hairline that draws itself left
// to right when its block starts is the same gesture without the noise.
//
// JS owns the typewriter and nothing else. It has to: a caret that follows the
// text needs the text to actually grow, so it cannot be a keyframe. Everything
// else — the voucher landing, the rules drawing, the stub — is CSS keyed off
// two flags.
import React from "react";
import "../Stylesheets/StaplesPromoAd.css";

import cnLogo from "../Images/cn-woodbridge-logo.png";

// ── The Staples mark ─────────────────────────────────────────────────────
// SWAP POINT. Drop the supplied logo into src/Images/ (a transparent PNG or an
// SVG), import it here, and set USE_LOGO to true — the wordmark below is a
// stand-in, correct in colour and weight but not their actual letterforms, and
// it should not ship if the real mark is available.
//
//   import staplesLogo from "../Images/staples-logo.png";
//
const USE_LOGO = false;
const staplesLogo = null;

// One entry per printed line.
//   t  the line, exactly as it appears — breaks are authored, never wrapped
//   k  what kind of line it is, for styling
//   z  which offer block it belongs to
//   s  milliseconds per character
//   a  the pause after the line lands, i.e. the carriage return
//
// PLACEHOLDER COPY. The amounts, the thresholds, the code and both dates are
// the offer itself and are public-facing — confirm them before a take is
// posted (repo rule, and this one carries a partner's name as well as ours).
const LINES = [
  { t: "NEW TO CODE NINJAS", k: "who", z: 0, s: 26, a: 200 },

  { t: "$50 OFF", k: "amt", z: 0, s: 95, a: 260 },
  { t: "a new 3-month membership,", k: "what", z: 0, s: 16, a: 50 },
  { t: "paid in full", k: "what", z: 0, s: 16, a: 200 },

  { t: "Spend $100 or more at Staples", k: "meta", z: 0, s: 11, a: 70 },
  { t: "Through October 31, 2026", k: "meta", z: 0, s: 11, a: 110 },
  { t: "CODE STAPLES2026", k: "code", z: 0, s: 42, a: 620 },

  { t: "ALREADY A CODE NINJAS FAMILY", k: "who", z: 1, s: 26, a: 200 },

  { t: "$20 OFF", k: "amt", z: 1, s: 95, a: 260 },
  { t: "a $75 Staples order,", k: "what", z: 1, s: 16, a: 50 },
  { t: "at any Canadian location", k: "what", z: 1, s: 16, a: 200 },

  { t: "Through September 14, 2026", k: "meta", z: 1, s: 11, a: 0 },
];

// Carry each line's index in the flat script with it, then split by block: the
// typewriter walks one list, the layout draws two columns of it.
const SCRIPT = LINES.map((l, i) => ({ ...l, i }));
const BLOCKS = [0, 1].map((z) => SCRIPT.filter((l) => l.z === z));

// The voucher lands and the letterhead resolves before a key is struck.
const OPEN = 900;

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
        <div className="sp-voucher">
          {/* ---- letterhead ----
              A hairline between two marks is the standard way to say "with",
              and it keeps either brand from looking like it owns the other.
              The marks are the only pictures on the page; everything below
              them is struck. */}
          <div className="sp-head">
            <div className="sp-kicker">PARTNER OFFER</div>
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
          </div>

          {BLOCKS.map((lines, z) => (
            <React.Fragment key={z}>
              {/* The perforation between the two offers. Two coupons on one
                  piece of stock is the reason a reader accepts that the ad is
                  making two different offers to two different people. */}
              {z > 0 && (
                <div className="sp-tear" aria-hidden>
                  <span className="sp-notch sp-notch-l" />
                  <span className="sp-perf" />
                  <span className="sp-notch sp-notch-r" />
                </div>
              )}

              <div
                className={`sp-block${lines[0].i <= li ? " is-open" : ""}`}
              >
                <div className="sp-blockhead">
                  <span className="sp-num">{`0${z + 1}`}</span>
                  <Line line={lines[0]} li={li} ch={ch} />
                </div>
                <span className="sp-hrule" aria-hidden />

                {lines.slice(1).map((line) => (
                  <Line key={line.i} line={line} li={li} ch={ch} />
                ))}
              </div>
            </React.Fragment>
          ))}

          {/* ---- the stub ----
              Who issued it. It arrives once the last key is struck, which is
              also the frame the ad holds on. */}
          <div className="sp-tear sp-tear-foot" aria-hidden>
            <span className="sp-notch sp-notch-l" />
            <span className="sp-perf" />
            <span className="sp-notch sp-notch-r" />
          </div>
          <div className="sp-foot">CODE NINJAS WOODBRIDGE</div>
        </div>
      </div>

      {/* Over everything, so the desk under the voucher can stay a flat colour
          — which is what lets the perforation's notches be punched in that
          same flat colour and land invisibly. */}
      <div className="sp-vignette" aria-hidden />
      <div className="sp-grain" aria-hidden />
    </div>
  );
}

/**
 * One printed line. Every line is present from frame one as a hidden ghost
 * holding its own width and height, with the struck text laid over it —
 * without that the block grows a line at a time and, because it is centred,
 * the whole page creeps upward on every carriage return.
 */
function Line({ line, li, ch }) {
  const started = line.i <= li;
  return (
    <div className={`sp-line sp-${line.k}${started ? " is-typed" : ""}`}>
      <span className="sp-ghost" aria-hidden>
        {line.t}
      </span>
      <span className="sp-live">
        {line.i < li ? line.t : line.i === li ? line.t.slice(0, ch) : ""}
        {line.i === li && <i className="sp-caret" aria-hidden />}
      </span>
    </div>
  );
}
