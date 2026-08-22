// OpenHouseAd.js — the Code Ninjas Woodbridge open house, animated.
//
// PORTED FROM ../poster's OpenHouse. A COPY, NOT A REWRITE. That sheet is the
// design; this file is it plus the hooks a cascade needs. If the poster
// changes, copy it over again and re-apply the deltas below — a fix made only
// here is a fix the poster loses.
//
// ── WHAT THE PORT ADDS, AND NOTHING ELSE ──
//
//   1. `.oh-frame`, the query container the poster's `--px` is a thousandth
//      of. It stands in for the poster repo's <Frame>.
//   2. `.oh-push` / `.oh-shake`, two camera wrappers. A CSS transform REPLACES
//      a transform, so the slow dolly and the impact shake cannot live on the
//      same element — they are separate boxes, each with one job.
//   3. `go`, one class flipped on the first frame after mount, which every
//      animation in the stylesheet keys off. All the motion is CSS.
//   4. Confetti carries its angle as `--rot` instead of an inline transform,
//      so a keyframe can restate the rotation instead of destroying it.
//
// Everything else — the markup, the props, the copy, the slot system — is the
// poster's, unchanged.
import React from "react";
import "../Stylesheets/OpenHouseAd.css";
import cnLogo from "../Images/cn-logo-horizontal.svg";
import ninjaFigure from "../Images/cn-ninja-figure.png";
import qrCode from "../Images/qr-cnwoodbridge.svg";
import FALLBACKS from "./OpenHouseIcons";

/**
 * A supplied image, else a drawn fallback, else reserved space.
 *
 * The fallback is what stops an unfilled poster reading as a wireframe. It is
 * a floor and not a decision — pass a src for that slot and it is gone.
 */
function Slot({ src, name, className = "", alt = "", pass }) {
  if (src) return <img className={`oh-slot ${className}`} src={src} alt={alt} />;
  const Fallback = FALLBACKS[name];
  if (Fallback) {
    return (
      <span className={`oh-slot oh-slot--drawn ${className}`} aria-hidden>
        <Fallback {...pass} />
      </span>
    );
  }
  return <span className={`oh-slot oh-slot--empty ${className}`} aria-hidden />;
}

