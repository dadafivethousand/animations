// MapleThreeThousandAd.js — Maple Jiu Jitsu hits 3,000 Instagram followers.
//
// A counter runs 0 -> 3,000 while a jiu-jitsu belt underneath it fills through
// the ranks (white, blue, purple, brown, black). On 3,000 the number lands, a
// burst of small maple leaves goes off, and the thank-you copy follows.
//
// Two palettes off one URL param so every cut records from one dev server:
//   ?theme=night  (default) navy field, gold accents
//   ?theme=paper  warm off-white field, navy type, Canada-red leaves
// Geometry, timing and copy are identical between them.
import React from "react";
import "../Stylesheets/MapleThreeThousandAd.css";
import mapleLogo from "../Images/maple-logo.png";
import mapleBjjLogo from "../Images/maple-bjj-logo.png";

// Phase cues in ms. Everything that moves is CSS keyed off .m3k-p<n>.
const CUES = [
  350, //  p1  logo drops in
  900, //  p2  counter + belt start
  3500, // p3  3,000 lands, leaves burst
  4300, // p4  FOLLOWERS
  5200, // p5  THANK YOU
  6300, // p6  sign-off + url
];
const COUNT_FROM = 900;
const COUNT_MS = 2600;

// Ease-out so the last few hundred tick slowly and 3,000 feels earned.
const easeOut = (t) => 1 - Math.pow(1 - t, 3.2);

// Deterministic "random" so every take is the same take.
function rand(i) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
const LEAVES = Array.from({ length: 30 }, (_, i) => {
  const a = (i / 30) * Math.PI * 2 + rand(i) * 0.4;
  const r = 34 + rand(i + 50) * 22; // vw
  return {
    dx: Math.cos(a) * r,
    dy: Math.sin(a) * r * 1.25 - 6,
    rot: (rand(i + 9) - 0.5) * 540,
    size: 3.2 + rand(i + 3) * 3.6,
    delay: rand(i + 21) * 120,
    tint: i % 3,
  };
});

export default function MapleThreeThousandAd({
  target = 3000,
  label = "FOLLOWERS",
  thanks = "THANK YOU",
  signoff = "SEE YOU ON THE MATS",
  site = "maplebjj.com",
}) {
  const theme = React.useMemo(() => {
    if (typeof window === "undefined") return "night";
    const q = new URLSearchParams(window.location.search).get("theme");
    return q === "paper" ? "paper" : "night";
  }, []);

  const reduce = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const [phase, setPhase] = React.useState(reduce ? CUES.length : 0);
  const [n, setN] = React.useState(reduce ? target : 0);
  // Linear time through the count. The number eases out, so ranking the belt
  // off the number would skip straight to black; ranking it off time gives
  // each belt an equal beat.
  const [tp, setTp] = React.useState(reduce ? 1 : 0);

  React.useEffect(() => {
    if (reduce) return undefined;
    const timers = CUES.map((t, i) => setTimeout(() => setPhase(i + 1), t));

    let raf;
    const t0 = performance.now() + COUNT_FROM;
    const tick = (now) => {
      const p = Math.min(1, Math.max(0, (now - t0) / COUNT_MS));
      setN(Math.round(easeOut(p) * target));
      setTp(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, [reduce, target]);

  const progress = n / target;
  const cls = Array.from({ length: phase }, (_, i) => `m3k-p${i + 1}`).join(" ");

  return (
    <div className={`m3k-stage m3k-${theme} ${cls}`}>
      <div className="m3k-field" aria-hidden />
      <div
        className="m3k-leaf-bg"
        aria-hidden
        style={{ WebkitMaskImage: `url(${mapleLogo})`, maskImage: `url(${mapleLogo})` }}
      />
      <div className="m3k-flash" aria-hidden />

      <div className="m3k-card">
        <img
          className="m3k-logo"
          src={theme === "paper" ? mapleBjjLogo : mapleLogo}
          alt="Maple Jiu Jitsu"
        />

        <div className="m3k-hero">
          <div className="m3k-burst" aria-hidden>
            {LEAVES.map((l, i) => (
              <i
                key={i}
                className={`m3k-bit m3k-t${l.tint}`}
                style={{
                  "--dx": `${l.dx}vw`,
                  "--dy": `${l.dy}vw`,
                  "--rot": `${l.rot}deg`,
                  "--sz": `${l.size}vw`,
                  "--dl": `${l.delay}ms`,
                  WebkitMaskImage: `url(${mapleLogo})`,
                  maskImage: `url(${mapleLogo})`,
                }}
              />
            ))}
          </div>
          <div className="m3k-num">{n.toLocaleString("en-US")}</div>
        </div>

        {/* The progress bar is a belt: the fill colour steps through the
            ranks as the count climbs, ending on black with the red bar. */}
        <div className="m3k-belt" aria-hidden>
          <div
            className="m3k-belt-fill"
            style={{ width: `${progress * 100}%` }}
            data-rank={Math.min(4, Math.floor(tp * 5))}
          />
          <div className="m3k-belt-bar" />
        </div>

        <div className="m3k-copy">
          <div className="m3k-label"><span>{label}</span></div>
          <div className="m3k-thanks"><span>{thanks}</span></div>
          <div className="m3k-sign">{signoff}</div>
          <div className="m3k-site">{site}</div>
        </div>
      </div>
    </div>
  );
}
