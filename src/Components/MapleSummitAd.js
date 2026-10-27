// MapleSummitAd.js — Maple Jiu Jitsu, 3,000 followers: "you climb the
// mountain only to see more mountains."
//
// 1. A tiny climber walks a ridge up through mist, past false summits, while
//    the FOLLOWERS readout climbs with them.
// 2. Summit at 3,000: the cloud breaks, sunrise, a Maple flag goes in.
//    "WE MADE IT TO THE TOP."
// 3. The camera cranes back. The summit shrinks to a rock poking out of a sea
//    of cloud, and range after range of far bigger peaks comes out of the
//    haze behind it. "...OR SO WE THOUGHT."
// 4. THE CLIMB NEVER ENDS.
//
// The landscape is a canvas with a simple pinhole projection: every ridge
// layer sits at a real distance, so the crane-back gives true parallax (the
// near peak shrinks fast, the far giants barely move). The text is HTML.
//
//   ?theme=sunrise (default) gold and blue
//   ?theme=dusk              alpenglow pink and violet
import React from "react";
import "../Stylesheets/MapleSummitAd.css";
import mapleLogo from "../Images/maple-logo.png";

// ---------------- timeline (ms) ----------------
const T_HUD = 300;
const T_CLIMB0 = 500;
const T_SUMMIT = 6000;
const T_CAP1 = 6900;
const T_CRANE0 = 7000;
const T_CAP2 = 8900;
const T_CRANE1 = 11200;
const T_FINAL = 10900;
const T_THANKS = 11800;
const T_SIGN = 12600;
export const MAPLE_SUMMIT_TIMELINE = { T_SUMMIT, T_CAP2, T_FINAL };

const TARGET = 3000;
const SUMMIT_H = 3000;
const CLOUD_H = 2480;
const NEAR_D = 1200;

// ---------------- helpers ----------------
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ss = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
function hex(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mixA(a, b, t, al = 1) {
  const A = hex(a);
  const B = hex(b);
  return `rgba(${Math.round(lerp(A[0], B[0], t))},${Math.round(lerp(A[1], B[1], t))},${Math.round(lerp(A[2], B[2], t))},${al})`;
}
function hash(i, seed) {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function vnoise(x, seed) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return lerp(hash(i, seed), hash(i + 1, seed), u) * 2 - 1;
}
function fbm(x, seed, oct = 5) {
  let s = 0;
  let a = 0.5;
  let fq = 1;
  for (let o = 0; o < oct; o++) {
    s += a * vnoise(x * fq, seed + o * 17);
    a *= 0.5;
    fq *= 2.1;
  }
  return s;
}
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function sprite(color) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const [r, gg, b] = hex(color);
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, `rgba(${r},${gg},${b},1)`);
  grd.addColorStop(0.45, `rgba(${r},${gg},${b},0.6)`);
  grd.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return c;
}

const THEMES = {
  sunrise: {
    skyTop: "#0d1f45",
    skyMid: "#3f5d96",
    skyLow: "#f0a66e",
    skyHor: "#ffdcaa",
    sun: "#fff4dc",
    sunGlow: "#ffae5e",
    near: "#151c2e",
    far: "#5a6890",
    rim: "#ffcf8a",
    snowLit: "#fff6ea",
    snowShade: "#b6c6e2",
    rock: "#c98f62",
    cloudTop: "#fff1de",
    cloudBody: "#c3c9dc",
    fog: "#b7c1cf",
  },
  dusk: {
    skyTop: "#160e33",
    skyMid: "#55387a",
    skyLow: "#ee7a72",
    skyHor: "#ffc28e",
    sun: "#ffe2c4",
    sunGlow: "#ff8a6a",
    near: "#1a1430",
    far: "#62507c",
    rim: "#ffb79a",
    snowLit: "#ffe6e0",
    snowShade: "#c9bcd9",
    rock: "#c9837a",
    cloudTop: "#ffd9cc",
    cloudBody: "#a99bbd",
    fog: "#aaa3bc",
  },
};

