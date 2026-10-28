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
// Four lines — "3,000" / "FOLLOWERS" / "THANK YOU" / "FOR THE SUPPORT" —
// rendered in Arial Black and THINNED to a one-pixel skeleton (Zhang-Suen)
// before sampling, so every stroke is a single row of holes rather than a
// slab several rounds deep.
//
// TWO CALIBRES. Legibility of a letter made of holes depends on how many
// holes fit across its stroke, not on how big the letter is: scale the text
// down and the block just scales back up to fill the frame, and nothing is
// gained. So the two small lines are shot with a smaller round, closer
// together — a third element per hole carries that size. It is also what
// anyone would actually do to write small.
//
// Each entry is [x, y, calibre]; x is in units of the block's own width, and
// the block is 0.714 as tall as it is wide. Points are grouped into strokes
// and each stroke walked nearest-neighbour from its top end, so a burst
// travels along a letter the way a hand would draw it.
const HOLES = [[-0.3121,0.3569,1.0],[-0.2937,0.3551,1.0],[-0.2770,0.3464,1.0],[-0.2700,0.3288,1.0],[-0.2735,0.3104,1.0],[-0.2805,0.2928,1.0],[-0.2788,0.2744,1.0],[-0.2665,0.2603,1.0],[-0.2603,0.2428,1.0],[-0.2621,0.2243,1.0],[-0.2700,0.2076,1.0],[-0.2884,0.1962,1.0],[-0.3112,0.1936,1.0],[-0.3297,0.1962,1.0],[-0.3455,0.2076,1.0],[-0.3613,0.2191,1.0],[-0.3191,0.2700,1.0],[-0.3051,0.2823,1.0],[-0.3464,0.3428,1.0],[-0.3314,0.3543,1.0],[-0.3630,0.3341,1.0],[-0.3797,0.3262,1.0],[-0.1769,0.2076,1.0],[-0.1629,0.1953,1.0],[-0.1637,0.1769,1.0],[-0.1699,0.1594,1.0],[-0.1839,0.1471,1.0],[-0.0487,0.3551,1.0],[-0.0303,0.3543,1.0],[-0.0136,0.3464,1.0],[-0.0031,0.3306,1.0],[0.0022,0.3121,1.0],[0.0048,0.2937,1.0],[0.0057,0.2752,1.0],[0.0048,0.2568,1.0],[0.0022,0.2384,1.0],[-0.0031,0.2199,1.0],[-0.0136,0.2041,1.0],[-0.0364,0.1971,1.0],[-0.0645,0.1989,1.0],[-0.0795,0.2112,1.0],[-0.0874,0.2278,1.0],[-0.0917,0.2463,1.0],[-0.0935,0.2647,1.0],[-0.0944,0.2831,1.0],[-0.0926,0.3016,1.0],[-0.0891,0.3200,1.0],[-0.0821,0.3376,1.0],[-0.0689,0.3507,1.0],[0.1269,0.3551,1.0],[0.1453,0.3543,1.0],[0.1620,0.3464,1.0],[0.1725,0.3306,1.0],[0.1778,0.3121,1.0],[0.1804,0.2937,1.0],[0.1813,0.2752,1.0],[0.1804,0.2568,1.0],[0.1778,0.2384,1.0],[0.1725,0.2199,1.0],[0.1620,0.2041,1.0],[0.1392,0.1971,1.0],[0.1111,0.1989,1.0],[0.0961,0.2112,1.0],[0.0882,0.2278,1.0],[0.0838,0.2463,1.0],[0.0821,0.2647,1.0],[0.0812,0.2831,1.0],[0.0830,0.3016,1.0],[0.0865,0.3200,1.0],[0.0935,0.3376,1.0],[0.1067,0.3507,1.0],[0.3025,0.3551,1.0],[0.3209,0.3543,1.0],[0.3376,0.3464,1.0],[0.3481,0.3306,1.0],[0.3534,0.3121,1.0],[0.3560,0.2937,1.0],[0.3569,0.2752,1.0],[0.3560,0.2568,1.0],[0.3534,0.2384,1.0],[0.3481,0.2199,1.0],[0.3376,0.2041,1.0],[0.3147,0.1971,1.0],[0.2867,0.1989,1.0],[0.2717,0.2112,1.0],[0.2638,0.2278,1.0],[0.2594,0.2463,1.0],[0.2577,0.2647,1.0],[0.2568,0.2831,1.0],[0.2586,0.3016,1.0],[0.2621,0.3200,1.0],[0.2691,0.3376,1.0],[0.2823,0.3507,1.0],[-0.4254,0.0593,1.0],[-0.4069,0.0593,1.0],[-0.3885,0.0593,1.0],[-0.4025,0.0241,1.0],[-0.4210,0.0241,1.0],[-0.4289,0.0408,1.0],[-0.4289,0.0075,1.0],[-0.3130,0.0601,1.0],[-0.2946,0.0575,1.0],[-0.2814,0.0443,1.0],[-0.2770,0.0259,1.0],[-0.2788,0.0075,1.0],[-0.2893,-0.0092,1.0],[-0.3086,-0.0145,1.0],[-0.3270,-0.0119,1.0],[-0.3402,0.0013,1.0],[-0.3437,0.0198,1.0],[-0.3420,0.0382,1.0],[-0.3314,0.0540,1.0],[-0.2313,0.0549,1.0],[-0.2313,0.0364,1.0],[-0.2313,0.0180,1.0],[-0.2313,-0.0004,1.0],[-0.2173,-0.0127,1.0],[-0.1989,-0.0127,1.0],[-0.1435,0.0549,1.0],[-0.1435,0.0364,1.0],[-0.1435,0.0180,1.0],[-0.1435,-0.0004,1.0],[-0.1295,-0.0127,1.0],[-0.1111,-0.0127,1.0],[-0.0285,0.0601,1.0],[-0.0101,0.0575,1.0],[0.0031,0.0443,1.0],[0.0075,0.0259,1.0],[0.0057,0.0075,1.0],[-0.0048,-0.0092,1.0],[-0.0241,-0.0145,1.0],[-0.0426,-0.0119,1.0],[-0.0558,0.0013,1.0],[-0.0593,0.0198,1.0],[-0.0575,0.0382,1.0],[-0.0470,0.0540,1.0],[0.1550,0.0663,1.0],[0.1427,0.0522,1.0],[0.1392,0.0338,1.0],[0.1356,0.0154,1.0],[0.1251,-0.0004,1.0],[0.1102,0.0206,1.0],[0.1049,0.0391,1.0],[0.0944,0.0549,1.0],[0.0838,0.0391,1.0],[0.0795,0.0206,1.0],[0.0680,0.0048,1.0],[0.0531,0.0215,1.0],[0.0487,0.0399,1.0],[0.0452,0.0584,1.0],[0.1848,0.0408,1.0],[0.1883,0.0593,1.0],[0.2068,0.0593,1.0],[0.2252,0.0593,1.0],[0.2331,0.0259,1.0],[0.2147,0.0259,1.0],[0.1962,0.0259,1.0],[0.1848,0.0110,1.0],[0.1848,-0.0075,1.0],[0.2024,-0.0136,1.0],[0.2208,-0.0136,1.0],[0.2858,0.0601,1.0],[0.3042,0.0601,1.0],[0.3227,0.0584,1.0],[0.3341,0.0435,1.0],[0.3253,0.0259,1.0],[0.3209,0.0075,1.0],[0.3323,-0.0075,1.0],[0.3472,-0.0189,1.0],[0.2981,0.0224,1.0],[0.2796,0.0241,1.0],[0.2796,0.0426,1.0],[0.2796,0.0057,1.0],[0.4061,0.0628,1.0],[0.4236,0.0566,1.0],[0.4140,0.0233,1.0],[0.4298,0.0136,1.0],[0.4298,-0.0048,1.0],[0.4131,-0.0162,1.0],[0.3946,-0.0154,1.0],[0.3806,-0.0031,1.0],[0.3955,0.0285,1.0],[0.3815,0.0408,1.0],[0.3876,0.0584,1.0],[-0.3209,-0.1620,0.72],[-0.3068,-0.1620,0.72],[-0.2928,-0.1620,0.72],[-0.2788,-0.1620,0.72],[-0.2963,-0.1760,0.72],[-0.2963,-0.1901,0.72],[-0.2963,-0.2041,0.72],[-0.1435,-0.1637,0.72],[-0.1321,-0.1725,0.72],[-0.1269,-0.1857,0.72],[-0.1242,-0.1997,0.72],[-0.1181,-0.2129,0.72],[-0.1471,-0.2050,0.72],[-0.1611,-0.2041,0.72],[-0.1681,-0.2173,0.72],[-0.1558,-0.1901,0.72],[-0.1514,-0.1760,0.72],[-0.1971,-0.1787,0.72],[-0.1971,-0.1646,0.72],[-0.1971,-0.1927,0.72],[-0.1971,-0.2068,0.72],[-0.2164,-0.1866,0.72],[-0.2305,-0.1866,0.72],[-0.2428,-0.1936,0.72],[-0.2428,-0.2076,0.72],[-0.2428,-0.1787,0.72],[-0.2428,-0.1646,0.72],[-0.0847,-0.1655,0.72],[-0.0759,-0.1769,0.72],[-0.0856,-0.1874,0.72],[-0.0856,-0.2015,0.72],[-0.0637,-0.1857,0.72],[-0.0558,-0.1980,0.72],[-0.0408,-0.2059,0.72],[-0.0382,-0.1918,0.72],[-0.0382,-0.1778,0.72],[-0.0382,-0.1637,0.72],[0.0549,-0.1550,0.72],[0.0391,-0.1602,0.72],[0.0285,-0.1708,0.72],[0.0233,-0.1848,0.72],[0.0320,-0.1971,0.72],[0.0391,-0.2094,0.72],[0.0496,-0.2191,0.72],[0.0083,-0.1883,0.72],[-0.0031,-0.1971,0.72],[-0.0031,-0.2112,0.72],[-0.0031,-0.1787,0.72],[-0.0031,-0.1646,0.72],[0.0953,-0.1541,0.72],[0.1084,-0.1602,0.72],[0.1172,-0.1716,0.72],[0.1260,-0.1839,0.72],[0.1313,-0.1971,0.72],[0.1313,-0.2112,0.72],[0.1444,-0.1734,0.72],[0.1523,-0.1611,0.72],[0.1655,-0.1550,0.72],[0.1927,-0.1664,0.72],[0.1857,-0.1787,0.72],[0.1848,-0.1927,0.72],[0.1883,-0.2068,0.72],[0.2006,-0.2147,0.72],[0.2234,-0.2129,0.72],[0.2322,-0.2006,0.72],[0.2340,-0.1866,0.72],[0.2305,-0.1725,0.72],[0.2199,-0.1629,0.72],[0.2059,-0.1611,0.72],[0.2682,-0.1646,0.72],[0.2682,-0.1787,0.72],[0.2682,-0.1927,0.72],[0.2709,-0.2068,0.72],[0.2823,-0.2155,0.72],[0.2963,-0.2155,0.72],[0.3104,-0.2068,0.72],[0.3130,-0.1927,0.72],[0.3139,-0.1787,0.72],[0.3139,-0.1646,0.72],[-0.4982,-0.3025,0.72],[-0.4842,-0.3025,0.72],[-0.4701,-0.3025,0.72],[-0.4789,-0.3288,0.72],[-0.4930,-0.3288,0.72],[-0.5000,-0.3165,0.72],[-0.5000,-0.3411,0.72],[-0.3481,-0.3007,0.72],[-0.3341,-0.3007,0.72],[-0.3200,-0.3016,0.72],[-0.3121,-0.3139,0.72],[-0.3191,-0.3262,0.72],[-0.3218,-0.3402,0.72],[-0.3130,-0.3516,0.72],[-0.3385,-0.3288,0.72],[-0.3525,-0.3288,0.72],[-0.3525,-0.3147,0.72],[-0.3525,-0.3428,0.72],[-0.3885,-0.3411,0.72],[-0.3867,-0.3270,0.72],[-0.3903,-0.3130,0.72],[-0.4008,-0.3033,0.72],[-0.4148,-0.3016,0.72],[-0.4280,-0.3068,0.72],[-0.4350,-0.3191,0.72],[-0.4359,-0.3332,0.72],[-0.4324,-0.3472,0.72],[-0.4201,-0.3551,0.72],[-0.3973,-0.3534,0.72],[-0.2507,-0.3025,0.72],[-0.2366,-0.3025,0.72],[-0.2226,-0.3025,0.72],[-0.2085,-0.3025,0.72],[-0.2261,-0.3165,0.72],[-0.2261,-0.3306,0.72],[-0.2261,-0.3446,0.72],[-0.1725,-0.3051,0.72],[-0.1725,-0.3191,0.72],[-0.1602,-0.3270,0.72],[-0.1462,-0.3270,0.72],[-0.1269,-0.3332,0.72],[-0.1269,-0.3191,0.72],[-0.1269,-0.3051,0.72],[-0.1269,-0.3472,0.72],[-0.1725,-0.3481,0.72],[-0.1725,-0.3341,0.72],[-0.0891,-0.3025,0.72],[-0.0751,-0.3025,0.72],[-0.0610,-0.3025,0.72],[-0.0672,-0.3270,0.72],[-0.0812,-0.3270,0.72],[-0.0909,-0.3165,0.72],[-0.0909,-0.3376,0.72],[-0.0909,-0.3516,0.72],[-0.0768,-0.3560,0.72],[-0.0628,-0.3560,0.72],[-0.0531,-0.3270,0.72],[0.0241,-0.2998,0.72],[0.0382,-0.3007,0.72],[0.0127,-0.3095,0.72],[0.0180,-0.3227,0.72],[0.0320,-0.3270,0.72],[0.0461,-0.3323,0.72],[0.0496,-0.3464,0.72],[0.0373,-0.3569,0.72],[0.0206,-0.3569,0.72],[0.0101,-0.3472,0.72],[0.0838,-0.3051,0.72],[0.0838,-0.3191,0.72],[0.0838,-0.3332,0.72],[0.0865,-0.3472,0.72],[0.0979,-0.3560,0.72],[0.1119,-0.3560,0.72],[0.1260,-0.3472,0.72],[0.1286,-0.3332,0.72],[0.1295,-0.3191,0.72],[0.1295,-0.3051,0.72],[0.1699,-0.3007,0.72],[0.1839,-0.3007,0.72],[0.1980,-0.3042,0.72],[0.2024,-0.3183,0.72],[0.1936,-0.3297,0.72],[0.1795,-0.3306,0.72],[0.1655,-0.3288,0.72],[0.1655,-0.3147,0.72],[0.1655,-0.3428,0.72],[0.2366,-0.3428,0.72],[0.2366,-0.3288,0.72],[0.2366,-0.3147,0.72],[0.2410,-0.3007,0.72],[0.2550,-0.3007,0.72],[0.2691,-0.3042,0.72],[0.2735,-0.3183,0.72],[0.2647,-0.3297,0.72],[0.2507,-0.3306,0.72],[0.3060,-0.3332,0.72],[0.3068,-0.3191,0.72],[0.3139,-0.3068,0.72],[0.3270,-0.3016,0.72],[0.3411,-0.3033,0.72],[0.3516,-0.3130,0.72],[0.3551,-0.3270,0.72],[0.3534,-0.3411,0.72],[0.3446,-0.3534,0.72],[0.3218,-0.3551,0.72],[0.3095,-0.3472,0.72],[0.3894,-0.3428,0.72],[0.3894,-0.3288,0.72],[0.3894,-0.3147,0.72],[0.3938,-0.3007,0.72],[0.4078,-0.3007,0.72],[0.4219,-0.3016,0.72],[0.4298,-0.3139,0.72],[0.4227,-0.3262,0.72],[0.4201,-0.3402,0.72],[0.4289,-0.3516,0.72],[0.4034,-0.3288,0.72],[0.4579,-0.3025,0.72],[0.4719,-0.3025,0.72],[0.4860,-0.3025,0.72],[0.5000,-0.3025,0.72],[0.4824,-0.3165,0.72],[0.4824,-0.3306,0.72],[0.4824,-0.3446,0.72]];