export default function OpenHouseAd({
  script = ["Turn", "Screen Time", "into", "Skill Time!"],
  burst = ["FUN FOR", "KIDS 5–14", "& FAMILIES!"],
  title = ["OPEN", "HOUSE!"],
  banner = ["COME EXPLORE. PLAY.", "WIN!"],

  // ONE STRING, so nobody can update the weekday and leave the number.
  // AUGUST 30 2026 IS A SUNDAY. If the event is in fact on the SATURDAY it is
  // Aug 29, not Aug 30: change both halves of this string and `dateNum`.
  date = "SUN, AUG 30",
  dateNum = "30",
  time = "1:00 PM",

  tabs = [
    { key: "games", tone: "violet", title: "GAMES", line: "Play & explore" },
    { key: "prizes", tone: "green", title: "PRIZES", line: "All afternoon" },
    { key: "chess", tone: "blue", title: "CHESS", line: "Tournament" },
    { key: "giveaways", tone: "orange", title: "GIVEAWAYS", line: "For everyone" },
    { key: "more", tone: "yellow", title: "AND MORE", line: "Come and see" },
  ],

  programs = [
    { key: "coding", title: "CODING", line: "Build cool\nprojects!" },
    { key: "minecraft", title: "MINECRAFT®", line: "Create &\nExplore Worlds!" },
    { key: "roblox", title: "ROBLOX®", line: "Design games\n& adventure!" },
    { key: "printing", title: "3D PRINTING", line: "See ideas come\nto life!" },
  ],

  checks = ["MEET THE TEAM", "TOUR THE CENTRE", "SEE OUR PROGRAMS"],

  centre = "CODE NINJAS WOODBRIDGE",
  address = "6175 Hwy 7, Woodbridge, ON",
  plaza = "",
  phone = "647-887-9940",

  art = {},
}) {
  const a = { logo: cnLogo, mascot: ninjaFigure, qr: qrCode, ...art };

  const reduce = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Mount paints the field; the class lands on the next frame so the ad opens
  // ON its first move rather than partway through it.
  const [go, setGo] = React.useState(false);
  React.useEffect(() => {
    if (reduce) return undefined;
    const r = requestAnimationFrame(() => setGo(true));
    return () => cancelAnimationFrame(r);
  }, [reduce]);

  return (
    <div className="oh-frame">
      <div className={`oh-stage oh${go ? " oh-go" : ""}${reduce ? " oh-still" : ""}`}>
        {/* The dolly. One slow move across the whole run, on its own box. */}
        <div className="oh-push">
          {/* The impact. Fires once, when HOUSE! lands. */}
          <div className="oh-shake">

            <div className="oh-field" aria-hidden />
            <Confetti />

            {/* ---------- top band ---------- */}
            <div className="oh-sheet" aria-hidden />

            <p className="oh-script">
              {script.map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </p>

            <img className="oh-logo" src={a.logo} alt="Code Ninjas" />
            <p className="oh-centre-name">WOODBRIDGE</p>

            <div className="oh-burst">
              <span>
                {burst.map((l, i) => (
                  <b key={i}>{l}</b>
                ))}
              </span>
            </div>

            {/* ---------- headline ---------- */}
            <h1 className="oh-title">
              <span className="oh-title-a">{title[0]}</span>
              <span className="oh-title-b">{title[1]}</span>
            </h1>

            {/* THE POOL IS NOT DECORATION. The mascot artwork is a near-black
                figure with a thin cyan rim, and on this navy field his body and
                legs simply disappear. A blurred pool of light behind him
                separates the silhouette without touching the artwork. */}
            <span className="oh-mascot-pool" aria-hidden />
            <Slot src={a.mascot} name="mascot" className="oh-mascot" />

            <p className="oh-banner">
              {banner[0]} <b>{banner[1]}</b>
            </p>

            {/* ---------- when ---------- */}
            <div className="oh-when">
              <Slot src={a.calendar} name="calendar" className="oh-when-icon"
                    pass={{ day: dateNum }} />
              <span className="oh-when-date">{date}</span>
              <Slot src={a.clock} name="clock" className="oh-when-icon" />
              <span className="oh-when-time">{time}</span>
            </div>

            {/* ---------- right-hand tabs ---------- */}
            <div className="oh-tabs">
              {tabs.map((t) => (
                <div className={`oh-tab oh-tab--${t.tone}`} key={t.key}>
                  <Slot src={a[t.key]} name={t.key} className="oh-tab-icon" />
                  <span className="oh-tab-text">
                    <b>{lines(t.title)}</b>
                    <i>{lines(t.line)}</i>
                  </span>
                </div>
              ))}
            </div>

            {/* ---------- programs ---------- */}
            <div className="oh-programs">
              {programs.map((p) => (
                <div className="oh-program" key={p.key}>
                  <Slot src={a[p.key]} name={p.key} className="oh-program-icon" />
                  <b>{p.title}</b>
                  <i>{lines(p.line)}</i>
                </div>
              ))}
            </div>

            {/* ---------- checks ---------- */}
            <div className="oh-checks">
              {checks.map((c) => (
                <span key={c}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"
                       strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m4 13 5.5 5.5L20 6" />
                  </svg>
                  {c}
                </span>
              ))}
            </div>

            {/* ---------- footer ---------- */}
            <div className="oh-foot">
              <Slot src={a.pin} name="pin" className="oh-foot-icon" />
              <span className="oh-foot-addr">
                <b>{centre}</b>
                <i>{address}</i>
                {plaza ? <em>{plaza}</em> : null}
              </span>

              <span className="oh-foot-rule" aria-hidden />

              <Slot src={a.phone} name="phone" className="oh-foot-icon" />
              <span className="oh-foot-tel">{phone}</span>

              <span className="oh-qr">
                <b>SCAN ME!</b>
                <Slot src={a.qr} name="QR" className="oh-qr-img" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** "A\nB" → A<br/>B, so a tab or a program can carry two lines from one prop. */
function lines(text) {
  return String(text)
    .split("\n")
    .map((l, i, all) => (
      <React.Fragment key={i}>
        {l}
        {i < all.length - 1 && <br />}
      </React.Fragment>
    ));
}

/* Paper confetti, distributed down the whole 9:16 frame and kept out of three
 * places: the handwritten note, the starburst, and the type inside the white
 * slab. Fixed rather than random so the export is identical run to run — a
 * render that differs between takes cannot be checked against anything.
 *
 * THE ANGLE IS A CUSTOM PROPERTY, NOT A TRANSFORM. The poster set
 * `transform: rotate(Ndeg)` inline, which an entrance keyframe would wipe out;
 * as `--rot` the keyframes restate it and the piece both falls and spins. */
const CONFETTI = [
  [21, 1, 19, 9, 12, "#f9d81d"], [31, 6, 15, 15, -34, "#4ea936"],
  [43, 2, 17, 8, 22, "#0172ec"], [55, 5, 13, 13, -40, "#e4002b"],
  [66, 1, 20, 10, 16, "#ef7c18"], [74, 7, 15, 15, 30, "#7a2bbd"],
  [88, 6, 17, 8, 44, "#4ea936"], [95, 11, 14, 14, -20, "#0172ec"],
  [3, 4, 16, 8, -18, "#7a2bbd"], [11, 9, 13, 13, 34, "#ef7c18"],
  [2, 19, 18, 9, 26, "#f9d81d"], [97, 19, 15, 7, -30, "#e4002b"],
  [2, 30, 14, 14, 14, "#4ea936"], [96, 33, 17, 8, -24, "#f9d81d"],
  [4, 44, 13, 13, 40, "#7a2bbd"], [95, 47, 16, 8, 18, "#0172ec"],
  [1, 57, 15, 7, -36, "#ef7c18"], [97, 60, 13, 13, 22, "#4ea936"],
  [6, 82, 17, 8, -14, "#0172ec"], [92, 85, 14, 14, 32, "#f9d81d"],
  [24, 90, 15, 7, 20, "#7a2bbd"], [70, 93, 16, 8, -26, "#4ea936"],
  [47, 88, 13, 13, 38, "#ef7c18"], [83, 96, 15, 7, -18, "#0172ec"],
];

function Confetti() {
  return (
    <div className="oh-confetti" aria-hidden>
      {CONFETTI.map(([x, y, w, h, rot, c], i) => (
        <span
          key={i}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `calc(${w} * var(--px))`,
            height: `calc(${h} * var(--px))`,
            background: c,
            "--rot": `${rot}deg`,
            // The fall and the drift are both staggered off the index, so the
            // field never pulses in unison.
            "--i": i,
          }}
        />
      ))}
    </div>
  );
}
