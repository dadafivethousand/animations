// GameByKidAd.jsx — a game plays, then you find out who made it.
//
// Six seconds of an actual side-scrolling platformer running full frame — sky,
// parallax hills, a ninja running and jumping, coins popping, a score climbing
// — and then the level clears and the credit lands: MADE BY SOFIA, AGE 9.
//
// ── Why this one is worth the build ──
//
// Every other ad in this repo tells a parent what the centre does. This one
// shows the thing itself, and it is the only ad here a competitor cannot run
// by swapping their logo into it. The proof is the pixels.
//
// The level is called SOFIA'S QUEST from the first frame, so the credit at the
// end confirms something the viewer half-noticed rather than announcing
// something new. That is the difference between a twist and a reveal.
//
// ── Everything is on one 2.4s clock ──
//
// THE SINGLE MOST IMPORTANT THING IN THIS FILE. The ground, the coins, the
// ninja's jump and the dust all loop on --beat, and every sync in the ad falls
// out of that instead of being hand-timed. A coin enters at 110% and exits at
// -10%, so it passes the ninja — who is parked at 30% — at exactly 66.7% of
// the loop, which is where its collect pop is keyframed and where the jump
// arc puts him at apex. Change --beat and it all still lines up. Change one
// layer's duration on its own and the ninja starts jumping at nothing.
//
// There is no collision detection and there does not need to be: two things on
// the same clock always meet in the same place.
//
// ── The sprite swap ──
//
// CSS cannot change an <img> src, so both poses are stacked and their opacity
// is cross-cut on the same clock — run on the ground, jump in the air. Done
// with steps() rather than a fade, because a ninja dissolving between two
// poses looks like a ghost, and a game cuts.
import React from "react";
import "../Stylesheets/GameByKidAd.css";

import cnLogo from "../Images/cn-woodbridge-logo.png";
import ninjaRun from "../Images/b2s-ninja-run.png";
import ninjaJump from "../Images/b2s-ninja-jump.png";
import ninjaCheer from "../Images/b2s-ninja-thumbs.png";

// PLACEHOLDER: the kid's name and age are the whole payoff of this ad, so they
// have to be a real student's — with a parent's permission — before it posts.
const KID = { name: "SOFIA", age: 9 };

const TIMELINE = [
  { k: "play",   ms: 6000 },   // the game, just running
  { k: "clear",  ms: 1500 },   // LEVEL COMPLETE, the ninja cheers
  { k: "credit", ms: 2300 },   // who made it
  { k: "end",    ms: 0 },      // holds
];

// Coins, spread across the shared beat by their delay. Two per loop lands one
// at head height and one up at the jump's apex, which is what makes the ninja
// look like he is jumping FOR something rather than on a timer.
//   d   fraction of the beat to offset by
//   y   height above the ground, in vh
const COINS = [
  { d: 0.00, y: 9 },
  { d: 0.28, y: 24 },
  { d: 0.52, y: 10 },
  { d: 0.74, y: 26 },
  { d: 1.18, y: 12 },
  { d: 1.46, y: 23 },
];

// Clouds and hills, deterministic so every take of the recording is identical.
const CLOUDS = [
  { x: 8,  y: 12, s: 1.0,  d: 46 },
  { x: 38, y: 22, s: 0.72, d: 61 },
  { x: 63, y: 8,  s: 1.18, d: 39 },
  { x: 86, y: 19, s: 0.86, d: 54 },
];

