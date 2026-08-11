// ThankYouAd.jsx — the 60 is recast as THANK YOU, then it cuts to JOIN US.
//
// The back half of GoogleReviewsAd, in two scenes on one white sheet:
//
//   scene 1  the reviews ad's closing frame — the star and the gold 60 —
//            with the 60 melting down and being recast as THANK YOU
//   scene 2  a hard cut to JOIN US typing itself out in the same gold, with
//            the two ninjas rising into frame underneath
//
// There's no wordmark on either scene — the two ninjas are the brand in scene
// 2, and scene 1 signs off on the gold alone.
//
// Beat sheet (plays once, then holds the final frame):
//   p1  the inherited frame holds a beat
//   p2  the 60 slumps, blurs and collapses onto the seam; the gold pools
//   p3  THANK is drawn up out of the pool, YOU settles down out of it
//   p4  a sheen crosses both words and the star kicks once
//   p5  hard cut. JOIN US types in gold, one character at a time, caret
//       following
//   p6  the ninjas travel up from off the bottom of the screen
//
// The typewriter is the one thing JS owns beyond phase — it has to, because a
// caret that follows the text needs the text to actually grow. Everything else
// is CSS keyed off .tk-p0..p6.
import React from "react";
import "../Stylesheets/ThankYouAd.css";

import star from "../Images/gold-star-3d.png";
import ninjas from "../Images/cn-ninjas-pair.png";

const JOIN = "JOIN US";
const KEY_MS = 115; // per character

const HOLD = 700; // the inherited frame, before anything moves
const MELT = 900; // the 60 going down
const CAST = 820; // the words coming out
const SET = 1500; // THANK YOU holds before the cut
const TYPE = JOIN.length * KEY_MS + 260; // typing, plus a beat on the last key

const C1 = 160;
const C2 = C1 + HOLD;
const C3 = C2 + MELT;
const C4 = C3 + CAST;
const C5 = C4 + SET;
const C6 = C5 + TYPE;
const CUES = [C1, C2, C3, C4, C5, C6];

export default function ThankYouAd() {
  const [phase, setPhase] = React.useState(0);
  const [typed, setTyped] = React.useState(0);
  const [still, setStill] = React.useState(false);

  React.useEffect(() => {
    // reduced motion: no melt, no cut, no typing — hand over the finished card
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setStill(true);
      setPhase(6);
      setTyped(JOIN.length);
      return undefined;
    }
    const timers = CUES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  // the typewriter — starts on the cut, stops on the last character
  const typing = phase >= 5 && !still;
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
    <div className={`tk-stage tk-p${phase}${done ? " tk-typed" : ""}`}>
      <div className="tk-aurora" aria-hidden />
      <div className="tk-vignette" aria-hidden />

      <div className="tk-card">
        <div className="tk-body">
          {/* ---- scene 1 : the recast ---- */}
          <div className="tk-s1">
            <div className="tk-scene">
              <img className="tk-star" src={star} alt="" />
              <div className="tk-shadow" aria-hidden />
            </div>

            {/* the 60 and the words share one box, and the pool sits on the
                seam between the two lines — that is the whole trick */}
            <div className="tk-forge">
              <div className="tk-pool" aria-hidden />

              <div className="tk-sixty" aria-hidden>
                <span>60</span>
              </div>

              <div className="tk-words">
                <span className="tk-line tk-line--up">
                  <i className="tk-word">THANK</i>
                </span>
                <span className="tk-line tk-line--down">
                  <i className="tk-word tk-word--you">YOU</i>
                </span>
              </div>
            </div>
          </div>

          {/* ---- scene 2 : the invitation ---- */}
          <div className="tk-s2">
            {/* the ghost reserves the full width so the block stays centred
                while the live text grows from a fixed left edge — otherwise a
                centred typewriter shuffles sideways on every keystroke */}
            <div className="tk-join-wrap">
              <div className="tk-join">
                <span className="tk-join-ghost" aria-hidden>
                  {JOIN}
                </span>
                <span className="tk-join-live">
                  {JOIN.slice(0, typed)}
                  <i className="tk-caret" aria-hidden />
                </span>
              </div>
            </div>

            <div className="tk-ninjas">
              <img src={ninjas} alt="Two Code Ninjas ninjas giving a thumbs up" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
