// MapleViceAd.js — a Maple Jiu-Jitsu commercial in the style of a Vice City
// open-world game trailer. An homage, not a copy: no game logo, no game name.
//
//   1. WELCOME TO MAPLE. — neon sunset, palms, skyline
//   2. loading-screen art: gym photos as tilted, posterised comic panels
//   3. gameplay HUD over a roll: minimap, wanted stars, mission text
//   4. MISSION PASSED / RESPECT + over the podium
//   5. end card
//
// Cut to a 100 bpm bar (2.4 s). Everything, overlay included, is a pure
// function of time: ?render=1 hands the clock to tools/record-frames.js via
// window.__renderAt, so CSS transitions are not used anywhere.
import React from "react";
import "../Stylesheets/MapleViceAd.css";
import mapleLogo from "../Images/maple-logo.png";
import groupPhoto from "../Images/IMG_4224.jpg";
import kidsPhoto from "../Images/kids.jpeg";
import rollPhoto from "../Images/Jess.jpg";
import podiumPhoto from "../Images/Nabiha.JPG";

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ss = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;
const back = (t) => {
  // overshoot ease, for things that slam in
  const c = 1.9;
  const u = clamp01(t) - 1;
  return 1 + (c + 1) * u * u * u + c * u * u;
};

// ---------------- timeline (ms), on a 2.4 s bar ----------------
const BAR = 2400;
const S1 = 0; // sunset + title
const S2 = 2 * BAR; // loading-screen panels (drums drop here)
const S3 = 4 * BAR; // gameplay HUD
const S4 = 6 * BAR; // mission passed
const S5 = 7 * BAR; // end card
const END_MS = 9 * BAR;
export const VICE_TIMELINE = { BAR, S1, S2, S3, S4, S5, END_MS };

// ---------------- palm, drawn ----------------
function palmPath(seed) {
  let a = seed;
  const r = () => {
    a = (a * 9301 + 49297) % 233280;
    return a / 233280;
  };
  // trunk: a gentle curve
  const parts = ["M 0 0 C 6 -60 -4 -130 18 -200 L 28 -200 C 8 -130 18 -60 14 0 Z"];
  // fronds: long drooping blades from the crown
  const cx = 23;
  const cy = -204;
  for (let i = 0; i < 9; i++) {
    const ang = -Math.PI / 2 + (i - 4) * 0.42 + (r() - 0.5) * 0.15;
    const len = 80 + r() * 40;
    const ex = cx + Math.cos(ang) * len;
    const ey = cy + Math.sin(ang) * len * 0.55 + len * 0.45;
    const mx = cx + Math.cos(ang) * len * 0.55;
    const my = cy + Math.sin(ang) * len * 0.55 - 22;
    const w = 7 + r() * 4;
    parts.push(`M ${cx} ${cy} Q ${mx} ${my - w} ${ex} ${ey} Q ${mx} ${my + w} ${cx} ${cy + 4} Z`);
  }
  return parts.join(" ");
}

function Palm({ seed, style }) {
  return (
    <svg className="gv-palm" style={style} viewBox="-120 -330 260 340" aria-hidden>
      <path d={palmPath(seed)} fill="currentColor" />
    </svg>
  );
}

function Skyline() {
  // a low Miami skyline: a few towers, one with a stepped top
  const towers = [
    [0, 60], [14, 90], [26, 74], [40, 130], [56, 104], [70, 150], [86, 96], [100, 120],
    [116, 84], [130, 170], [146, 110], [160, 88], [174, 140], [190, 100], [204, 76], [218, 118],
  ];
  return (
    <svg className="gv-skyline" viewBox="0 0 232 180" preserveAspectRatio="none" aria-hidden>
      {towers.map(([x, h], i) => (
        <rect key={i} x={x} y={180 - h} width={13} height={h} fill="currentColor" />
      ))}
      <rect x={133} y={0} width={2} height={14} fill="currentColor" />
    </svg>
  );
}

const STAR_D = "M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z";

