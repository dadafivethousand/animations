// BackToSchoolAd.jsx — school bus drives at camera, turns, exits, promo lands.
//
// A bright daylight cartoon road (flat sky, green verge, perspective asphalt)
// picked to match the flat vector style of the bus art, and deliberately unlike
// both the notebook-paper and dark-cinematic ads on the feed.
//
// Beat sheet (plays once, then holds the final frame):
//   p1  the road scene fades up, bus sits tiny on the vanishing point
//   p2  the bus bears down on camera — scale follows a 1/distance curve so it
//       reads as closing at constant speed rather than a linear zoom; anime
//       zoom-lines bloom out of the vanishing point and the camera shake ramps
//   p3  the turn: the front view rotates away and blurs out while the profile
//       counter-rotates in behind it, on a shared perspective, so it reads as
//       one body swinging round rather than a cut
//   p4  it accelerates off frame right, trailing speed lines and dust
//   p5  the scene dims and the promo card punches in
//
// Each stage's keyframes open exactly where the previous stage's closed, so
// swapping the phase class hands the bus off mid-flight with no visible seam.
//
// JS only advances the phase; every bit of motion is CSS keyed off .rd-p0..p5.
import React from "react";
import "../Stylesheets/BackToSchoolAd.css";

import logo from "../Images/cn-woodbridge-logo.png";
import busFront from "../Images/bus-front.png";
import busSide from "../Images/bus-side.png";

const COPY = {
  lead: "BACK TO SCHOOL",
  plate: "SPECIALS ON NOW",
  place: "WOODBRIDGE",
  cta: "BOOK A FREE SESSION",
  url: "cnwoodbridge.com",
};

const DASHES = 9;   // centre-line dashes, spaced by a fake perspective curve
const CLOUDS = 3;
const PUFFS = 7;    // dust kicked up as it leaves

// phase cue sheet (ms from mount); index 1..5, index 0 is the initial state
const CUES = [180, 620, 4820, 5920, 7320];

export default function BackToSchoolAd() {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    const timers = CUES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`rd-stage rd-p${phase}`}>
      {/* everything inside the camera shakes; it is oversized so the shake
          never drags an empty edge into frame */}
      <div className="rd-cam">
        <div className="rd-sky" aria-hidden />
        <div className="rd-sun" aria-hidden />

        <div className="rd-clouds" aria-hidden>
          {Array.from({ length: CLOUDS }, (_, i) => (
            <i key={i} style={{ "--i": i }} />
          ))}
        </div>

        <div className="rd-hills" aria-hidden />
        <div className="rd-ground" aria-hidden />
        <div className="rd-verge" aria-hidden />
        <div className="rd-road" aria-hidden />

        {/* centre line: each dash is placed and sized off a t^2.1 curve, which
            is a cheap stand-in for real perspective foreshortening */}
        <div className="rd-dashes" aria-hidden>
          {Array.from({ length: DASHES }, (_, i) => {
            const p = Math.pow((i + 1) / (DASHES + 1), 2.1);
            return (
              <i
                key={i}
                style={{
                  "--t": p,
                  "--w": `${0.7 + p * 9}%`,
                  "--h": `${0.4 + p * 6.5}%`,
                }}
              />
            );
          })}
        </div>

        <div className="rd-beam" aria-hidden />
        <div className="rd-zoom" aria-hidden />

        {/* zero-size anchor: both buses hang their bottom edge off this point,
            so they share a ground contact and a perspective origin */}
        <div className="rd-busbox" aria-hidden>
          <img className="rd-front" src={busFront} alt="" />
          <img className="rd-side" src={busSide} alt="" />
        </div>

        <div className="rd-streaks" aria-hidden />

        <div className="rd-dust" aria-hidden>
          {Array.from({ length: PUFFS }, (_, i) => (
            <i
              key={i}
              style={{
                "--i": i,
                "--x": `${8 + i * 11}%`,
                "--d": `${(i % 3) * 60}ms`,
                "--s": `${0.7 + ((i * 13) % 40) / 50}`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="rd-scrim" aria-hidden />

      {/* ---- promo ---- */}
      <div className="rd-promo">
        <div className="rd-card">
          <img className="rd-logo" src={logo} alt="Code Ninjas" />
          <span className="rd-place">{COPY.place}</span>
          <h1 className="rd-lead">{COPY.lead}</h1>
          <div className="rd-plate">
            <span>{COPY.plate}</span>
          </div>
          <span className="rd-btn">
            {COPY.cta}
            <b>›</b>
          </span>
          <span className="rd-url">{COPY.url}</span>
        </div>
      </div>

      <div className="rd-grain" aria-hidden />
      <div className="rd-vignette" aria-hidden />
    </div>
  );
}
