// GameShowcase.jsx — Code Ninjas "we build every kind of game" promo reel.
// Genre scenes flip in 3D; the ninja mascots star as the characters.
import React, { useEffect, useState } from "react";
import "../Stylesheets/GameShowcase.css";

import leap from "../Images/ninja-leap.png";
import thumbs from "../Images/ninja-thumbs.png";
import cheer from "../Images/ninja-cheer.png";
import kick from "../Images/ninja-kick.png";

const SCENES = ["tetris", "fps", "fighting", "adventure", "racing", "outro"];
// Per-scene durations — punchy games, a longer beat on the closing ad.
const SCENE_MS = {
  tetris: 3000,
  fps: 3200,
  fighting: 3000,
  adventure: 3000,
  racing: 3000,
  outro: 5400,
};

function SceneBody({ name }) {
  switch (name) {
    case "tetris": return <Tetris />;
    case "fps": return <FPS />;
    case "fighting": return <Fighting />;
    case "adventure": return <Adventure />;
    case "racing": return <Racing />;
    case "outro": return <Outro />;
    default: return null;
  }
}

export default function GameShowcase() {
  const [active, setActive] = useState(0);

  // recursive timer so each scene can hold for its own duration
  useEffect(() => {
    const name = SCENES[active];
    const t = setTimeout(
      () => setActive((a) => (a + 1) % SCENES.length),
      SCENE_MS[name] || 3000
    );
    return () => clearTimeout(t);
  }, [active]);

  const name = SCENES[active];

  return (
    <div className="gs-stage">
      <div className="gs-screen">
        {/* only the active scene is mounted — it remounts on every change so
            its animations (Tetris drops, the FPS kill) restart cleanly */}
        <section key={active} className={`gs-scene gs-${name} gs-on`}>
          <SceneBody name={name} />
        </section>

        <div key={`sw-${active}`} className="gs-swipe" />
        <div className="gs-crt" />
      </div>

      <div className="gs-hud">
        <div className="gs-brand">
          <span className="gs-brand-code">CODE</span>
          <span className="gs-brand-ninjas">NINJAS</span>
          <span className="gs-brand-studio">GAME&nbsp;STUDIO</span>
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

/* ============================ TETRIS ============================ */
const CELL = 26;
const TET = {
  I: { c: "#31c7ef", cells: [[0, 0], [1, 0], [2, 0], [3, 0]] },
  O: { c: "#f7d308", cells: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  T: { c: "#c04dd6", cells: [[0, 0], [1, 0], [2, 0], [1, 1]] },
  L: { c: "#ef8a21", cells: [[0, 0], [0, 1], [0, 2], [1, 2]] },
  J: { c: "#3d6bff", cells: [[1, 0], [1, 1], [1, 2], [0, 2]] },
  S: { c: "#39d353", cells: [[1, 0], [2, 0], [0, 1], [1, 1]] },
  Z: { c: "#ff4d5e", cells: [[0, 0], [1, 0], [1, 1], [2, 1]] },
};

function Piece({ type, className = "", style = {} }) {
  const t = TET[type];
  const w = Math.max(...t.cells.map((c) => c[0])) + 1;
  const h = Math.max(...t.cells.map((c) => c[1])) + 1;
  return (
    <div
      className={`tet-piece ${className}`}
      style={{ width: w * CELL, height: h * CELL, ...style }}
    >
      {t.cells.map(([x, y], i) => (
        <span
          key={i}
          className="tet-cell"
          style={{ left: x * CELL, top: y * CELL, background: t.c }}
        />
      ))}
    </div>
  );
}

// Pieces fall one at a time onto an empty field and STAY (build a stack).
// Each drop is a bespoke keyframe on the same scene-length timeline, so the
// field is empty when the scene appears and fills up before it flips away.
function Tetris() {
  return (
    <>
      <div className="tet-bg" />
      {/* ninja on the side holding the NEXT piece */}
      <div className="tet-side">
        <div className="tet-next">
          <span className="tet-next-label">NEXT</span>
          <div className="tet-next-box"><Piece type="T" /></div>
        </div>
        <img className="tet-ninja" src={thumbs} alt="" />
      </div>

      {/* playfield */}
      <div className="tet-well">
        <div className="tet-grid" />
        <div className="tet-scanline" />
        {/* row 0 (floor) */}
        <Piece type="I" className="tet-drop p1" style={{ left: 0 * CELL }} />
        <Piece type="O" className="tet-drop p2" style={{ left: 4 * CELL }} />
        <Piece type="L" className="tet-drop p3" style={{ left: 6 * CELL }} />
        {/* row 1 (on top) */}
        <Piece type="T" className="tet-drop p4" style={{ left: 0 * CELL }} />
        <Piece type="S" className="tet-drop p5" style={{ left: 3 * CELL }} />
      </div>

      {/* ninja mascot on the right */}
      <img className="tet-ninja-right" src={cheer} alt="" />
    </>
  );
}

/* ============================ FPS ============================ */
function FPS() {
  return (
    <div className="fps-shake">
      <div className="fps-sky" />
      <div className="fps-searchlight" />
      <div className="fps-skyline" />
      <div className="fps-windows" />
      <div className="fps-grid" />
      <div className="fps-ground" />
      <div className="fps-rain" />
      <div className="fps-smoke" />

      {/* distant battle: explosions on the horizon */}
      <div className="fps-explosions"><i /><i /></div>

      {/* main downrange enemy popping from cover, flinches when hit */}
      <div className="fps-enemy">
        <img src={kick} alt="" />
        <span className="fps-enemy-hit" />
      </div>
      <div className="fps-crate" />

      {/* floating embers */}
      <div className="fps-embers">
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} style={{ "--i": i, left: `${(i * 71) % 100}%` }} />
        ))}
      </div>

      {/* outgoing fire */}
      <div className="fps-tracers"><i /><i /><i /></div>
      <div className="fps-incoming"><i /><i /></div>
      <span className="fps-shotflash" />

      {/* sniper scope + reticle */}
      <div className="fps-scope">
        <span className="fps-reticle-dot" />
        <span className="fps-mil m1" /><span className="fps-mil m2" /><span className="fps-mil m3" />
        <span className="fps-mil mL" /><span className="fps-mil mR" />
      </div>
      <div className="fps-hitmarker"><i /><i /><i /><i /></div>
      <div className="fps-dmg">120</div>

      <div className="fps-flash" />

      {/* HUD */}
      <div className="fps-hud">
        {/* compass strip */}
        <div className="fps-compass">
          <div className="fps-compass-track">
            <span>N</span><span>·</span><span>NE</span><span>·</span><span>E</span><span>·</span>
            <span>SE</span><span>·</span><span>S</span><span>·</span><span>SW</span><span>·</span>
            <span>W</span><span>·</span><span>NW</span><span>·</span><span>N</span>
          </div>
          <span className="fps-compass-obj" />
        </div>
        <div className="fps-killfeed">
          <span className="fps-kf-you">YOU</span> ⟶ <span className="fps-kf-them">NINJA_07</span>
        </div>
        <div className="fps-elim">ENEMY&nbsp;ELIMINATED</div>

        <div className="fps-health">
          <span className="fps-health-label">100</span>
          <div className="fps-health-bar"><i /></div>
        </div>
        <div className="fps-gadgets"><span className="g1" /><span className="g2" /></div>
        <div className="fps-ammo"><b>27</b><span>/&nbsp;120</span></div>
        <div className="fps-mini">
          <span className="fps-mini-cone" />
          <span className="fps-mini-dot" />
          <span className="fps-mini-ping" />
          <span className="fps-mini-enemy" />
        </div>
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
      <div className="gs-arena-beams"><i /><i /><i /></div>
      <div className="gs-shake">
        <div className="gs-fighter gs-fighter--l">
          <span className="gs-aura gs-aura--blue" />
          <span className="gs-fdust" />
          <img src={cheer} alt="" />
          <span className="gs-fshadow" />
        </div>
        <div className="gs-blast"><span className="gs-blast-trail" /></div>
        <div className="gs-impact"><i /><i /><i /><i /><i /><i /></div>
        <div className="gs-fighter gs-fighter--r">
          <span className="gs-aura gs-aura--red" />
          <span className="gs-fdust" />
          <img src={kick} alt="" />
          <span className="gs-fshadow" />
        </div>
      </div>
      <div className="gs-hitflash" />
      <div className="gs-combo">4 HIT COMBO</div>
      <div className="gs-round">ROUND 1</div>
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
      <span className="gs-adv-bird b1" />
      <span className="gs-adv-bird b2" />
      <div className="gs-adv-hills" />
      <div className="gs-adv-blocks">
        <span className="q">?</span><span className="b" /><span className="q">?</span>
      </div>
      <div className="gs-adv-coins"><span /><span /><span /><span /><span /><span /></div>
      <div className="gs-adv-bushes" />
      {/* goal flag on the right */}
      <div className="gs-adv-goal"><span className="pole" /><span className="flag" /></div>
      <div className="gs-adv-ground" />
      <div className="gs-adv-hero">
        <span className="gs-adv-trail" />
        <img src={leap} alt="" />
        <span className="gs-adv-hshadow" />
        <span className="gs-adv-dust" />
        <span className="gs-adv-pop">+100</span>
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
        <div className="gs-race-rumble l" />
        <div className="gs-race-rumble r" />
      </div>
      {/* roadside palms rushing past */}
      <div className="gs-race-palms">
        <span className="p l1" /><span className="p r1" />
        <span className="p l2" /><span className="p r2" />
      </div>
      <div className="gs-race-lines"><i /><i /><i /><i /><i /></div>

      {/* rear-view car */}
      <div className="gs-racer">
        <span className="gs-racer-shadow" />
        <span className="gs-car-exhaust l" />
        <span className="gs-car-exhaust r" />
        <span className="gs-car-tire l" />
        <span className="gs-car-tire r" />
        <div className="gs-car-body">
          <span className="gs-car-window" />
          <span className="gs-car-light l" />
          <span className="gs-car-light r" />
          <span className="gs-car-number">07</span>
          <span className="gs-car-plate" />
        </div>
        <div className="gs-car-spoiler"><i className="l" /><i className="r" /><b /></div>
        <img src={thumbs} alt="" />
      </div>
      <div className="gs-race-hud">
        <div className="gs-lap">LAP&nbsp;1/3</div>
        <div className="gs-pos"><b>1</b><small>ST</small></div>
        <div className="gs-speed"><b>180</b><small>KM/H</small></div>
      </div>
    </>
  );
}

