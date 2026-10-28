// MapleBulletAd.js — Maple Jiu Jitsu, 3,000 followers, shot into steel.
//
// A plate hangs in a dark bay with a hot room behind it. Automatic fire walks
// across it, glyph by glyph, and the holes it punches spell 3,000 — each one
// a pit of torn metal with the light behind the plate coming through it, so
// the number arrives as light rather than as paint.
//
// WHY BACKLIT. A bullet hole in steel photographs as a dark pit with a bright
// torn lip, which on a dark plate is nearly invisible at a distance. Putting
// the light source behind the plate is what makes 249 small holes legible as
// a number from across the room — and it is the honest thing to draw, because
// a hole really does go through.
//
// HOW THE DAMAGE IS DRAWN. Not 249 meshes. The plate's maps are canvases and
// each impact paints into them: a near-black pit and a soot halo into the
// colour map, a raised lip into the bump map, bare shiny metal into the
// roughness map, a hot point into the emissive map. Painting is incremental
// while time runs forward and the whole set is repainted if time jumps back,
// so renderAt stays a pure function of t for tools/record-frames.js.
//
// three.js, a pure function of time: ?render=1 hands the clock to
// tools/record-frames.js via window.__renderAt.
import React from "react";
import * as THREE from "three";
import "../Stylesheets/MapleBulletAd.css";

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ss = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------- the glyphs, as hole positions ----------------
// "3,000" over "FOLLOWERS!", then LFG written downwards, one letter to a
// line —
// set in Impact and THINNED to a one-pixel skeleton (Zhang-Suen) before
// sampling, so every stroke is a single row of holes.
//
// IMPACT, not Arial Black. Its zero is narrow with flat sides, so it reads as
// a numeral instead of three identical ovals, and being condensed it buys
// letter height at the same block width — which is the only thing that makes
// a letter drawn in holes legible.
//
// TWO CALIBRES. Legibility is holes-per-stroke, not letter size: shrink the
// text and the block only scales back up to fill the frame. So the two small
// lines are shot with a smaller round, closer together, which is also what
// anyone would do to write small. Every hole is then nudged a few pixels off
// its sampled position, because a hand-shot group is never a clean copy and
// three identical zeros look printed.
//
// Each entry is [x, y, calibre]; x is in units of the block's own width, and
// the block is 1.291 as tall as it is wide.
const HOLES = [[-0.5024,0.1188,1.0],[-0.5005,0.0891,1.0],[-0.4650,0.2253,1.0],[-0.4976,0.2209,1.0],[-0.5017,0.1892,1.0],[-0.4992,0.1566,1.0],[-0.4668,0.1563,1.0],[-0.4576,0.5918,1.0],[-0.4530,0.4044,1.0],[-0.4428,0.3781,1.0],[-0.4378,0.3540,1.0],[-0.4358,0.6349,1.0],[-0.3692,0.2272,1.0],[-0.3552,0.1925,1.0],[-0.3509,0.1642,1.0],[-0.3538,0.1404,1.0],[-0.3539,0.1096,1.0],[-0.3713,0.0790,1.0],[-0.3966,0.0807,1.0],[-0.4120,0.1069,1.0],[-0.4120,0.1368,1.0],[-0.4124,0.1636,1.0],[-0.4141,0.1899,1.0],[-0.4066,0.2165,1.0],[-0.4050,0.5057,1.0],[-0.3766,0.5050,1.0],[-0.3568,0.5059,1.0],[-0.3553,0.4881,1.0],[-0.3427,0.4618,1.0],[-0.3376,0.4383,1.0],[-0.3412,0.4074,1.0],[-0.3428,0.3828,1.0],[-0.3539,0.3597,1.0],[-0.3646,0.3426,1.0],[-0.3923,0.3399,1.0],[-0.3962,0.6442,1.0],[-0.3607,0.6369,1.0],[-0.3467,0.6120,1.0],[-0.3428,0.5821,1.0],[-0.3489,0.5615,1.0],[-0.2927,0.2162,1.0],[-0.2902,0.1892,1.0],[-0.2919,0.1608,1.0],[-0.2930,0.1359,1.0],[-0.2914,0.1077,1.0],[-0.2881,0.0857,1.0],[-0.2606,0.0827,1.0],[-0.2383,0.3569,1.0],[-0.2355,0.3274,1.0],[-0.2441,0.2993,1.0],[-0.2645,0.2857,1.0],[-0.2093,0.2183,1.0],[-0.2103,0.1913,1.0],[-0.2105,0.1604,1.0],[-0.2109,0.1347,1.0],[-0.2101,0.1098,1.0],[-0.2010,0.0848,1.0],[-0.1772,0.0841,1.0],[-0.1355,0.6015,1.0],[-0.1396,0.5764,1.0],[-0.1437,0.5479,1.0],[-0.1440,0.5210,1.0],[-0.1440,0.4969,1.0],[-0.1457,0.4668,1.0],[-0.1426,0.4391,1.0],[-0.1404,0.4139,1.0],[-0.1381,0.3869,1.0],[-0.1285,0.1895,1.0],[-0.1297,0.1628,1.0],[-0.1289,0.1356,1.0],[-0.1244,0.1081,1.0],[-0.1182,0.0813,1.0],[-0.0986,0.6428,1.0],[-0.1241,0.6353,1.0],[-0.0709,0.6456,1.0],[-0.0498,0.6331,1.0],[-0.1200,0.3475,1.0],[-0.0884,0.3414,1.0],[-0.1147,0.2272,1.0],[-0.0834,0.2249,1.0],[-0.0722,0.1988,1.0],[-0.0701,0.1744,1.0],[-0.0673,0.1464,1.0],[-0.0692,0.1172,1.0],[-0.0776,0.0891,1.0],[-0.0372,0.6005,1.0],[-0.0310,0.5748,1.0],[-0.0300,0.5502,1.0],[-0.0269,0.5195,1.0],[-0.0273,0.4919,1.0],[-0.0259,0.4674,1.0],[-0.0262,0.4413,1.0],[-0.0282,0.4114,1.0],[-0.0335,0.3883,1.0],[-0.0467,0.3564,1.0],[-0.0156,0.2130,1.0],[-0.0102,0.1796,1.0],[-0.0071,0.1523,1.0],[-0.0025,0.1276,1.0],[-0.0036,0.1062,1.0],[0.0241,0.1085,1.0],[0.0320,0.1422,1.0],[0.0495,0.2126,1.0],[0.0449,0.1771,1.0],[0.0676,0.1618,1.0],[0.0715,0.1326,1.0],[0.0707,0.1083,1.0],[0.0936,0.0912,1.0],[0.1029,0.1179,1.0],[0.1074,0.1448,1.0],[0.1103,0.1693,1.0],[0.1142,0.1970,1.0],[0.1341,0.6429,1.0],[0.1631,0.6445,1.0],[0.1914,0.6276,1.0],[0.2033,0.5988,1.0],[0.2074,0.5755,1.0],[0.2071,0.5497,1.0],[0.2117,0.5230,1.0],[0.2103,0.4919,1.0],[0.2090,0.4675,1.0],[0.2083,0.4378,1.0],[0.2084,0.4114,1.0],[0.2003,0.3863,1.0],[0.1950,0.3634,1.0],[0.1821,0.3434,1.0],[0.1532,0.3397,1.0],[0.1201,0.3461,1.0],[0.1000,0.3872,1.0],[0.0946,0.4161,1.0],[0.0928,0.4394,1.0],[0.0942,0.4700,1.0],[0.0918,0.4964,1.0],[0.0916,0.5198,1.0],[0.0920,0.5499,1.0],[0.0937,0.5762,1.0],[0.1006,0.6024,1.0],[0.1105,0.6335,1.0],[0.1292,0.2300,1.0],[0.2071,0.2221,1.0],[0.1713,0.2171,1.0],[0.1720,0.1890,1.0],[0.1729,0.1593,1.0],[0.1712,0.1277,1.0],[0.1734,0.1023,1.0],[0.1847,0.0829,1.0],[0.2123,0.0860,1.0],[0.2080,0.1570,1.0],[0.3120,0.2231,1.0],[0.3226,0.1983,1.0],[0.3174,0.1739,1.0],[0.2949,0.1566,1.0],[0.2652,0.1593,1.0],[0.2663,0.1878,1.0],[0.2664,0.2183,1.0],[0.3169,0.1387,1.0],[0.3243,0.1121,1.0],[0.3213,0.0896,1.0],[0.2655,0.1186,1.0],[0.2673,0.0901,1.0],[0.3582,0.6392,1.0],[0.3464,0.6278,1.0],[0.3345,0.5946,1.0],[0.3309,0.5691,1.0],[0.3305,0.5411,1.0],[0.3281,0.5115,1.0],[0.3302,0.4873,1.0],[0.3286,0.4588,1.0],[0.3271,0.4345,1.0],[0.3341,0.4086,1.0],[0.3382,0.3801,1.0],[0.3462,0.3575,1.0],[0.3904,0.2220,1.0],[0.3779,0.1933,1.0],[0.3856,0.1754,1.0],[0.4066,0.1593,1.0],[0.4281,0.1421,1.0],[0.3805,0.1099,1.0],[0.3865,0.0855,1.0],[0.3986,0.6466,1.0],[0.4231,0.6331,1.0],[0.4342,0.6045,1.0],[0.4425,0.5812,1.0],[0.4427,0.5547,1.0],[0.4444,0.5234,1.0],[0.4479,0.4978,1.0],[0.4481,0.4727,1.0],[0.4437,0.4431,1.0],[0.4442,0.4159,1.0],[0.4393,0.3927,1.0],[0.4313,0.3598,1.0],[0.4151,0.3457,1.0],[0.3801,0.3406,1.0],[0.4286,0.2243,1.0],[0.4322,0.2053,1.0],[0.4395,0.1090,1.0],[0.4310,0.0818,1.0],[0.4975,0.1813,1.0],[0.4959,0.1538,1.0],[0.4969,0.1280,1.0],[0.4983,0.2177,1.0],[0.5022,0.0815,1.0],[-0.0179,-0.0812,0.62],[-0.0184,-0.0958,0.62],[-0.0174,-0.1144,0.62],[-0.0200,-0.1277,0.62],[-0.0185,-0.1453,0.62],[-0.0155,-0.1596,0.62],[-0.0198,-0.1761,0.62],[-0.0173,-0.1924,0.62],[-0.0078,-0.2048,0.62],[0.0045,-0.2124,0.62],[0.0179,-0.2099,0.62],[0.0383,-0.2135,0.62],[0.0114,-0.2774,0.62],[0.0274,-0.2774,0.62],[0.0395,-0.2768,0.62],[-0.0111,-0.2828,0.62],[-0.0193,-0.2942,0.62],[-0.0232,-0.3172,0.62],[-0.0209,-0.3312,0.62],[-0.0151,-0.3516,0.62],[-0.0205,-0.3623,0.62],[-0.0234,-0.3796,0.62],[-0.0219,-0.3933,0.62],[-0.0211,-0.4092,0.62],[0.0053,-0.3493,0.62],[0.0198,-0.3508,0.62],[0.0370,-0.3478,0.62],[-0.0136,-0.4887,0.62],[0.0036,-0.4859,0.62],[0.0221,-0.4883,0.62],[0.0251,-0.4979,0.62],[0.0345,-0.5146,0.62],[0.0205,-0.5731,0.62],[0.0325,-0.5843,0.62],[0.0435,-0.5961,0.62],[0.0416,-0.6128,0.62],[0.0499,-0.6195,0.62],[0.0514,-0.6361,0.62],[0.0218,-0.6289,0.62],[0.0111,-0.6389,0.62],[-0.0002,-0.6434,0.62],[-0.0196,-0.6470,0.62],[-0.0272,-0.6444,0.62],[-0.0408,-0.6220,0.62],[-0.0438,-0.6113,0.62],[-0.0469,-0.5949,0.62],[-0.0497,-0.5770,0.62],[-0.0474,-0.5599,0.62],[-0.0470,-0.5469,0.62],[-0.0444,-0.5303,0.62],[-0.0357,-0.5085,0.62],[-0.0307,-0.4939,0.62]];

