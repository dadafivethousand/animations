// GameBuildAd.jsx — "KIDS BUILD REAL GAMES" arcade build-out ad unit.
//
// A bright cream/arcade-yellow stage (deliberately NOT the dark cinematic
// palette of the recent ads). A tiny platformer level assembles itself block by
// block inside a cartridge screen, the Code Ninjas mark runs and hops through
// it popping coins, code lines type in underneath, then the logo lockup + CTA
// land. Portrait / mobile only.
//
// JS only advances the phase; every bit of motion is CSS keyed off .gb-p0..p5.
import React from "react";
import "../Stylesheets/GameBuildAd.css";

import logo from "../Images/cn-woodbridge-logo.png";
import ninja from "../Images/cn-ninja-icon.png";

const COPY = {
  kicker: "CODE NINJAS",
  place: "WOODBRIDGE",
  titleA: ["KIDS", "BUILD"],
  titleB: ["REAL", "GAMES"],
  code: [
    "const ninja = new Player();",
    "ninja.jump();  // ↑",
    "if (coin) score += 100;",
  ],
  cta: "BOOK A FREE SESSION",
  url: "cnwoodbridge.com",
};

// phase cue sheet (ms from mount) — index 1..5, index 0 is the initial state
const CUES = [500, 1400, 2600, 4200, 6200];
const LOOP_AT = 15000; // restart so a screen-recording can catch a clean pass

export default function GameBuildAd() {
  const [phase, setPhase] = React.useState(0);
  const [run, setRun] = React.useState(0);

  React.useEffect(() => {
    setPhase(0);
    const timers = CUES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    timers.push(setTimeout(() => setRun((r) => r + 1), LOOP_AT));
    return () => timers.forEach(clearTimeout);
  }, [run]);

  return (
    <div key={run} className={`gb-stage gb-p${phase}`}>
      <div className="gb-grid" aria-hidden />
      <div className="gb-sun" aria-hidden />

      <header className="gb-top">
        <span className="gb-kicker">
          {COPY.kicker} <b>&middot;</b> {COPY.place}
        </span>
        <h1 className="gb-title">
          <span className="gb-tline">
            {COPY.titleA.map((w, i) => (
              <i key={w} className={`gb-w gb-w${i + 1}`}>{w}</i>
            ))}
          </span>
          <span className="gb-tline">
            {COPY.titleB.map((w, i) => (
              <i key={w} className={`gb-w gb-w${i + 3} ${i ? "gb-hot" : ""}`}>{w}</i>
            ))}
          </span>
        </h1>
      </header>

      <div className="gb-screen">
        <div className="gb-clouds" aria-hidden>
          <i className="gb-cloud gb-c1" />
          <i className="gb-cloud gb-c2" />
          <i className="gb-cloud gb-c3" />
        </div>

        <div className="gb-hud" aria-hidden>
          <span>SCORE</span>
          <span className="gb-roll">
            <b>
              <em>000</em>
              <em>100</em>
              <em>200</em>
              <em>300</em>
            </b>
          </span>
        </div>

        <i className="gb-block gb-b1" aria-hidden />
        <i className="gb-block gb-b2" aria-hidden />
        <i className="gb-block gb-b3" aria-hidden />

        <i className="gb-coin gb-k1" aria-hidden />
        <i className="gb-coin gb-k2" aria-hidden />
        <i className="gb-coin gb-k3" aria-hidden />

        <div className="gb-flag" aria-hidden>
          <i />
        </div>

        <div className="gb-ground" aria-hidden>
          <i className="gb-gl" />
          <i className="gb-gr" />
        </div>

        <div className="gb-ninja" aria-hidden>
          <span className="gb-hop">
            <img src={ninja} alt="" />
          </span>
        </div>

        <div className="gb-shine" aria-hidden />
      </div>

      <div className="gb-code">
        {COPY.code.map((l, i) => (
          <p key={l} className={`gb-line gb-l${i + 1}`}>{l}</p>
        ))}
      </div>

      <footer className="gb-foot">
        <img className="gb-logo" src={logo} alt="Code Ninjas" />
        <span className="gb-wb">{COPY.place}</span>
        <span className="gb-cta">{COPY.cta}</span>
        <span className="gb-url">{COPY.url}</span>
      </footer>
    </div>
  );
}
