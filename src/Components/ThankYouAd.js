// ThankYouAd.jsx — the 60 melts down and is recast as THANK YOU.
//
// This is the back half of GoogleReviewsAd, not a new ad: same white Google
// sheet, same four-colour ambient light, same Roboto, same gold. It opens on
// the frame the reviews ad holds on — star, gold 60, Woodbridge lockup — so
// the two cut together with no seam. The "5-STAR GOOGLE REVIEWS" line is gone;
// that was the other ad's payoff, and this one has its own.
//
// The move is a recast, not a cross-fade. The 60 softens, slumps and collapses
// onto a single molten line; the gold pools there; then THANK is drawn up out
// of the pool and YOU settles down out of it. Both words are masked at that
// same seam, so the metal appears to become the letters rather than being
// swapped for them. Same gold ramp as the number, so it reads as one material
// throughout.
//
// Beat sheet (plays once, then holds the final frame):
//   p1  the inherited frame — star, 60, lockup — holds a beat
//   p2  the 60 slumps, blurs and collapses onto the seam; the gold pools
//   p3  THANK is drawn up out of the pool, YOU settles down out of it
//   p4  the gold sets: a sheen crosses both words and the star gives one kick
//
// JS advances the phase; every bit of motion is CSS keyed off .tk-p0..p4.
import React from "react";
import "../Stylesheets/ThankYouAd.css";

import star from "../Images/gold-star-3d.png";
import logo from "../Images/cn-woodbridge-logo.png";

const HOLD = 700; // the inherited frame, before anything moves
const MELT = 900; // the 60 going down
const CAST = 820; // the words coming out

const CUES = [160, 160 + HOLD, 160 + HOLD + MELT, 160 + HOLD + MELT + CAST];

export default function ThankYouAd() {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    // reduced motion: no melt, no cast — hand over the finished card
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase(4);
      return undefined;
    }
    const timers = CUES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`tk-stage tk-p${phase}`}>
      <div className="tk-aurora" aria-hidden />
      <div className="tk-vignette" aria-hidden />

      <div className="tk-card">
        <div className="tk-scene">
          <img className="tk-star" src={star} alt="" />
          <div className="tk-shadow" aria-hidden />
        </div>

        {/* the 60 and the words share one box, and the pool sits on the seam
            between the two lines — that is the whole trick */}
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

        <div className="tk-lockup">
          <img className="tk-logo" src={logo} alt="Code Ninjas" />
          <div className="tk-city">WOODBRIDGE</div>
        </div>
      </div>
    </div>
  );
}