// ---------------- timeline (ms) ----------------
const T_FIRE = 950; // first round leaves
// Automatic fire in bursts: a run of rounds at a fixed cadence, then the
// shooter resets onto the next part of the glyph. Deterministic, so the shot
// times are the same on every render and the recorder can seek anywhere.
const SHOT_T = (() => {
  const r = mulberry32(9931);
  const out = [];
  let t = T_FIRE;
  let left = 0;
  for (let i = 0; i < HOLES.length; i++) {
    if (left === 0) {
      left = 16 + Math.floor(r() * 9);
      if (i) t += 70 + r() * 45; // swing onto the next run
    }
    out.push(t);
    t += 12 + r() * 4;
    left -= 1;
  }
  return out;
})();
const T_LAST = SHOT_T[SHOT_T.length - 1];
const T_SETTLE = T_LAST + 620; // the wall is quiet, the smoke is still there
const T_WORD = T_SETTLE + 950;
const T_THANKS = T_WORD + 1150;
const END_MS = T_THANKS + 3900;

// ---------------- the wall, and the damage layer on it ----------------
// The steel fills the frame: a 9:16 crop has no room for a plate with its
// edges showing, and the edges were landing inside the safe margin anyway.
//
// The damage does NOT live in the wall's own texture. At a resolution that
// covers a wall this size, a bullet hole is three pixels across. So the holes
// get their own plane, sized to the number and nothing more, sitting a few
// millimetres proud of the wall and TRANSPARENT everywhere a hole is not.
// The wall shows through it, there is no seam to hide, and each hole gets
// fourteen pixels of radius to be torn metal in.
const WALLW = 9;
const WALLH = 9;
const PY = 1.62; // the line the number is shot along
const DW = 2.6; // damage layer
const DH = 3.3;
const SPAN = 2.0; // the block's width
const CW = 1600;
const CH = Math.round((CW * DH) / DW);
const HOLE_R = 10.5;