// ---------------- terrain ----------------
function makeLayer(o) {
  const pts = [];
  for (let x = o.x0; x <= o.x1; x += o.dx) {
    let h = o.base;
    for (const p of o.peaks) {
      const s = x < p.x ? p.sL : p.sR;
      h = Math.max(h, p.h - s * Math.abs(x - p.x));
    }
    const above = Math.max(0, h - o.base);
    h += fbm(x / o.nScale, o.seed) * o.nAmp * (0.35 + 0.65 * Math.min(1, above / 1500));
    if (o.shape) h = o.shape(x, h);
    pts.push(h);
  }
  // facet seeds: prominent local maxima, each paired with the next minimum
  const m = o.facetWin || 6;
  const facets = [];
  for (let i = m; i < pts.length - m; i++) {
    let isMax = true;
    for (let k = i - m; k <= i + m; k++) if (pts[k] > pts[i]) { isMax = false; break; }
    if (!isMax) continue;
    let j = i - 1;
    while (j > 0 && !(pts[j] <= pts[j - 1] && pts[j] <= pts[j + 1])) j--;
    // follow the descent leftwards until it really turns
    while (j > 0 && pts[j - 1] < pts[j] + 30) j--;
    facets.push([Math.max(0, j), i]);
  }
  return { ...o, pts, facets };
}

function buildTerrain() {
  const rnd = mulberry32(42);
  const range = (n, x0, x1, h0, h1, s0, s1) =>
    Array.from({ length: n }, () => {
      const s = lerp(s0, s1, rnd());
      return { x: lerp(x0, x1, rnd()), h: lerp(h0, h1, rnd()), sL: s * lerp(0.8, 1.2, rnd()), sR: s * lerp(0.8, 1.25, rnd()) };
    });

  const near = makeLayer({
    d: NEAR_D, x0: -4200, x1: 3200, dx: 12, base: 250, seed: 1, nScale: 260, nAmp: 90, facetWin: 9,
    peaks: [{ x: 0, h: SUMMIT_H, sL: 0.72, sR: 1.35 }],
    shape: (x, h) => {
      // false summits on the climbing ridge, and a clean point at the top
      h += 140 * Math.exp(-Math.pow((x + 1550) / 160, 2)) + 100 * Math.exp(-Math.pow((x + 760) / 120, 2));
      const k = ss(0, 220, Math.abs(x));
      const clean = SUMMIT_H - (x < 0 ? 0.72 : 1.35) * Math.abs(x);
      h = lerp(clean, h, k);
      return Math.min(h, SUMMIT_H - Math.abs(x) * 0.15);
    },
  });

  // Gullies run down the fall line from the ridge: above the snowline they
  // read as dark rock ribs, below it as snow-filled couloirs.
  const gr = mulberry32(99);
  near.gullies = [];
  for (let x = -2900; x < 1700; x += 70 + gr() * 90) {
    const ridge = heightAt(near, x);
    if (ridge < 900) continue;
    const len = 120 + gr() * 380;
    // the fall line runs away from the summit, steeper near the top
    const drift = (x < 0 ? -0.55 : 0.6) * (0.6 + gr() * 0.6);
    const w = 2.5 + gr() * 4.5;
    const pts = [];
    let gx = x;
    for (let dh = 8; dh < len; dh += 10) {
      gx += drift * 10 * (0.6 + dh / len) + fbm((x * 3 + dh) / 70, 7) * 5;
      pts.push([gx, ridge - dh]);
    }
    near.gullies.push({ pts, w });
  }
  near.rocks = Array.from({ length: 170 }, () => {
    const x = (gr() - 0.62) * 3600;
    return { x, h: heightAt(near, x) - 15 - gr() * 420, rx: 1.2 + gr() * 3.5, ry: 0.5 + gr() * 1.2, a: (x < 0 ? -0.5 : 0.5) + (gr() - 0.5) * 0.4 };
  });

  const far = [
    makeLayer({ d: 3400, x0: -9000, x1: 9000, dx: 30, base: 900, seed: 11, nScale: 420, nAmp: 160,
      peaks: range(9, -8000, 8000, 1900, 2700, 0.8, 1.3) }),
    makeLayer({ d: 7500, x0: -16000, x1: 16000, dx: 50, base: 1200, seed: 23, nScale: 700, nAmp: 260,
      peaks: range(11, -15000, 15000, 3500, 4700, 0.7, 1.2) }),
    makeLayer({ d: 13500, x0: -24000, x1: 24000, dx: 70, base: 1500, seed: 37, nScale: 1000, nAmp: 380,
      peaks: range(11, -22000, 22000, 4600, 6100, 0.65, 1.1) }),
    makeLayer({ d: 23000, x0: -36000, x1: 36000, dx: 100, base: 2000, seed: 53, nScale: 1500, nAmp: 520,
      peaks: range(10, -34000, 34000, 5800, 7400, 0.6, 1.0) }),
    makeLayer({ d: 37000, x0: -52000, x1: 52000, dx: 140, base: 2400, seed: 71, nScale: 2200, nAmp: 700,
      peaks: [{ x: 1900, h: 10600, sL: 0.62, sR: 0.78 }, ...range(8, -48000, 48000, 7000, 8600, 0.5, 0.9)] }),
  ];
  return { near, far };
}