// ---------------- timeline (ms) ----------------
const T_FIRE = 950; // first round leaves
// Where the first line ends. The counter is tied to THIS, not to the whole
// block: it has to read 3,000 at the moment the wall does, or the frame
// shows a tally arguing with the number right above it.
const NUM_SHOTS = 93;
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
      if (i) t += 80 + r() * 50; // swing onto the next run
    }
    out.push(t);
    t += 13 + r() * 5;
    left -= 1;
  }
  return out;
})();
const T_LAST = SHOT_T[SHOT_T.length - 1];
const T_PULL = T_LAST + 620; // camera eases back to show the whole number
const T_WORD = T_PULL + 950; // FOLLOWERS
const T_THANKS = T_WORD + 1150;
const END_MS = T_THANKS + 3100;

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
const DW = 2.85; // damage layer
const DH = 1.95;
const SPAN = 2.2; // the block's width
const CW = 2560;
const CH = Math.round((CW * DH) / DW);
const HOLE_R = 12;

// hole centre -> damage-canvas px
const toCanvas = (h) => [((h[0] * SPAN) / DW + 0.5) * CW, (0.5 - (h[1] * SPAN) / DH) * CH];
// hole centre -> world
const toWorld = (h) => [h[0] * SPAN, PY + h[1] * SPAN];