// hole centre -> damage-canvas px
const toCanvas = (h) => [((h[0] * SPAN) / DW + 0.5) * CW, (0.5 - (h[1] * SPAN) / DH) * CH];
// hole centre -> world
const toWorld = (h) => [h[0] * SPAN, PY + h[1] * SPAN];

// ---------------- procedural steel ----------------
function steelCanvas() {
  // CLEAN. Earlier versions piled on mottling, heavy brushed streaks and rust
  // and the wall read as video noise rather than as metal. What makes metal
  // look like metal here is the environment it reflects, not texture — so
  // this is a flat grey with a fine horizontal grain and a handful of old
  // scuffs, and nothing else.
  const SW = 1024;
  const c = document.createElement("canvas");
  c.width = SW;
  c.height = SW;
  const x = c.getContext("2d");
  const r = mulberry32(4242);
  x.fillStyle = "#8a8d90";
  x.fillRect(0, 0, SW, SW);

  // the grain of rolled steel: fine, horizontal, barely there
  for (let i = 0; i < 2200; i++) {
    const py = r() * SW;
    const px = r() * SW;
    const len = 120 + r() * 700;
    const v = r() > 0.5 ? 255 : 0;
    x.strokeStyle = `rgba(${v},${v},${v},${0.0022 + r() * 0.0035})`;
    x.lineWidth = 0.8 + r() * 1.6;
    x.beginPath();
    x.moveTo(px, py);
    x.lineTo(px + len, py);
    x.stroke();
  }

  // a few scuffs so it is not a brand-new sheet
  for (let i = 0; i < 26; i++) {
    const px = r() * SW;
    const py = r() * SW;
    x.strokeStyle = `rgba(40,40,40,${0.02 + r() * 0.035})`;
    x.lineWidth = 0.8 + r() * 1.8;
    x.beginPath();
    x.moveTo(px, py);
    x.lineTo(px + (r() - 0.5) * 170, py + (r() - 0.5) * 42);
    x.stroke();
  }
  return c;
}