export default function MapleViceAd({
  welcome = "WELCOME TO",
  title = "MAPLE",
  panels = [
    ["TRAIN HARD.", groupPhoto],
    ["BRING THE KIDS.", kidsPhoto],
    ["NO EGO.", rollPhoto],
  ],
  address = "20 CRANSTON PARK AVE",
  site = "maplebjj.com",
}) {
  const R = React.useRef({}).current;
  const ref = (k) => (el) => {
    R[k] = el;
  };

  React.useEffect(() => {
    const renderMode = new URLSearchParams(window.location.search).get("render") === "1";
    const fx = (k, o, y = 0, s = 1, extra = "") => {
      const el = R[k];
      if (!el) return;
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translateY(${y.toFixed(2)}px) scale(${s.toFixed(4)}) ${extra}`;
    };
    const vis = (k, on) => {
      if (R[k]) R[k].style.visibility = on ? "visible" : "hidden";
    };

    function renderAt(t) {
      // ---- which scene ----
      const inSun = t < S2 || t >= S5;
      vis("sun", inSun);
      vis("panels", t >= S2 && t < S3);
      vis("hud", t >= S3 && t < S4);
      vis("passed", t >= S4 && t < S5);
      vis("end", t >= S5);

      // ---- 1: sunset ----
      // the camera drifts down out of the sky onto the water
      const sunK = t < S2 ? t / S2 : (t - S5) / (END_MS - S5);
      if (R.sky) R.sky.style.transform = `translateY(${lerp(-6, 4, sunK)}%) scale(1.15)`;
      if (R.sundisc) R.sundisc.style.transform = `translate(-50%, ${lerp(-8, 6, sunK)}%)`;
      if (R.palmL) R.palmL.style.transform = `translateX(${lerp(-4, 6, sunK)}%) rotate(${Math.sin(t / 900) * 1.2}deg)`;
      if (R.palmR) R.palmR.style.transform = `translateX(${lerp(6, -6, sunK)}%) scaleX(-1) rotate(${Math.sin(t / 1100 + 1) * 1.2}deg)`;
      if (R.waves) R.waves.style.backgroundPositionY = `${(t / 40) % 24}px`;

      fx("welcome", ss(250, 800, t) * (1 - ss(S2 - 250, S2, t)), (1 - ss(250, 900, t)) * 10);
      const slam = back((t - 900) / 450);
      fx("title", t > 900 ? Math.min(1, (t - 900) / 120) * (1 - ss(S2 - 250, S2, t)) : 0, 0, t > 900 ? lerp(2.4, 1, slam) : 2.4);

      // ---- 2: loading-screen panels ----
      for (let i = 0; i < 3; i++) {
        const t0 = S2 + i * 1200;
        const k = back((t - t0) / 420);
        const el = R["panel" + i];
        if (!el) continue;
        const from = [[-120, -20], [120, 10], [-110, 30]][i];
        const rot = [-6, 5, -3][i];
        el.style.opacity = t > t0 ? "1" : "0";
        el.style.transform = `translate(${lerp(from[0], 0, k)}vw, ${lerp(from[1], 0, k)}vh) rotate(${rot}deg) scale(${1 + 0.04 * Math.sin(((t - t0) / 1000) * 0.9)})`;
        // slow push inside each frame
        const img = R["pimg" + i];
        if (img) img.style.transform = `scale(${1.08 + ((t - t0) / 1000) * 0.03})`;
        fx("cap" + i, ss(t0 + 200, t0 + 450, t) * (1 - ss(t0 + 1150, t0 + 1300, t) * (i < 2 ? 1 : 0)), 0, lerp(1.3, 1, ss(t0 + 200, t0 + 420, t)));
      }
      fx("cap3", 0);

      // ---- 3: gameplay HUD ----
      const hk = (t - S3) / (S4 - S3);
      if (R.hudimg) R.hudimg.style.transform = `scale(${1.0 + hk * 0.07}) translateX(${lerp(1.5, -1.5, hk)}%)`;
      fx("minimap", ss(S3 + 100, S3 + 400, t), (1 - ss(S3 + 100, S3 + 400, t)) * 20);
      if (R.mapinner) R.mapinner.style.transform = `rotate(${lerp(-25, 15, hk)}deg) translateY(${lerp(0, -14, hk)}px)`;
      fx("starsbox", ss(S3 + 200, S3 + 500, t));
      fx("money", ss(S3 + 200, S3 + 500, t));
      // wanted level climbs a star at a time, each one flashing as it lands
      for (let i = 0; i < 5; i++) {
        const tOn = S3 + 600 + i * 700;
        const el = R["star" + i];
        if (!el) continue;
        const on = t >= tOn;
        el.setAttribute("fill", on ? "#ffffff" : "rgba(0,0,0,0.35)");
        const fl = on ? 1 - clamp01((t - tOn) / 350) : 0;
        el.parentNode.style.transform = `scale(${1 + fl * 0.6})`;
        el.parentNode.style.filter = fl > 0 ? `drop-shadow(0 0 ${6 * fl}px #fff)` : "none";
      }
      const cash = Math.round(2450 + (t > S3 + 3300 ? 500 * ss(S3 + 3300, S3 + 3900, t) : 0));
      if (R.cash) R.cash.textContent = "$" + cash.toLocaleString("en-US");
      fx("plus", ss(S3 + 3300, S3 + 3450, t) * (1 - ss(S3 + 4300, S3 + 4600, t)), -ss(S3 + 3300, S3 + 4600, t) * 14);
      fx("help", ss(S3 + 2400, S3 + 2600, t) * (1 - ss(S4 - 250, S4, t)), 0, lerp(0.92, 1, ss(S3 + 2400, S3 + 2600, t)));
      fx("mis1", ss(S3 + 300, S3 + 500, t) * (1 - ss(S3 + 2200, S3 + 2400, t)));
      fx("mis2", ss(S3 + 2500, S3 + 2700, t) * (1 - ss(S4 - 250, S4, t)));

      // ---- 4: mission passed ----
      const pk = (t - S4) / (S5 - S4);
      if (R.passimg) {
        R.passimg.style.transform = `scale(${1.1 + pk * 0.05})`;
        R.passimg.style.filter = `grayscale(${ss(S4, S4 + 900, t)}) brightness(${lerp(1, 0.72, ss(S4, S4 + 900, t))}) contrast(1.1)`;
      }
      fx("band", ss(S4 + 120, S4 + 300, t), 0, 1, `scaleY(${ss(S4 + 120, S4 + 300, t)})`);
      fx("passtxt", ss(S4 + 250, S4 + 380, t), 0, lerp(1.6, 1, back((t - S4 - 250) / 350)));
      fx("respect", ss(S4 + 700, S4 + 850, t), (1 - ss(S4 + 700, S4 + 900, t)) * 8);

      // ---- 5: end card ----
      fx("logo", ss(S5 + 150, S5 + 500, t), 0, lerp(0.7, 1, back((t - S5 - 150) / 500)));
      fx("endtitle", ss(S5 + 350, S5 + 700, t), 0, lerp(1.5, 1, back((t - S5 - 350) / 450)));
      fx("enroll", ss(S5 + 900, S5 + 1200, t), (1 - ss(S5 + 900, S5 + 1250, t)) * 10);
      fx("addr", ss(S5 + 1300, S5 + 1600, t), (1 - ss(S5 + 1300, S5 + 1650, t)) * 8);

      // ---- cuts: a white pop on each scene change ----
      let flash = 0;
      for (const c of [S2, S3, S4, S5]) {
        const d = t - c;
        if (d >= 0 && d < 220) flash = Math.max(flash, 1 - d / 220);
      }
      for (let i = 1; i < 3; i++) {
        const d = t - (S2 + i * 1200);
        if (d >= 0 && d < 140) flash = Math.max(flash, 0.5 * (1 - d / 140));
      }
      if (R.flash) R.flash.style.opacity = (flash * 0.85).toFixed(3);
      // fade in from black, out to black
      if (R.black) R.black.style.opacity = Math.max(1 - ss(0, 500, t), ss(END_MS - 500, END_MS, t)).toFixed(3);
    }

    let raf;
    let disposed = false;
    (async () => {
      try {
        await Promise.all([
          document.fonts.load('400 80px "Bangers"'),
          document.fonts.load('400 80px "Anton"'),
          document.fonts.load("800 30px Inter"),
        ]);
      } catch (e) { /* fonts are a nicety */ }
      await Promise.all(
        Array.from(document.querySelectorAll(".gv-stage img")).map((im) =>
          im.complete ? null : new Promise((r) => { im.onload = r; im.onerror = r; })
        )
      );
      if (disposed) return;
      renderAt(0);
      if (renderMode) {
        window.__renderAt = (ms) => renderAt(ms);
        window.__viceEnd = END_MS;
        window.__viceMarks = { BAR, S1, S2, S3, S4, S5, END_MS };
        window.__ready = true;
        return;
      }
      const t0 = performance.now();
      const loop = (now) => {
        renderAt((now - t0) % END_MS);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    })();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
    };
  }, [R]);

  return (
    <div className="gv-stage">
      {/* the comic-art grade used on the loading-screen panels */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter id="gv-art" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="1.5" />
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0.02 0.22 0.42 0.62 0.82 1" />
            <feFuncG type="discrete" tableValues="0.02 0.2 0.4 0.6 0.8 0.97" />
            <feFuncB type="discrete" tableValues="0.06 0.26 0.46 0.66 0.85 1" />
          </feComponentTransfer>
        </filter>
        <filter id="gv-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      {/* ---------- 1 & 5: sunset ---------- */}
      <div className="gv-scene gv-sun" ref={ref("sun")}>
        <div className="gv-sky" ref={ref("sky")} />
        <div className="gv-sundisc" ref={ref("sundisc")} />
        <div className="gv-skyline-wrap"><Skyline /></div>
        <div className="gv-sea"><div className="gv-waves" ref={ref("waves")} /></div>
        <div className="gv-palm-l" ref={ref("palmL")}><Palm seed={11} /></div>
        <div className="gv-palm-r" ref={ref("palmR")}><Palm seed={29} /></div>

        <div className="gv-titleblock">
          <div className="gv-welcome" ref={ref("welcome")}>{welcome}</div>
          <div className="gv-title" ref={ref("title")} data-text={title}>{title}</div>
        </div>

        <div className="gv-end" ref={ref("end")}>
          <img className="gv-endlogo" ref={ref("logo")} src={mapleLogo} alt="Maple Jiu-Jitsu" />
          <div className="gv-endtitle" ref={ref("endtitle")}>MAPLE JIU-JITSU</div>
          <div className="gv-enroll" ref={ref("enroll")}>NOW ENROLLING</div>
          <div className="gv-addr" ref={ref("addr")}>
            <span>{address}</span>
            <span>{site}</span>
          </div>
        </div>
      </div>

      {/* ---------- 2: loading-screen art ---------- */}
      <div className="gv-scene gv-panels" ref={ref("panels")}>
        {panels.map(([cap, src], i) => (
          <div key={i} className={`gv-panel gv-panel-${i}`} ref={ref("panel" + i)}>
            <img src={src} alt="" ref={ref("pimg" + i)} />
            <div className="gv-tone" />
            <div className="gv-dots" />
            <div className="gv-cap" ref={ref("cap" + i)}>{cap}</div>
          </div>
        ))}
        <div className="gv-cap gv-cap-hidden" ref={ref("cap3")} />
      </div>

      {/* ---------- 3: gameplay ---------- */}
      <div className="gv-scene gv-hud" ref={ref("hud")}>
        <img className="gv-bg" src={rollPhoto} alt="" ref={ref("hudimg")} />
        <div className="gv-grade" />

        <div className="gv-help" ref={ref("help")}>
          Press <span className="gv-btn">◎</span> to <b>tap out</b>.
        </div>

        <div className="gv-tr">
          <div className="gv-money" ref={ref("money")}>
            <span ref={ref("cash")}>$2,450</span>
            <span className="gv-plus" ref={ref("plus")}>+$500</span>
          </div>
          <div className="gv-stars" ref={ref("starsbox")}>
            {[0, 1, 2, 3, 4].map((i) => (
              <svg key={i} className="gv-star" viewBox="0 0 24 24" aria-hidden>
                <path ref={ref("star" + i)} d={STAR_D} fill="rgba(0,0,0,0.35)" stroke="#000" strokeWidth="1.6" />
              </svg>
            ))}
          </div>
        </div>

        <div className="gv-minimap" ref={ref("minimap")}>
          <div className="gv-mapring">
            <div className="gv-mapinner" ref={ref("mapinner")}>
              <div className="gv-road" style={{ top: "48%", left: "-20%", width: "140%", height: "7%" }} />
              <div className="gv-road" style={{ top: "-20%", left: "30%", width: "6%", height: "140%" }} />
              <div className="gv-road" style={{ top: "20%", left: "-10%", width: "120%", height: "4%", transform: "rotate(28deg)" }} />
              <div className="gv-road" style={{ top: "-10%", left: "66%", width: "4%", height: "120%" }} />
              <div className="gv-route" />
              <svg className="gv-blip" viewBox="0 0 24 24" aria-hidden>
                <circle cx="12" cy="12" r="11" fill="#13234b" stroke="#ffd34d" strokeWidth="2" />
                <path d="M12 4l1.4 3 2.3-1-.6 3.4 2.6-.4-1.5 2.6 2 1.2-3.4 1.3.3 2-3.1-.6V20h-1V16.5l-3.1.6.3-2-3.4-1.3 2-1.2-1.5-2.6 2.6.4-.6-3.4 2.3 1z" fill="#ffd34d" />
              </svg>
            </div>
            <div className="gv-player" />
          </div>
          <div className="gv-bars">
            <div className="gv-hp"><i /></div>
            <div className="gv-ap"><i /></div>
          </div>
        </div>

        <div className="gv-mission">
          <div className="gv-mis" ref={ref("mis1")}>Go to <em>Maple Jiu-Jitsu</em>.</div>
          <div className="gv-mis" ref={ref("mis2")}>Survive your <em>first class</em>.</div>
        </div>
      </div>

      {/* ---------- 4: mission passed ---------- */}
      <div className="gv-scene gv-passed" ref={ref("passed")}>
        <img className="gv-bg" src={podiumPhoto} alt="" ref={ref("passimg")} />
        <div className="gv-band" ref={ref("band")} />
        <div className="gv-passtxt" ref={ref("passtxt")}>MISSION PASSED</div>
        <div className="gv-respect" ref={ref("respect")}>RESPECT +</div>
      </div>

      {/* ---------- grade, grain, flash ---------- */}
      <div className="gv-vignette" aria-hidden />
      <svg className="gv-grain" aria-hidden><rect width="100%" height="100%" filter="url(#gv-grain)" /></svg>
      <div className="gv-flash" ref={ref("flash")} aria-hidden />
      <div className="gv-black" ref={ref("black")} aria-hidden />
    </div>
  );
}
