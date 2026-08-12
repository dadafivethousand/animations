// SummerCamp2026Ad.jsx — Code Ninjas Woodbridge summer camp promo.
//
// Outrun summer: deep navy ground, a retro perspective grid running to the
// horizon, electric cyan structure and a hot yellow-to-orange heat on the
// title. Distinct from the white Google sheet and the newsprint next to it on
// the grid.
//
// Beat sheet (plays once, then holds a complete poster):
//   p1  intro     the shuriken spins in; the wordmark wipes open behind it
//   p2  title     SUMMER CAMP 2026 slams in per letter — white flash, one
//                 screen shake, one finite RGB-split burst
//   p3  features  three chips knife in from alternating sides
//   p4  info      the contact card springs up
//   p5  cta       REGISTER NOW pops, with the urgency line under it
//
// Every element stays on screen and accumulates into the final poster, which
// is completely still — see the ambient note in the stylesheet.
//
// JS advances the phase and nothing else; all motion is CSS keyed off
// .s26-p0..p5.
import React from "react";
import "../Stylesheets/SummerCamp2026Ad.css";

import logo from "../Images/cn-woodbridge-logo.png";

const TITLE_A = "SUMMER CAMP";
const TITLE_B = "2026";

const CHIPS = [
  { icon: "🎮", label: "BUILD REAL VIDEO GAMES", side: "l" },
  { icon: "💻", label: "LEVEL UP CODING SKILLS", side: "r" },
  { icon: "🥷", label: "EPIC NINJA CHALLENGES", side: "l" },
];

// the rising field. Fixed maths, so every replay is identical — and every
// particle's run is finite, so the held frame has nothing moving in it.
const MOTES = Array.from({ length: 26 }, (_, i) => ({
  x: (i * 37) % 100, // vw across
  s: 2 + ((i * 5) % 4), // px
  // bounded on purpose: the largest delay + the largest duration must land
  // before the last cue, or a mote is still climbing on the frame this holds
  dur: 3400 + ((i * 617) % 2000), // ms  -> 3400..5400
  delay: (i * 397) % 6200, // ms         -> 0..6199
  drift: ((i * 53) % 40) - 20, // px sideways
  warm: i % 3 === 0, // one in three picks up the heat
}));

// ~12.8s to the last frame of motion, then it holds. The urgency beat is the
// last thing to finish, which is what sets the total.
const CUES = [200, 3100, 5900, 8700, 11000];

// split into per-letter spans; spaces become their own fixed-width span so the
// stagger index stays honest across the gap
function Letters({ text, from }) {
  let i = from;
  return text.split("").map((ch, k) =>
    ch === " " ? (
      <span className="s26-sp" key={k} aria-hidden />
    ) : (
      <span className="s26-ch" style={{ "--i": i++ }} key={k}>
        <span className="s26-ch-back" aria-hidden>
          {ch}
        </span>
        <span className="s26-ch-face">{ch}</span>
      </span>
    )
  );
}

export default function SummerCamp2026Ad() {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    // reduced motion: no slam, no shake, no glitch — hand over the poster
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase(5);
      return undefined;
    }
    const timers = CUES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`s26-stage s26-p${phase}`}>
      <div className="s26-sky" aria-hidden />
      <div className="s26-sun" aria-hidden />
      <div className="s26-grid" aria-hidden>
        <div className="s26-grid-in" />
      </div>

      <div className="s26-motes" aria-hidden>
        {MOTES.map((m, i) => (
          <i
            key={i}
            className={m.warm ? "s26-mote s26-mote--warm" : "s26-mote"}
            style={{
              left: `${m.x}vw`,
              "--sz": `${m.s}px`,
              "--dur": `${m.dur}ms`,
              "--dly": `${m.delay}ms`,
              "--dx": `${m.drift}px`,
            }}
          />
        ))}
      </div>

      <div className="s26-vignette" aria-hidden />

      {/* the shake moves the whole frame, background included */}
      <div className="s26-shake">
        <div className="s26-flash" aria-hidden />

        <div className="s26-card">
          {/* ---- p1 : the lockup ---- */}
          <div className="s26-lockup">
            <div className="s26-star" aria-hidden>
              <i />
            </div>
            {/* the mark is dark-on-transparent and has no light-on-dark
                variant, so it's foiled: grayscale first (keeps the mask band
                and eye slits distinct from the head) then inverted, where a
                flat invert would flatten the head into a white disc */}
            <div className="s26-wordmark">
              <img src={logo} alt="Code Ninjas" />
            </div>
            <div className="s26-city">WOODBRIDGE</div>
          </div>

          {/* ---- p2 : the title ---- */}
          <h1 className="s26-title">
            <span className="s26-line">
              <span className="s26-glitch s26-glitch--r" aria-hidden>
                {TITLE_A}
              </span>
              <span className="s26-glitch s26-glitch--c" aria-hidden>
                {TITLE_A}
              </span>
              <Letters text={TITLE_A} from={0} />
            </span>
            <span className="s26-line s26-line--b">
              <span className="s26-glitch s26-glitch--r" aria-hidden>
                {TITLE_B}
              </span>
              <span className="s26-glitch s26-glitch--c" aria-hidden>
                {TITLE_B}
              </span>
              <Letters text={TITLE_B} from={TITLE_A.replace(/ /g, "").length} />
            </span>
          </h1>

          {/* ---- p3 : the features ---- */}
          <ul className="s26-chips">
            {CHIPS.map((c, i) => (
              <li
                key={c.label}
                className={`s26-chip s26-chip--${c.side}`}
                style={{ "--i": i }}
              >
                <span className="s26-chip-ico" aria-hidden>
                  {c.icon}
                </span>
                <span className="s26-chip-txt">{c.label}</span>
              </li>
            ))}
          </ul>

          {/* ---- p4 : the contact card ---- */}
          <div className="s26-info">
            <div className="s26-info-name">Code Ninjas Woodbridge</div>
            <div className="s26-info-row">6175 Highway 7</div>
            <div className="s26-info-row">647-887-9940</div>
            <div className="s26-info-row s26-info-row--site">cnwoodbridge.com</div>
          </div>

          {/* ---- p5 : the call to action ---- */}
          <div className="s26-cta">
            <div className="s26-btn">REGISTER NOW</div>
            <div className="s26-urgent">SPOTS FILLING FAST</div>
          </div>
        </div>
      </div>
    </div>
  );
}
