// GameShowcase.jsx — Code Ninjas "we build every kind of game" promo reel.
// Three polished genre scenes that flip in 3D, ninja mascots as the characters.
import React, { useEffect, useState } from "react";
import "../Stylesheets/GameShowcase.css";

import leap from "../Images/ninja-leap.png";
import thumbs from "../Images/ninja-thumbs.png";
import cheer from "../Images/ninja-cheer.png";
import kick from "../Images/ninja-kick.png";

const SCENES = ["fighting", "adventure", "racing"];
const LABELS = { fighting: "FIGHTING", adventure: "ADVENTURE", racing: "RACING" };
const SCENE_MS = 5000;

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
      <div className="gs-screen">
        {SCENES.map((key, i) => (
          <section
            key={key}
            className={`gs-scene gs-${key} ${i === active ? "gs-on" : ""}`}
          >
            {key === "fighting" && <Fighting />}
            {key === "adventure" && <Adventure />}
            {key === "racing" && <Racing />}
          </section>
        ))}

        <div key={active} className="gs-swipe" />
        <div className="gs-crt" />
      </div>

      {/* HUD */}
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
      <div className="gs-arena-sky" />
      <div className="gs-arena-lights" />
      <div className="gs-crowd" />
      <div className="gs-arena-stage" />

      {/* top HUD: health + timer */}
      <div className="gs-fbar">
        <div className="gs-fbar-side gs-fbar-side--l">
          <span className="gs-fname">NINJA&nbsp;01</span>
          <div className="gs-hp gs-hp--l"><i /></div>
        </div>
        <div className="gs-timer">99</div>
        <div className="gs-fbar-side gs-fbar-side--r">
          <span className="gs-fname">NINJA&nbsp;02</span>
          <div className="gs-hp gs-hp--r"><i /></div>
        </div>
      </div>

      <div className="gs-shake">
        <div className="gs-fighter gs-fighter--l">
          <span className="gs-aura gs-aura--blue" />
          <img src={cheer} alt="" />
          <span className="gs-fshadow" />
        </div>

        <div className="gs-blast" />
        <div className="gs-impact"><i /><i /><i /><i /></div>

        <div className="gs-fighter gs-fighter--r">
          <span className="gs-aura gs-aura--red" />
          <img src={kick} alt="" />
          <span className="gs-fshadow" />
        </div>
      </div>

      <div className="gs-combo">4 HIT COMBO</div>
      <div className="gs-fight-word">FIGHT!</div>
    </>
  );
}

/* ============================ ADVENTURE ============================ */
function Adventure() {
  return (
    <>
      <div className="gs-adv-sky" />
      <div className="gs-adv-sun" />
      <div className="gs-adv-mtn" />
      <span className="gs-adv-cloud c1" />
      <span className="gs-adv-cloud c2" />
      <div className="gs-adv-hills" />
      <div className="gs-adv-blocks">
        <span className="q">?</span>
        <span className="b" />
        <span className="q">?</span>
      </div>
      <div className="gs-adv-coins">
        <span /><span /><span /><span /><span /><span />
      </div>
      <div className="gs-adv-bushes" />
      <div className="gs-adv-ground" />
      <div className="gs-adv-hero">
        <span className="gs-adv-trail" />
        <img src={leap} alt="" />
        <span className="gs-adv-hshadow" />
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
      <div className="gs-race-mtn" />
      <div className="gs-race-ground" />
      <div className="gs-race-road">
        <div className="gs-race-dashes" />
      </div>
      {/* roadside markers rushing past */}
      <div className="gs-race-side gs-race-side--l"><i /><i /><i /></div>
      <div className="gs-race-side gs-race-side--r"><i /><i /><i /></div>
      <div className="gs-race-lines"><i /><i /><i /><i /><i /></div>

      <div className="gs-racer">
        <img src={thumbs} alt="" />
        <div className="gs-kart">
          <span className="gs-kart-wheel l" />
          <span className="gs-kart-wheel r" />
          <span className="gs-kart-exhaust" />
        </div>
        <span className="gs-racer-shadow" />
      </div>

      <div className="gs-race-hud">
        <div className="gs-lap">LAP&nbsp;1/3</div>
        <div className="gs-pos"><b>1</b><small>ST</small></div>
        <div className="gs-speed"><b>180</b><small>KM/H</small></div>
      </div>
    </>
  );
}