export default function GameByKidAd() {
  const reduce = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const [step, setStep] = React.useState(0);
  const [score, setScore] = React.useState(0);

  React.useEffect(() => {
    if (reduce) {
      setStep(TIMELINE.length - 1);
      setScore(1200);
      return undefined;
    }
    if (step >= TIMELINE.length - 1) return undefined;   // the endcard holds
    const t = setTimeout(() => setStep((n) => n + 1), TIMELINE[step].ms);
    return () => clearTimeout(t);
  }, [step, reduce]);

  const kind = TIMELINE[step].k;

  // The score ticks while the level runs and freezes when it clears, which is
  // what a game does — and a number still climbing under LEVEL COMPLETE would
  // say nobody was driving it.
  React.useEffect(() => {
    if (reduce || kind !== "play") return undefined;
    const t = setTimeout(() => setScore((s) => s + 50), 260);
    return () => clearTimeout(t);
  }, [kind, score, reduce]);

  return (
    <div className={`pg-stage pg-k-${kind}`}>
      {/* ---- the world ----
          Back to front: sky, sun, clouds, far hills, near hills, ground.
          Each layer scrolls slower than the one in front of it, which is the
          whole of the parallax and the reason this reads as depth rather than
          as a pattern sliding sideways. */}
      <div className="pg-sky" aria-hidden />
      <div className="pg-sun" aria-hidden />

      <div className="pg-clouds" aria-hidden>
        {CLOUDS.map((c, i) => (
          <span
            key={i}
            className="pg-cloud"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              "--sc": c.s,
              "--dur": `${c.d}s`,
            }}
          >
            <i /><i /><i />
          </span>
        ))}
      </div>

      {/* Hills are one wide strip rendered TWICE and translated exactly -50%,
          so the second copy arrives where the first was and the loop has no
          seam. Same trick on every scrolling layer below. */}
      <div className="pg-hills pg-hills-far" aria-hidden>
        <span /><span />
      </div>
      <div className="pg-hills pg-hills-near" aria-hidden>
        <span /><span />
      </div>

      {/* ---- the coins ----
          Each rides the shared beat and pops at 66.7% of it, which is the
          moment it passes the ninja. See the header: no collision test,
          because two things on one clock always meet in the same place. */}
      <div className="pg-coins" aria-hidden>
        {COINS.map((c, i) => (
          <span
            key={i}
            className="pg-coin"
            style={{
              bottom: `calc(var(--ground) + ${c.y}vh)`,
              "--d": `${-c.d}`,
            }}
          >
            <i className="pg-coin-face" />
            <b className="pg-pop">+50</b>
          </span>
        ))}
      </div>

      {/* ---- the ninja ----
          Parked at 30% of the width; the world moves past him, as it does in
          every side-scroller ever shipped. Both poses are stacked and cut
          between on the same clock. */}
      <div className="pg-hero" aria-hidden>
        <span className="pg-dust"><i /><i /><i /></span>
        <img className="pg-sprite pg-sprite-run" src={ninjaRun} alt="" />
        <img className="pg-sprite pg-sprite-jump" src={ninjaJump} alt="" />
        <img className="pg-sprite pg-sprite-cheer" src={ninjaCheer} alt="" />
      </div>

      <div className="pg-ground" aria-hidden>
        <span /><span />
      </div>

      {/* ---- the HUD ----
          The level is named for the kid from frame one, so the credit at the
          end confirms something already half-noticed instead of announcing
          something new. */}
      <div className="pg-hud">
        <div className="pg-hud-l">
          <span className="pg-lvl">{KID.name}&rsquo;S QUEST</span>
          <span className="pg-world">LEVEL 1&ndash;3</span>
        </div>
        <div className="pg-hud-r">
          <span className="pg-coin-icon" aria-hidden />
          <span className="pg-score">{String(score).padStart(4, "0")}</span>
        </div>
      </div>

      {/* ---- level complete ---- */}
      <div className="pg-clear">
        <span className="pg-clear-k">LEVEL</span>
        <span className="pg-clear-n">COMPLETE</span>
        <span className="pg-stars" aria-hidden>
          <i /><i /><i />
        </span>
      </div>

      {/* ---- the credit ----
          The whole ad. Set like a game's own credit roll rather than like a
          caption, because it is being claimed BY the game, not about it. */}
      <div className="pg-credit">
        <span className="pg-credit-k">A GAME BY</span>
        <span className="pg-credit-n">{KID.name}</span>
        <span className="pg-credit-a">AGE {KID.age}</span>
      </div>

      {/* ---- the endcard ---- */}
      <div className="pg-end">
        <img className="pg-logo" src={cnLogo} alt="Code Ninjas" />
        <div className="pg-loc">WOODBRIDGE</div>
        <span className="pg-rule" aria-hidden />
        <div className="pg-sub">
          <span>Kids 5&ndash;14 build real games</span>
          <span>Yours could start this week</span>
        </div>
        <div className="pg-cta">cnwoodbridge.com</div>
      </div>

      <div className="pg-vignette" aria-hidden />
    </div>
  );
}