function heightAt(layer, x) {
  const f = (x - layer.x0) / layer.dx;
  const i = Math.max(0, Math.min(layer.pts.length - 2, Math.floor(f)));
  const r = f - i;
  return lerp(layer.pts[i], layer.pts[i + 1], r);
}

export default function MapleSummitAd({
  label = "FOLLOWERS",
  cap1 = "WE MADE IT TO THE TOP.",
  cap2 = "…OR SO WE THOUGHT.",
  final1 = "THE CLIMB",
  final2 = "NEVER ENDS",
  thanks = "THANK YOU FOR 3,000",
  signoff = "SEE YOU ON THE MATS",
  site = "maplebjj.com",
}) {
  const themeKey = React.useMemo(() => {
    if (typeof window === "undefined") return "sunrise";
    const q = new URLSearchParams(window.location.search).get("theme");
    return THEMES[q] ? q : "sunrise";
  }, []);

  const canvasRef = React.useRef(null);
  const numRef = React.useRef(null);
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    const cues = [T_HUD, T_SUMMIT, T_CAP1, T_CAP2, T_FINAL, T_THANKS, T_SIGN];
    const ids = cues.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => ids.forEach(clearTimeout);
  }, []);

  React.useEffect(() => {
    const TH = THEMES[themeKey];
    const cv = canvasRef.current;
    const mainCtx = cv.getContext("2d");
    let ctx = mainCtx;
    const farCv = document.createElement("canvas");
    const farCtx = farCv.getContext("2d");
    const rnd = mulberry32(7);
    const { near, far } = buildTerrain();

    let W = 0, H = 0, S = 1;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      S = Math.min(W / 360, H / 640);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;
      farCv.width = cv.width;
      farCv.height = cv.height;
      mainCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      farCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit);

    const SPR = { mist: sprite(TH.fog), cloud: sprite(TH.cloudTop), cloudB: sprite(TH.cloudBody), glow: sprite(TH.sunGlow), white: sprite("#ffffff") };
    const mists = Array.from({ length: 14 }, () => ({ x: rnd(), y: rnd(), r: 0.3 + rnd() * 0.4, v: 0.01 + rnd() * 0.025, a: 0.1 + rnd() * 0.14 }));
    const cloudBits = Array.from({ length: 260 }, () => ({ u: rnd(), j: rnd(), r: 0.5 + rnd() }));
    let drift = [];

    const grain = document.createElement("canvas");
    grain.width = grain.height = 256;
    {
      const g = grain.getContext("2d");
      const id = g.createImageData(256, 256);
      for (let i = 0; i < id.data.length; i += 4) {
        const v = 128 + (rnd() - 0.5) * 255;
        id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
        id.data[i + 3] = 255;
      }
      g.putImageData(id, 0, 0);
    }

    const flagImg = new Image();
    flagImg.src = mapleLogo;

    const t0 = performance.now();
    let last = t0;
    let raf;

    function frame(now) {
      const t = now - t0;
      const dt = Math.min(50, now - last);
      last = now;
      const f = 1080 * S;

      // ---- climber ----
      const cp = clamp01((t - T_CLIMB0) / (T_SUMMIT - T_CLIMB0));
      const walkP = 1 - Math.pow(1 - cp, 1.25);
      const cx = lerp(-2350, 0, walkP);
      const ch = heightAt(near, cx);

      // ---- camera ----
      const crane = easeIO(clamp01((t - T_CRANE0) / (T_CRANE1 - T_CRANE0)));
      const post = Math.max(0, t - T_CRANE1) / 1000; // slow drift after the crane
      const sumHold = ss(T_SUMMIT - 600, T_SUMMIT + 500, t);
      let camX = lerp(cx + 55, 70, sumHold);
      let camH = lerp(ch + 70, SUMMIT_H + 40, sumHold);
      camX = lerp(camX, -560, crane);
      camH = lerp(camH, 3440, crane) + post * 20;
      const camZ = -6200 * crane - post * 220;
      const horY = H * lerp(0.53, 0.63, crane);

      const P = (x, h, d) => {
        const k = f / (d - camZ);
        return [W / 2 + (x - camX) * k, horY - (h - camH) * k, k];
      };

      // ---- atmosphere state ----
      const fog = 1 - ss(T_SUMMIT - 1300, T_SUMMIT + 500, t); // inside the cloud
      const hidden = 1 - ss(T_CRANE0 + 300, T_CRANE1 - 400, t); // far ranges still in haze
      const sunUp = ss(T_SUMMIT - 900, T_SUMMIT + 900, t);

      // ---- sky ----
      const sky = ctx.createLinearGradient(0, 0, 0, horY);
      sky.addColorStop(0, TH.skyTop);
      sky.addColorStop(0.45, TH.skyMid);
      sky.addColorStop(0.82, TH.skyLow);
      sky.addColorStop(1, TH.skyHor);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = TH.skyHor;
      ctx.fillRect(0, horY, W, H - horY);

      // sun, at infinity: fixed angle, so it only moves with the horizon
      const sunX = W / 2 + (-0.115 - camX / 40000) * f * 0.6;
      const sunY = horY - 0.135 * f * 0.6;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.9 * sunUp;
      const sg = 420 * S;
      ctx.drawImage(SPR.glow, sunX - sg, sunY - sg, sg * 2, sg * 2);
      ctx.globalAlpha = sunUp;
      ctx.drawImage(SPR.white, sunX - 26 * S, sunY - 26 * S, 52 * S, 52 * S);
      // rays
      ctx.globalAlpha = 0.07 * sunUp;
      ctx.fillStyle = TH.sun;
      for (let i = 0; i < 9; i++) {
        const a = -Math.PI / 2 + (i - 4) * 0.33 + Math.sin(t * 0.0002 + i) * 0.04;
        const L = H * 1.3;
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(sunX + Math.cos(a - 0.035) * L, sunY + Math.sin(a - 0.035) * L);
        ctx.lineTo(sunX + Math.cos(a + 0.035) * L, sunY + Math.sin(a + 0.035) * L);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // ---- ridge layers ----
      function drawLayer(L, idx, total, extraHaze, isNear) {
        const k = f / (L.d - camZ);
        const xa = camX - (W / 2 + 40) / k;
        const xb = camX + (W / 2 + 40) / k;
        const i0 = Math.max(0, Math.floor((xa - L.x0) / L.dx));
        const i1 = Math.min(L.pts.length - 1, Math.ceil((xb - L.x0) / L.dx));
        if (i1 <= i0) return;
        const sx = (i) => W / 2 + (L.x0 + i * L.dx - camX) * k;
        const sy = (h) => horY - (h - camH) * k;

        const df = isNear ? 0 : (idx + 1) / (total + 0.4);
        const haze = Math.min(1, df * 0.42 + extraHaze);
        const body = mixA(TH.near, TH.far, df);

        const path = new Path2D();
        path.moveTo(sx(i0), H + 20);
        for (let i = i0; i <= i1; i++) path.lineTo(sx(i), sy(L.pts[i]));
        path.lineTo(sx(i1), H + 20);
        path.closePath();

        // top of the layer's own peaks, for the vertical gradient
        let top = Infinity;
        for (let i = i0; i <= i1; i++) top = Math.min(top, sy(L.pts[i]));
        const baseY = sy(L.base);
        const g = ctx.createLinearGradient(0, top, 0, Math.max(top + 10, baseY));
        g.addColorStop(0, body);
        g.addColorStop(1, mixA(TH.near, TH.far, Math.min(1, df + 0.25)));
        ctx.fillStyle = g;
        ctx.fill(path);

        ctx.save();
        ctx.clip(path);

        // sunlit rock: the left flank of each prominent peak
        const facetPath = new Path2D();
        for (const [a, b] of L.facets) {
          if (b < i0 || a > i1) continue;
          facetPath.moveTo(sx(a), sy(L.pts[a]));
          for (let i = a + 1; i <= b; i++) facetPath.lineTo(sx(i), sy(L.pts[i]));
          facetPath.lineTo(sx(b) - (sx(b) - sx(a)) * 0.16, H + 20);
          facetPath.lineTo(sx(a), H + 20);
          facetPath.closePath();
        }
        ctx.fillStyle = mixA(TH.rock, TH.far, isNear ? 0 : df * 0.5, isNear ? 0.3 : 0.22);
        ctx.fill(facetPath);

        // snow, with a ragged lower edge
        const snowH = isNear ? 2620 : 4300 + idx * 550;
        const ySnow = sy(snowH);
        if (ySnow > top) {
          const sp = new Path2D();
          sp.moveTo(sx(i0), sy(L.pts[i0]));
          for (let i = i0; i <= i1; i++) sp.lineTo(sx(i), sy(L.pts[i]));
          for (let i = i1; i >= i0; i--) {
            const rag = fbm(i * 0.22, L.seed + 5) + 0.25 * fbm(i * 1.1, L.seed + 9);
            const y = Math.max(sy(L.pts[i]), ySnow + rag * (isNear ? 34 * k : 22 * S));
            sp.lineTo(sx(i), y);
          }
          sp.closePath();
          // shaded snow is pale blue, not grey: it must still read as snow
          ctx.fillStyle = mixA(TH.snowShade, TH.far, isNear ? 0 : df * 0.35, isNear ? 1 : 0.8);
          ctx.fill(sp);
          // and where the sun hits it, it glows
          ctx.save();
          ctx.clip(sp);
          ctx.fillStyle = mixA(TH.snowLit, TH.rim, 0.12, isNear ? 0.92 : 0.7);
          ctx.fill(facetPath);
          ctx.restore();
        }

        if (isNear) {
          // rock ribs through the snow, snow in the couloirs below it. Each
          // run is filled as one tapered ribbon, so nothing overlaps itself.
          for (const gl of L.gullies) {
            const n = gl.pts.length;
            const X0 = W / 2 + (gl.pts[0][0] - camX) * k;
            if (X0 < -60 || X0 > W + 60) continue;
            let run = [];
            let runSnow = null;
            const flush = () => {
              if (run.length < 2) { run = []; return; }
              const left = [];
              const right = [];
              for (const [X, Y, hw] of run) { left.push([X - hw, Y]); right.push([X + hw, Y]); }
              ctx.beginPath();
              ctx.moveTo(left[0][0], left[0][1]);
              for (const q of left) ctx.lineTo(q[0], q[1]);
              for (let q = right.length - 1; q >= 0; q--) ctx.lineTo(right[q][0], right[q][1]);
              ctx.closePath();
              ctx.fillStyle = runSnow ? "rgba(34,38,54,0.42)" : mixA(TH.snowShade, TH.snowLit, 0.4, 0.42);
              ctx.fill();
              run = [];
            };
            for (let j = 0; j < n; j++) {
              const [x1, h1] = gl.pts[j];
              const inSnow = h1 > snowH + fbm(x1 / 120, 3) * 60;
              const taper = Math.sin(Math.PI * Math.min(1, (j + 0.5) / n)) ** 0.7;
              const pt = [W / 2 + (x1 - camX) * k, sy(h1), Math.max(0.3, gl.w * k * taper * 0.5)];
              if (runSnow !== null && inSnow !== runSnow) { run.push(pt); flush(); }
              runSnow = inSnow;
              run.push(pt);
            }
            flush();
          }
          // exposed rocks in the snowfield
          ctx.fillStyle = "rgba(30,34,48,0.45)";
          for (const r of L.rocks) {
            if (r.h < snowH - 80) continue;
            const X = W / 2 + (r.x - camX) * k;
            if (X < -10 || X > W + 10) continue;
            ctx.beginPath();
            ctx.ellipse(X, sy(r.h), Math.max(0.5, r.rx * k), Math.max(0.4, r.ry * k), r.a, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // valley fog rising from the base of the layer
        const vf = ctx.createLinearGradient(0, lerp(top, baseY, 0.6), 0, baseY);
        vf.addColorStop(0, mixA(TH.cloudBody, TH.skyHor, 0.3, 0));
        vf.addColorStop(1, mixA(TH.cloudBody, TH.skyHor, 0.3, 0.5));
        ctx.fillStyle = vf;
        ctx.fillRect(0, top, W, H - top + 20);

        // distance haze
        if (haze > 0.01) {
          ctx.fillStyle = mixA(TH.skyLow, TH.skyMid, 0.35, haze);
          ctx.fillRect(0, 0, W, H);
        }
        ctx.restore();

        // golden rim on the skyline, strongest on the layers near the sun
        if (sunUp > 0.05) {
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.strokeStyle = mixA(TH.rim, TH.sun, 0.3, (isNear ? 0.35 : 0.28 * (1 - haze)) * sunUp);
          ctx.lineWidth = isNear ? 1.4 : 1;
          ctx.beginPath();
          for (let i = i0; i <= i1; i++) {
            const X = sx(i);
            const Y = sy(L.pts[i]);
            if (i === i0) ctx.moveTo(X, Y);
            else ctx.lineTo(X, Y);
          }
          ctx.stroke();
          ctx.restore();
        }
      }

      function drawCloudSea(d, alpha) {
        if (alpha <= 0.01 || camH < CLOUD_H) return;
        const k = f / (d - camZ);
        const y = horY - (CLOUD_H - camH) * k;
        if (y > H + 40) return;
        const g = ctx.createLinearGradient(0, y - 30 * S, 0, Math.min(H, y + 220 * S));
        g.addColorStop(0, mixA(TH.cloudTop, TH.cloudBody, 0, 0));
        g.addColorStop(0.25, mixA(TH.cloudTop, TH.cloudBody, 0.2, 0.8 * alpha));
        g.addColorStop(1, mixA(TH.cloudTop, TH.cloudBody, 0.8, 0.95 * alpha));
        ctx.fillStyle = g;
        ctx.fillRect(0, y - 30 * S, W, H - y + 60 * S);
        const size = Math.min(70 * S, Math.max(10 * S, 1500 * k));
        ctx.globalAlpha = 0.55 * alpha;
        for (let i = 0; i < 40; i++) {
          const b = cloudBits[(i * 7 + Math.round(d)) % cloudBits.length];
          const wx = camX + (b.u - 0.5) * (W + 200) / k + Math.sin(t * 0.0001 + b.j * 6) * 40;
          const X = W / 2 + (wx - camX) * k;
          const sz = size * (0.6 + b.r * 0.8);
          ctx.drawImage(i % 3 ? SPR.cloud : SPR.cloudB, X - sz, y - sz * 0.3 + b.j * 8 * S, sz * 2, sz * 0.7);
        }
        ctx.globalAlpha = 1;
      }

      const seaA = ss(T_SUMMIT - 200, T_SUMMIT + 1600, t);
      // far ranges, far to near, each with a cloud deck in front of it
      // Far ranges render offscreen and fade in as one picture, so while
      // they are coming out of the haze they never read as flat cut-outs.
      if (hidden < 0.995) {
        ctx = farCtx;
        ctx.clearRect(0, 0, W, H);
        for (let i = far.length - 1; i >= 0; i--) {
          drawLayer(far[i], i, far.length, 0, false);
          drawCloudSea(far[i].d * 0.82, 1);
        }
        ctx = mainCtx;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 1 - hidden;
        ctx.drawImage(farCv, 0, 0);
        ctx.restore();
      }
      drawCloudSea(NEAR_D * 2.2, seaA);

      // ascent: the whole background is inside the cloud
      if (fog > 0.01) {
        ctx.fillStyle = mixA(TH.fog, TH.skyHor, 0.12, 0.93 * fog);
        ctx.fillRect(0, 0, W, H);
      }

      // ---- near mountain ----
      drawLayer(near, 0, 1, 0.12 * fog, true);
      drawCloudSea(NEAR_D * 0.9, seaA * crane);

      // ---- spindrift off the summit ----
      if (t > T_SUMMIT - 800) {
        if (rnd() < dt * 0.06) {
          drift.push({ x: rnd() * 60 - 30, h: SUMMIT_H - rnd() * 60, vx: 0.025 + rnd() * 0.03, vh: (rnd() - 0.3) * 0.006, age: 0, life: 1800 + rnd() * 1400 });
        }
        drift = drift.filter((p) => (p.age += dt) < p.life);
        ctx.fillStyle = "#ffffff";
        for (const p of drift) {
          p.x += p.vx * dt;
          p.h += p.vh * dt;
          const [X, Y, k] = P(p.x, p.h, NEAR_D);
          ctx.globalAlpha = 0.5 * Math.sin((p.age / p.life) * Math.PI);
          const r = Math.max(0.6, 2.4 * k * 1.1);
          ctx.fillRect(X, Y, r, r);
        }
        ctx.globalAlpha = 1;
      }

      // ---- climber ----
      {
        const [X, Y, k] = P(cx, ch, NEAR_D);
        const k0 = f / NEAR_D;
        const sc = S * Math.max(0.34, k / k0);
        const walking = t > T_CLIMB0 && t < T_SUMMIT;
        const ph = t * 0.012;
        ctx.save();
        ctx.translate(X, Y);
        ctx.scale(sc, sc);
        ctx.fillStyle = "#07090f";
        ctx.strokeStyle = "#07090f";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        const lean = walking ? 0.22 : 0;
        const bob = walking ? Math.abs(Math.sin(ph)) * 0.8 : 0;
        // legs
        ctx.lineWidth = 2.2;
        const sw = walking ? Math.sin(ph) * 3.2 : 1.6;
        ctx.beginPath();
        ctx.moveTo(0, -8 - bob); ctx.lineTo(-sw, 0);
        ctx.moveTo(0, -8 - bob); ctx.lineTo(sw, 0);
        ctx.stroke();
        // torso + pack + head
        ctx.save();
        ctx.translate(0, -8 - bob);
        ctx.rotate(lean);
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -7.5); ctx.stroke();
        ctx.fillRect(-4.6, -8.4, 3.2, 6.2);
        ctx.beginPath(); ctx.arc(0.3, -10.2, 2.1, 0, Math.PI * 2); ctx.fill();
        // arm + axe, or the flag
        ctx.lineWidth = 1.6;
        if (t < T_SUMMIT + 300) {
          const ar = walking ? Math.sin(ph + 1.4) * 2.5 : 0;
          ctx.beginPath(); ctx.moveTo(0, -6.5); ctx.lineTo(3.6 + ar * 0.3, -2.6 + ar * 0.2); ctx.stroke();
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(3.6 + ar * 0.3, -2.6); ctx.lineTo(4.6 + ar * 0.3, 7); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.moveTo(0, -6.5); ctx.lineTo(4.2, -11.5); ctx.stroke();
        }
        ctx.restore();

        // the flag goes in after the summit
        const fl = ss(T_SUMMIT + 200, T_SUMMIT + 900, t);
        if (fl > 0) {
          const poleH = 26 * fl;
          ctx.lineWidth = 1.1;
          ctx.beginPath(); ctx.moveTo(5.5, 0); ctx.lineTo(5.5, -poleH); ctx.stroke();
          if (fl > 0.6) {
            const fw = 15;
            const fh = 10;
            ctx.save();
            ctx.translate(5.5, -poleH);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            for (let i = 0; i <= 8; i++) {
              const xx = (i / 8) * fw;
              ctx.lineTo(xx, Math.sin(t * 0.012 - i * 0.7) * 1.4 * (i / 8));
            }
            for (let i = 8; i >= 0; i--) {
              const xx = (i / 8) * fw;
              ctx.lineTo(xx, fh + Math.sin(t * 0.012 - i * 0.7) * 1.4 * (i / 8));
            }
            ctx.closePath();
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            if (flagImg.complete && flagImg.naturalWidth) ctx.drawImage(flagImg, fw / 2 - 4.2, fh / 2 - 4.4 + Math.sin(t * 0.012 - 3.5) * 0.7, 8.4, 8.6);
            ctx.restore();
          }
        }
        ctx.restore();
      }

      // ---- mist rolling past during the climb ----
      if (fog > 0.01) {
        for (const m of mists) {
          const X = ((m.x + t * m.v * 0.001 * 6) % 1.4 - 0.2) * W;
          const Y = m.y * H;
          const R = m.r * H;
          ctx.globalAlpha = m.a * fog;
          ctx.drawImage(SPR.mist, X - R, Y - R * 0.5, R * 2, R);
        }
        ctx.globalAlpha = 1;
      }

      // ---- breakthrough flash / bloom ----
      const bloom = Math.exp(-Math.pow((t - T_SUMMIT) / 450, 2)) * 0.45;
      if (bloom > 0.01) {
        ctx.fillStyle = mixA(TH.sun, TH.skyHor, 0.3, bloom);
        ctx.fillRect(0, 0, W, H);
      }

      // ---- vignette + fade-in ----
      const vg = ctx.createRadialGradient(W / 2, H * 0.48, H * 0.28, W / 2, H * 0.5, H * 0.78);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(5,6,16,0.55)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);
      // film grain
      ctx.save();
      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = 0.045;
      const gx = -Math.floor(rnd() * 256);
      const gy = -Math.floor(rnd() * 256);
      for (let y = gy; y < H; y += 256) for (let x = gx; x < W; x += 256) ctx.drawImage(grain, x, y);
      ctx.restore();

      const fin = 1 - ss(0, 700, t);
      if (fin > 0) {
        ctx.fillStyle = `rgba(0,0,0,${fin})`;
        ctx.fillRect(0, 0, W, H);
      }

      if (numRef.current) {
        const n = Math.round(TARGET * Math.pow(cp, 1.12));
        numRef.current.textContent = n.toLocaleString("en-US");
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, [themeKey]);

  const cls = Array.from({ length: phase }, (_, i) => `ms-p${i + 1}`).join(" ");

  return (
    <div className={`ms-stage ms-${themeKey} ${cls}`}>
      <canvas ref={canvasRef} className="ms-canvas" aria-hidden />

      <div className="ms-top">
        <div className="ms-brand">
          <img src={mapleLogo} alt="" />
          <span>MAPLE JIU JITSU</span>
        </div>
        <div className="ms-num"><b ref={numRef}>0</b></div>
        <div className="ms-label">{label}</div>
        <div className="ms-cap">
          <span className="ms-cap1">{cap1}</span>
          <span className="ms-cap2">{cap2}</span>
        </div>
      </div>

      <div className="ms-final">
        <img className="ms-final-logo" src={mapleLogo} alt="Maple Jiu Jitsu" />
        <div className="ms-final-line"><span>{final1}</span></div>
        <div className="ms-final-line ms-final-2"><span>{final2}</span></div>
      </div>

      <div className="ms-foot">
        <div className="ms-thanks">{thanks}</div>
        <div className="ms-sign">{signoff}</div>
        <div className="ms-site">{site}</div>
      </div>
    </div>
  );
}
