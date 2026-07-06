// SuperMarioRun.jsx — the ninja mascot runs & jumps through an endless
// Super Mario Bros. level: parallax sky/hills/bushes, scrolling pipes,
// ? blocks and spinning coins, brick ground, dust puffs and speed streaks.
import React from "react";
import "../Stylesheets/SuperMarioRun.css";
import ninja from "../Images/mario-ninja.png";

// One screen-width "set" of level props; rendered twice for a seamless loop.
function LevelSet() {
  return (
    <div className="smb-set">
      {/* floating ? / brick row */}
      <div className="smb-qrow" style={{ left: "14vw" }}>
        <span className="smb-brick" />
        <span className="smb-qblock">?</span>
        <span className="smb-brick" />
      </div>

      <div className="smb-pipe smb-pipe--short" style={{ left: "30vw" }} />

      <div className="smb-qrow" style={{ left: "48vw" }}>
        <span className="smb-qblock">?</span>
      </div>

      <div className="smb-pipe smb-pipe--tall" style={{ left: "66vw" }} />

      <div className="smb-qrow" style={{ left: "84vw" }}>
        <span className="smb-brick" />
        <span className="smb-qblock">?</span>
        <span className="smb-brick" />
        <span className="smb-brick" />
      </div>
    </div>
  );
}

// Spinning coins live on their own faster track.
function CoinSet() {
  const xs = ["22vw", "40vw", "58vw", "76vw", "94vw"];
  return (
    <div className="smb-coinset">
      {xs.map((x, i) => (
        <span key={i} className="smb-coin" style={{ left: x }} />
      ))}
    </div>
  );
}

export default function SuperMarioRun() {
  return (
    <div className="smb-stage">
      {/* --- parallax backdrop --- */}
      <div className="smb-clouds" aria-hidden>
        <span className="smb-cloud smb-cloud--1" />
        <span className="smb-cloud smb-cloud--2" />
        <span className="smb-cloud smb-cloud--3" />
      </div>

      <div className="smb-hills" aria-hidden />
      <div className="smb-bushes" aria-hidden />

      {/* --- scrolling coins (behind hero) --- */}
      <div className="smb-coins" aria-hidden>
        <CoinSet />
        <CoinSet />
      </div>

      {/* --- scrolling pipes / blocks --- */}
      <div className="smb-obstacles" aria-hidden>
        <LevelSet />
        <LevelSet />
      </div>

      {/* --- brick ground --- */}
      <div className="smb-ground" aria-hidden />

      {/* --- the running / jumping ninja --- */}
      <div className="smb-hero" aria-hidden>
        <div className="smb-streaks" />
        <div className="smb-hop">
          <div className="smb-tilt">
            <img className="smb-ninja" src={ninja} alt="" />
          </div>
        </div>
        <div className="smb-dust" />
        <div className="smb-shadow" />
      </div>
    </div>
  );
}
