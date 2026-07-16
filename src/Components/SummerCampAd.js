// SummerCampAd.jsx — Code Ninjas Woodbridge summer-camp one-page ad.
// Self-contained poster (4:5) that scales to any screen via container units.
// Graphics: radial "summer sun" burst, floating code particles, animated
// shine sweep on the coupon, staggered card pop-in, leaping ninja.
import React from "react";
import "../Stylesheets/SummerCampAd.css";
import cnLogo from "../Images/cn-wb-logo-2025.png";
import ninja from "../Images/ninja-leap.png";

// Camp tracks — each gets its own accent gradient + emoji glyph.
const TRACKS = [
  { key: "chess",    label: "Chess",     glyph: "♟️", c1: "#8b5cf6", c2: "#6366f1" },
  { key: "minecraft",label: "Minecraft", glyph: "⛏️", c1: "#22c55e", c2: "#15803d" },
  { key: "roblox",   label: "Roblox",    glyph: "🎮", c1: "#ff4d5e", c2: "#e11d48" },
  { key: "robotics", label: "Robotics",  glyph: "🤖", c1: "#22d3ee", c2: "#0891b2" },
  { key: "coding",   label: "Coding",    glyph: "💻", c1: "#38bdf8", c2: "#2563eb" },
  { key: "ai",       label: "AI",        glyph: "🧠", c1: "#f472b6", c2: "#c026d3" },
];

// floating code-symbol particles
const PARTICLES = ["</>", "{ }", "01", "#", "()", "<>", "AI", "01", "*", "//"].map(
  (t, i) => ({
    t,
    x: (i * 41 + 8) % 96,
    dur: 9 + (i % 5) * 2.4,
    delay: -((i * 1.7) % 11),
    size: 2.4 + (i % 4) * 0.9,
  })
);

export default function SummerCampAd() {
  return (
    <div className="sc-stage">
      <div className="sc-poster">
        {/* ---------- ambient graphics ---------- */}
        <div className="sc-sun" aria-hidden />
        <div className="sc-rays" aria-hidden />
        <div className="sc-grid" aria-hidden />
        <div className="sc-particles" aria-hidden>
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              style={{
                left: `${p.x}%`,
                fontSize: `${p.size}cqw`,
                animationDuration: `${p.dur}s`,
                animationDelay: `${p.delay}s`,
              }}
            >
              {p.t}
            </span>
          ))}
        </div>

        {/* ---------- top bar ---------- */}
        <header className="sc-top">
          <img className="sc-logo" src={cnLogo} alt="Code Ninjas Woodbridge" />
        </header>

        {/* ---------- hero ---------- */}
        <div className="sc-hero">
          <div className="sc-kicker">
            <span className="sc-spark">★</span> NOW ENROLLING <span className="sc-spark">★</span>
          </div>
          <h1 className="sc-title">
            <span className="sc-title-a">SUMMER</span>
            <span className="sc-title-b">CAMPS</span>
          </h1>
          <p className="sc-tagline">Build&nbsp;·&nbsp;Code&nbsp;·&nbsp;Play — all summer long</p>
          <img className="sc-ninja" src={ninja} alt="" aria-hidden />
        </div>

        {/* ---------- coupon ---------- */}
        <div className="sc-coupon">
          <div className="sc-coupon-shine" aria-hidden />
          <div className="sc-coupon-left">
            <span className="sc-coupon-num">20<span className="sc-coupon-pct">%</span></span>
            <span className="sc-coupon-off">OFF</span>
          </div>
          <div className="sc-coupon-right">
            <span className="sc-coupon-lbl">USE CODE</span>
            <span className="sc-coupon-code">26SUMMER</span>
          </div>
        </div>

        {/* ---------- tracks ---------- */}
        <div className="sc-tracks">
          {TRACKS.map((t, i) => (
            <div
              key={t.key}
              className="sc-track"
              style={{
                "--c1": t.c1,
                "--c2": t.c2,
                animationDelay: `${0.15 * i + 0.4}s`,
              }}
            >
              <span className="sc-track-icon">{t.glyph}</span>
              <span className="sc-track-label">{t.label}</span>
            </div>
          ))}
        </div>

        {/* ---------- footer / CTA ---------- */}
        <footer className="sc-foot">
          <div className="sc-foot-cta">
            <span className="sc-foot-lbl">REGISTER AT</span>
            <span className="sc-foot-web">cnwoodbridge.com</span>
          </div>
          <div className="sc-foot-meta">
            <span className="sc-foot-item"><b>📍</b>6175 Hwy 7</span>
            <span className="sc-foot-dot" />
            <span className="sc-foot-item"><b>📞</b>647-887-9940</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