// ---------------- procedural steel ----------------
function steelCanvas() {
  const SW = 1024;
  const c = document.createElement("canvas");
  c.width = SW;
  c.height = SW;
  const x = c.getContext("2d");
  const CW = SW;
  const CH = SW;
  const r = mulberry32(4242);
  x.fillStyle = "#86898c";
  x.fillRect(0, 0, CW, CH);
  // rolled-steel mottling
  for (let i = 0; i < 900; i++) {
    const px = r() * CW;
    const py = r() * CH;
    const rad = 18 + r() * 90;
    const g = x.createRadialGradient(px, py, 0, px, py, rad);
    const v = r() > 0.5 ? 255 : 0;
    g.addColorStop(0, `rgba(${v},${v},${v},${0.004 + r() * 0.007})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g;
    x.fillRect(px - rad, py - rad, rad * 2, rad * 2);
  }
  // brushed grain, horizontal
  for (let i = 0; i < 900; i++) {
    const py = r() * CH;
    const len = 60 + r() * 520;
    const px = r() * CW;
    x.strokeStyle = `rgba(${r() > 0.5 ? 255 : 0},${r() > 0.5 ? 255 : 0},255,${0.012 + r() * 0.022})`;
    x.lineWidth = 1.1 + r() * 2.4;
    x.beginPath();
    x.moveTo(px, py);
    x.lineTo(px + len, py + (r() - 0.5) * 2);
    x.stroke();
  }
  // a few old scuffs, grey like everything else
  for (let i = 0; i < 46; i++) {
    const px = r() * CW;
    const py = r() * CH;
    x.strokeStyle = `rgba(32,32,32,${0.02 + r() * 0.04})`;
    x.lineWidth = 1 + r() * 2.4;
    x.beginPath();
    x.moveTo(px, py);
    x.lineTo(px + (r() - 0.5) * 200, py + (r() - 0.5) * 70);
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
    g.addColorStop(0, "rgba(14,13,13,0.62)");
    g.addColorStop(0.5, "rgba(22,20,19,0.26)");
    g.addColorStop(1, "rgba(22,20,19,0)");
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
    torn(cx, px, py, R, sh, 1.30);
    cx.fillStyle = "#8b9198";
    cx.fill();
    torn(cx, px, py, R, sh, 1.13);
    cx.fillStyle = "#c2c9d0";
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
  const refs = {
    count: React.useRef(null),
    num: React.useRef(null),
  };

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
    const puffTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const g = c.getContext("2d").createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, "rgba(176,178,186,0.30)");
      g.addColorStop(0.5, "rgba(140,142,150,0.11)");
      g.addColorStop(1, "rgba(130,130,140,0)");
      const x = c.getContext("2d");
      x.fillStyle = g;
      x.fillRect(0, 0, 128, 128);
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

    // ---- dust in the beam ----
    const MOTES = 220;
    const motes = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(0.012, 0.012),
      new THREE.MeshBasicMaterial({ color: "#e8e8e8", transparent: true, opacity: 0.16, depthWrite: false }),
      MOTES
    );
    motes.frustumCulled = false;
    scene.add(motes);
    const moteRnd = mulberry32(1212);
    const moteSeed = Array.from({ length: MOTES }, () => ({
      x: (moteRnd() - 0.5) * 6,
      y: moteRnd() * 3.6,
      z: moteRnd() * 5.5,
      sp: 0.02 + moteRnd() * 0.05,
      ph: moteRnd() * 9,
    }));

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

      // ---- dust ----
      for (let i = 0; i < MOTES; i++) {
        const m = moteSeed[i];
        dummy.position.set(
          m.x + Math.sin(t / 2600 + m.ph) * 0.25,
          (m.y + (t / 1000) * m.sp) % 3.6,
          m.z + Math.cos(t / 3100 + m.ph) * 0.2
        );
        dummy.quaternion.copy(camera.quaternion);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        motes.setMatrixAt(i, dummy.matrix);
      }
      motes.instanceMatrix.needsUpdate = true;

      // ---- camera ----
      // In close while it is being shot, back off to read the whole number.
      const pull = easeIO(clamp01((t - T_PULL) / 1700));
      // Close while it is being shot so the holes are objects; back at the end
      // so the two lines are one shape.
      const dist = lerp(7.1, 8.05, pull);
      const drift = ss(0, T_LAST, t);
      let camX = lerp(-0.32, 0, pull) + Math.sin(t / 2300) * 0.05;
      let camY = PY + lerp(-0.1, 0.02, pull) + Math.cos(t / 2700) * 0.035;
      let camZ = dist - 0.25 * drift * (1 - pull);
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

      // ---- overlay ----
      const fire = ss(T_FIRE - 150, T_FIRE + 250, t);
      const gone = ss(SHOT_T[NUM_SHOTS - 1] + 450, SHOT_T[NUM_SHOTS - 1] + 1100, t);
      setFx(refs.count.current, fire * (1 - gone), 0, 1);
      if (refs.num.current) {
        const v = Math.round(3000 * Math.min(1, n / NUM_SHOTS));
        refs.num.current.textContent = v.toLocaleString("en-US");
      }
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
        window.__bulletMarks = { T_FIRE, T_LAST, T_PULL, T_WORD, T_THANKS, END_MS, HOLES: HOLES.length };
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
      <div className="bu-count" ref={refs.count}>
        <div className="bu-num" ref={refs.num}>0</div>
      </div>
    </div>
  );
}
