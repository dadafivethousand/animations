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
// "3,000" / "FOLLOWERS" / "LFG" —
// set in Impact and THINNED to a one-pixel skeleton (Zhang-Suen) before
// sampling, so every stroke is a single row of holes.
//
// IMPACT, not Arial Black. Its zero is narrow with flat sides, so it reads as
// a numeral instead of three identical ovals, and being condensed it buys
// letter height at the same block width — which is the only thing that makes
// a letter drawn in holes legible.
//
// ONLY THE NUMBER TAKES THE HEAVY ROUND. Legibility is holes-per-stroke, not
// letter size: shrink the text and the block only scales back up to fill the
// frame. FOLLOWERS was shot with the big round and read as a hedge — nine
// condensed letters, a handful of holes each, neighbours closing every gap.
// It is on the fine round now, and the line is tracked out so each letter
// has air around it. The two lines below it get the same treatment one step
// further — a finer round again and their own tracking — because they are
// the smallest text on the wall and were the hardest to read. Three
// calibres in all: heavy for the number, fine for FOLLOWERS, finer still
// for the thanks. Every hole is then nudged a few pixels off
// its sampled position, because a hand-shot group is never a clean copy and
// three identical zeros look printed.
//
// LFG is shot on the heavy round, the same as the number: three letters,
// set big in the band below FOLLOWERS, so it lands as the punchline.
//
// Each entry is [x, y, calibre]; x is in units of the block's own width, and
// the block is 0.940 as tall as it is wide.
const HOLES = [[-0.3579,0.4319,1.0],[-0.3517,0.2810,1.0],[-0.3480,0.2643,1.0],[-0.3410,0.2429,1.0],[-0.3404,0.4626,1.0],[-0.3157,0.3645,1.0],[-0.2953,0.3634,1.0],[-0.2806,0.3613,1.0],[-0.2781,0.3489,1.0],[-0.2663,0.3285,1.0],[-0.2653,0.3089,1.0],[-0.2657,0.2857,1.0],[-0.2691,0.2686,1.0],[-0.2743,0.2484,1.0],[-0.2843,0.2350,1.0],[-0.3083,0.2336,1.0],[-0.3074,0.4683,1.0],[-0.2830,0.4636,1.0],[-0.2694,0.4421,1.0],[-0.2672,0.4217,1.0],[-0.2700,0.4050,1.0],[-0.1870,0.2496,0.72],[-0.1864,0.2322,0.72],[-0.1881,0.2177,0.72],[-0.1964,0.1981,0.72],[-0.2047,0.1881,0.72],[-0.1061,0.4350,1.0],[-0.1125,0.4174,1.0],[-0.1132,0.3952,1.0],[-0.1130,0.3761,1.0],[-0.1148,0.3521,1.0],[-0.1133,0.3321,1.0],[-0.1152,0.3124,1.0],[-0.1102,0.2906,1.0],[-0.1061,0.2725,1.0],[-0.0797,0.4681,1.0],[-0.0968,0.4615,1.0],[-0.0585,0.4707,1.0],[-0.0413,0.4598,1.0],[-0.0961,0.2403,1.0],[-0.0726,0.2336,1.0],[-0.0280,0.4352,1.0],[-0.0256,0.4142,1.0],[-0.0245,0.3949,1.0],[-0.0223,0.3731,1.0],[-0.0245,0.3542,1.0],[-0.0241,0.3311,1.0],[-0.0229,0.3093,1.0],[-0.0236,0.2912,1.0],[-0.0274,0.2685,1.0],[-0.0375,0.2485,1.0],[0.1027,0.4700,1.0],[0.1228,0.4709,1.0],[0.1444,0.4555,1.0],[0.1517,0.4347,1.0],[0.1561,0.4164,1.0],[0.1603,0.3952,1.0],[0.1588,0.3738,1.0],[0.1608,0.3527,1.0],[0.1614,0.3323,1.0],[0.1592,0.3103,1.0],[0.1580,0.2894,1.0],[0.1542,0.2717,1.0],[0.1472,0.2503,1.0],[0.1382,0.2355,1.0],[0.1153,0.2341,1.0],[0.0878,0.2368,1.0],[0.0734,0.2716,1.0],[0.0697,0.2916,1.0],[0.0684,0.3123,1.0],[0.0699,0.3327,1.0],[0.0682,0.3526,1.0],[0.0700,0.3733,1.0],[0.0674,0.3949,1.0],[0.0725,0.4171,1.0],[0.0737,0.4349,1.0],[0.0838,0.4601,1.0],[0.2758,0.4668,1.0],[0.2631,0.4561,1.0],[0.2560,0.4287,1.0],[0.2533,0.4085,1.0],[0.2502,0.3897,1.0],[0.2524,0.3680,1.0],[0.2519,0.3454,1.0],[0.2511,0.3274,1.0],[0.2501,0.3055,1.0],[0.2540,0.2856,1.0],[0.2566,0.2675,1.0],[0.2647,0.2457,1.0],[0.3061,0.4677,1.0],[0.3261,0.4620,1.0],[0.3363,0.4390,1.0],[0.3404,0.4177,1.0],[0.3420,0.3989,1.0],[0.3413,0.3771,1.0],[0.3416,0.3570,1.0],[0.3430,0.3340,1.0],[0.3425,0.3148,1.0],[0.3423,0.2948,1.0],[0.3376,0.2735,1.0],[0.3307,0.2515,1.0],[0.3197,0.2360,1.0],[0.2926,0.2336,1.0],[-0.4449,0.1323,0.72],[-0.4605,0.1318,0.72],[-0.4603,0.1092,0.72],[-0.4638,0.0961,0.72],[-0.4508,0.0772,0.72],[-0.4635,0.0723,0.72],[-0.4628,0.0571,0.72],[-0.4625,0.0401,0.72],[-0.4623,0.0265,0.72],[-0.4374,0.0779,0.72],[-0.3591,0.1369,0.72],[-0.3675,0.1248,0.72],[-0.3697,0.1081,0.72],[-0.3713,0.0948,0.72],[-0.3734,0.0806,0.72],[-0.3708,0.0656,0.72],[-0.3719,0.0472,0.72],[-0.3700,0.0350,0.72],[-0.3649,0.0196,0.72],[-0.3355,0.0162,0.72],[-0.3303,0.0299,0.72],[-0.3250,0.0454,0.72],[-0.3227,0.0592,0.72],[-0.3223,0.0744,0.72],[-0.3223,0.0907,0.72],[-0.3246,0.1045,0.72],[-0.3278,0.1212,0.72],[-0.3368,0.1354,0.72],[-0.2524,0.1307,0.72],[-0.2542,0.1189,0.72],[-0.2544,0.1010,0.72],[-0.2541,0.0883,0.72],[-0.2546,0.0727,0.72],[-0.2531,0.0579,0.72],[-0.2550,0.0432,0.72],[-0.2547,0.0254,0.72],[-0.2437,0.0194,0.72],[-0.2288,0.0193,0.72],[-0.1676,0.1282,0.72],[-0.1669,0.1157,0.72],[-0.1682,0.0978,0.72],[-0.1665,0.0839,0.72],[-0.1672,0.0679,0.72],[-0.1667,0.0552,0.72],[-0.1663,0.0391,0.72],[-0.1644,0.0230,0.72],[-0.1505,0.0218,0.72],[-0.1394,0.0199,0.72],[-0.0441,0.1354,0.72],[-0.0358,0.1194,0.72],[-0.0321,0.1065,0.72],[-0.0320,0.0893,0.72],[-0.0318,0.0751,0.72],[-0.0308,0.0583,0.72],[-0.0341,0.0466,0.72],[-0.0365,0.0321,0.72],[-0.0427,0.0176,0.72],[-0.0728,0.0201,0.72],[-0.0763,0.0359,0.72],[-0.0807,0.0500,0.72],[-0.0806,0.0653,0.72],[-0.0791,0.0796,0.72],[-0.0809,0.0927,0.72],[-0.0783,0.1100,0.72],[-0.0758,0.1249,0.72],[-0.0713,0.1373,0.72],[0.0326,0.1324,0.72],[0.0339,0.1151,0.72],[0.0354,0.1014,0.72],[0.0373,0.0846,0.72],[0.0353,0.0690,0.72],[0.0393,0.0562,0.72],[0.0404,0.0418,0.72],[0.0589,0.0370,0.72],[0.0676,0.0613,0.72],[0.1395,0.1343,0.72],[0.1356,0.1196,0.72],[0.1337,0.1015,0.72],[0.1309,0.0880,0.72],[0.1317,0.0737,0.72],[0.1280,0.0561,0.72],[0.1218,0.0318,0.72],[0.1093,0.0366,0.72],[0.1019,0.0494,0.72],[0.0985,0.0625,0.72],[0.0979,0.0775,0.72],[0.0923,0.0927,0.72],[0.0851,0.0994,0.72],[0.0735,0.0932,0.72],[0.0824,0.1158,0.72],[0.2241,0.1337,0.72],[0.2032,0.1304,0.72],[0.2042,0.1118,0.72],[0.2052,0.0946,0.72],[0.2036,0.0806,0.72],[0.2023,0.0688,0.72],[0.2031,0.0545,0.72],[0.2042,0.0377,0.72],[0.2063,0.0214,0.72],[0.2196,0.0195,0.72],[0.2344,0.0206,0.72],[0.2304,0.0772,0.72],[0.2132,0.0792,0.72],[0.3185,0.1347,0.72],[0.3360,0.1332,0.72],[0.3403,0.1185,0.72],[0.3431,0.1030,0.72],[0.3382,0.0915,0.72],[0.3316,0.0800,0.72],[0.3334,0.0715,0.72],[0.3426,0.0545,0.72],[0.3454,0.0420,0.72],[0.3455,0.0240,0.72],[0.2972,0.0264,0.72],[0.2977,0.0407,0.72],[0.2980,0.0537,0.72],[0.2959,0.0700,0.72],[0.2977,0.0828,0.72],[0.2956,0.0973,0.72],[0.2981,0.1136,0.72],[0.2958,0.1287,0.72],[0.3159,0.0811,0.72],[0.4330,0.1389,0.72],[0.4458,0.1370,0.72],[0.4533,0.1197,0.72],[0.4202,0.1371,0.72],[0.4113,0.1247,0.72],[0.4095,0.1127,0.72],[0.4134,0.0995,0.72],[0.4186,0.0902,0.72],[0.4344,0.0791,0.72],[0.4491,0.0679,0.72],[0.4546,0.0527,0.72],[0.4574,0.0388,0.72],[0.4540,0.0259,0.72],[0.4340,0.0169,0.72],[0.4171,0.0192,0.72],[0.4104,0.0343,0.72],[-0.2458,-0.2192,1.0],[-0.2436,-0.2420,1.0],[-0.2438,-0.2663,1.0],[-0.2447,-0.2915,1.0],[-0.2464,-0.3101,1.0],[-0.2427,-0.3335,1.0],[-0.2441,-0.3545,1.0],[-0.2454,-0.3797,1.0],[-0.2466,-0.4030,1.0],[-0.2471,-0.4243,1.0],[-0.2467,-0.4439,1.0],[-0.2272,-0.4577,1.0],[-0.2073,-0.4632,1.0],[-0.0449,-0.2140,1.0],[-0.0557,-0.2318,1.0],[-0.0544,-0.2503,1.0],[-0.0556,-0.2787,1.0],[-0.0539,-0.3011,1.0],[-0.0595,-0.3206,1.0],[-0.0403,-0.3335,1.0],[-0.0125,-0.3279,1.0],[-0.0566,-0.3457,1.0],[-0.0585,-0.3617,1.0],[-0.0560,-0.3876,1.0],[-0.0597,-0.4090,1.0],[-0.0606,-0.4341,1.0],[-0.0271,-0.2127,1.0],[-0.0001,-0.2090,1.0],[0.1878,-0.1985,1.0],[0.2084,-0.2005,1.0],[0.2279,-0.2093,1.0],[0.2381,-0.2309,1.0],[0.2421,-0.2497,1.0],[0.1592,-0.2073,1.0],[0.1535,-0.2255,1.0],[0.1405,-0.2436,1.0],[0.1394,-0.2653,1.0],[0.1356,-0.2914,1.0],[0.1357,-0.3118,1.0],[0.1393,-0.3326,1.0],[0.1417,-0.3568,1.0],[0.1365,-0.3800,1.0],[0.1430,-0.4061,1.0],[0.1463,-0.4237,1.0],[0.1478,-0.4473,1.0],[0.1569,-0.4653,1.0],[0.1977,-0.4672,1.0],[0.2205,-0.4532,1.0],[0.2417,-0.4356,1.0],[0.2617,-0.4440,1.0],[0.2456,-0.4204,1.0],[0.2491,-0.3960,1.0],[0.2502,-0.3724,1.0],[0.2372,-0.3530,1.0],[0.2121,-0.3450,1.0]];

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
    t += 10 + r() * 4;
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
const DW = 2.75; // damage layer
const DH = 2.6;
const SPAN = 2.1; // the block's width
const CW = 1700;
const CH = Math.round((CW * DH) / DW);
const HOLE_R = 11;

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

