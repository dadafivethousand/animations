// SummerCampWoodbridgeAd.jsx — Code Ninjas Woodbridge summer camp.
//
// Bright summer daylight: a warm cream-to-gold ground, white cards, deep ink
// type and one hot orange. Light rather than dark on purpose — it means the
// brand mark runs in its real colours, blue CODE and black NINJAS, instead of
// being foiled to silver the way every dark ad in this repo has to.
//
// No concept, no framing device. Every element arrives on its own beat:
//
//   p1  the lockup wipes in
//   p2  SUMMER CAMP lands letter by letter, 2026 drops under it
//   p3  the three cards slide in from alternating sides
//   p4  the contact card springs up
//   p5  REGISTER NOW pops, with the urgency line under it
//
// Everything is in the layout from frame one at its final position and only
// animates its own appearance, so nothing reflows as the poster builds, and
// the whole composition stays centred inside the crop guard.
//
// JS advances the phase and nothing else; all motion is CSS keyed off
// .scw-p0..p5.
import React from "react";
import "../Stylesheets/SummerCampWoodbridgeAd.css";

import logo from "../Images/cn-woodbridge-logo.png";

const TITLE = "SUMMER CAMP";
const YEAR = "2026";

const CARDS = [
  { icon: "🎮", text: "Build real video games", side: "l" },
  { icon: "💻", text: "Level up coding skills", side: "r" },
  { icon: "🥷", text: "Epic ninja challenges", side: "l" },
];

const ROWS = [
  { icon: "📍", text: "6175 Highway 7" },
  { icon: "📞", text: "647-887-9940" },
  { icon: "🌐", text: "cnwoodbridge.com", strong: true },
];

const CUES = [300, 2000, 4300, 7000, 9200];

// one span per letter so the title can land a letter at a time; spaces get
// their own fixed-width span so the stagger index stays honest across the gap
function Letters({ text }) {
  let i = 0;
  return text.split("").map((ch, k) =>
    ch === " " ? (
      <span className="scw-sp" key={k} aria-hidden />
    ) : (
      <span className="scw-ch" style={{ "--i": i++ }} key={k}>
        {ch}
      </span>
    )
  );
}

export default function SummerCampWoodbridgeAd() {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    // reduced motion: no staggers — hand over the finished poster
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase(5);
      return undefined;
    }
    const timers = CUES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`scw-stage scw-p${phase}`}>
      <div className="scw-ground" aria-hidden />
      <div className="scw-bloom" aria-hidden />

      <div className="scw-card">
        <div className="scw-lockup">
          <div className="scw-mark">
            <img src={logo} alt="Code Ninjas" />
          </div>
          <div className="scw-city">WOODBRIDGE</div>
        </div>

        <h1 className="scw-title">
          <span className="scw-t1">
            <Letters text={TITLE} />
          </span>
          <span className="scw-t2">{YEAR}</span>
        </h1>

        <div className="scw-rule" aria-hidden />

        <ul className="scw-cards">
          {CARDS.map((c, i) => (
            <li key={c.text} className={`scw-item scw-item--${c.side}`} style={{ "--i": i }}>
              <span className="scw-item-i" aria-hidden>
                {c.icon}
              </span>
              <span className="scw-item-t">{c.text}</span>
            </li>
          ))}
        </ul>

        <div className="scw-info">
          <div className="scw-info-name">Code Ninjas Woodbridge</div>
          {ROWS.map((r, i) => (
            <div
              key={r.text}
              className={r.strong ? "scw-row scw-row--s" : "scw-row"}
              style={{ "--i": i }}
            >
              <span className="scw-row-i" aria-hidden>
                {r.icon}
              </span>
              <span>{r.text}</span>
            </div>
          ))}
        </div>

        <div className="scw-cta">
          <div className="scw-btn">REGISTER NOW</div>
          <div className="scw-urgent">SPOTS FILLING FAST</div>
        </div>
      </div>
    </div>
  );
}
