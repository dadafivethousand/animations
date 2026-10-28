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
// "3,000" / "FOLLOWERS!" / "THANK YOU" / "FOR THE SUPPORT" —
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
// the block is 0.941 as tall as it is wide.
const HOLES = [[-0.4055,0.4271,1.0],[-0.3985,0.2562,1.0],[-0.3943,0.2372,1.0],[-0.3863,0.2130,1.0],[-0.3856,0.4619,1.0],[-0.3577,0.3508,1.0],[-0.3346,0.3495,1.0],[-0.3180,0.3471,1.0],[-0.3151,0.3331,1.0],[-0.3018,0.3100,1.0],[-0.3007,0.2877,1.0],[-0.3010,0.2615,1.0],[-0.3049,0.2421,1.0],[-0.3108,0.2192,1.0],[-0.3221,0.2040,1.0],[-0.3493,0.2025,1.0],[-0.3483,0.4684,1.0],[-0.3207,0.4630,1.0],[-0.3053,0.4387,1.0],[-0.3027,0.4156,1.0],[-0.3059,0.3967,1.0],[-0.2118,0.2206,1.0],[-0.2123,0.1912,1.0],[-0.2185,0.1694,1.0],[-0.2333,0.1515,1.0],[-0.1203,0.4298,1.0],[-0.1245,0.4081,1.0],[-0.1296,0.3871,1.0],[-0.1282,0.3619,1.0],[-0.1280,0.3403,1.0],[-0.1301,0.3131,1.0],[-0.1283,0.2905,1.0],[-0.1283,0.2681,1.0],[-0.1206,0.2445,1.0],[-0.0880,0.4707,1.0],[-0.1096,0.4606,1.0],[-0.0668,0.4682,1.0],[-0.0448,0.4625,1.0],[-0.1090,0.2066,1.0],[-0.0832,0.2046,1.0],[-0.0340,0.4299,1.0],[-0.0275,0.4084,1.0],[-0.0268,0.3834,1.0],[-0.0267,0.3616,1.0],[-0.0253,0.3369,1.0],[-0.0277,0.3155,1.0],[-0.0284,0.2893,1.0],[-0.0271,0.2646,1.0],[-0.0310,0.2452,1.0],[-0.0407,0.2152,1.0],[0.1163,0.4715,1.0],[0.1400,0.4704,1.0],[0.1638,0.4574,1.0],[0.1722,0.4292,1.0],[0.1762,0.4078,1.0],[0.1790,0.3860,1.0],[0.1827,0.3619,1.0],[0.1800,0.3376,1.0],[0.1822,0.3137,1.0],[0.1818,0.2907,1.0],[0.1793,0.2657,1.0],[0.1747,0.2432,1.0],[0.1683,0.2242,1.0],[0.1540,0.2053,1.0],[0.1309,0.2014,1.0],[0.1017,0.2073,1.0],[0.0833,0.2437,1.0],[0.0788,0.2680,1.0],[0.0768,0.2918,1.0],[0.0775,0.3152,1.0],[0.0792,0.3383,1.0],[0.0772,0.3609,1.0],[0.0793,0.3843,1.0],[0.0785,0.4088,1.0],[0.0865,0.4329,1.0],[0.0942,0.4573,1.0],[0.3106,0.4666,1.0],[0.3007,0.4538,1.0],[0.2895,0.4256,1.0],[0.2869,0.4010,1.0],[0.2848,0.3771,1.0],[0.2835,0.3557,1.0],[0.2859,0.3311,1.0],[0.2854,0.3055,1.0],[0.2845,0.2852,1.0],[0.2866,0.2613,1.0],[0.2920,0.2388,1.0],[0.2983,0.2194,1.0],[0.3471,0.4683,1.0],[0.3682,0.4591,1.0],[0.3802,0.4344,1.0],[0.3864,0.4137,1.0],[0.3878,0.3875,1.0],[0.3886,0.3661,1.0],[0.3867,0.3414,1.0],[0.3871,0.3187,1.0],[0.3875,0.2926,1.0],[0.3870,0.2708,1.0],[0.3846,0.2492,1.0],[0.3740,0.2208,1.0],[0.3629,0.2077,1.0],[0.3322,0.2019,1.0],[-0.4099,0.0909,1.0],[-0.4397,0.0887,1.0],[-0.4402,0.0635,1.0],[-0.4389,0.0325,1.0],[-0.4139,0.0338,1.0],[-0.4410,-0.0037,1.0],[-0.4425,-0.0233,1.0],[-0.3581,0.0894,1.0],[-0.3641,0.0637,1.0],[-0.3651,0.0418,1.0],[-0.3669,0.0153,1.0],[-0.3629,-0.0069,1.0],[-0.3552,-0.0314,1.0],[-0.3223,0.0925,1.0],[-0.3145,0.0720,1.0],[-0.3137,0.0495,1.0],[-0.3107,0.0260,1.0],[-0.3130,-0.0012,1.0],[-0.3205,-0.0269,1.0],[-0.2589,0.0845,1.0],[-0.2578,0.0613,1.0],[-0.2606,0.0382,1.0],[-0.2588,0.0160,1.0],[-0.2572,-0.0091,1.0],[-0.2525,-0.0316,1.0],[-0.2279,-0.0303,1.0],[-0.1854,0.0852,1.0],[-0.1858,0.0633,1.0],[-0.1853,0.0365,1.0],[-0.1840,0.0161,1.0],[-0.1861,-0.0080,1.0],[-0.1809,-0.0326,1.0],[-0.1570,-0.0298,1.0],[-0.1093,0.0866,1.0],[-0.1130,0.0645,1.0],[-0.1162,0.0414,1.0],[-0.1158,0.0149,1.0],[-0.1141,-0.0081,1.0],[-0.1068,-0.0318,1.0],[-0.0761,0.0927,1.0],[-0.0657,0.0732,1.0],[-0.0640,0.0465,1.0],[-0.0621,0.0242,1.0],[-0.0639,-0.0003,1.0],[-0.0730,-0.0298,1.0],[-0.0135,0.0818,1.0],[-0.0103,0.0540,1.0],[-0.0085,0.0311,1.0],[-0.0055,0.0065,1.0],[-0.0039,-0.0118,1.0],[0.0131,-0.0149,1.0],[0.0269,0.0176,1.0],[0.1043,0.0916,1.0],[0.0980,0.0669,1.0],[0.0959,0.0425,1.0],[0.0912,0.0227,1.0],[0.0895,-0.0012,1.0],[0.0825,-0.0208,1.0],[0.0613,-0.0116,1.0],[0.0595,0.0149,1.0],[0.0556,0.0384,1.0],[0.0374,0.0536,1.0],[0.0435,0.0838,1.0],[0.1798,0.0900,1.0],[0.1505,0.0882,1.0],[0.1491,0.0621,1.0],[0.1478,0.0354,1.0],[0.1507,0.0095,1.0],[0.1500,-0.0166,1.0],[0.1613,-0.0299,1.0],[0.1850,-0.0318,1.0],[0.1773,0.0310,1.0],[0.2302,0.0605,1.0],[0.2282,0.0366,1.0],[0.2310,0.0087,1.0],[0.2290,-0.0120,1.0],[0.2321,0.0921,1.0],[0.2674,0.0937,1.0],[0.2760,0.0528,1.0],[0.2674,0.0374,1.0],[0.2747,0.0192,1.0],[0.2781,-0.0019,1.0],[0.2785,-0.0294,1.0],[0.3385,0.0898,1.0],[0.3322,0.0678,1.0],[0.3337,0.0472,1.0],[0.3492,0.0363,1.0],[0.3631,0.0288,1.0],[0.3325,-0.0108,1.0],[0.3365,-0.0285,1.0],[0.3692,0.0926,1.0],[0.3795,0.0764,1.0],[0.3805,-0.0110,1.0],[0.3740,-0.0300,1.0],[0.4353,0.0535,1.0],[0.4334,0.0312,1.0],[0.4320,0.0071,1.0],[0.4329,0.0886,1.0],[0.4363,-0.0313,1.0],[-0.3167,-0.1914,0.72],[-0.2941,-0.1914,0.72],[-0.2763,-0.1891,0.72],[-0.2969,-0.2140,0.72],[-0.2992,-0.2289,0.72],[-0.2979,-0.2476,0.72],[-0.2953,-0.2633,0.72],[-0.2990,-0.2810,0.72],[-0.1488,-0.1934,0.72],[-0.1308,-0.1935,0.72],[-0.1275,-0.2109,0.72],[-0.1276,-0.2258,0.72],[-0.1226,-0.2461,0.72],[-0.1204,-0.2625,0.72],[-0.1396,-0.2635,0.72],[-0.1601,-0.2630,0.72],[-0.1584,-0.2469,0.72],[-0.1569,-0.2321,0.72],[-0.1572,-0.2137,0.72],[-0.2002,-0.2099,0.72],[-0.2026,-0.1956,0.72],[-0.1998,-0.2328,0.72],[-0.2024,-0.2480,0.72],[-0.2011,-0.2633,0.72],[-0.2004,-0.2803,0.72],[-0.1697,-0.2901,0.72],[-0.1194,-0.2839,0.72],[-0.2170,-0.2320,0.72],[-0.2400,-0.2353,0.72],[-0.2399,-0.2457,0.72],[-0.2387,-0.2618,0.72],[-0.2414,-0.2787,0.72],[-0.2396,-0.2151,0.72],[-0.2412,-0.1934,0.72],[-0.0418,-0.1924,0.72],[-0.0397,-0.2082,0.72],[-0.0392,-0.2239,0.72],[-0.0426,-0.2426,0.72],[-0.0456,-0.2647,0.72],[-0.0436,-0.2798,0.72],[-0.0853,-0.2833,0.72],[-0.0823,-0.2657,0.72],[-0.0853,-0.2506,0.72],[-0.0791,-0.2323,0.72],[-0.0652,-0.2362,0.72],[-0.0808,-0.2129,0.72],[-0.0835,-0.1942,0.72],[0.0471,-0.1839,0.72],[0.0351,-0.2054,0.72],[0.0280,-0.2348,0.72],[0.0357,-0.2621,0.72],[0.0422,-0.2859,0.72],[0.0595,-0.2956,0.72],[-0.0001,-0.2787,0.72],[0.0029,-0.2637,0.72],[0.0015,-0.2478,0.72],[0.0019,-0.2168,0.72],[0.0014,-0.1919,0.72],[0.1481,-0.1823,0.72],[0.1397,-0.1965,0.72],[0.1356,-0.2115,0.72],[0.1281,-0.2318,0.72],[0.1075,-0.2210,0.72],[0.1080,-0.2068,0.72],[0.1019,-0.1894,0.72],[0.1223,-0.2546,0.72],[0.1206,-0.2734,0.72],[0.1864,-0.1901,0.72],[0.1793,-0.2028,0.72],[0.1788,-0.2168,0.72],[0.1772,-0.2360,0.72],[0.1790,-0.2504,0.72],[0.1784,-0.2670,0.72],[0.1851,-0.2835,0.72],[0.2127,-0.2815,0.72],[0.2168,-0.2629,0.72],[0.2191,-0.2490,0.72],[0.2191,-0.2304,0.72],[0.2187,-0.2145,0.72],[0.2062,-0.1874,0.72],[0.2601,-0.1947,0.72],[0.2600,-0.2184,0.72],[0.2597,-0.2364,0.72],[0.2605,-0.2520,0.72],[0.2624,-0.2702,0.72],[0.2674,-0.2826,0.72],[0.2916,-0.2862,0.72],[0.2975,-0.2638,0.72],[0.2996,-0.2470,0.72],[0.2999,-0.2299,0.72],[0.3014,-0.2104,0.72],[0.3013,-0.1915,0.72],[-0.4782,-0.3721,0.72],[-0.4998,-0.3735,0.72],[-0.4991,-0.3996,0.72],[-0.4781,-0.4190,0.72],[-0.4986,-0.4270,0.72],[-0.4986,-0.4469,0.72],[-0.5012,-0.4612,0.72],[-0.4326,-0.3689,0.72],[-0.4375,-0.3857,0.72],[-0.4410,-0.3987,0.72],[-0.4424,-0.4189,0.72],[-0.4408,-0.4329,0.72],[-0.4382,-0.4508,0.72],[-0.4325,-0.4673,0.72],[-0.4077,-0.4627,0.72],[-0.4034,-0.4439,0.72],[-0.4020,-0.4264,0.72],[-0.3998,-0.4078,0.72],[-0.4023,-0.3920,0.72],[-0.4103,-0.3701,0.72],[-0.3532,-0.3698,0.72],[-0.3272,-0.3745,0.72],[-0.3191,-0.3923,0.72],[-0.3243,-0.4082,0.72],[-0.3388,-0.4184,0.72],[-0.3571,-0.4165,0.72],[-0.3569,-0.4274,0.72],[-0.3591,-0.4472,0.72],[-0.3565,-0.4630,0.72],[-0.3169,-0.4627,0.72],[-0.3177,-0.4469,0.72],[-0.3247,-0.4292,0.72],[-0.3593,-0.3973,0.72],[-0.2574,-0.3717,0.72],[-0.2401,-0.3750,0.72],[-0.2351,-0.3955,0.72],[-0.2380,-0.4114,0.72],[-0.2377,-0.4275,0.72],[-0.2364,-0.4438,0.72],[-0.2372,-0.4648,0.72],[-0.2146,-0.3725,0.72],[-0.1788,-0.3780,0.72],[-0.1812,-0.3994,0.72],[-0.1786,-0.4147,0.72],[-0.1818,-0.4288,0.72],[-0.1803,-0.4479,0.72],[-0.1813,-0.4639,0.72],[-0.1394,-0.4634,0.72],[-0.1415,-0.4476,0.72],[-0.1416,-0.4302,0.72],[-0.1389,-0.4148,0.72],[-0.1607,-0.4148,0.72],[-0.1424,-0.3919,0.72],[-0.1412,-0.3764,0.72],[-0.0717,-0.3698,0.72],[-0.0923,-0.3712,0.72],[-0.0957,-0.3976,0.72],[-0.0961,-0.4198,0.72],[-0.0724,-0.4160,0.72],[-0.0970,-0.4412,0.72],[-0.0980,-0.4564,0.72],[-0.0890,-0.4664,0.72],[-0.0709,-0.4657,0.72],[-0.0026,-0.3717,0.72],[0.0204,-0.3711,0.72],[0.0242,-0.3820,0.72],[-0.0102,-0.3927,0.72],[-0.0032,-0.4135,0.72],[0.0113,-0.4180,0.72],[0.0242,-0.4304,0.72],[0.0283,-0.4512,0.72],[0.0217,-0.4661,0.72],[0.0060,-0.4724,0.72],[-0.0103,-0.4517,0.72],[0.0708,-0.3752,0.72],[0.0702,-0.3987,0.72],[0.0707,-0.4186,0.72],[0.0707,-0.4336,0.72],[0.0705,-0.4521,0.72],[0.0755,-0.4643,0.72],[0.1005,-0.4696,0.72],[0.1079,-0.4465,0.72],[0.1104,-0.4282,0.72],[0.1078,-0.4104,0.72],[0.1070,-0.3921,0.72],[0.1104,-0.3758,0.72],[0.1565,-0.3724,0.72],[0.1536,-0.3913,0.72],[0.1520,-0.4223,0.72],[0.1512,-0.4470,0.72],[0.1529,-0.4645,0.72],[0.1862,-0.4123,0.72],[0.1891,-0.3965,0.72],[0.1846,-0.3761,0.72],[0.2493,-0.3688,0.72],[0.2310,-0.3730,0.72],[0.2292,-0.3933,0.72],[0.2290,-0.4216,0.72],[0.2274,-0.4413,0.72],[0.2269,-0.4650,0.72],[0.2590,-0.4209,0.72],[0.2633,-0.3923,0.72],[0.3308,-0.3721,0.72],[0.3097,-0.3744,0.72],[0.3021,-0.3871,0.72],[0.3035,-0.4049,0.72],[0.3029,-0.4237,0.72],[0.3025,-0.4413,0.72],[0.3036,-0.4561,0.72],[0.3085,-0.4692,0.72],[0.3345,-0.4694,0.72],[0.3414,-0.4462,0.72],[0.3396,-0.4295,0.72],[0.3416,-0.4134,0.72],[0.3392,-0.3941,0.72],[0.4019,-0.3719,0.72],[0.3903,-0.3702,0.72],[0.3862,-0.3930,0.72],[0.3856,-0.4166,0.72],[0.3848,-0.4291,0.72],[0.3872,-0.4438,0.72],[0.3854,-0.4651,0.72],[0.4254,-0.4630,0.72],[0.4250,-0.4508,0.72],[0.4202,-0.4332,0.72],[0.4026,-0.4190,0.72],[0.4160,-0.4091,0.72],[0.4248,-0.3931,0.72],[0.4189,-0.3736,0.72],[0.4590,-0.3733,0.72],[0.4771,-0.3745,0.72],[0.4778,-0.3925,0.72],[0.4788,-0.4100,0.72],[0.4805,-0.4254,0.72],[0.4790,-0.4444,0.72],[0.4807,-0.4651,0.72],[0.5009,-0.3728,0.72]];

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
const DW = 2.7; // damage layer
const DH = 2.6;
const SPAN = 2.1; // the block's width
const CW = 1700;
const CH = Math.round((CW * DH) / DW);
const HOLE_R = 11.3;

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
      const dist = 7.43;
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