function fill(w, h, colour) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const x = c.getContext("2d");
  x.fillStyle = colour;
  x.fillRect(0, 0, w, h);
  return c;
}

function setFx(el, opacity, y = 0, scale = 1) {
  if (!el) return;
  el.style.opacity = opacity.toFixed(3);
  el.style.transform = `translateY(${y.toFixed(2)}px) scale(${scale.toFixed(3)})`;
}

// ---------------- the damage, painted into the plate's maps ----------------
// Four canvases, one per channel the eye reads a bullet hole by:
//   colour     the pit, and the soot the gas lays down around it
//   bump       the lip of torn metal standing proud of the surface
//   roughness  that lip is bare, so it is the shiniest thing on an old plate
//   emissive   the hot room behind the plate, coming through
function makeDamage() {
  const mk = () => {
    const c = document.createElement("canvas");
    c.width = CW;
    c.height = CH;
    return [c, c.getContext("2d")];
  };
  const [colour, cx] = mk();   // transparent except where a round went in
  const [bump, bx] = mk();
  const [rough, rx] = mk();
  const [metal, mx] = mk();
  const [alpha, ax] = mk();

  const rnd = mulberry32(5150);
  // each hole gets its own torn outline, decided once
  const shapes = HOLES.map(() => {
    const pts = [];
    for (let i = 0; i < 13; i++) pts.push(0.82 + rnd() * 0.38);
    return { pts, rot: rnd() * Math.PI * 2, scale: 0.88 + rnd() * 0.3 };
  });

  function torn(ctx, px, py, rad, sh, grow) {
    ctx.beginPath();
    const n = sh.pts.length;
    for (let i = 0; i <= n; i++) {
      const a = sh.rot + ((i % n) / n) * Math.PI * 2;
      const r = rad * sh.pts[i % n] * grow;
      const X = px + Math.cos(a) * r;
      const Y = py + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(X, Y);
      else ctx.lineTo(X, Y);
    }
    ctx.closePath();
  }

  function paint(i) {
    const [px, py] = toCanvas(HOLES[i]);
    const sh = shapes[i];
    const R = HOLE_R * sh.scale * (HOLES[i][2] || 1);

    // Everything this layer draws has to carry its own alpha, because the
    // wall behind it is doing the rest. Soot first: the dirty halo the muzzle
    // gas lays down, wide and soft.
    let g = cx.createRadialGradient(px, py, R * 0.7, px, py, R * 3.2);
    g.addColorStop(0, "rgba(9,9,10,0.82)");
    g.addColorStop(0.5, "rgba(14,13,13,0.4)");
    g.addColorStop(1, "rgba(14,13,13,0)");
    cx.fillStyle = g;
    cx.fillRect(px - R * 3.2, py - R * 3.2, R * 6.4, R * 6.4);
    ax.fillStyle = g;
    ax.fillRect(px - R * 3.2, py - R * 3.2, R * 6.4, R * 6.4);
    rx.fillStyle = "rgba(255,255,255,0.30)"; // soot is matte
    rx.beginPath();
    rx.arc(px, py, R * 2.4, 0, Math.PI * 2);
    rx.fill();

    // The lip. Metal does not vanish — it is pushed out of the hole and left
    // standing proud and bare, and bare steel is the brightest thing here.
    torn(cx, px, py, R, sh, 1.22);
    cx.fillStyle = "#8b9198";
    cx.fill();
    torn(cx, px, py, R, sh, 1.08);
    cx.fillStyle = "#b4bcc4";
    cx.fill();
    torn(ax, px, py, R, sh, 1.30);
    ax.fillStyle = "#ffffff";
    ax.fill();
    torn(bx, px, py, R, sh, 1.26);
    bx.fillStyle = "#f2f2f2"; // standing proud
    bx.fill();
    torn(rx, px, py, R, sh, 1.2);
    rx.fillStyle = "rgba(0,0,0,0.85)"; // and polished, so it catches the key
    rx.fill();

    // The lip is bare metal and reflects; the pit is a void and does not.
    // Without this the pit renders as a grey mirror of the environment and
    // the hole stops reading as a hole at all.
    torn(mx, px, py, R, sh, 1.3);
    mx.fillStyle = "#ffffff";
    mx.fill();

    // The pit itself.
    torn(cx, px, py, R, sh, 1);
    cx.fillStyle = "#050607";
    cx.fill();
    torn(bx, px, py, R, sh, 1);
    bx.fillStyle = "#060606"; // sunk
    bx.fill();
    torn(mx, px, py, R, sh, 1);
    mx.fillStyle = "#000000";
    mx.fill();
    torn(rx, px, py, R, sh, 1);
    rx.fillStyle = "rgba(255,255,255,0.9)"; // and matte
    rx.fill();

  }

  function reset() {
    for (const c of [cx, bx, rx, mx, ax]) c.clearRect(0, 0, CW, CH);
  }

  const tex = (c, srgb) => {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    t.anisotropy = 8;
    return t;
  };
  const texColour = tex(colour, true);
  const texBump = tex(bump, false);
  const texRough = tex(rough, false);
  const texMetal = tex(metal, false);
  const texAlpha = tex(alpha, false);

  let drawn = 0;
  return {
    texColour,
    texBump,
    texRough,
    texMetal,
    texAlpha,
    // Pure in effect: forward in time paints the new holes, backward repaints
    // from scratch, so any frame can be asked for in any order.
    to(n) {
      if (n === drawn) return;
      if (n < drawn) {
        reset();
        drawn = 0;
      }
      for (let i = drawn; i < n; i++) paint(i);
      drawn = n;
      texColour.needsUpdate = true;
      texBump.needsUpdate = true;
      texRough.needsUpdate = true;
      texMetal.needsUpdate = true;
      texAlpha.needsUpdate = true;
    },
  };
}

