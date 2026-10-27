// MapleThreeThousandAd.js — Maple Jiu Jitsu hits 3,000 Instagram followers,
// told as a stock chart. $MAPLE's "price" is the follower count: a line
// climbs (with a couple of realistic pullbacks) while the quote ticks along
// with its tip, breaks a dashed 3,000 line, and prints an all-time high.
//
// Three palettes off one URL param, identical geometry/timing/copy:
//   ?theme=terminal (default) black, neon green
//   ?theme=navy               Maple navy, green
//   ?theme=light              white trading-app look
//
// The curve's shape is illustrative, not the account's real history — there
// are no dates on the x-axis for that reason.
import React from "react";
import "../Stylesheets/MapleThreeThousandAd.css";
import mapleLogo from "../Images/maple-logo.png";
import mapleBjjLogo from "../Images/maple-bjj-logo.png";

const THEMES = ["terminal", "navy", "light"];

// Timeline (ms). The chart draw is driven by rAF; everything else is CSS
// keyed off .m3k-p<n>.
const DRAW_FROM = 1000;
const DRAW_MS = 3600;
const CUES = [
  250, //            p1 header in
  700, //            p2 chart frame + quote
  DRAW_FROM + DRAW_MS, // p3 breakout: flash, ATH tag
  DRAW_FROM + DRAW_MS + 900, // p4 FOLLOWERS
  DRAW_FROM + DRAW_MS + 1700, // p5 THANK YOU
  DRAW_FROM + DRAW_MS + 2600, // p6 sign-off
];

// ---- chart geometry, in SVG units ----
const VW = 300;
const VH = 190;
const PLOT_R = 258; // right edge of the plot; axis labels live past it
const Y_TOP = 14;
const Y_BOT = 150;
const VMAX = 3300;
const yOf = (v) => Y_BOT - (v / VMAX) * (Y_BOT - Y_TOP);

function rand(i) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Compounding growth with noise and two pullbacks; the last point is the
// high, and nothing before it reaches 3,000.
const N = 56;
const SERIES = (() => {
  const k = 2.4;
  const pts = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    let v = ((Math.exp(k * t) - 1) / (Math.exp(k) - 1)) * 2860 + 90;
    v += (rand(i) - 0.5) * 160 * (0.4 + t);
    if (i > 18 && i < 23) v -= 150 * Math.sin(((i - 18) / 5) * Math.PI);
    if (i > 38 && i < 45) v -= 260 * Math.sin(((i - 38) / 7) * Math.PI);
    pts.push(Math.max(60, Math.min(2930, v)));
  }
  pts[N - 1] = 3000;
  return pts;
})();
const XS = SERIES.map((_, i) => (i / (N - 1)) * PLOT_R);
const VOL = SERIES.map((_, i) => 0.25 + rand(i + 77) * 0.75);

// Accelerating draw: growth should feel like it is picking up speed.
const ease = (t) => (t < 1 ? t * t * (3 - 2 * t) * 0.35 + Math.pow(t, 1.6) * 0.65 : 1);

// Point on the series at fractional index f.
function at(f) {
  const i = Math.min(N - 2, Math.floor(f));
  const r = f - i;
  return { x: XS[i] + (XS[i + 1] - XS[i]) * r, v: SERIES[i] + (SERIES[i + 1] - SERIES[i]) * r };
}

