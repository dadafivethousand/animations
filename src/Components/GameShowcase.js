// GameShowcase.jsx — a Code Ninjas "we build every kind of game" promo reel.
// Flips through game genres (Fighting / Adventure / Racing / Space / Rhythm),
// each a mini animated scene starring the ninja mascots as the characters.
import React, { useEffect, useState } from "react";
import "../Stylesheets/GameShowcase.css";

import leap from "../Images/ninja-leap.png";
import thumbs from "../Images/ninja-thumbs.png";
import cheer from "../Images/ninja-cheer.png";
import kick from "../Images/ninja-kick.png";

const SCENES = ["fighting", "adventure", "racing", "space", "rhythm"];
const LABELS = {
  fighting: "FIGHTING",
  adventure: "ADVENTURE",
  racing: "RACING",
  space: "SPACE SHOOTER",
  rhythm: "RHYTHM",
};
const SCENE_MS = 3600;

export default function GameShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((a) => (a + 1) % SCENES.length),
      SCENE_MS
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="gs-stage">
      {/* ---- genre scenes (all mounted; active one flips in) ---- */}
      <div className="gs-screen">
        {SCENES.map((key, i) => (
          <section
            key={key}
            className={`gs-scene gs-${key} ${i === active ? "gs-on" : ""}`}
          >
            {key === "fighting" && <Fighting />}
            {key === "adventure" && <Adventure />}
            {key === "racing" && <Racing />}
            {key === "space" && <Space />}
            {key === "rhythm" && <Rhythm />}
          </section>
        ))}

        {/* transition flash — remounts each switch to replay the swipe */}
        <div key={active} className="gs-swipe" />
        {/* CRT scanlines + vignette */}
        <div className="gs-crt" />
      </div>

      {/* ---- HUD overlay ---- */}
      <div className="gs-hud">
        <div className="gs-brand">
          <span className="gs-brand-code">CODE</span>
          <span className="gs-brand-ninjas">NINJAS</span>
          <span className="gs-brand-studio">GAME&nbsp;STUDIO</span>
        </div>

        <div className="gs-genre">
          <span className="gs-genre-kicker">NOW BUILDING</span>
          <span key={active} className="gs-genre-label">
            {LABELS[SCENES[active]]}
          </span>
        </div>

        <div className="gs-dots">
          {SCENES.map((k, i) => (
            <span key={k} className={`gs-dot ${i === active ? "on" : ""}`} />
          ))}
        </div>

        <div className="gs-tag">ONE ACADEMY&nbsp;•&nbsp;EVERY KIND OF GAME</div>
      </div>
    </div>
  );
}

/* ============================ FIGHTING ============================ */
function Fighting() {
  return (
    <>
      <div className="gs-fx-stage" />
      <div className="gs-hpbars">
        <div className="gs-hp gs-hp--l"><i /></div>
        <div className="gs-hp gs-hp--r"><i /></div>
      </div>
      <div className="gs-floor gs-floor--fight" />
      <div className="gs-fighter gs-fighter--l">
        <span className="gs-aura gs-aura--blue" />
        <img src={cheer} alt="" />
      </div>
      <div className="gs-fighter gs-fighter--r">
        <span className="gs-aura gs-aura--red" />
        <img src={kick} alt="" />
      </div>
      <div className="gs-vs">VS</div>
      <div className="gs-fight-word">FIGHT!</div>
    </>
  );
}

/* ============================ ADVENTURE ============================ */
function Adventure() {
  return (
    <>
      <div className="gs-adv-sky" />
      <span className="gs-adv-cloud c1" />
      <span className="gs-adv-cloud c2" />
      <div className="gs-adv-hills" />
      <div className="gs-adv-coins">
        <span /><span /><span /><span /><span />
      </div>
      <div className="gs-adv-pipes"><span /><span /></div>
      <div className="gs-adv-ground" />
      <div className="gs-adv-hero">
        <img src={leap} alt="" />
        <span className="gs-adv-dust" />
      </div>
    </>
  );
}

/* ============================ RACING ============================ */
function Racing() {
  return (
    <>
      <div className="gs-race-sky" />
      <div className="gs-race-sun" />
      <div className="gs-race-road">
        <div className="gs-race-dashes" />
      </div>
      <div className="gs-flag gs-flag--l" />
      <div className="gs-flag gs-flag--r" />
      <div className="gs-race-lines"><i /><i /><i /><i /></div>
      <div className="gs-racer">
        <img src={leap} alt="" />
        <div className="gs-kart" />
      </div>
      <div className="gs-lap">LAP 1/3</div>
    </>
  );
}

/* ============================ SPACE ============================ */
function Space() {
  return (
    <>
      <div className="gs-space-bg" />
      <div className="gs-stars s1" />
      <div className="gs-stars s2" />
      <div className="gs-asteroid a1" />
      <div className="gs-asteroid a2" />
      <div className="gs-asteroid a3" />
      <div className="gs-lasers"><i /><i /><i /></div>
      <div className="gs-ship">
        <div className="gs-ship-body" />
        <img src={thumbs} alt="" />
        <span className="gs-thruster" />
      </div>
      <div className="gs-score">SCORE 9450</div>
    </>
  );
}

/* ============================ RHYTHM ============================ */
function Rhythm() {
  return (
    <>
      <div className="gs-rhythm-bg" />
      <div className="gs-notes">
        <span className="n1">◀</span>
        <span className="n2">▲</span>
        <span className="n3">▼</span>
        <span className="n4">▶</span>
      </div>
      <div className="gs-targets"><span>◀</span><span>▲</span><span>▼</span><span>▶</span></div>
      <div className="gs-rhythm-floor" />
      <div className="gs-rhythm-dancer">
        <img src={thumbs} alt="" />
      </div>
      <div className="gs-combo">128&nbsp;COMBO</div>
    </>
  );
}
