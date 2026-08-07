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


// ---- road geometry ---------------------------------------------------------
// The bus turns right, so the road has to bend right underneath it or the turn
// reads as driving into the grass. One centre curve drives everything: the
// tarmac, the painted shoulder and the centre dashes are all offsets from it.
// Straight until BEND_AT (the whole approach happens on that stretch), then it
// sweeps right and toward camera, which is the bend the bus takes.
const RW = 390;         // road-region viewBox, matches a 390x844 stage
const RH = 473;
const BEND_AT = 190;    // where the curve starts, in viewBox units
// A big sweep on purpose. With a small one the road still ends at the bottom
// of the frame while its inner edge curls back, which reads as a teardrop
// rather than a bend; carrying it far enough that the road leaves through the
// right of frame turns that same curl into the inside of a corner.
const BEND_TO = 400;    // total lateral sweep

const cx = (y) => {
  const t = Math.max(0, (y - BEND_AT) / (RH - BEND_AT));
  return RW / 2 + BEND_TO * t * t;
};
// half-width, opening linearly toward camera
const hw = (y) => 14 + 296 * (y / RH);

// a filled band around the centre curve, `pad` widening it (0 = tarmac)
function band(pad) {
  const n = 60;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const y = (RH * i) / n;
    pts.push([cx(y) - hw(y) - pad(y), y]);
  }
  for (let i = n; i >= 0; i--) {
    const y = (RH * i) / n;
    pts.push([cx(y) + hw(y) + pad(y), y]);
  }
  return "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L") + " Z";
}

const TARMAC = band(() => 0);
const SHOULDER = band((y) => 2 + 9 * (y / RH));

// centre dashes: bunched toward the horizon, scaled by the local road width
// and rotated onto the tangent so they lie along the bend
const DASHES = Array.from({ length: 12 }, (_, i) => {
  const y = RH * Math.pow((i + 1) / 13, 2);
  const w = Math.max(0.9, hw(y) * 0.05);
  const ln = Math.max(1.5, hw(y) * 0.08);
  const ang = Math.atan2(1, (cx(y + 2) - cx(y - 2)) / 4) - Math.PI / 2;
  const ca = Math.cos(ang), sa = Math.sin(ang), x0 = cx(y);
  return (
    "M" +
    [[-w, -ln], [w, -ln], [w, ln], [-w, ln]]
      .map(([dx, dy]) =>
        `${(x0 + dx * ca - dy * sa).toFixed(1)},${(y + dx * sa + dy * ca).toFixed(1)}`)
      .join(" L") + " Z"
  );
});

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

        <svg
          className="rd-road"
          viewBox={`0 0 ${RW} ${RH}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="rdTar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7b828d" />
              <stop offset="44%" stopColor="#6a7078" />
              <stop offset="100%" stopColor="#575d66" />
            </linearGradient>
          </defs>
          <path className="rd-shoulder" d={SHOULDER} />
          <path className="rd-tar" d={TARMAC} />
          {DASHES.map((d, i) => (
            <path key={i} className="rd-dash" d={d} />
          ))}
        </svg>

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