/* ============================ OUTRO (the ad) ============================ */
function Outro() {
  const genres = [
    ["🧩", "PUZZLE"],
    ["🔫", "SHOOTER"],
    ["🏎️", "RACING"],
    ["🥊", "FIGHTING"],
    ["🍄", "ADVENTURE"],
  ];
  return (
    <>
      <div className="gs-outro-bg" />
      <div className="gs-outro-rays" />
      <div className="gs-outro-spot" />
      <div className="gs-outro-sparkles">
        {Array.from({ length: 18 }, (_, i) => (
          <span key={i} style={{ left: `${(i * 61) % 100}%`, top: `${(i * 37) % 90}%`, animationDelay: `${(i % 6) * -0.5}s` }} />
        ))}
      </div>
      <div className="gs-outro-confetti">
        {Array.from({ length: 46 }, (_, i) => (
          <span
            key={i}
            style={{
              left: `${(i * 83) % 100}%`,
              background: i % 2 ? "#3D8EBD" : (i % 3 ? "#ffd42f" : "#fff"),
              animationDelay: `${((i * 137) % 100) / 100 * -3}s`,
              animationDuration: `${2.4 + ((i * 53) % 30) / 10}s`,
            }}
          />
        ))}
      </div>

      <div className="gs-outro-content">
        <div className="gs-outro-brand">
          <span className="gs-outro-code">CODE</span>
          <span className="gs-outro-ninjas">NINJAS</span>
          <sup>®</sup>
          <span className="gs-outro-shine" />
        </div>
        <div className="gs-outro-place">WOODBRIDGE</div>

        <h2 className="gs-outro-head">
          <span className="l1">WHATEVER GAME YOU CAN DREAM UP&hellip;</span>
          <span className="l2">OUR&nbsp;STUDENTS&nbsp;BUILD&nbsp;IT.</span>
        </h2>

        <div className="gs-outro-genres">
          {genres.map(([icon, label], i) => (
            <span className="gs-outro-chip" key={label} style={{ animationDelay: `${0.5 + i * 0.09}s` }}>
              <b>{icon}</b> {label}
            </span>
          ))}
        </div>

        <div className="gs-outro-stage">
          <div className="gs-outro-crew">
            <img src={thumbs} alt="" style={{ animationDelay: "-0.0s" }} />
            <img src={cheer} alt="" style={{ animationDelay: "-0.3s" }} />
            <img src={kick} alt="" style={{ animationDelay: "-0.6s" }} />
            <img src={leap} alt="" style={{ animationDelay: "-0.9s" }} />
          </div>
        </div>

        <div className="gs-outro-cta">
          <span className="gs-outro-btn">BOOK A FREE TRIAL&nbsp;→<span className="gs-outro-btn-shine" /></span>
          <span className="gs-outro-contact">cnwoodbridge.com&nbsp;&nbsp;·&nbsp;&nbsp;(647) 887-9940</span>
        </div>
      </div>
    </>
  );
}