export default function MapleBulletAd() {
  const mountRef = React.useRef(null);

  React.useEffect(() => {
    const renderMode = new URLSearchParams(window.location.search).get("render") === "1";
    const mount = mountRef.current;
    const W = window.innerWidth;
    const H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#74777a");
    scene.fog = new THREE.FogExp2("#74777a", 0.008);
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.05, 200);

    // ---- what the metal reflects ----
    // A metal with no environment reflects nothing and renders black, which
    // is how a wall lit by three white lights still came out near-black. So
    // the scene gets one: a plain grey gradient, no detail, no colour. It is
    // what makes the steel read as grey steel and what puts a glint on the
    // lip of every hole.
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 64;
    envCanvas.height = 32;
    {
      const ex2 = envCanvas.getContext("2d");
      const g = ex2.createLinearGradient(0, 0, 0, 32);
      // A BAND, NOT A RAMP. A smooth gradient reflects as an even wash and
      // the wall reads matte however low the roughness goes. Polished metal
      // shows you the bright thing in the room, so the environment has one:
      // a hot band a little above the middle, which the wall returns as a
      // broad horizontal sheen.
      g.addColorStop(0, "#f7f8f9");
      g.addColorStop(0.33, "#c8ccd0");
      g.addColorStop(0.45, "#ffffff");
      g.addColorStop(0.57, "#c4c8cc");
      g.addColorStop(1, "#777a7d");
      ex2.fillStyle = g;
      ex2.fillRect(0, 0, 64, 32);
    }
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    envTex.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromEquirectangular(envTex).texture;
    envTex.dispose();
    pmrem.dispose();

    // ---- light ----
    // Flat and neutral on purpose. A spotlight put a bright pool in one
    // corner and tinted lights left a sheen on the steel; the brief is a
    // solid grey wall, so every source here is pure white and nothing casts
    // a pool. The shape in the frame comes from the holes, not the lighting.
    const key = new THREE.DirectionalLight("#ffffff", 2.7);
    key.position.set(-3.2, 4.0, 6.0);
    scene.add(key);
    const fill2 = new THREE.DirectionalLight("#ffffff", 0.95);
    fill2.position.set(4.6, -1.2, 5.0);
    scene.add(fill2);
    scene.add(new THREE.AmbientLight("#ffffff", 0.75));

    // ---- the wall, and the damage on it ----
    const steelTex = new THREE.CanvasTexture(steelCanvas());
    steelTex.colorSpace = THREE.SRGBColorSpace;
    steelTex.wrapS = steelTex.wrapT = THREE.RepeatWrapping;
    steelTex.repeat.set(1, 1);
    steelTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(WALLW, WALLH),
      new THREE.MeshStandardMaterial({ map: steelTex, roughness: 0.3, metalness: 0.82, color: "#a7abae" })
    );
    wall.position.set(0, PY, 0);
    scene.add(wall);

    const dmg = makeDamage();
    const dmgMat = new THREE.MeshStandardMaterial({
      map: dmg.texColour,
      alphaMap: dmg.texAlpha,
      transparent: true,
      bumpMap: dmg.texBump,
      bumpScale: 22,
      roughnessMap: dmg.texRough,
      metalnessMap: dmg.texMetal,
      roughness: 1,
      metalness: 1,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    const decal = new THREE.Mesh(new THREE.PlaneGeometry(DW, DH), dmgMat);
    decal.position.set(0, PY, 0.004);
    scene.add(decal);

    // ---- sparks ----
    const PER = 11;
    const RECENT = 26;
    const SPARKS = PER * RECENT;
    const sparkGeo = new THREE.BoxGeometry(0.004, 0.004, 0.03);
    const sparks = new THREE.InstancedMesh(
      sparkGeo,
      new THREE.MeshBasicMaterial({ toneMapped: false }),
      SPARKS
    );
    sparks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    sparks.frustumCulled = false;
    scene.add(sparks);
    const sparkRnd = mulberry32(606);
    const sparkSeed = Array.from({ length: HOLES.length * PER }, () => ({
      a: sparkRnd() * Math.PI * 2,
      up: 0.1 + sparkRnd() * 0.8,
      out: 0.5 + sparkRnd() * 1.5,
      fwd: 1.2 + sparkRnd() * 2.6,
      life: 0.1 + sparkRnd() * 0.17,
      spin: sparkRnd() * 26,
    }));

    // ---- smoke ----
    const PUFFS = 22;
    // A SMOKE SPRITE, NOT A BLUR. A plain radial gradient reads as an
    // airbrushed dot however you animate it; real smoke is lumpy at every
    // scale. So this builds a cloud out of forty soft blobs scattered inside
    // the disc, then punches the whole thing out with a radial alpha so it
    // has no edge. Rotating each instance differently does the rest — the
    // same sprite never shows the same way twice.
    const puffTex = (() => {
      const S = 256;
      const c = document.createElement("canvas");
      c.width = c.height = S;
      const x = c.getContext("2d");
      const r = mulberry32(2468);
      for (let i = 0; i < 40; i++) {
        const a2 = r() * Math.PI * 2;
        const rad = Math.pow(r(), 0.65) * S * 0.3;
        const px = S / 2 + Math.cos(a2) * rad;
        const py = S / 2 + Math.sin(a2) * rad;
        const br = S * (0.07 + r() * 0.2);
        const v = 150 + Math.floor(r() * 70);
        const g = x.createRadialGradient(px, py, 0, px, py, br);
        g.addColorStop(0, `rgba(${v},${v},${v + 4},${0.1 + r() * 0.16})`);
        g.addColorStop(1, `rgba(${v},${v},${v + 4},0)`);
        x.fillStyle = g;
        x.fillRect(px - br, py - br, br * 2, br * 2);
      }
      // no edge: fade the whole cloud out towards the rim
      x.globalCompositeOperation = "destination-in";
      const mask = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      mask.addColorStop(0, "rgba(0,0,0,1)");
      mask.addColorStop(0.55, "rgba(0,0,0,0.85)");
      mask.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = mask;
      x.fillRect(0, 0, S, S);
      return new THREE.CanvasTexture(c);
    })();

    const puffs = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: puffTex, transparent: true, depthWrite: false, opacity: 1 }),
      PUFFS
    );
    puffs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    puffs.frustumCulled = false;
    scene.add(puffs);

    // ---- tracers ----
    const TR = 10;
    const tracers = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.006, 0.006, 0.26),
      new THREE.MeshBasicMaterial({ color: "#ffd9a0", toneMapped: false, transparent: true, opacity: 0.9 }),
      TR
    );
    tracers.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    tracers.frustumCulled = false;
    scene.add(tracers);
    const MUZZLE = new THREE.Vector3(-2.4, 0.55, 8.4); // behind and left of camera

    // ---- impact flash ----
    const flash = new THREE.PointLight("#ffd0a0", 0, 2.1, 2);
    scene.add(flash);

    const dummy = new THREE.Object3D();
    const hidden = new THREE.Matrix4().makeScale(0, 0, 0);
    const col = new THREE.Color();
    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();

    // how many rounds have landed by t
    function landed(t) {
      let lo = 0;
      let hi = SHOT_T.length;
      while (lo < hi) {
        const m = (lo + hi) >> 1;
        if (SHOT_T[m] <= t) lo = m + 1;
        else hi = m;
      }
      return lo;
    }

    function renderAt(t) {
      const n = landed(t);
      dmg.to(n);

      // ---- the wall takes the hits ----
      // A wall does not swing, but it rings: the surface flexes a fraction of
      // a millimetre and the camera is what shows it.

      // more holes, more of the room behind coming through

      // ---- sparks ----
      let si = 0;
      for (let i = Math.max(0, n - RECENT); i < n; i++) {
        const [wx, wy] = toWorld(HOLES[i]);
        const dt = (t - SHOT_T[i]) / 1000;
        for (let k = 0; k < PER; k++) {
          const s = sparkSeed[i * PER + k];
          if (si >= SPARKS) break;
          if (dt < 0 || dt > s.life) {
            sparks.setMatrixAt(si, hidden);
            si += 1;
            continue;
          }
          const u = dt / s.life;
          dummy.position.set(
            wx + Math.cos(s.a) * s.out * dt,
            wy + Math.sin(s.a) * s.out * dt + s.up * dt - 7.5 * dt * dt,
            s.fwd * dt
          );
          dummy.rotation.set(s.spin * dt, s.a, s.spin * dt * 0.7);
          const sc = 1 - u * 0.75;
          dummy.scale.set(sc, sc, sc * (1 + u * 1.4)); // stretches as it flies
          dummy.updateMatrix();
          sparks.setMatrixAt(si, dummy.matrix);
          // white hot, then orange, then gone
          col.setRGB(1, 0.86 - u * 0.5, 0.52 - u * 0.5).multiplyScalar(1 - u * 0.2);
          sparks.setColorAt(si, col);
          si += 1;
        }
      }
      for (; si < SPARKS; si++) sparks.setMatrixAt(si, hidden);
      sparks.instanceMatrix.needsUpdate = true;
      if (sparks.instanceColor) sparks.instanceColor.needsUpdate = true;

      // ---- smoke ----
      for (let p = 0; p < PUFFS; p++) {
        const i = n - 1 - p;
        if (i < 0) {
          puffs.setMatrixAt(p, hidden);
          continue;
        }
        const dt = (t - SHOT_T[i]) / 1000;
        if (dt < 0 || dt > 1.5) {
          puffs.setMatrixAt(p, hidden);
          continue;
        }
        const [wx, wy] = toWorld(HOLES[i]);
        const u = dt / 1.5;
        dummy.position.set(wx, wy + dt * 0.42, 0.1 + dt * 0.3);
        dummy.quaternion.copy(camera.quaternion);
        const sc = 0.07 + dt * 0.34;
        dummy.scale.set(sc, sc, sc);
        dummy.updateMatrix();
        puffs.setMatrixAt(p, dummy.matrix);
      }
      puffs.instanceMatrix.needsUpdate = true;
      puffs.material.opacity = 0.2;

      // ---- tracers: the round itself, for the last few metres ----
      let ti = 0;
      for (let i = n; i < Math.min(HOLES.length, n + 3); i++) {
        const lead = SHOT_T[i] - t;
        if (ti >= TR || lead < 0 || lead > 70) continue;
        const [wx, wy] = toWorld(HOLES[i]);
        vA.set(wx, wy, 0);
        const u = 1 - lead / 70;
        vB.copy(MUZZLE).lerp(vA, 0.55 + 0.45 * u);
        dummy.position.copy(vB);
        dummy.lookAt(vA);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        tracers.setMatrixAt(ti, dummy.matrix);
        ti += 1;
      }
      for (; ti < TR; ti++) tracers.setMatrixAt(ti, hidden);
      tracers.instanceMatrix.needsUpdate = true;

      // ---- muzzle-side flash on the plate ----
      let fl = 0;
      let fx = 0;
      let fy = PY;
      for (let i = Math.max(0, n - 6); i < n; i++) {
        const dt = t - SHOT_T[i];
        if (dt < 0 || dt > 80) continue;
        const e = Math.exp(-dt / 26);
        if (e > fl) {
          fl = e;
          const w = toWorld(HOLES[i]);
          fx = w[0];
          fy = w[1];
        }
      }
      flash.intensity = fl * 2.1;
      flash.position.set(fx, fy, 0.5);

      // ---- camera ----
      // In close while it is being shot, back off to read the whole number.
      // ONE DISTANCE, ALL THE WAY THROUGH. Nothing moves under the viewer
      // at the moment the last round lands; only a slow handheld float.
      const dist = 7.18;
      let camX = Math.sin(t / 2300) * 0.055;
      let camY = PY + Math.cos(t / 2700) * 0.04;
      let camZ = dist;
      // handheld, and a kick on every round
      let shake = 0;
      for (let i = Math.max(0, n - 8); i < n; i++) {
        const dt = t - SHOT_T[i];
        if (dt >= 0 && dt < 220) shake += 0.009 * Math.exp(-dt / 70);
      }
      camX += Math.sin(t * 0.021) * 0.012 + Math.sin(t * 0.13) * shake;
      camY += Math.cos(t * 0.017) * 0.010 + Math.cos(t * 0.11) * shake;
      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, PY + 0.02, 0);
      camera.rotation.z += Math.sin(t * 0.0009) * 0.004;
      camera.updateProjectionMatrix();

      renderer.render(scene, camera);

    }

    let raf;
    let disposed = false;
    (async () => {
      try {
        await document.fonts.load('400 100px "Bebas Neue"');
        await document.fonts.load("800 40px Inter");
      } catch (e) { /* fonts are a nicety */ }
      if (disposed) return;
      renderAt(0);
      if (renderMode) {
        window.__renderAt = (ms) => renderAt(ms);
        window.__bulletEnd = END_MS;
        window.__bulletMarks = { T_FIRE, T_LAST, T_SETTLE, T_WORD, T_THANKS, END_MS, HOLES: HOLES.length };
        window.__ready = true;
        return;
      }
      const t0 = performance.now();
      const loop = (now) => {
        renderAt(now - t0);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="bu-stage">
      <div className="bu-canvas" ref={mountRef} />
      <div className="bu-vignette" aria-hidden />
    </div>
  );
}