export default function MapleThreeThousandAd({
  ticker = "$MAPLE",
  name = "MAPLE JIU JITSU",
  label = "FOLLOWERS",
  thanks = "THANK YOU",
  signoff = "SEE YOU ON THE MATS",
  site = "maplebjj.com",
}) {
  const theme = React.useMemo(() => {
    if (typeof window === "undefined") return THEMES[0];
    const q = new URLSearchParams(window.location.search).get("theme");
    return THEMES.includes(q) ? q : THEMES[0];
  }, []);

  const reduce = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const [phase, setPhase] = React.useState(reduce ? CUES.length : 0);
  const [prog, setProg] = React.useState(reduce ? 1 : 0);

  React.useEffect(() => {
    if (reduce) return undefined;
    const timers = CUES.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    let raf;
    const t0 = performance.now() + DRAW_FROM;
    const tick = (now) => {
      const p = Math.min(1, Math.max(0, (now - t0) / DRAW_MS));
      setProg(ease(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  // Build the drawn part of the line up to the tip.
  const f = prog * (N - 1);
  const tip = prog >= 1 ? { x: XS[N - 1], v: SERIES[N - 1] } : at(f);
  const whole = Math.floor(f);
  let d = `M0 ${yOf(SERIES[0]).toFixed(2)}`;
  for (let i = 1; i <= whole && i < N; i++) d += ` L${XS[i].toFixed(2)} ${yOf(SERIES[i]).toFixed(2)}`;
  d += ` L${tip.x.toFixed(2)} ${yOf(tip.v).toFixed(2)}`;
  const area = `${d} L${tip.x.toFixed(2)} ${Y_BOT} L0 ${Y_BOT} Z`;
  const quote = Math.round(tip.v);
  const tipY = yOf(tip.v);

  const cls = Array.from({ length: phase }, (_, i) => `m3k-p${i + 1}`).join(" ");

  return (
    <div className={`m3k-stage m3k-${theme} ${cls}`}>
      <div className="m3k-field" aria-hidden />
      <div className="m3k-flash" aria-hidden />

      <div className="m3k-card">
        {/* ---- quote header ---- */}
        <div className="m3k-head">
          <img
            className="m3k-logo"
            src={theme === "light" ? mapleBjjLogo : mapleLogo}
            alt=""
          />
          <div className="m3k-id">
            <div className="m3k-ticker">{ticker}</div>
            <div className="m3k-name">{name} · INSTAGRAM</div>
          </div>
          <div className="m3k-live"><i />LIVE</div>
        </div>

        <div className="m3k-quote">
          <div className="m3k-price">{quote.toLocaleString("en-US")}</div>
          <div className="m3k-chip">
            <span className="m3k-chip-a">▲ RISING</span>
            <span className="m3k-chip-b">▲ ALL-TIME HIGH</span>
          </div>
        </div>

        {/* ---- chart ---- */}
        <div className="m3k-chart">
          <svg viewBox={`0 0 ${VW} ${VH}`} className="m3k-svg">
            <defs>
              <linearGradient id="m3k-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" className="m3k-stop-a" />
                <stop offset="100%" className="m3k-stop-b" />
              </linearGradient>
            </defs>

            {[1000, 2000, 3000].map((v) => (
              <g key={v} className={v === 3000 ? "m3k-target" : "m3k-grid"}>
                <line x1="0" x2={PLOT_R} y1={yOf(v)} y2={yOf(v)} />
                <text x={PLOT_R + 6} y={yOf(v) + 3.2}>{v / 1000}K</text>
              </g>
            ))}
            <line className="m3k-base" x1="0" x2={PLOT_R} y1={Y_BOT} y2={Y_BOT} />

            {/* volume */}
            {SERIES.map((_, i) => {
              const h = VOL[i] * 22 * (0.5 + i / N);
              return (
                <rect
                  key={i}
                  className="m3k-vol"
                  x={XS[i] - 1.6}
                  y={VH - 6 - h}
                  width="3.2"
                  height={h}
                  style={{ opacity: i <= f ? undefined : 0 }}
                />
              );
            })}

            <path className="m3k-area" d={area} fill="url(#m3k-fill)" />
            <path className="m3k-line m3k-glow" d={d} />
            <path className="m3k-line" d={d} />

            <g className="m3k-tip" transform={`translate(${tip.x} ${tipY})`}>
              <circle className="m3k-ring" r="4" />
              <circle className="m3k-dot" r="3.2" />
            </g>
          </svg>

        </div>

        {/* ---- copy ---- */}
        <div className="m3k-copy">
          <div className="m3k-label"><span>3,000 {label}</span></div>
          <div className="m3k-thanks"><span>{thanks}</span></div>
          <div className="m3k-sign">{signoff}</div>
          <div className="m3k-site">{site}</div>
        </div>
      </div>
    </div>
  );
}