// ---------------- the engraving ----------------
// "MAPLE JIU-JITSU" cut into the wall rather than printed on it. A groove
// reads by its walls, not by its colour: the chamfer facing the key light
// catches a highlight, the one facing away falls into shadow, and the floor
// of the cut sits darker than the surface because less light reaches it.
//
// So this builds two canvases. The BUMP is mid-grey for the surface with the
// lettering in black, blurred — the blur is what makes the wall of the cut a
// ramp rather than a cliff, and a ramp is what the renderer needs in order
// to put a highlight down one side of it. The TINT is transparent except in
// the cut, where it lays a little dirt and shadow.
//
// Both go on a transparent plane sitting a few millimetres off the wall, so
// the steel shows through everywhere the letters are not and there is no
// patch edge to hide.
const ENGRAVE_TEXT = "MAPLE JIU-JITSU";

// The cut is the same for anything: draw the shape once as a blurred dark
// ramp for the bump, and three times, offset, for the lit and shadowed walls.
function engraveFrom(EW, EH, draw) {
  const mk = () => {
    const c = document.createElement("canvas");
    c.width = EW;
    c.height = EH;
    return [c, c.getContext("2d")];
  };
  const [bump, bx] = mk();
  bx.fillStyle = "#808080";
  bx.fillRect(0, 0, EW, EH);
  bx.filter = "blur(4px)";
  bx.fillStyle = "#121212";
  draw(bx, 0, 0);
  bx.filter = "none";

  // The key is up and to the left, so the far wall of a groove is the lit
  // one: a highlight peeks out below and right of each stroke, a shadow
  // above and left, and the floor of the cut sits darker than the surface.
  const [tint, tx] = mk();
  tx.filter = "blur(2.5px)";
  tx.fillStyle = "rgba(240,245,250,0.7)";
  draw(tx, 4, 4);
  tx.fillStyle = "rgba(12,14,17,0.55)";
  draw(tx, -3, -3);
  tx.filter = "blur(1.5px)";
  tx.fillStyle = "rgba(56,60,66,0.85)";
  draw(tx, 0, 0);
  tx.filter = "none";
  return [bump, tint];
}

