// GoogleReviewsAd.jsx — the gold star turns over, then the review count climbs.
//
// Google-clean daylight: white sheet, four-colour ambient light, Google grey
// type. Deliberately not the dark-navy stage and not the newsprint — this one
// has to read as a Google review card the moment it lands on the feed.
//
// Beat sheet (plays once, then holds the final frame):
//   p1  the star drops in from far and settles dead-on — no turn, the turn is
//       the counter's move and waits for it
//   p2  the counter climbs 0 -> 60 on an ease-out, so it blasts through the
//       forties and then crawls 57 . 58 . 59 . ; the star starts turning on
//       that same ease-out for three full rotations, so its angle tracks the
//       number and it coasts onto square exactly as the 60 lands. Both faces
//       are the same star, so it reads as one solid object turning. It kicks
//       on every tick.
//   p3  60 lands: flash, four-colour confetti, the five stars pop in one by
//       one and the line reads
//   p4  the Woodbridge lockup settles under it
//
// JS advances the phase and drives the count; every bit of motion is CSS keyed
// off .gr-p0..p4.
import React from "react";
import "../Stylesheets/GoogleReviewsAd.css";

import star from "../Images/gold-star-3d.png";
import logo from "../Images/cn-woodbridge-logo.png";

const TARGET = 60;
const ENTER_MS = 1500; // the drop-in; the star holds still through it
const COUNT_MS = 2900; // 0 -> 60

// phase cue sheet (ms from mount); index 1..4, index 0 is the empty sheet
const CUES = [200, 200 + ENTER_MS, 200 + ENTER_MS + COUNT_MS, 200 + ENTER_MS + COUNT_MS + 850];

// confetti thrown on the 60 — Google's four, fixed so every replay matches
const G4 = ["#4285f4", "#ea4335", "#fbbc05", "#34a853"];
const CONFETTI = Array.from({ length: 18 }, (_, i) => ({
  a: (i * 137.5) % 360, // golden-angle spray, never clumps
  d: 30 + ((i * 37) % 24), // vh travelled
  s: 5 + ((i * 13) % 6), // px
  r: ((i * 91) % 360) - 180, // spin
  t: (i % 5) * 26, // ms stagger
  c: G4[i % 4],
}));

// the four-colour wordmark — the chip is gone, this now carries the brand
// down in the label line
function GoogleWordmark() {
  return (
    <span className="gr-g">
      <b style={{ color: "#4285f4" }}>G</b>
      <b style={{ color: "#ea4335" }}>o</b>
      <b style={{ color: "#fbbc05" }}>o</b>
      <b style={{ color: "#4285f4" }}>g</b>
      <b style={{ color: "#34a853" }}>l</b>
      <b style={{ color: "#ea4335" }}>e</b>
    </span>
  );
}

export default function GoogleReviewsAd() {
  const [phase, setPhase] = React.useState(0);
  const [num, setNum] = React.useState(0);
  const [still, setStill] = React.useState(false);

  React.useEffect(() => {
    // reduced motion: skip the drop, the turn and the climb — finished card
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setStill(true);
      setPhase(4);
      setNum(TARGET);
      return undefined;
    }
    const timers = CUES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  // the climb — cubic ease-out, so the last five numbers eat 45% of the run
  const counting = phase >= 2 && !still;
  React.useEffect(() => {
    if (!counting) return undefined;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min((now - t0) / COUNT_MS, 1);
      const p = 1 - Math.pow(1 - t, 3);
      setNum(Math.min(TARGET, Math.floor(p * TARGET)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setNum(TARGET);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [counting]);

  // restart the per-tick pop without remounting the node: alternate two
  // identical keyframe names on the parity of the number
  const beat = num % 2 ? "grBeatA" : "grBeatB";

  return (
    <div className={`gr-stage gr-p${phase}`}>
      <div className="gr-aurora" aria-hidden />
      <div className="gr-vignette" aria-hidden />

      <div className="gr-card">
        <div className="gr-scene">
          <div className="gr-burst" aria-hidden />
          <div className="gr-confetti" aria-hidden>
            {CONFETTI.map((c, i) => (
              <i
                key={i}
                style={{
                  "--a": `${c.a}deg`,
                  "--d": `${c.d}vh`,
                  "--s-px": `${c.s}px`,
                  "--r": `${c.r}deg`,
                  "--t": `${c.t}ms`,
                  background: c.c,
                }}
              />
            ))}
          </div>

          <div className="gr-pulse" style={{ animationName: phase === 2 ? beat : undefined }}>
            <div className="gr-star3d">
              <div className="gr-face gr-face--front">
                <img src={star} alt="" />
              </div>
              <div className="gr-face gr-face--back">
                <img src={star} alt="" />
              </div>
            </div>
          </div>
          <div className="gr-shadow" aria-hidden />
        </div>

        <div className="gr-count">
          <span className="gr-num" style={{ animationName: phase === 2 ? beat : undefined }}>
            {num}
          </span>
        </div>

        <div className="gr-row" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <img key={i} className="gr-mini" style={{ "--i": i }} src={star} alt="" />
          ))}
        </div>

        <div className="gr-label">
          5-STAR <GoogleWordmark /> REVIEWS
        </div>

        <div className="gr-lockup">
          <img className="gr-logo" src={logo} alt="Code Ninjas" />
          <div className="gr-city">WOODBRIDGE</div>
        </div>
      </div>
    </div>
  );
}
