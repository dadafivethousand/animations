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
// "3,000" / "FOLLOWERS" / "THANK YOU" / "FOR THE SUPPORT" —
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
// has air around it. Everything below it was always fine. Every hole is then nudged a few pixels off
// its sampled position, because a hand-shot group is never a clean copy and
// three identical zeros look printed.
//
// Each entry is [x, y, calibre]; x is in units of the block's own width, and
// the block is 0.891 as tall as it is wide.
const HOLES = [[-0.3825,0.4044,1.0],[-0.3759,0.2432,1.0],[-0.3719,0.2253,1.0],[-0.3644,0.2024,1.0],[-0.3638,0.4373,1.0],[-0.3374,0.3324,1.0],[-0.3156,0.3312,1.0],[-0.2999,0.3290,1.0],[-0.2972,0.3157,1.0],[-0.2847,0.2939,1.0],[-0.2836,0.2730,1.0],[-0.2839,0.2482,1.0],[-0.2876,0.2299,1.0],[-0.2932,0.2083,1.0],[-0.3038,0.1940,1.0],[-0.3295,0.1925,1.0],[-0.3286,0.4434,1.0],[-0.3025,0.4383,1.0],[-0.2880,0.4154,1.0],[-0.2856,0.3935,1.0],[-0.2885,0.3757,1.0],[-0.1998,0.2096,0.72],[-0.1992,0.1909,0.72],[-0.2011,0.1755,0.72],[-0.2099,0.1545,0.72],[-0.2188,0.1438,0.72],[-0.1134,0.4077,1.0],[-0.1202,0.3890,1.0],[-0.1210,0.3652,1.0],[-0.1208,0.3448,1.0],[-0.1227,0.3191,1.0],[-0.1210,0.2978,1.0],[-0.1231,0.2767,1.0],[-0.1178,0.2534,1.0],[-0.1134,0.2340,1.0],[-0.0852,0.4431,1.0],[-0.1035,0.4361,1.0],[-0.0625,0.4459,1.0],[-0.0441,0.4343,1.0],[-0.1028,0.1996,1.0],[-0.0776,0.1925,1.0],[-0.0299,0.4080,1.0],[-0.0273,0.3855,1.0],[-0.0262,0.3649,1.0],[-0.0238,0.3416,1.0],[-0.0262,0.3214,1.0],[-0.0258,0.2967,1.0],[-0.0245,0.2734,1.0],[-0.0252,0.2540,1.0],[-0.0293,0.2298,1.0],[-0.0401,0.2085,1.0],[0.1098,0.4452,1.0],[0.1313,0.4462,1.0],[0.1544,0.4297,1.0],[0.1621,0.4074,1.0],[0.1668,0.3879,1.0],[0.1713,0.3652,1.0],[0.1698,0.3423,1.0],[0.1718,0.3197,1.0],[0.1725,0.2980,1.0],[0.1701,0.2744,1.0],[0.1689,0.2522,1.0],[0.1648,0.2333,1.0],[0.1574,0.2104,1.0],[0.1478,0.1946,1.0],[0.1232,0.1930,1.0],[0.0938,0.1959,1.0],[0.0784,0.2331,1.0],[0.0745,0.2545,1.0],[0.0731,0.2766,1.0],[0.0747,0.2984,1.0],[0.0728,0.3197,1.0],[0.0748,0.3418,1.0],[0.0720,0.3649,1.0],[0.0775,0.3886,1.0],[0.0788,0.4076,1.0],[0.0895,0.4346,1.0],[0.2948,0.4418,1.0],[0.2812,0.4303,1.0],[0.2737,0.4010,1.0],[0.2707,0.3795,1.0],[0.2675,0.3593,1.0],[0.2697,0.3361,1.0],[0.2692,0.3120,1.0],[0.2683,0.2928,1.0],[0.2673,0.2693,1.0],[0.2714,0.2481,1.0],[0.2743,0.2287,1.0],[0.2829,0.2054,1.0],[0.3271,0.4427,1.0],[0.3485,0.4366,1.0],[0.3594,0.4120,1.0],[0.3638,0.3893,1.0],[0.3656,0.3692,1.0],[0.3648,0.3459,1.0],[0.3651,0.3244,1.0],[0.3666,0.2998,1.0],[0.3661,0.2793,1.0],[0.3658,0.2579,1.0],[0.3609,0.2351,1.0],[0.3535,0.2117,1.0],[0.3417,0.1950,1.0],[0.3127,0.1925,1.0],[-0.4755,0.0842,0.72],[-0.4922,0.0837,0.72],[-0.4920,0.0595,0.72],[-0.4957,0.0456,0.72],[-0.4818,0.0253,0.72],[-0.4954,0.0200,0.72],[-0.4947,0.0039,0.72],[-0.4943,-0.0143,0.72],[-0.4942,-0.0289,0.72],[-0.4675,0.0261,0.72],[-0.3838,0.0891,0.72],[-0.3928,0.0762,0.72],[-0.3951,0.0584,0.72],[-0.3969,0.0442,0.72],[-0.3991,0.0290,0.72],[-0.3963,0.0129,0.72],[-0.3975,-0.0067,0.72],[-0.3955,-0.0198,0.72],[-0.3900,-0.0362,0.72],[-0.3586,-0.0398,0.72],[-0.3531,-0.0252,0.72],[-0.3474,-0.0087,0.72],[-0.3449,0.0061,0.72],[-0.3445,0.0223,0.72],[-0.3445,0.0398,0.72],[-0.3469,0.0545,0.72],[-0.3504,0.0723,0.72],[-0.3600,0.0876,0.72],[-0.2698,0.0825,0.72],[-0.2717,0.0699,0.72],[-0.2719,0.0508,0.72],[-0.2716,0.0372,0.72],[-0.2722,0.0205,0.72],[-0.2706,0.0047,0.72],[-0.2725,-0.0110,0.72],[-0.2722,-0.0300,0.72],[-0.2604,-0.0365,0.72],[-0.2445,-0.0366,0.72],[-0.1791,0.0798,0.72],[-0.1784,0.0665,0.72],[-0.1798,0.0474,0.72],[-0.1780,0.0324,0.72],[-0.1787,0.0154,0.72],[-0.1782,0.0018,0.72],[-0.1777,-0.0154,0.72],[-0.1757,-0.0326,0.72],[-0.1608,-0.0339,0.72],[-0.1490,-0.0359,0.72],[-0.0472,0.0875,0.72],[-0.0383,0.0705,0.72],[-0.0343,0.0566,0.72],[-0.0342,0.0383,0.72],[-0.0340,0.0231,0.72],[-0.0330,0.0052,0.72],[-0.0364,-0.0074,0.72],[-0.0390,-0.0229,0.72],[-0.0457,-0.0384,0.72],[-0.0778,-0.0357,0.72],[-0.0815,-0.0188,0.72],[-0.0862,-0.0038,0.72],[-0.0862,0.0126,0.72],[-0.0845,0.0279,0.72],[-0.0865,0.0419,0.72],[-0.0837,0.0604,0.72],[-0.0810,0.0763,0.72],[-0.0762,0.0895,0.72],[0.0348,0.0844,0.72],[0.0363,0.0658,0.72],[0.0378,0.0512,0.72],[0.0399,0.0333,0.72],[0.0377,0.0166,0.72],[0.0421,0.0029,0.72],[0.0432,-0.0125,0.72],[0.0630,-0.0176,0.72],[0.0723,0.0084,0.72],[0.1491,0.0864,0.72],[0.1449,0.0706,0.72],[0.1429,0.0513,0.72],[0.1399,0.0368,0.72],[0.1407,0.0216,0.72],[0.1368,0.0027,0.72],[0.1301,-0.0232,0.72],[0.1168,-0.0180,0.72],[0.1089,-0.0044,0.72],[0.1053,0.0096,0.72],[0.1047,0.0256,0.72],[0.0986,0.0418,0.72],[0.0910,0.0491,0.72],[0.0786,0.0425,0.72],[0.0881,0.0666,0.72],[0.2396,0.0858,0.72],[0.2172,0.0822,0.72],[0.2182,0.0623,0.72],[0.2193,0.0439,0.72],[0.2176,0.0290,0.72],[0.2162,0.0163,0.72],[0.2171,0.0011,0.72],[0.2182,-0.0168,0.72],[0.2205,-0.0343,0.72],[0.2347,-0.0363,0.72],[0.2505,-0.0352,0.72],[0.2462,0.0254,0.72],[0.2279,0.0275,0.72],[0.3404,0.0868,0.72],[0.3591,0.0851,0.72],[0.3637,0.0695,0.72],[0.3668,0.0529,0.72],[0.3614,0.0406,0.72],[0.3545,0.0283,0.72],[0.3564,0.0193,0.72],[0.3661,0.0011,0.72],[0.3692,-0.0123,0.72],[0.3693,-0.0315,0.72],[0.3176,-0.0290,0.72],[0.3182,-0.0137,0.72],[0.3186,0.0002,0.72],[0.3163,0.0176,0.72],[0.3182,0.0313,0.72],[0.3159,0.0468,0.72],[0.3186,0.0643,0.72],[0.3162,0.0804,0.72],[0.3376,0.0295,0.72],[0.4628,0.0913,0.72],[0.4765,0.0892,0.72],[0.4845,0.0708,0.72],[0.4491,0.0894,0.72],[0.4396,0.0761,0.72],[0.4377,0.0633,0.72],[0.4418,0.0491,0.72],[0.4474,0.0392,0.72],[0.4643,0.0274,0.72],[0.4800,0.0154,0.72],[0.4858,-0.0008,0.72],[0.4889,-0.0157,0.72],[0.4853,-0.0295,0.72],[0.4638,-0.0391,0.72],[0.4458,-0.0367,0.72],[0.4386,-0.0205,0.72],[-0.3264,-0.1817,0.72],[-0.3043,-0.1844,0.72],[-0.3062,-0.2045,0.72],[-0.3034,-0.2216,0.72],[-0.3065,-0.2345,0.72],[-0.3049,-0.2540,0.72],[-0.3045,-0.2698,0.72],[-0.2855,-0.1821,0.72],[-0.2442,-0.1851,0.72],[-0.2448,-0.2037,0.72],[-0.2437,-0.2245,0.72],[-0.2436,-0.2429,0.72],[-0.2445,-0.2561,0.72],[-0.2086,-0.2502,0.72],[-0.2058,-0.2685,0.72],[-0.2071,-0.2373,0.72],[-0.2067,-0.2222,0.72],[-0.2071,-0.2048,0.72],[-0.2085,-0.1856,0.72],[-0.2235,-0.2243,0.72],[-0.1534,-0.1848,0.72],[-0.1362,-0.1868,0.72],[-0.1344,-0.2029,0.72],[-0.1289,-0.2209,0.72],[-0.1296,-0.2358,0.72],[-0.1265,-0.2508,0.72],[-0.1463,-0.2534,0.72],[-0.1642,-0.2547,0.72],[-0.1639,-0.2374,0.72],[-0.1592,-0.2192,0.72],[-0.1598,-0.2049,0.72],[-0.1682,-0.2721,0.72],[-0.1262,-0.2686,0.72],[-0.0440,-0.1839,0.72],[-0.0453,-0.2012,0.72],[-0.0455,-0.2151,0.72],[-0.0464,-0.2364,0.72],[-0.0615,-0.2290,0.72],[-0.0821,-0.2231,0.72],[-0.0869,-0.2381,0.72],[-0.0856,-0.2560,0.72],[-0.0857,-0.2723,0.72],[-0.0465,-0.2710,0.72],[-0.0478,-0.2544,0.72],[-0.0815,-0.2037,0.72],[-0.0848,-0.1841,0.72],[0.0453,-0.1774,0.72],[0.0327,-0.1957,0.72],[0.0276,-0.2163,0.72],[0.0238,-0.2275,0.72],[0.0019,-0.2243,0.72],[0.0018,-0.2065,0.72],[-0.0007,-0.1866,0.72],[0.0002,-0.2425,0.72],[0.0018,-0.2590,0.72],[0.0318,-0.2490,0.72],[0.0398,-0.2697,0.72],[0.0570,-0.2844,0.72],[0.1517,-0.1744,0.72],[0.1415,-0.1866,0.72],[0.1400,-0.2054,0.72],[0.1295,-0.2248,0.72],[0.1151,-0.2185,0.72],[0.1135,-0.2004,0.72],[0.1110,-0.1819,0.72],[0.1285,-0.2531,0.72],[0.1255,-0.2680,0.72],[0.1924,-0.1824,0.72],[0.1865,-0.1993,0.72],[0.1876,-0.2142,0.72],[0.1863,-0.2317,0.72],[0.1868,-0.2464,0.72],[0.1880,-0.2613,0.72],[0.1924,-0.2738,0.72],[0.2202,-0.2693,0.72],[0.2234,-0.2540,0.72],[0.2239,-0.2383,0.72],[0.2239,-0.2213,0.72],[0.2241,-0.2033,0.72],[0.2169,-0.1865,0.72],[0.2710,-0.1863,0.72],[0.2719,-0.2072,0.72],[0.2712,-0.2247,0.72],[0.2686,-0.2394,0.72],[0.2693,-0.2558,0.72],[0.2774,-0.2712,0.72],[0.2988,-0.2733,0.72],[0.3086,-0.2522,0.72],[0.3069,-0.2348,0.72],[0.3072,-0.2175,0.72],[0.3083,-0.2005,0.72],[0.3076,-0.1880,0.72],[-0.4767,-0.3549,0.72],[-0.4976,-0.3581,0.72],[-0.5009,-0.3824,0.72],[-0.4984,-0.3977,0.72],[-0.5015,-0.4151,0.72],[-0.5000,-0.4332,0.72],[-0.4808,-0.3987,0.72],[-0.4321,-0.3547,0.72],[-0.4381,-0.3670,0.72],[-0.4413,-0.3820,0.72],[-0.4387,-0.3969,0.72],[-0.4421,-0.4120,0.72],[-0.4410,-0.4279,0.72],[-0.4348,-0.4446,0.72],[-0.4077,-0.4415,0.72],[-0.4018,-0.4195,0.72],[-0.4020,-0.4029,0.72],[-0.4034,-0.3904,0.72],[-0.4023,-0.3707,0.72],[-0.4094,-0.3580,0.72],[-0.3373,-0.3531,0.72],[-0.3562,-0.3544,0.72],[-0.3573,-0.3781,0.72],[-0.3587,-0.3977,0.72],[-0.3562,-0.4083,0.72],[-0.3588,-0.4226,0.72],[-0.3568,-0.4407,0.72],[-0.3228,-0.4432,0.72],[-0.3214,-0.4262,0.72],[-0.3233,-0.4136,0.72],[-0.3407,-0.3968,0.72],[-0.3277,-0.3865,0.72],[-0.3203,-0.3743,0.72],[-0.2567,-0.3557,0.72],[-0.2318,-0.3545,0.72],[-0.2141,-0.3534,0.72],[-0.2339,-0.3771,0.72],[-0.2339,-0.3913,0.72],[-0.2351,-0.4087,0.72],[-0.2355,-0.4223,0.72],[-0.2352,-0.4415,0.72],[-0.1776,-0.3599,0.72],[-0.1763,-0.3791,0.72],[-0.1787,-0.3948,0.72],[-0.1794,-0.4068,0.72],[-0.1762,-0.4239,0.72],[-0.1783,-0.4419,0.72],[-0.1395,-0.4384,0.72],[-0.1410,-0.4242,0.72],[-0.1418,-0.4090,0.72],[-0.1412,-0.3972,0.72],[-0.1594,-0.3945,0.72],[-0.1415,-0.3746,0.72],[-0.1417,-0.3584,0.72],[-0.0735,-0.3525,0.72],[-0.0938,-0.3575,0.72],[-0.0935,-0.3746,0.72],[-0.0937,-0.3972,0.72],[-0.0952,-0.4168,0.72],[-0.0957,-0.4331,0.72],[-0.0897,-0.4462,0.72],[-0.0725,-0.4445,0.72],[-0.0746,-0.3991,0.72],[0.0239,-0.3547,0.72],[0.0279,-0.3637,0.72],[-0.0001,-0.3551,0.72],[-0.0048,-0.3739,0.72],[0.0040,-0.3915,0.72],[0.0202,-0.4034,0.72],[0.0289,-0.4138,0.72],[0.0321,-0.4321,0.72],[0.0255,-0.4437,0.72],[-0.0026,-0.4421,0.72],[-0.0047,-0.4289,0.72],[0.0710,-0.3571,0.72],[0.0734,-0.3817,0.72],[0.0747,-0.3953,0.72],[0.0738,-0.4127,0.72],[0.0743,-0.4299,0.72],[0.0786,-0.4438,0.72],[0.1051,-0.4434,0.72],[0.1095,-0.4251,0.72],[0.1118,-0.4059,0.72],[0.1115,-0.3924,0.72],[0.1100,-0.3747,0.72],[0.1095,-0.3603,0.72],[0.1698,-0.3541,0.72],[0.1589,-0.3582,0.72],[0.1573,-0.3833,0.72],[0.1688,-0.4023,0.72],[0.1889,-0.3932,0.72],[0.1906,-0.3728,0.72],[0.1865,-0.3559,0.72],[0.1577,-0.4221,0.72],[0.1563,-0.4400,0.72],[0.2368,-0.3552,0.72],[0.2529,-0.3542,0.72],[0.2657,-0.3743,0.72],[0.2581,-0.4001,0.72],[0.2311,-0.3997,0.72],[0.2296,-0.4176,0.72],[0.2301,-0.4409,0.72],[0.2306,-0.3726,0.72],[0.3323,-0.3530,0.72],[0.3137,-0.3560,0.72],[0.3082,-0.3673,0.72],[0.3032,-0.3794,0.72],[0.3032,-0.3958,0.72],[0.3038,-0.4131,0.72],[0.3072,-0.4286,0.72],[0.3100,-0.4432,0.72],[0.3399,-0.4403,0.72],[0.3441,-0.4243,0.72],[0.3423,-0.4094,0.72],[0.3430,-0.3941,0.72],[0.3406,-0.3753,0.72],[0.4012,-0.3543,0.72],[0.3897,-0.3552,0.72],[0.3858,-0.3808,0.72],[0.3896,-0.3938,0.72],[0.3896,-0.4078,0.72],[0.3861,-0.4222,0.72],[0.3885,-0.4415,0.72],[0.4237,-0.4428,0.72],[0.4221,-0.4286,0.72],[0.4197,-0.4107,0.72],[0.4143,-0.3940,0.72],[0.4227,-0.3836,0.72],[0.4177,-0.3575,0.72],[0.4592,-0.3535,0.72],[0.4781,-0.3576,0.72],[0.4814,-0.3762,0.72],[0.4778,-0.3901,0.72],[0.4806,-0.4069,0.72],[0.4807,-0.4248,0.72],[0.4779,-0.4411,0.72],[0.4989,-0.3549,0.72]];

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
const DW = 2.75; // damage layer
const DH = 2.5;
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
