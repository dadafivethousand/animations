// ScreenTimeSplit.jsx — Code Ninjas Woodbridge.
// The parent screen-time reframe: SAME kid, SAME screen time, two futures.
//   LEFT  — a phone doom-scrolling junk, the kid slumped, red -XP draining away.
//   RIGHT — the SAME kid, switched on, a phone scrolling live code that builds a
//           game, green +XP rising, a little ninja running the level they made.
// Both phone "feeds" scroll continuously, so the whole thing loops with no seam.
// PORTRAIT / iPhone-first. Pure CSS keyframes (see the CSS); no JS timers.
import React from "react";
import "../Stylesheets/ScreenTimeSplit.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";

// the same ninja-kid on both sides — only posture/energy differ (mood class)
const Kid = ({ mood }) => (
  <svg className={`st-kid st-kid--${mood}`} viewBox="0 0 80 90" aria-hidden>
    <ellipse cx="40" cy="84" rx="20" ry="5" fill="rgba(0,0,0,.28)" />
    <g className="st-kid-body">
      {/* legs */}
      <rect x="30" y="60" width="8" height="18" rx="4" fill="#141b25" />
      <rect x="42" y="60" width="8" height="18" rx="4" fill="#141b25" />
      {/* arms */}
      <rect x="18" y="40" width="8" height="20" rx="4" fill="#1b2430" />
      <rect x="54" y="40" width="8" height="20" rx="4" fill="#1b2430" />
      {/* torso */}
      <rect x="24" y="36" width="32" height="30" rx="12" fill="#1b2430" />
      {/* head */}
      <circle cx="40" cy="24" r="16" fill="#1b2430" />
      {/* headband */}
      <rect x="23" y="18" width="34" height="10" rx="2.5" className="st-band" />
      <path d="M56 20 L72 15 L69 26 Z" className="st-band" />
      <path d="M56 24 L73 27 L68 33 Z" className="st-band st-band--dk" />
      {/* eyes */}
      <rect x="30" y="21" width="8" height="5" rx="1.5" fill="#fff" />
      <rect x="42" y="21" width="8" height="5" rx="1.5" fill="#fff" />
      <circle className="st-pupil" cx="34" cy="24" r="1.6" fill="#141b25" />
      <circle className="st-pupil" cx="46" cy="24" r="1.6" fill="#141b25" />
    </g>
  </svg>
);

// junk cards for the doom-scroll feed (abstract, not real content)
const JUNK = ["▶", "🤪", "▶", "😵", "▶", "🔁"];
// code lines for the build feed
const CODE = ["game.hero()", "onJump(() => fly())", "spawn(coin)", "level.win() ✓", "ship('my-game')", "player.score++"];

export default function ScreenTimeSplit() {
  return (
    <div className="st-stage">
      <div className="st-over">
        SAME&nbsp;KID · SAME&nbsp;SCREEN&nbsp;TIME · <b>DIFFERENT&nbsp;FUTURE</b>
      </div>

      <div className="st-split">
        {/* ---------------- LEFT: just scrolling ---------------- */}
        <div className="st-col st-col--bad">
          <div className="st-label st-label--bad">JUST&nbsp;SCROLLING</div>

          <div className="st-phone st-phone--bad">
            <div className="st-notch" />
            <div className="st-feed st-feed--junk">
              {[...JUNK, ...JUNK].map((g, i) => (
                <div className="st-card st-card--junk" key={i}>
                  <span className="st-card-play">{g}</span>
                  <span className="st-card-bar" />
                </div>
              ))}
            </div>
          </div>

          {/* draining energy */}
          <span className="st-xp st-xp--bad" style={{ "--d": "0s", left: "18%" }}>-1</span>
          <span className="st-xp st-xp--bad" style={{ "--d": "1.1s", left: "58%" }}>-1</span>
          <span className="st-xp st-xp--bad" style={{ "--d": "2.2s", left: "38%" }}>💤</span>

          <Kid mood="slump" />
          <div className="st-chip st-chip--bad">⏳ hours gone</div>
        </div>

        <div className="st-vs">VS</div>

        {/* ---------------- RIGHT: building it ---------------- */}
        <div className="st-col st-col--good">
          <div className="st-label st-label--good">BUILDING&nbsp;IT</div>

          <div className="st-phone st-phone--good">
            <div className="st-notch" />
            <div className="st-feed st-feed--code">
              {[...CODE, ...CODE].map((t, i) => (
                <div className="st-codeline" key={i}>
                  <span className="st-cl-n">{(i % CODE.length) + 1}</span>
                  <code>{t}</code>
                </div>
              ))}
            </div>
            {/* mini game preview the kid "made" — ninja runs, coin spins */}
            <svg className="st-mini" viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden>
              <rect x="0" y="30" width="120" height="10" fill="#3ddc84" />
              <g className="st-mini-coin">
                <circle cx="92" cy="18" r="5" fill="#ffcf3f" stroke="#e0a200" strokeWidth="1.5" />
              </g>
              <g className="st-mini-ninja">
                <rect x="-4" y="-10" width="12" height="12" rx="4" fill="#1b2430" />
                <rect x="-5" y="-14" width="14" height="5" rx="1.5" fill="#e4002b" />
              </g>
            </svg>
          </div>

          {/* gaining skills */}
          <span className="st-xp st-xp--good" style={{ "--d": "0.4s", left: "24%" }}>+1</span>
          <span className="st-xp st-xp--good" style={{ "--d": "1.5s", left: "64%" }}>+1</span>
          <span className="st-xp st-xp--good" style={{ "--d": "2.6s", left: "44%" }}>⚡</span>

          <Kid mood="up" />
          <div className="st-chip st-chip--good">🏆 games shipped</div>
        </div>
      </div>

      <div className="st-tagline">
        One just scrolls. <b>One builds the future.</b>
      </div>

      <footer className="st-foot">
        <img className="st-foot-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
        <div className="st-foot-rows">
          <span className="st-foot-row">Code Ninjas Woodbridge · 647-887-9940</span>
          <span className="st-foot-row st-foot-web">cnwoodbridge.com</span>
        </div>
      </footer>
    </div>
  );
}
