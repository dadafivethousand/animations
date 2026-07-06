// NinjaParty.jsx — all four ninja mascots throwing down on a nightclub dance
// floor: rotating disco ball with light beams, sweeping colored spotlights,
// a 3D perspective light-up floor, confetti, a bass-reactive equalizer, and a
// global beat pulse. Each ninja has its own choreographed dance loop.
import React, { useMemo } from "react";
import "../Stylesheets/NinjaParty.css";

import leap from "../Images/ninja-leap.png";
import thumbs from "../Images/ninja-thumbs.png";
import cheer from "../Images/ninja-cheer.png";
import kick from "../Images/ninja-kick.png";

const DANCERS = [
  { src: thumbs, dance: "groove", left: "15%",  beat: "0s",    scale: 0.9 },
  { src: cheer,  dance: "jump",   left: "38%",  beat: "-0.25s", scale: 1.0 },
  { src: kick,   dance: "kick",   left: "61%",  beat: "-0.5s",  scale: 0.95 },
  { src: leap,   dance: "spin",   left: "83%",  beat: "-0.15s", scale: 0.9 },
];

export default function NinjaParty() {
  // deterministic "random" scatter for confetti + floor tiles (no Math.random)
  const confetti = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => {
        const hue = (i * 47) % 360;
        return {
          left: `${(i * 79) % 100}%`,
          delay: `${((i * 137) % 100) / 100 * -6}s`,
          dur: `${4 + ((i * 53) % 40) / 10}s`,
          size: 6 + ((i * 31) % 8),
          hue,
          drift: `${((i % 2 ? 1 : -1) * (20 + (i * 13) % 60))}px`,
          round: i % 3 === 0,
        };
      }),
    []
  );

  const tiles = useMemo(() => Array.from({ length: 8 * 6 }, (_, i) => i), []);

  return (
    <div className="np-stage">
      {/* ===== ambient room glows ===== */}
      <div className="np-ambient" aria-hidden />

      {/* ===== sweeping spotlights ===== */}
      <div className="np-lights" aria-hidden>
        <span className="np-beam np-beam--1" />
        <span className="np-beam np-beam--2" />
        <span className="np-beam np-beam--3" />
        <span className="np-beam np-beam--4" />
      </div>

      {/* ===== disco ball + rays ===== */}
      <div className="np-disco" aria-hidden>
        <div className="np-disco-rays" />
        <div className="np-disco-ball">
          {Array.from({ length: 40 }, (_, i) => (
            <span key={i} className="np-facet" style={{ "--i": i }} />
          ))}
          <div className="np-disco-shine" />
        </div>
        <div className="np-disco-string" />
      </div>

      {/* ===== confetti ===== */}
      <div className="np-confetti" aria-hidden>
        {confetti.map((c, i) => (
          <span
            key={i}
            className={`np-confetti-piece${c.round ? " np-round" : ""}`}
            style={{
              left: c.left,
              width: `${c.size}px`,
              height: `${c.size}px`,
              background: `hsl(${c.hue} 90% 60%)`,
              animationDelay: c.delay,
              animationDuration: c.dur,
              "--drift": c.drift,
            }}
          />
        ))}
      </div>

      {/* ===== title ===== */}
      <h1 className="np-title" data-text="CODE NINJAS PARTY">
        CODE NINJAS PARTY
      </h1>

      {/* ===== 3D dance floor ===== */}
      <div className="np-floor-wrap" aria-hidden>
        <div className="np-floor">
          {tiles.map((i) => (
            <span key={i} className="np-tile" style={{ "--i": i }} />
          ))}
        </div>
      </div>

      {/* ===== dancers ===== */}
      <div className="np-dancers">
        {DANCERS.map((d, i) => (
          <div
            key={i}
            className={`np-dancer np-${d.dance}`}
            style={{ left: d.left, "--beat": d.beat, "--scale": d.scale }}
          >
            <img className="np-ninja" src={d.src} alt="" />
            <span className="np-dancer-shadow" />
          </div>
        ))}
      </div>

      {/* ===== bass-reactive equalizer ===== */}
      <div className="np-eq" aria-hidden>
        {Array.from({ length: 28 }, (_, i) => (
          <span key={i} className="np-eq-bar" style={{ "--i": i }} />
        ))}
      </div>

      {/* ===== strobe flash overlay ===== */}
      <div className="np-strobe" aria-hidden />
    </div>
  );
}
