// FilmstripScene.jsx — hybrid ad unit: a branded, themed stage wrapping REAL
// photos that scroll past on two counter-moving film strips (with sprocket
// holes + a slow Ken-Burns zoom on each frame). The animation/brand framing is
// CSS; the proof is your real photos. Portrait / mobile only.
//
// THEME per topic (chess here) — duplicate this file & swap THEME + PHOTOS to
// make coding/robotics/etc. versions.  Drop real photos into src/Images and
// replace the imports below with your own (portrait shots look best).
import React from "react";
import "../Stylesheets/FilmstripScene.css";

// --- PLACEHOLDER photos (swap for real chess-club shots) ---------------------
import p1 from "../Images/kids.jpeg";
import p2 from "../Images/IMG_4224.jpg";
import p3 from "../Images/Jess.jpg";
import p4 from "../Images/carter3.jpg";
import p5 from "../Images/ChaberskiJ.jpeg";

const THEME = {
  kicker: "CODE NINJAS · WOODBRIDGE",
  title: "CHESS CLUB",
  tagline: "Real games. Real focus.",
  ctaMain: "Book a FREE session",
  ctaSub: "cnwoodbridge.com",
};

// two strips, each its own set (repeat/mix your real photos here)
const STRIP_A = [p1, p2, p3, p4, p5];
const STRIP_B = [p3, p5, p1, p4, p2];

const Cell = ({ src, i }) => (
  <div className="fs-cell">
    {/* alternate the ken-burns direction so the strip feels alive */}
    <img src={src} alt="" className={i % 2 ? "kb-b" : "kb-a"} />
  </div>
);

const Strip = ({ photos, variant }) => {
  const loop = [...photos, ...photos]; // duplicate for a seamless scroll
  return (
    <div className={`fs-strip fs-${variant}`}>
      <div className="fs-track">
        {loop.map((src, i) => <Cell key={i} src={src} i={i} />)}
      </div>
    </div>
  );
};

export default function FilmstripScene() {
  return (
    <div className="fs-stage">
      <div className="fs-checker" aria-hidden />
      <div className="fs-glow" aria-hidden />

      <div className="fs-head">
        <span className="fs-kicker">{THEME.kicker}</span>
        <span className="fs-title">{THEME.title}</span>
        <span className="fs-tagline">{THEME.tagline}</span>
      </div>

      <div className="fs-reels">
        <Strip photos={STRIP_A} variant="a" />
        <Strip photos={STRIP_B} variant="b" />
      </div>

      <div className="fs-cta">
        <span className="fs-cta-main">{THEME.ctaMain.split("FREE")[0]}<b>FREE</b>{THEME.ctaMain.split("FREE")[1]}</span>
        <span className="fs-cta-sub">{THEME.ctaSub}</span>
      </div>
    </div>
  );
}
