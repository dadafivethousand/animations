// WoodbridgeSummerAd.jsx — Code Ninjas Woodbridge summer-camp ad.
// Premium sequenced reveal on a clean white stage (~80% body width):
//   1) logo lands cinematically (scale/blur clear + light-sweep masked to
//      the logo silhouette)
//   2) "Woodbridge" types out fast, left→right, right-aligned under the logo
//   3) the 6 camp tracks spring in as glass cards + a confetti burst
//   4) holographic promo ticket (20% OFF · 26SUMMER) + contact chips reveal
// Self-contained.
import React, { useEffect, useState } from "react";
import "../Stylesheets/WoodbridgeSummerAd.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";

const WORD = "Woodbridge";

// Camp tracks — each gets its own accent gradient + emoji glyph.
const TRACKS = [
  { key: "chess",     label: "Chess",     sub: "Think & strategize", glyph: "♟️", c1: "#8b5cf6", c2: "#6366f1" },
  { key: "minecraft", label: "Minecraft", sub: "Build & mod worlds",  glyph: "⛏️", c1: "#22c55e", c2: "#15803d" },
  { key: "roblox",    label: "Roblox",    sub: "Make your own games", glyph: "🎮", c1: "#ff4d5e", c2: "#e11d48" },
  { key: "robotics",  label: "Robotics",  sub: "Build smart robots",  glyph: "🤖", c1: "#22d3ee", c2: "#0891b2" },
  { key: "coding",    label: "Coding",    sub: "Write real code",     glyph: "💻", c1: "#38bdf8", c2: "#2563eb" },
  { key: "ai",        label: "AI",        sub: "Create with AI",      glyph: "🧠", c1: "#f472b6", c2: "#c026d3" },
];

// faint floating code symbols behind everything (keeps the bg alive but clean)
const PARTICLES = ["</>", "{ }", "01", "()", "<>", "AI", "#", "//", "[]", "*"].map(
  (t, i) => ({
    t,
    x: (i * 37 + 6) % 96,
    dur: 12 + (i % 5) * 2.6,
    delay: -((i * 1.9) % 13),
    size: 1.5 + (i % 4) * 0.7,
    c: TRACKS[i % TRACKS.length].c1,
  })
);

// celebratory confetti that bursts when the tracks land (deterministic)
const CONFETTI = Array.from({ length: 52 }, (_, i) => {
  const c = TRACKS[i % TRACKS.length];
  return {
    left: (i * 1.93 + ((i * i) % 11)) % 100,
    delay: 0.35 + (i % 12) * 0.03,
    dur: 1.5 + (i % 7) * 0.22,
    size: 6 + (i % 4) * 3,
    dx: ((i % 2 ? 1 : -1) * (8 + (i % 6) * 9)),
    rot: (i * 57) % 360 + 540,
    color: i % 2 ? c.c1 : c.c2,
    round: i % 3 === 0,
  };
});

export default function WoodbridgeSummerAd() {
  // phase: 0 logo · 1 typing · 2 tracks · 3 promo/contact
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState(0);

  // logo lands, then start typing
  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 780);
    return () => clearTimeout(t);
  }, []);

  // fast typewriter for "Woodbridge"
  useEffect(() => {
    if (phase < 1) return;
    if (typed >= WORD.length) {
      const t = setTimeout(() => setPhase((p) => (p < 2 ? 2 : p)), 320);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTyped((v) => v + 1), 62);
    return () => clearTimeout(t);
  }, [phase, typed]);

  // tracks finish springing in, then reveal promo + contact
  useEffect(() => {
    if (phase !== 2) return;
    const t = setTimeout(() => setPhase(3), 1250);
    return () => clearTimeout(t);
  }, [phase]);

  const maskStyle = { WebkitMaskImage: `url(${cnLogo})`, maskImage: `url(${cnLogo})` };

  return (
    <div className="wb-stage">
      <div className="wb-aurora" aria-hidden />
      <div className="wb-particles" aria-hidden>
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            style={{
              left: `${p.x}%`, color: p.c, fontSize: `${p.size}rem`,
              animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
            }}
          >
            {p.t}
          </span>
        ))}
      </div>

      <div className="wb-body">
        {/* HUD corner brackets */}
        <div className="wb-hud" aria-hidden><i /><i /><i /><i /></div>

        {/* 1) logo + light sweep masked to its silhouette */}
        <div className="wb-logo-wrap">
          <img className="wb-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
          <span className="wb-logo-shine" style={maskStyle} aria-hidden />
        </div>

        {/* 2) typewriter word — right-aligned under the logo, types left→right */}
        <div className={`wb-word ${phase >= 1 ? "is-on" : ""} ${typed >= WORD.length ? "is-done" : ""}`}>
          <span className="wb-word-inner">
            <span className="wb-word-sizer" aria-hidden>{WORD}</span>
            <span className="wb-word-text">{WORD.slice(0, typed)}</span>
            <span className="wb-word-underline" aria-hidden />
          </span>
        </div>

        <div className={`wb-kicker ${phase >= 2 ? "is-in" : ""}`}>
          <span>★</span>&nbsp;SUMMER CAMP&nbsp;·&nbsp;NOW ENROLLING&nbsp;<span>★</span>
        </div>

        {/* 3) camp tracks + confetti burst */}
        <div className={`wb-tracks ${phase >= 2 ? "is-in" : ""}`}>
          <div className="wb-confetti" aria-hidden>
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className={c.round ? "is-round" : ""}
                style={{
                  left: `${c.left}%`, width: `${c.size}px`, height: `${c.size * (c.round ? 1 : 1.6)}px`,
                  background: c.color, animationDelay: `${c.delay}s`, animationDuration: `${c.dur}s`,
                  "--dx": `${c.dx}px`, "--r": `${c.rot}deg`,
                }}
              />
            ))}
          </div>
          {TRACKS.map((t, i) => (
            <div
              key={t.key}
              className="wb-track"
              style={{ "--c1": t.c1, "--c2": t.c2, "--i": i }}
            >
              <span className="wb-track-glow" aria-hidden />
              <span className="wb-track-icon"><span className="wb-track-ring" aria-hidden />{t.glyph}</span>
              <span className="wb-track-text">
                <span className="wb-track-label">{t.label}</span>
                <span className="wb-track-sub">{t.sub}</span>
              </span>
            </div>
          ))}
        </div>

        {/* 4) promo ticket + contact */}
        <div className={`wb-reveal ${phase >= 3 ? "is-in" : ""}`}>
          <div className="wb-coupon">
            <div className="wb-coupon-holo" aria-hidden />
            <div className="wb-coupon-shine" aria-hidden />
            <div className="wb-coupon-left">
              <span className="wb-coupon-num">20<span className="wb-coupon-pct">%</span></span>
              <span className="wb-coupon-off">OFF</span>
            </div>
            <div className="wb-coupon-right">
              <span className="wb-coupon-lbl">USE PROMO CODE</span>
              <span className="wb-coupon-code">26SUMMER</span>
            </div>
          </div>

          <div className="wb-contact">
            <span className="wb-chip"><b>📍</b> 6175 Hwy 7</span>
            <span className="wb-chip"><b>📞</b> (647) 887-9940</span>
            <span className="wb-chip wb-web"><b>🌐</b> cnwoodbridge.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
