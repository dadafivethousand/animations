// TechTalkAd.jsx — a talk, announced.
//
// This is not the co-brand film. StaplesLockupAd exists to say that these two
// brands are together; this one exists to get somebody to an address at a
// time, and everything in it is subordinate to that. The frame that matters is
// the last one, because it is the frame that gets screenshotted and shown to a
// parent, and it has to answer WHAT / WHEN / WHERE without being replayed.
//
// ── Why it assembles instead of cutting ──
//
// The lockup film moves through scenes: marks, then an offer card. An event
// notice cannot afford that, because a viewer who leaves at second four has to
// have already got the date. So this one never clears the frame — every beat
// ADDS a line to a poster that is being built in front of you, and the poster
// is complete and holding by the time the film ends. Nothing that arrives ever
// leaves.
//
// ── Inherited, deliberately ──
//
// Same studio, same restraint, same rules as the lockup film: no bounce, every
// ease a settle, red as the only colour, hairlines rather than boxes, both
// marks used as supplied. A viewer seeing this next to the offer film should
// read them as one campaign, and a partner reviewing both should not have to
// make the handling argument twice. See StaplesLockupAd.css for the reasoning
// those rules come from — it is not repeated here.
import React from "react";
import "../Stylesheets/TechTalkAd.css";

// The same two marks the lockup film uses, and for the same reason: this is
// the Staples art with the real on-screen red (226,33,28), not the duller
// CMYK-converted version out of the print PDF, and the Code Ninjas logo as
// vector so there is no size at which it softens.
import staplesLogo from "../Images/staples-easy-logo.png";
import cnLogo from "../Images/cn-logo-horizontal.svg";

// Every string a viewer has to act on, in one place. The address is written
// the way it is on the door, not abbreviated to fit — somebody is typing this
// into a maps app.
const TALK = {
  eyebrow: "Tech talk",
  title: ["Becoming", "the ultimate", "AI game dev"],
  // The weekday is doing real work: "August 19" alone makes a reader go and
  // check what day that is, and the ones who don't check are the ones who
  // don't come.
  day: "Wednesday, August 19",
  time: "1:00 PM",
  venue: "Staples",
  street: "517 Richmond St. E",
  city: "Toronto, ON M5A 1R4",
  by: "Presented by Code Ninjas",
};

// One cascade, not a step machine. The lockup film steps through beats because
// its beats REPLACE each other; here every line is additive and permanent, so
// the choreography is just a set of delays and lives in the stylesheet next to
// the durations it has to stay in sync with. The component's only job is to
// start it.
export default function TechTalkAd() {
  const reduce = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Mount paints the empty studio; the class arrives on the next frame and the
  // cascade runs. Without the gap the animations are already partway through
  // by the time the first frame is composited, and the film opens mid-move.
  const [go, setGo] = React.useState(false);
  React.useEffect(() => {
    if (reduce) return undefined;
    const r = requestAnimationFrame(() => setGo(true));
    return () => cancelAnimationFrame(r);
  }, [reduce]);

  return (
    <div className={`tt-stage${go ? " tt-go" : ""}${reduce ? " tt-still" : ""}`}>
      <div className="tt-key" aria-hidden />
      <div className="tt-floor" aria-hidden />

      <div className="tt-card">
        {/* The lockup sits ABOVE the headline, small. It is the credential on
            the notice, not the subject of it — whose talk this is and whose
            room it is in, answered before the reader gets to the title and
            then out of the way. Assembled from the same measurements as the
            offer card's lockup; see TechTalkAd.css. */}
        <div className="tt-lockup">
          <img className="tt-lockup-s" src={staplesLogo} alt="Staples" />
          <span className="tt-lockup-bar" aria-hidden />
          <img className="tt-lockup-c" src={cnLogo} alt="Code Ninjas" />
        </div>

        <div className="tt-eyebrow">
          <span>{TALK.eyebrow}</span>
          {/* Draws out from the centre, once the word is already there. */}
          <i className="tt-rule" aria-hidden />
        </div>

        {/* The subject. Three lines, stacked, each rising on the one before
            it — a headline that arrives all at once is a graphic, one that
            arrives a line at a time is read. */}
        <h1 className="tt-title">
          {TALK.title.map((line, i) => (
            <span key={line} style={{ "--i": i }}>
              {line}
            </span>
          ))}
        </h1>

        <span className="tt-hair" aria-hidden />

        {/* WHEN, at the largest size anything that is not the title gets. This
            is the single fact the film exists to deliver. */}
        <div className="tt-when">
          <span className="tt-day">{TALK.day}</span>
          <span className="tt-time">{TALK.time}</span>
        </div>

        {/* WHERE. The store name leads, because that is what a reader
            recognises from the street; the address is underneath it for the
            maps app. */}
        <div className="tt-where">
          <span className="tt-venue">{TALK.venue}</span>
          <span>{TALK.street}</span>
          <span>{TALK.city}</span>
        </div>

        <div className="tt-by">{TALK.by}</div>
      </div>

      <div className="tt-grain" aria-hidden />
      <div className="tt-vignette" aria-hidden />
    </div>
  );
}
