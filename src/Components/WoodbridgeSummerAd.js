// WoodbridgeSummerAd.jsx — Code Ninjas Woodbridge summer-camp ad.
// Clean white background. Sequenced reveal:
//   1) the logo drops in alone
//   2) "Woodbridge" is typed out underneath (typewriter + caret)
//   3) the 6 camp tracks (Chess/Minecraft/Roblox/Robotics/Coding/AI) flip in
//   4) the promo coupon (20% OFF · 26SUMMER) + contact info slide up
// Body is ~80% of the screen width. Self-contained.
import React, { useEffect, useState } from "react";
import "../Stylesheets/WoodbridgeSummerAd.css";
import cnLogo from "../Images/cn-woodbridge-logo.png";

const WORD = "Woodbridge";

// Camp tracks — each gets its own accent gradient + emoji glyph.
const TRACKS = [
  { key: "chess",     label: "Chess",     glyph: "♟️", c1: "#8b5cf6", c2: "#6366f1" },
  { key: "minecraft", label: "Minecraft", glyph: "⛏️", c1: "#22c55e", c2: "#15803d" },
  { key: "roblox",    label: "Roblox",    glyph: "🎮", c1: "#ff4d5e", c2: "#e11d48" },
  { key: "robotics",  label: "Robotics",  glyph: "🤖", c1: "#22d3ee", c2: "#0891b2" },
  { key: "coding",    label: "Coding",    glyph: "💻", c1: "#38bdf8", c2: "#2563eb" },
  { key: "ai",        label: "AI",        glyph: "🧠", c1: "#f472b6", c2: "#c026d3" },
];

// faint floating code symbols behind everything (keeps the bg alive but clean)
const PARTICLES = ["</>", "{ }", "01", "()", "<>", "AI", "#", "//", "[]", "*"].map(
  (t, i) => ({
    t,
    x: (i * 37 + 6) % 96,
    dur: 11 + (i % 5) * 2.6,
    delay: -((i * 1.9) % 13),
    size: 1.6 + (i % 4) * 0.7,
    c: TRACKS[i % TRACKS.length].c1,
  })
);

export default function WoodbridgeSummerAd() {
  // phase: 0 logo · 1 typing · 2 tracks · 3 promo/contact
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState(0);

  // logo lands, then start typing
  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 950);
    return () => clearTimeout(t);
  }, []);

  // typewriter for "Woodbridge"
  useEffect(() => {
    if (phase < 1) return;
    if (typed >= WORD.length) {
      const t = setTimeout(() => setPhase((p) => (p < 2 ? 2 : p)), 550);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTyped((v) => v + 1), 145);
    return () => clearTimeout(t);
  }, [phase, typed]);

  // tracks finish flipping in, then reveal promo + contact
  useEffect(() => {
    if (phase !== 2) return;
    const t = setTimeout(() => setPhase(3), 1600);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className="wb-stage">
      {/* ambient */}
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

      {/* one-time scanline sweep on boot */}
      <div className="wb-scan" aria-hidden />

      <div className="wb-body">
        {/* HUD corner brackets */}
        <div className="wb-hud" aria-hidden><i /><i /><i /><i /></div>

        {/* 1) logo */}
        <img className="wb-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />

        {/* 2) typewriter word */}
        <div className={`wb-word ${phase >= 1 ? "is-on" : ""} ${phase >= 2 ? "is-glitch" : ""}`}>
          <span className="wb-word-text" data-text={WORD.slice(0, typed)}>{WORD.slice(0, typed)}</span>
          <span className={`wb-caret ${phase >= 2 ? "is-done" : ""}`} aria-hidden />
        </div>

        <div className={`wb-kicker ${phase >= 2 ? "is-in" : ""}`}>
          <span>★</span>&nbsp;SUMMER CAMP&nbsp;·&nbsp;NOW ENROLLING&nbsp;<span>★</span>
        </div>

        {/* 3) camp tracks */}
        <div className={`wb-tracks ${phase >= 2 ? "is-in" : ""}`}>
          {TRACKS.map((t, i) => (
            <div
              key={t.key}
              className="wb-track"
              style={{ "--c1": t.c1, "--c2": t.c2, "--i": i }}
            >
              <span className="wb-track-icon">{t.glyph}</span>
              <span className="wb-track-label">{t.label}</span>
            </div>
          ))}
        </div>

        {/* 4) promo + contact */}
        <div className={`wb-reveal ${phase >= 3 ? "is-in" : ""}`}>
          <div className="wb-coupon">
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
            <span className="wb-contact-item"><b>📍</b> 6175 Hwy 7</span>
            <span className="wb-dot" />
            <span className="wb-contact-item"><b>📞</b> (647) 887-9940</span>
            <span className="wb-dot" />
            <span className="wb-contact-item wb-web"><b>🌐</b> cnwoodbridge.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
