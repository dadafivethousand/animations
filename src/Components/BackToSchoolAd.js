// BackToSchoolAd.jsx — "BACK TO SCHOOL SPECIALS ARE ON NOW" ad unit.
//
// Deliberately NOT the dark navy/cyan cinematic palette: this one is a sheet of
// ruled notebook paper on a school-bus-yellow desk — cream paper, blue rules, a
// red margin line, marker/highlighter accents and a rubber stamp.
//
// Intentionally light on copy. It names no offer, no price and no deadline —
// just "the specials are on" — so it stays true whatever the actual promo is
// and doesn't need re-cutting when the offer changes. The details happen in the
// DM/booking, not on the post.
//
// Beat sheet (plays once, then holds the final frame):
//   p1  paper drops in, blue rules draw left->right, red margin draws down
//   p2  a fast ninja "cast flash" punches through 3 poses and lands on the
//       leap, the title slams in letter by letter, paper scraps burst, the
//       highlighter swipes and the marker underline draws
//   p3  the SPECIALS plaque unfurls from its centre
//   p4  the AGES rubber stamp thumps down with a shockwave
//   p5  the CTA panel rises
//
// JS only advances the phase; every bit of motion is CSS keyed off .bs-p0..p5.
import React from "react";
import "../Stylesheets/BackToSchoolAd.css";

import logo from "../Images/cn-woodbridge-logo.png";
import nLeap from "../Images/b2s-ninja-leap.png";
import nBlocks from "../Images/b2s-ninja-blocks.png";
import nHandheld from "../Images/b2s-ninja-handheld.png";
import nThumbs from "../Images/b2s-ninja-thumbs.png";

const COPY = {
  kicker: "CODE NINJAS",
  place: "WOODBRIDGE",
  lead: "BACK TO",
  hero: "SCHOOL",
  ribbon: "SPECIALS",
  ribbonSub: "ARE ON NOW",
  stamp: ["AGES", "5–14"],
  cta: "BOOK A FREE SESSION",
  url: "cnwoodbridge.com",
};

// the poses the cast-flash punches through before it settles on the leap
const CAST = [nBlocks, nHandheld, nThumbs];

const RULES = 20;   // blue ruled lines
const SCRAPS = 26;  // paper-scrap confetti

// phase cue sheet (ms from mount); index 1..5, index 0 is the initial state
const CUES = [240, 1050, 3200, 4300, 5300];

// deterministic per-letter jitter so the sticker slam doesn't look mechanical
const jitter = (i) => `${(((i * 37) % 13) - 6)}deg`;

function Word({ text, offset = 0 }) {
  return (
    <span className="bs-word">
      {[...text].map((ch, i) => (
        <span
          key={`${ch}${i}`}
          className="bs-ch"
          style={{ "--i": offset + i, "--r": jitter(offset + i) }}
        >
          {/* a plain space inside an inline-block collapses — keep it hard */}
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

export default function BackToSchoolAd() {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    const timers = CUES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`bs-stage bs-p${phase}`}>
      {/* ---- the sheet of paper ---- */}
      <div className="bs-paper" aria-hidden>
        <div className="bs-rules">
          {Array.from({ length: RULES }, (_, i) => (
            <i key={i} style={{ "--i": i }} />
          ))}
        </div>
        <div className="bs-margin" />
      </div>

      <div className="bs-halftone" aria-hidden />
      <div className="bs-glow" aria-hidden />

      {/* ---- paper-scrap confetti, flung out of the headline ---- */}
      <div className="bs-scraps" aria-hidden>
        {Array.from({ length: SCRAPS }, (_, i) => (
          <i
            key={i}
            style={{
              "--i": i,
              "--x": `${(((i * 53) % 100) - 50) * 1.6}px`,
              "--y": `${-34 - ((i * 29) % 130)}px`,
              "--r": `${((i * 71) % 360) - 180}deg`,
              "--s": `${0.55 + ((i * 17) % 60) / 100}`,
              "--c": ["#e4002b", "#ffc21a", "#17342d", "#4a90d9", "#ff2a4d"][i % 5],
            }}
          />
        ))}
      </div>

      {/* ---- headline ---- */}
      <header className="bs-head">
        <p className="bs-kicker">
          <span>{COPY.kicker}</span>
          <b>•</b>
          <span>{COPY.place}</span>
        </p>

        <h1 className="bs-title">
          <span className="bs-l1">
            <Word text={COPY.lead} />
          </span>

          <span className="bs-l2">
            <span className="bs-hl" aria-hidden />
            <Word text={COPY.hero} offset={7} />
            <svg className="bs-swoosh" viewBox="0 0 300 26" aria-hidden>
              <path
                d="M7 18 C 58 7, 118 25, 176 13 S 258 6, 293 16"
                fill="none"
                stroke="#e4002b"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <div className="bs-ribbon">
          <span>{COPY.ribbon}</span>
          <em>{COPY.ribbonSub}</em>
        </div>
      </header>

      {/* ---- ninja cast flash, landing on the leap and holding ---- */}
      <div className="bs-cast" aria-hidden>
        <div className="bs-streaks" />
        {CAST.map((src, i) => (
          <img key={i} className="bs-flash" style={{ "--i": i }} src={src} alt="" />
        ))}
        <img className="bs-lead" src={nLeap} alt="" />
      </div>

      {/* ---- rubber stamp ---- */}
      <div className="bs-band">
        <div className="bs-stamp">
          <span className="bs-ring" aria-hidden />
          <b>{COPY.stamp[0]}</b>
          <em>{COPY.stamp[1]}</em>
        </div>
      </div>

      {/* ---- CTA ---- */}
      <footer className="bs-cta">
        <div className="bs-panel">
          <img className="bs-logo" src={logo} alt="Code Ninjas" />
          <span className="bs-place">{COPY.place}</span>
          <span className="bs-btn">
            {COPY.cta}
            <b>›</b>
          </span>
          <span className="bs-url">{COPY.url}</span>
        </div>
      </footer>

      <div className="bs-grain" aria-hidden />
      <div className="bs-vignette" aria-hidden />
    </div>
  );
}
