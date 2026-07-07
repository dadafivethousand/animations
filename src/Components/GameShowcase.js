// GameShowcase.jsx — Code Ninjas "we build every kind of game" promo reel.
// Genre scenes flip in 3D; the ninja mascots star as the characters.
import React, { useEffect, useState } from "react";
import "../Stylesheets/GameShowcase.css";

import leap from "../Images/ninja-leap.png";
import thumbs from "../Images/ninja-thumbs.png";
import cheer from "../Images/ninja-cheer.png";
import kick from "../Images/ninja-kick.png";

const SCENES = ["tetris", "fps", "fighting", "adventure", "racing"];
const LABELS = {
  tetris: "PUZZLE",
  fps: "FIRST-PERSON SHOOTER",
  fighting: "FIGHTING",
  adventure: "ADVENTURE",
  racing: "RACING",
};
const SCENE_MS = 4600;

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
            {key === "tetris" && <Tetris />}
            {key === "fps" && <FPS />}
            {key === "fighting" && <Fighting />}
            {key === "adventure" && <Adventure />}
            {key === "racing" && <Racing />}
          </section>
        ))}

        <div key={active} className="gs-swipe" />
        <div className="gs-crt" />
      </div>

      <div className="gs-hud">
        <div className="gs-brand">
          <span className="gs-brand-code">CODE</span>
          <span className="gs-brand-ninjas">NINJAS</span>
          <span className="gs-brand-studio">GAME&nbsp;STUDIO</span>
        </div>
        <div className="gs-genre">
          <span className="gs-genre-kicker">NOW BUILDING</span>
          <span key={active} className="gs-genre-label">{LABELS[SCENES[active]]}</span>
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

// pre-settled stack near the bottom of the well (8 wide); null = empty
const STACK = [
  [null, null, "L", null, null, "Z", "Z", null],
  ["I", null, "L", "L", "S", "S", "Z", "Z"],
  ["I", "T", "T", "T", "O", "O", "S", "S"],
  ["I", "J", "T", "J", "O", "O", "L", "L"],
];

function Tetris() {
  const cols = 8;
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

        {/* falling pieces */}
        <Piece type="I" className="tet-fall f1" style={{ left: 1 * CELL }} />
        <Piece type="L" className="tet-fall f2" style={{ left: 5 * CELL }} />
        <Piece type="S" className="tet-fall f3" style={{ left: 3 * CELL }} />

        {/* settled stack */}
        <div className="tet-stack">
          {STACK.map((row, r) =>
            row.map((c, x) =>
              c ? (
                <span
                  key={`${r}-${x}`}
                  className="tet-cell"
                  style={{
                    left: x * CELL,
                    bottom: (STACK.length - 1 - r) * CELL,
                    background: TET[c].c,
                  }}
                />
              ) : null
            )
          )}
          <span className="tet-clear" style={{ width: cols * CELL }} />
        </div>
      </div>

      {/* stats */}
      <div className="tet-stats">
        <div><span>SCORE</span><b>0148200</b></div>
        <div><span>LINES</span><b>042</b></div>
        <div><span>LEVEL</span><b>07</b></div>
      </div>
    </>
  );
}

/* ============================ FPS ============================ */
function FPS() {
  return (
    <>
      <div className="fps-sky" />
      <div className="fps-skyline" />
      <div className="fps-smoke" />
      <div className="fps-ground" />

      {/* downrange enemy popping from cover, flinches when hit */}
      <div className="fps-enemy">
        <img src={kick} alt="" />
        <span className="fps-enemy-hit" />
      </div>
      <div className="fps-crate" />

      <div className="fps-tracers"><i /><i /><i /></div>

      {/* crosshair + hitmarker */}
      <div className="fps-cross"><span /><span /><span /><span /><em /></div>
      <div className="fps-hitmarker"><i /><i /><i /><i /></div>

      {/* first-person weapon */}
      <div className="fps-weapon">
        <div className="fps-gun">
          <span className="fps-muzzle" />
          <span className="fps-barrel" />
          <span className="fps-sight" />
          <span className="fps-body" />
          <span className="fps-mag" />
          <span className="fps-stock" />
          <span className="fps-grip" />
        </div>
      </div>

      <div className="fps-flash" />

      {/* HUD */}
      <div className="fps-hud">
        <div className="fps-mode">TEAM&nbsp;DEATHMATCH&nbsp;·&nbsp;42–18</div>
        <div className="fps-health">
          <span className="fps-health-label">100</span>
          <div className="fps-health-bar"><i /></div>
        </div>
        <div className="fps-ammo"><b>27</b><span>/&nbsp;120</span></div>
        <div className="fps-mini"><span className="fps-mini-dot" /><span className="fps-mini-ping" /></div>
      </div>
    </>
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
        <span className="q">?</span><span className="b" /><span className="q">?</span>
      </div>
      <div className="gs-adv-coins"><span /><span /><span /><span /><span /><span /></div>
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
      <div className="gs-race-road"><div className="gs-race-dashes" /></div>
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
