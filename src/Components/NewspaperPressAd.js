// NewspaperPressAd.jsx — the mark printed on newsprint, then stamped.
//
// Warm newsprint grey, black ink, one muted spot red: the two-colour job an old
// letterpress shop could run. Nothing on the sheet but the mark and the stamp.
//
// Beat sheet (plays once, then holds the final frame):
//   p1  the mark presses in — oversized and blurred, landing sharp
//   p2  the WOODBRIDGE stamp thumps down crooked and the sheet takes the hit
//
// JS only advances the phase; every bit of motion is CSS keyed off .np-p0..p2.
import React from "react";
import "../Stylesheets/NewspaperPressAd.css";

import logo from "../Images/cn-woodbridge-logo.png";

// phase cue sheet (ms from mount); index 1..2, index 0 is the blank sheet
const CUES = [520, 1500];

export default function NewspaperPressAd() {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    // reduced motion: skip the press, show the finished sheet
    const still =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      setPhase(2);
      return undefined;
    }
    const timers = CUES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`np-stage np-p${phase}`}>
      <div className="np-paper">
        <div className="np-halftone" aria-hidden />
        <div className="np-fibres" aria-hidden />
        <div className="np-creases" aria-hidden />
        <div className="np-wear" aria-hidden />

        <div className="np-page">
          <img className="np-logo" src={logo} alt="Code Ninjas" />
          <div className="np-stamp">
            <span>WOODBRIDGE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
