// JoinUsAd.jsx — JOIN US types itself out in gold, then the ninjas arrive.
//
// The white Google sheet carried over from GoogleReviewsAd — same near-white
// ground, same four-colour ambient light, same vignette, same Roboto, same
// gold — so this still cuts together with that ad. Nothing else survives from
// the earlier build of this scene: no star, no 60, no THANK YOU, no wordmark.
// One line and one picture.
//
// Beat sheet (plays once, then holds the final frame):
//   p1  JOIN US types, one character at a time, the caret following
//   p2  the two ninjas travel up from off the bottom of the screen
//
// The typewriter is the one thing JS owns beyond phase — it has to, because a
// caret that follows the text needs the text to actually grow. Everything else
// is CSS keyed off .ju-p0..p2.
import React from "react";
import "../Stylesheets/JoinUsAd.css";

import ninjas from "../Images/cn-ninjas-pair.png";

const JOIN = "JOIN US";
const KEY_MS = 115; // per character

const OPEN = 260; // the sheet is empty until here
const TYPE = JOIN.length * KEY_MS + 300; // typing, plus a beat on the last key

const CUES = [OPEN, OPEN + TYPE];

export default function JoinUsAd() {
  const [phase, setPhase] = React.useState(0);
  const [typed, setTyped] = React.useState(0);
  const [still, setStill] = React.useState(false);

  React.useEffect(() => {
    // reduced motion: no typing, no travel — hand over the finished card
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setStill(true);
      setPhase(2);
      setTyped(JOIN.length);
      return undefined;
    }
    const timers = CUES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  // the typewriter — starts with p1, stops on the last character
  const typing = phase >= 1 && !still;
  React.useEffect(() => {
    if (!typing) return undefined;
    const id = setInterval(
      () => setTyped((n) => (n >= JOIN.length ? (clearInterval(id), n) : n + 1)),
      KEY_MS
    );
    return () => clearInterval(id);
  }, [typing]);

  const done = typed >= JOIN.length;

  return (
    <div className={`ju-stage ju-p${phase}${done ? " ju-typed" : ""}`}>
      <div className="ju-aurora" aria-hidden />
      <div className="ju-vignette" aria-hidden />

      <div className="ju-card">
        {/* the ghost reserves the full width so the block stays centred while
            the live text grows from a fixed left edge — otherwise a centred
            typewriter shuffles sideways on every keystroke */}
        <div className="ju-line">
          <div className="ju-join">
            <span className="ju-ghost" aria-hidden>
              {JOIN}
            </span>
            <span className="ju-live">
              {JOIN.slice(0, typed)}
              <i className="ju-caret" aria-hidden />
            </span>
          </div>
        </div>

        <div className="ju-ninjas">
          <img src={ninjas} alt="Two Code Ninjas ninjas giving a thumbs up" />
        </div>
      </div>
    </div>
  );
}