function engraveCanvases() {
  const EW = 2048;
  const EH = 420;
  return engraveFrom(EW, EH, (x, dx, dy) => {
    x.font = '700 210px Impact, "Arial Narrow", sans-serif';
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(ENGRAVE_TEXT, EW / 2 + dx, EH / 2 + 6 + dy);
  });
}

// The Maple leaf, the same outline the other Maple pieces use: right half,
// base to apex, mirrored, with a short stem.
const LEAF_HALF = [
  [0.05, 0.1], [0.42, 0.04], [0.36, 0.18], [0.62, 0.4], [0.5, 0.44], [0.56, 0.62],
  [0.36, 0.52], [0.34, 0.6], [0.24, 0.52], [0.28, 0.82], [0.16, 0.76], [0, 1.0],
];
function leafCanvases() {
  const S = 1024;
  const pts = [...LEAF_HALF, ...LEAF_HALF.slice(0, -1).reverse().map(([x, y]) => [-x, y])];
  const k = S * 0.74; // leaf units -> px
  return engraveFrom(S, S, (x, dx, dy) => {
    const X = (u) => S / 2 + u * k + dx;
    const Y = (v) => S * 0.9 - v * k - S * 0.06 + dy;
    x.beginPath();
    pts.forEach(([u, v], i) => (i ? x.lineTo(X(u), Y(v)) : x.moveTo(X(u), Y(v))));
    x.closePath();
    x.fill();
    // stem
    x.beginPath();
    x.moveTo(X(-0.022), Y(0.11));
    x.lineTo(X(0.022), Y(0.11));
    x.lineTo(X(0.03), Y(-0.1));
    x.lineTo(X(-0.012), Y(-0.1));
    x.closePath();
    x.fill();
  });
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
  const [emit, ex] = mk(); // the pits only: where light from behind gets through

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

    // The opening, for the light behind the plate.
    torn(ex, px, py, R, sh, 0.92);
    ex.fillStyle = "#ffffff";
    ex.fill();

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
    for (const c of [cx, bx, rx, mx, ax, ex]) c.clearRect(0, 0, CW, CH);
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
  const texEmit = tex(emit, true);

  let drawn = 0;
  return {
    texColour,
    texBump,
    texRough,
    texMetal,
    texAlpha,
    texEmit,
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
      texEmit.needsUpdate = true;
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
    renderer.toneMappingExposure = 1.06;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#8b8e91");
    scene.fog = new THREE.FogExp2("#8b8e91", 0.008);
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
      g.addColorStop(0, "#fdfdfe");
      g.addColorStop(0.33, "#dadde0");
      g.addColorStop(0.45, "#ffffff");
      g.addColorStop(0.57, "#d4d8dc");
      g.addColorStop(1, "#8e9194");
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
    const key = new THREE.DirectionalLight("#ffffff", 3.35);
    key.position.set(-3.2, 4.0, 6.0);
    scene.add(key);
    const fill2 = new THREE.DirectionalLight("#ffffff", 1.15);
    fill2.position.set(4.6, -1.2, 5.0);
    scene.add(fill2);
    scene.add(new THREE.AmbientLight("#ffffff", 0.95));

    // ---- the wall, and the damage on it ----
    const steelTex = new THREE.CanvasTexture(steelCanvas());
    steelTex.colorSpace = THREE.SRGBColorSpace;
    steelTex.wrapS = steelTex.wrapT = THREE.RepeatWrapping;
    steelTex.repeat.set(1, 1);
    steelTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(WALLW, WALLH),
      new THREE.MeshStandardMaterial({ map: steelTex, roughness: 0.3, metalness: 0.82, color: "#bcc0c3" })
    );
    wall.position.set(0, PY, 0);
    scene.add(wall);

    // ---- the mark, cut into the wall ----
    const [engBump, engTint] = engraveCanvases();
    const engTexBump = new THREE.CanvasTexture(engBump);
    const engTexTint = new THREE.CanvasTexture(engTint);
    engTexTint.colorSpace = THREE.SRGBColorSpace;
    engTexBump.anisotropy = renderer.capabilities.getMaxAnisotropy();
    engTexTint.anisotropy = engTexBump.anisotropy;
    const engMat = new THREE.MeshStandardMaterial({
      map: engTexTint,
      transparent: true,
      opacity: 0,
      bumpMap: engTexBump,
      bumpScale: 14,
      metalness: 0.45,
      roughness: 0.42,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3,
    });
    const engrave = new THREE.Mesh(new THREE.PlaneGeometry(2.25, 0.46), engMat);
    engrave.position.set(0, PY + 1.42, 0.005);
    scene.add(engrave);

    // ---- and the leaf, cut in above the name ----
    const [leafBump, leafTint] = leafCanvases();
    const leafTexBump = new THREE.CanvasTexture(leafBump);
    const leafTexTint = new THREE.CanvasTexture(leafTint);
    leafTexTint.colorSpace = THREE.SRGBColorSpace;
    leafTexBump.anisotropy = engTexBump.anisotropy;
    leafTexTint.anisotropy = engTexBump.anisotropy;
    const leafMat = engMat.clone();
    leafMat.map = leafTexTint;
    leafMat.bumpMap = leafTexBump;
    const LEAF_SIZE = 0.62;
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(LEAF_SIZE, LEAF_SIZE), leafMat);
    leaf.position.set(0, PY + 1.42 + 0.23 + 0.06 + LEAF_SIZE / 2, 0.005);
    scene.add(leaf);

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
    // Every round smokes, and none of them pile up.
    //
    // Those two pull against each other: rounds land every twelve
    // milliseconds, so anything that lingers has dozens of neighbours alive
    // beside it, and at the end of a burst they stop being wisps and become
    // one bright clump over the last word. Cutting the opacity fixed the
    // clump and lost the puff.
    //
    // What resolves it is the SHAPE of a puff's life rather than its
    // strength: it blooms and then collapses to nothing, so a fresh one is
    // clearly visible while anything older than about half a second has
    // already shrunk away and cannot add to a pile.
    const PUFFS = 14;
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

    // TRAILS. The single puff per round is gone before the next run starts,
    // so on its own only the last letters ever looked like they had been
    // shot. Each hole now keeps breathing out thin wisps for a few seconds
    // after it is hit: strong at first, thinning out, each wisp rising,
    // drifting and opening up as it goes. Faint individually, so the trail
    // follows the writing across the wall without burying the lettering.
    const WISP_EVERY = 320; // ms between wisps from one hole
    const WISP_N = 3; // wisps per hole: about a second of smoke
    const WISP_LIFE = 1.3; // s each wisp lives
    const WISP_MAX = 1700;
    const wisps = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: puffTex, transparent: true, depthWrite: false, opacity: 0.065 }),
      WISP_MAX
    );
    wisps.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    wisps.frustumCulled = false;
    scene.add(wisps);
    const wispRnd = mulberry32(777);
    const wispSeed = Array.from({ length: HOLES.length * WISP_N }, () => ({
      jitter: wispRnd() * WISP_EVERY,
      drift: (wispRnd() - 0.5) * 0.16,
      rise: 0.2 + wispRnd() * 0.16,
      wob: wispRnd() * 6.28,
      rot: wispRnd() * 6.28,
      size: 0.8 + wispRnd() * 0.5,
    }));
    const wq = new THREE.Quaternion();
    const wz = new THREE.Vector3(0, 0, 1);

    const puffs = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: puffTex, transparent: true, depthWrite: false, opacity: 1 }),
      PUFFS
    );
    puffs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    puffs.frustumCulled = false;
    scene.add(puffs);

    const dummy = new THREE.Object3D();
    // ---- heat ----
    // A round through plate steel leaves the hole glowing. Each fresh hole
    // gets an additive glow that runs white-hot, orange, dull red, then out,
    // so the line being written is a hot trail cooling behind the gun.
    const glowTex = (() => {
      const S = 128;
      const c = document.createElement("canvas");
      c.width = c.height = S;
      const x = c.getContext("2d");
      const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.22, "rgba(255,255,255,0.75)");
      g.addColorStop(0.5, "rgba(255,255,255,0.18)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g;
      x.fillRect(0, 0, S, S);
      return new THREE.CanvasTexture(c);
    })();
    const glowMat = () =>
      new THREE.MeshBasicMaterial({
        map: glowTex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      });
    const HEAT_MAX = 260;
    const heat = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), glowMat(), HEAT_MAX);
    heat.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    heat.frustumCulled = false;
    scene.add(heat);
    const HEAT_LIFE = 1.6; // s from white-hot to out
    const heatCol = (u, out) => {
      // white-hot -> yellow -> orange -> dull red -> nothing
      const stops = [
        [0.0, 4.0, 3.6, 2.8],
        [0.06, 3.6, 2.4, 0.9],
        [0.25, 2.6, 0.95, 0.16],
        [0.6, 1.2, 0.22, 0.04],
        [1.0, 0, 0, 0],
      ];
      let j = 0;
      while (j < stops.length - 2 && u > stops[j + 1][0]) j++;
      const [u0, r0, g0, b0] = stops[j];
      const [u1, r1, g1, b1] = stops[j + 1];
      const k = clamp01((u - u0) / (u1 - u0));
      return out.setRGB(lerp(r0, r1, k), lerp(g0, g1, k), lerp(b0, b1, k));
    };

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
        if (dt < 0 || dt > 0.75) {
          puffs.setMatrixAt(p, hidden);
          continue;
        }
        const [wx, wy] = toWorld(HOLES[i]);
        const u = dt / 0.75;
        dummy.position.set(wx, wy + dt * 0.3, 0.1 + dt * 0.22);
        dummy.quaternion.copy(camera.quaternion);
        const sc = (0.07 + dt * 0.5) * (1 - u * u); // bloom, then collapse
        dummy.scale.set(sc, sc, sc);
        dummy.updateMatrix();
        puffs.setMatrixAt(p, dummy.matrix);
      }
      puffs.instanceMatrix.needsUpdate = true;
      puffs.material.opacity = 0.34;

      // ---- smoke trails from every hole hit in the last few seconds ----
      let wi = 0;
      const window0 = t - (WISP_N * WISP_EVERY + WISP_LIFE * 1000);
      const first = landed(window0);
      for (let i = first; i < n && wi < WISP_MAX; i++) {
        const [wx, wy] = toWorld(HOLES[i]);
        for (let k = 0; k < WISP_N && wi < WISP_MAX; k++) {
          const s = wispSeed[i * WISP_N + k];
          const born = SHOT_T[i] + 40 + k * WISP_EVERY + s.jitter;
          const dt = (t - born) / 1000;
          if (dt < 0 || dt > WISP_LIFE) continue;
          const u = dt / WISP_LIFE;
          // later wisps from a hole are thinner: the hole is cooling
          const strength = 1 - (k / WISP_N) * 0.7;
          dummy.position.set(
            wx + s.drift * dt + Math.sin(s.wob + dt * 3) * 0.02 * dt,
            wy + s.rise * dt + 0.012,
            0.03 + dt * 0.05
          );
          wq.setFromAxisAngle(wz, s.rot + dt * 0.4);
          dummy.quaternion.copy(camera.quaternion).multiply(wq);
          const sc = (0.035 + dt * 0.11) * s.size * strength * Math.sin(Math.PI * Math.min(1, u * 1.15)) ** 0.7;
          dummy.scale.set(sc, sc, sc);
          dummy.updateMatrix();
          wisps.setMatrixAt(wi, dummy.matrix);
          wi += 1;
        }
      }
      for (; wi < WISP_MAX; wi++) wisps.setMatrixAt(wi, hidden);
      wisps.instanceMatrix.needsUpdate = true;

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

      // ---- heat ----
      let hi = 0;
      const h0 = landed(t - HEAT_LIFE * 1000);
      for (let i = h0; i < n && hi < HEAT_MAX; i++) {
        const dt = (t - SHOT_T[i]) / 1000;
        if (dt < 0 || dt > HEAT_LIFE) continue;
        const u = dt / HEAT_LIFE;
        const [wx, wy] = toWorld(HOLES[i]);
        const sz = (0.08 + 0.05 * (1 - u)) * (HOLES[i][2] || 1);
        dummy.position.set(wx, wy, 0.011);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(sz, sz, sz);
        dummy.updateMatrix();
        heat.setMatrixAt(hi, dummy.matrix);
        heat.setColorAt(hi, heatCol(u, col));
        hi += 1;
      }
      for (; hi < HEAT_MAX; hi++) heat.setMatrixAt(hi, hidden);
      heat.instanceMatrix.needsUpdate = true;
      if (heat.instanceColor) heat.instanceColor.needsUpdate = true;

      // ---- camera ----
      // In close while it is being shot, back off to read the whole number.
      // ONE DISTANCE, ALL THE WAY THROUGH. Nothing moves under the viewer
      // at the moment the last round lands; only a slow handheld float.
      const dist = 7.54;
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

      // The mark fades up before the first round. Driven from here so it
      // stays a function of t: the recorder steps the clock by hand.
      engMat.opacity = ss(180, 820, t);
      leafMat.opacity = engMat.opacity;

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
        window.__bulletShots = SHOT_T.map((x) => Math.round(x));
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
