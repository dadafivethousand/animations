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
// "3,000" over "FOLLOWERS!", then LFG and OSS each written downwards one
// letter to a line —
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
// the block is 2.086 as tall as it is wide, so height is what frames it.
const HOLES = [[-0.4966,0.6242,1.0],[-0.4675,0.6211,1.0],[-0.5020,0.5972,1.0],[-0.5015,0.5667,1.0],[-0.5019,0.5398,1.0],[-0.4991,0.5161,1.0],[-0.4753,0.5549,1.0],[-0.4134,1.0402,1.0],[-0.3881,1.0444,1.0],[-0.3565,1.0361,1.0],[-0.3483,1.0120,1.0],[-0.3425,0.9815,1.0],[-0.3482,0.9586,1.0],[-0.3535,0.9298,1.0],[-0.3760,0.9024,1.0],[-0.4063,0.9059,1.0],[-0.3546,0.8856,1.0],[-0.3468,0.8625,1.0],[-0.3360,0.8360,1.0],[-0.3396,0.8082,1.0],[-0.3417,0.7845,1.0],[-0.3508,0.7574,1.0],[-0.3823,0.7383,1.0],[-0.4236,0.7392,1.0],[-0.4391,0.7577,1.0],[-0.4459,0.7826,1.0],[-0.4494,0.8107,1.0],[-0.4679,0.9858,1.0],[-0.4466,1.0047,1.0],[-0.4377,1.0329,1.0],[-0.3913,0.6247,1.0],[-0.4074,0.6051,1.0],[-0.4151,0.5797,1.0],[-0.4106,0.5513,1.0],[-0.4102,0.5268,1.0],[-0.4082,0.4965,1.0],[-0.3911,0.4757,1.0],[-0.3622,0.4868,1.0],[-0.3574,0.5090,1.0],[-0.3549,0.5403,1.0],[-0.3537,0.5645,1.0],[-0.3533,0.5928,1.0],[-0.3626,0.6180,1.0],[-0.2926,0.6167,1.0],[-0.2908,0.5882,1.0],[-0.2940,0.5641,1.0],[-0.2934,0.5337,1.0],[-0.2903,0.5054,1.0],[-0.2813,0.4836,1.0],[-0.2384,0.7532,1.0],[-0.2358,0.7315,1.0],[-0.2430,0.7030,1.0],[-0.2638,0.6847,1.0],[-0.2100,0.6139,1.0],[-0.2105,0.5883,1.0],[-0.2096,0.5637,1.0],[-0.2062,0.5361,1.0],[-0.2097,0.5082,1.0],[-0.1983,0.4821,1.0],[-0.0870,1.0435,1.0],[-0.0618,1.0381,1.0],[-0.0413,1.0197,1.0],[-0.0327,0.9971,1.0],[-0.0297,0.9665,1.0],[-0.0250,0.9387,1.0],[-0.0241,0.9137,1.0],[-0.0270,0.8852,1.0],[-0.0273,0.8605,1.0],[-0.0284,0.8338,1.0],[-0.0299,0.8065,1.0],[-0.0326,0.7789,1.0],[-0.0450,0.7518,1.0],[-0.0668,0.7368,1.0],[-0.1234,0.7442,1.0],[-0.1297,0.7719,1.0],[-0.1397,0.7958,1.0],[-0.1425,0.8251,1.0],[-0.1412,0.8522,1.0],[-0.1446,0.8801,1.0],[-0.1438,0.9044,1.0],[-0.1437,0.9310,1.0],[-0.1441,0.9609,1.0],[-0.1373,0.9866,1.0],[-0.1307,1.0111,1.0],[-0.1172,1.0386,1.0],[-0.1063,0.6271,1.0],[-0.1232,0.6063,1.0],[-0.1297,0.5819,1.0],[-0.1277,0.5507,1.0],[-0.1281,0.5229,1.0],[-0.1216,0.4987,1.0],[-0.1034,0.4788,1.0],[-0.0761,0.4827,1.0],[-0.0691,0.5127,1.0],[-0.0691,0.5382,1.0],[-0.0686,0.5663,1.0],[-0.0691,0.5902,1.0],[-0.0757,0.6195,1.0],[0.1376,0.6342,1.0],[0.1166,0.6113,1.0],[0.1150,0.5868,1.0],[0.1105,0.5565,1.0],[0.1072,0.5302,1.0],[0.1036,0.5018,1.0],[0.0740,0.5102,1.0],[0.0720,0.5346,1.0],[0.0657,0.5646,1.0],[0.0521,0.5825,1.0],[0.0502,0.6148,1.0],[0.0352,0.5657,1.0],[0.0332,0.5360,1.0],[0.0297,0.5112,1.0],[-0.0045,0.5088,1.0],[-0.0059,0.5375,1.0],[-0.0081,0.5634,1.0],[-0.0082,0.5896,1.0],[-0.0116,0.6193,1.0],[0.1730,0.5974,1.0],[0.1768,0.5705,1.0],[0.1752,0.5388,1.0],[0.1739,0.5147,1.0],[0.1744,0.4847,1.0],[0.2029,0.4803,1.0],[0.1968,0.5533,1.0],[0.2077,0.6226,1.0],[0.1827,0.6208,1.0],[0.1501,1.0416,1.0],[0.1771,1.0397,1.0],[0.1960,1.0193,1.0],[0.2040,0.9971,1.0],[0.2097,0.9660,1.0],[0.2125,0.9432,1.0],[0.2110,0.9156,1.0],[0.2108,0.8846,1.0],[0.2112,0.8612,1.0],[0.2092,0.8335,1.0],[0.2089,0.8070,1.0],[0.2013,0.7807,1.0],[0.1919,0.7511,1.0],[0.1669,0.7372,1.0],[0.1138,0.7432,1.0],[0.1036,0.7690,1.0],[0.0984,0.7999,1.0],[0.0929,0.8229,1.0],[0.0941,0.8516,1.0],[0.0930,0.8775,1.0],[0.0938,0.9079,1.0],[0.0944,0.9335,1.0],[0.0970,0.9592,1.0],[0.1003,0.9886,1.0],[0.1073,1.0129,1.0],[0.1228,1.0347,1.0],[0.2757,0.6240,1.0],[0.3039,0.6246,1.0],[0.3223,0.6021,1.0],[0.3214,0.5765,1.0],[0.3167,0.5397,1.0],[0.3232,0.5189,1.0],[0.3252,0.4915,1.0],[0.2695,0.4885,1.0],[0.2671,0.5136,1.0],[0.2689,0.5443,1.0],[0.2899,0.5588,1.0],[0.2667,0.5738,1.0],[0.2690,0.5996,1.0],[0.3841,1.0407,1.0],[0.4134,1.0402,1.0],[0.4325,1.0200,1.0],[0.4394,0.9971,1.0],[0.4480,0.9700,1.0],[0.4484,0.9398,1.0],[0.4490,0.9150,1.0],[0.4504,0.8855,1.0],[0.4461,0.8579,1.0],[0.4480,0.8343,1.0],[0.4430,0.8084,1.0],[0.4416,0.7772,1.0],[0.4292,0.7551,1.0],[0.4032,0.7391,1.0],[0.3516,0.7473,1.0],[0.3406,0.7688,1.0],[0.3332,0.7981,1.0],[0.3320,0.8264,1.0],[0.3281,0.8539,1.0],[0.3287,0.8759,1.0],[0.3327,0.9044,1.0],[0.3329,0.9335,1.0],[0.3305,0.9575,1.0],[0.3362,0.9842,1.0],[0.3422,1.0140,1.0],[0.3589,1.0347,1.0],[0.4000,0.6283,1.0],[0.4261,0.6230,1.0],[0.3858,0.6058,1.0],[0.3827,0.5781,1.0],[0.4051,0.5617,1.0],[0.4287,0.5427,1.0],[0.4398,0.5199,1.0],[0.4355,0.4922,1.0],[0.3913,0.4825,1.0],[0.3842,0.5059,1.0],[0.5001,0.4796,1.0],[0.4998,0.6160,1.0],[0.4993,0.5906,1.0],[0.5004,0.5605,1.0],[0.4975,0.5364,1.0],[-0.0126,0.3173,0.62],[-0.0092,0.3032,0.62],[-0.0140,0.2866,0.62],[-0.0112,0.2702,0.62],[-0.0101,0.2554,0.62],[-0.0114,0.2378,0.62],[-0.0143,0.2247,0.62],[-0.0106,0.2047,0.62],[-0.0092,0.1926,0.62],[-0.0005,0.1791,0.62],[0.0126,0.1798,0.62],[-0.0074,0.1110,0.62],[0.0090,0.1079,0.62],[0.0219,0.1096,0.62],[-0.0135,0.0970,0.62],[-0.0167,0.0773,0.62],[-0.0130,0.0631,0.62],[-0.0163,0.0456,0.62],[-0.0012,0.0395,0.62],[0.0156,0.0396,0.62],[-0.0116,0.0309,0.62],[-0.0131,0.0132,0.62],[-0.0117,0.0006,0.62],[-0.0150,-0.0197,0.62],[-0.0037,-0.0975,0.62],[0.0138,-0.0985,0.62],[0.0213,-0.1105,0.62],[0.0285,-0.1288,0.62],[-0.0213,-0.1027,0.62],[-0.0290,-0.1189,0.62],[-0.0299,-0.1331,0.62],[-0.0305,-0.1472,0.62],[-0.0322,-0.1637,0.62],[-0.0346,-0.1819,0.62],[-0.0348,-0.1952,0.62],[-0.0345,-0.2128,0.62],[-0.0282,-0.2283,0.62],[-0.0272,-0.2469,0.62],[-0.0001,-0.2580,0.62],[0.0104,-0.2472,0.62],[0.0260,-0.2420,0.62],[0.0389,-0.2524,0.62],[0.0298,-0.2232,0.62],[0.0323,-0.2059,0.62],[0.0290,-0.1932,0.62],[0.0146,-0.1864,0.62],[-0.0013,-0.4567,0.62],[0.0135,-0.4551,0.62],[0.0212,-0.4675,0.62],[0.0299,-0.4863,0.62],[0.0294,-0.5039,0.62],[0.0311,-0.5172,0.62],[0.0305,-0.5314,0.62],[0.0287,-0.5488,0.62],[0.0305,-0.5665,0.62],[0.0282,-0.5810,0.62],[0.0219,-0.5969,0.62],[0.0116,-0.6103,0.62],[-0.0119,-0.6140,0.62],[-0.0265,-0.6000,0.62],[-0.0287,-0.5824,0.62],[-0.0333,-0.5686,0.62],[-0.0342,-0.5544,0.62],[-0.0352,-0.5383,0.62],[-0.0316,-0.5197,0.62],[-0.0337,-0.5063,0.62],[-0.0289,-0.4867,0.62],[-0.0274,-0.4701,0.62],[-0.0183,-0.4572,0.62],[-0.0078,-0.6698,0.62],[0.0078,-0.6680,0.62],[0.0231,-0.6843,0.62],[-0.0210,-0.6739,0.62],[-0.0289,-0.6903,0.62],[-0.0351,-0.7032,0.62],[-0.0296,-0.7215,0.62],[-0.0199,-0.7352,0.62],[-0.0069,-0.7448,0.62],[0.0076,-0.7526,0.62],[0.0222,-0.7637,0.62],[0.0280,-0.7751,0.62],[0.0297,-0.7930,0.62],[0.0252,-0.8104,0.62],[0.0180,-0.8256,0.62],[-0.0025,-0.8307,0.62],[-0.0166,-0.8252,0.62],[-0.0253,-0.8095,0.62],[-0.0324,-0.7968,0.62],[-0.0078,-0.8829,0.62],[0.0103,-0.8845,0.62],[0.0221,-0.8983,0.62],[-0.0208,-0.8862,0.62],[-0.0282,-0.9044,0.62],[-0.0340,-0.9167,0.62],[-0.0305,-0.9327,0.62],[-0.0186,-0.9512,0.62],[-0.0056,-0.9558,0.62],[0.0062,-0.9695,0.62],[0.0217,-0.9752,0.62],[0.0299,-0.9910,0.62],[0.0327,-1.0074,0.62],[0.0262,-1.0216,0.62],[0.0163,-1.0398,0.62],[-0.0028,-1.0442,0.62],[-0.0159,-1.0400,0.62],[-0.0263,-1.0282,0.62],[-0.0293,-1.0103,0.62]];

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
const DW = 2.5; // damage layer
const DH = 4.5;
const SPAN = 1.9; // the block's width
const CW = 1500;
const CH = Math.round((CW * DH) / DW);
const HOLE_R = 10;

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
      g.addColorStop(0, "#eceef0");
      g.addColorStop(0.55, "#b9bcbf");
      g.addColorStop(1, "#7c7f81");
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
      new THREE.MeshStandardMaterial({ map: steelTex, roughness: 0.56, metalness: 0.42, color: "#9ca0a3" })
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
      // ONE DISTANCE, ALL THE WAY THROUGH, and framed on HEIGHT: with LFG
      // and OSS written downwards the block is twice as tall as it is wide,
      // which is more elongated than the frame, so height is what runs out
      // first. Nothing moves under the viewer when the last round lands;
      // only a slow handheld float remains.
      const dist = 7.55;
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
