// ThankYouAd.jsx — the room fills with lights, one per person, then the
// thank-you lands on top of them.
//
// Warm dusk: aubergine and wine, ember light, cream type. Deliberately not the
// navy-and-cyan stage and not the white Google sheet — this one is the warm
// post on the grid, and it has to feel like a room at golden hour rather than
// a product drop.
//
// The hook is the field: 54 soft lights on a phyllotaxis spiral, igniting in a
// fast wave. One light per person is the whole idea of the copy, so the type
// doesn't have to explain it — the lights are already saying it before a word
// is readable, which is what buys the thumb-stop in the first second.
//
// Beat sheet (plays once, then holds the final frame):
//   p1  the lights come on across the field in a ~760ms wave
//   p2  the field gathers inward and drops to embers; the five lines mask up
//       from behind their own baselines, one after another
//   p3  the gold sweeps across APPRECIATE, the closing line fades in and a
//       hairline draws out under it
//   p4  the Woodbridge lockup settles at the bottom
//
// JS advances the phase; every bit of motion is CSS keyed off .ty-p0..p4.
import React from "react";
import "../Stylesheets/ThankYouAd.css";

import logo from "../Images/cn-woodbridge-logo.png";

// stacked short lines rather than long ones: at phone width this reads twice
// as loud, and each line gets its own reveal instead of sharing one
const LINES = ["WE TRULY", "APPRECIATE", "EVERY SINGLE", "PERSON WHO", "SUPPORTS US"];
const HERO = 1; // APPRECIATE — the one word struck in gold

const CLOSER = "these things don’t go unnoticed.";

// one light per supporter. Phyllotaxis — the golden angle with a sqrt radius —
// fills the area evenly and never clumps or ranks up, so it reads as a crowd
// instead of a grid. Fixed maths, so every replay is identical.
const WARM = ["#ffd9a0", "#ff9a6b", "#ffb347", "#ff6f8a"];
const COUNT = 54;
const DOTS = Array.from({ length: COUNT }, (_, i) => {
  const a = i * 137.508 * (Math.PI / 180);
  const r = Math.sqrt((i + 0.5) / COUNT);
  return {
    x: 50 + Math.cos(a) * r * 48,
    y: 50 + Math.sin(a) * r * 46,
    s: 3 + ((i * 7) % 5), // px
    d: (i * 14) % 760, // ms — the wave, not a straight sweep
    c: WARM[i % 4],
  };
});

const ENTER = 180; // the sheet is empty until here
const FIELD = 1180; // the lights coming on
const HEAD = 1520; // the five lines
const CLOSE = 980; // the closing line and its rule

const CUES = [ENTER, ENTER + FIELD, ENTER + FIELD + HEAD, ENTER + FIELD + HEAD + CLOSE];

export default function ThankYouAd() {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    // reduced motion: no wave, no reveal — hand over the finished card
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase(4);
      return undefined;
    }
    const timers = CUES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`ty-stage ty-p${phase}`}>
      <div className="ty-dusk" aria-hidden />
      <div className="ty-ember" aria-hidden />

      <div className="ty-field" aria-hidden>
        {DOTS.map((d, i) => (
          <i
            key={i}
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              "--dot": `${d.s}px`,
              "--d": `${d.d}ms`,
              "--c": d.c,
            }}
          />
        ))}
      </div>

      <div className="ty-vignette" aria-hidden />

      <div className="ty-card">
        <h1 className="ty-head">
          {LINES.map((t, i) => (
            <span className="ty-line" style={{ "--i": i }} key={t}>
              <i className={i === HERO ? "ty-word ty-word--hero" : "ty-word"}>{t}</i>
            </span>
          ))}
        </h1>

        <p className="ty-closer">{CLOSER}</p>
        <div className="ty-rule" aria-hidden />

        <div className="ty-lockup">
          <img className="ty-logo" src={logo} alt="Code Ninjas" />
          <div className="ty-city">WOODBRIDGE</div>
        </div>
      </div>
    </div>
  );
}
