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
// Four lines — "3,000" / "FOLLOWERS" / "THANK YOU" / "FOR THE SUPPORT!" —
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
// the block is 0.909 as tall as it is wide.
const HOLES = [[-0.3523,0.4564,1.0],[-0.3275,0.4524,1.0],[-0.3060,0.4502,1.0],[-0.2952,0.4261,1.0],[-0.2915,0.4034,1.0],[-0.2929,0.3837,1.0],[-0.2998,0.3593,1.0],[-0.3212,0.3347,1.0],[-0.3456,0.3398,1.0],[-0.2998,0.3243,1.0],[-0.2933,0.3040,1.0],[-0.2872,0.2780,1.0],[-0.2880,0.2590,1.0],[-0.2902,0.2345,1.0],[-0.2956,0.2102,1.0],[-0.3225,0.1979,1.0],[-0.3563,0.1949,1.0],[-0.3750,0.2138,1.0],[-0.3779,0.2360,1.0],[-0.3844,0.2580,1.0],[-0.3941,0.4062,1.0],[-0.3780,0.4237,1.0],[-0.3739,0.4449,1.0],[-0.2045,0.2125,1.0],[-0.1987,0.1874,1.0],[-0.2033,0.1639,1.0],[-0.2197,0.1482,1.0],[-0.0772,0.4561,1.0],[-0.0527,0.4511,1.0],[-0.0348,0.4379,1.0],[-0.0301,0.4118,1.0],[-0.0238,0.3902,1.0],[-0.0254,0.3689,1.0],[-0.0202,0.3448,1.0],[-0.0197,0.3244,1.0],[-0.0225,0.2984,1.0],[-0.0236,0.2757,1.0],[-0.0251,0.2564,1.0],[-0.0316,0.2291,1.0],[-0.0398,0.2114,1.0],[-0.0594,0.1963,1.0],[-0.1013,0.2027,1.0],[-0.1124,0.2229,1.0],[-0.1188,0.2478,1.0],[-0.1201,0.2692,1.0],[-0.1242,0.2948,1.0],[-0.1236,0.3144,1.0],[-0.1208,0.3359,1.0],[-0.1204,0.3624,1.0],[-0.1193,0.3814,1.0],[-0.1184,0.4093,1.0],[-0.1120,0.4307,1.0],[-0.1006,0.4516,1.0],[0.1219,0.4525,1.0],[0.1443,0.4507,1.0],[0.1627,0.4373,1.0],[0.1732,0.4150,1.0],[0.1740,0.3914,1.0],[0.1777,0.3683,1.0],[0.1796,0.3461,1.0],[0.1778,0.3217,1.0],[0.1775,0.2989,1.0],[0.1765,0.2791,1.0],[0.1727,0.2529,1.0],[0.1717,0.2293,1.0],[0.1632,0.2094,1.0],[0.1397,0.1956,1.0],[0.0949,0.2030,1.0],[0.0857,0.2250,1.0],[0.0814,0.2475,1.0],[0.0804,0.2697,1.0],[0.0769,0.2913,1.0],[0.0795,0.3138,1.0],[0.0758,0.3377,1.0],[0.0803,0.3624,1.0],[0.0777,0.3823,1.0],[0.0817,0.4072,1.0],[0.0902,0.4301,1.0],[0.0995,0.4507,1.0],[0.3230,0.4534,1.0],[0.3459,0.4499,1.0],[0.3620,0.4371,1.0],[0.3721,0.4141,1.0],[0.3756,0.3889,1.0],[0.3755,0.3700,1.0],[0.3753,0.3457,1.0],[0.3767,0.3229,1.0],[0.3752,0.3026,1.0],[0.3761,0.2759,1.0],[0.3736,0.2523,1.0],[0.3709,0.2321,1.0],[0.3636,0.2112,1.0],[0.3420,0.1956,1.0],[0.2971,0.2035,1.0],[0.2855,0.2240,1.0],[0.2808,0.2478,1.0],[0.2795,0.2677,1.0],[0.2791,0.2926,1.0],[0.2801,0.3165,1.0],[0.2777,0.3374,1.0],[0.2785,0.3626,1.0],[0.2788,0.3823,1.0],[0.2810,0.4057,1.0],[0.2863,0.4272,1.0],[0.3020,0.4501,1.0],[-0.4032,0.0881,1.0],[-0.3852,0.0909,1.0],[-0.4099,0.0643,1.0],[-0.4117,0.0464,1.0],[-0.3911,0.0340,1.0],[-0.4103,0.0190,1.0],[-0.4102,-0.0018,1.0],[-0.4123,-0.0280,1.0],[-0.3096,0.0949,1.0],[-0.3281,0.0804,1.0],[-0.3311,0.0569,1.0],[-0.3330,0.0366,1.0],[-0.3359,0.0151,1.0],[-0.3303,-0.0075,1.0],[-0.3245,-0.0337,1.0],[-0.2926,-0.0300,1.0],[-0.2849,-0.0111,1.0],[-0.2825,0.0122,1.0],[-0.2858,0.0356,1.0],[-0.2837,0.0601,1.0],[-0.2870,0.0812,1.0],[-0.2264,0.0832,1.0],[-0.2264,0.0620,1.0],[-0.2282,0.0374,1.0],[-0.2287,0.0179,1.0],[-0.2281,-0.0087,1.0],[-0.2235,-0.0276,1.0],[-0.2032,-0.0302,1.0],[-0.1568,0.0821,1.0],[-0.1564,0.0626,1.0],[-0.1571,0.0392,1.0],[-0.1551,0.0169,1.0],[-0.1576,-0.0053,1.0],[-0.1541,-0.0316,1.0],[-0.1318,-0.0329,1.0],[-0.0616,0.0933,1.0],[-0.0795,0.0799,1.0],[-0.0838,0.0607,1.0],[-0.0866,0.0342,1.0],[-0.0842,0.0130,1.0],[-0.0831,-0.0108,1.0],[-0.0752,-0.0293,1.0],[-0.0414,-0.0296,1.0],[-0.0329,-0.0091,1.0],[-0.0323,0.0160,1.0],[-0.0326,0.0362,1.0],[-0.0319,0.0576,1.0],[-0.0386,0.0819,1.0],[0.1449,0.1012,1.0],[0.1282,0.0809,1.0],[0.1254,0.0594,1.0],[0.1246,0.0343,1.0],[0.1195,0.0162,1.0],[0.1182,-0.0070,1.0],[0.0910,-0.0045,1.0],[0.0867,0.0165,1.0],[0.0853,0.0428,1.0],[0.0707,0.0623,1.0],[0.0708,0.0853,1.0],[0.0595,0.0427,1.0],[0.0538,0.0171,1.0],[0.0540,-0.0028,1.0],[0.0233,-0.0045,1.0],[0.0196,0.0211,1.0],[0.0210,0.0437,1.0],[0.0182,0.0635,1.0],[0.0155,0.0884,1.0],[0.1796,0.0654,1.0],[0.1755,0.0420,1.0],[0.1981,0.0327,1.0],[0.1760,0.0213,1.0],[0.1793,-0.0054,1.0],[0.1769,-0.0248,1.0],[0.1983,-0.0312,1.0],[0.2036,0.0920,1.0],[0.1808,0.0880,1.0],[0.2615,0.0922,1.0],[0.2866,0.0935,1.0],[0.3017,0.0794,1.0],[0.3023,0.0519,1.0],[0.2998,0.0223,1.0],[0.2793,0.0346,1.0],[0.2562,0.0442,1.0],[0.2581,0.0667,1.0],[0.2568,0.0217,1.0],[0.2586,-0.0035,1.0],[0.2558,-0.0231,1.0],[0.3047,-0.0216,1.0],[0.3084,0.0012,1.0],[0.3769,0.0938,1.0],[0.4013,0.0896,1.0],[0.3622,0.0805,1.0],[0.3590,0.0594,1.0],[0.3708,0.0390,1.0],[0.3915,0.0268,1.0],[0.4075,0.0059,1.0],[0.4091,-0.0185,1.0],[0.3921,-0.0358,1.0],[0.3657,-0.0313,1.0],[0.3594,-0.0123,1.0],[0.0468,-0.1775,0.72],[0.0380,-0.1928,0.72],[0.0360,-0.2076,0.72],[0.0284,-0.2248,0.72],[0.0331,-0.2419,0.72],[0.0382,-0.2573,0.72],[0.0422,-0.2755,0.72],[0.0540,-0.2831,0.72],[0.0046,-0.2724,0.72],[0.0059,-0.2522,0.72],[0.0061,-0.2356,0.72],[0.0034,-0.2184,0.72],[0.0042,-0.2031,0.72],[0.0046,-0.1894,0.72],[-0.0387,-0.1858,0.72],[-0.0363,-0.2004,0.72],[-0.0392,-0.2204,0.72],[-0.0368,-0.2354,0.72],[-0.0420,-0.2534,0.72],[-0.0383,-0.2677,0.72],[-0.0779,-0.2686,0.72],[-0.0759,-0.2522,0.72],[-0.0773,-0.2372,0.72],[-0.0708,-0.2175,0.72],[-0.0760,-0.2049,0.72],[-0.0777,-0.1854,0.72],[-0.1187,-0.2006,0.72],[-0.1199,-0.2169,0.72],[-0.1157,-0.2357,0.72],[-0.1166,-0.2520,0.72],[-0.1147,-0.2700,0.72],[-0.1339,-0.2548,0.72],[-0.1499,-0.2500,0.72],[-0.1504,-0.2340,0.72],[-0.1507,-0.2195,0.72],[-0.1488,-0.2004,0.72],[-0.1444,-0.1854,0.72],[-0.1242,-0.1849,0.72],[-0.1931,-0.1884,0.72],[-0.1895,-0.2062,0.72],[-0.1935,-0.2185,0.72],[-0.1915,-0.2393,0.72],[-0.1910,-0.2554,0.72],[-0.1926,-0.2698,0.72],[-0.1643,-0.2810,0.72],[-0.1538,-0.2706,0.72],[-0.2113,-0.2264,0.72],[-0.2278,-0.2228,0.72],[-0.2290,-0.2023,0.72],[-0.2310,-0.1847,0.72],[-0.2699,-0.1833,0.72],[-0.2881,-0.1848,0.72],[-0.3042,-0.1823,0.72],[-0.2840,-0.1973,0.72],[-0.2857,-0.2153,0.72],[-0.2829,-0.2335,0.72],[-0.2839,-0.2487,0.72],[-0.2852,-0.2652,0.72],[-0.2319,-0.2692,0.72],[-0.2274,-0.2550,0.72],[-0.2308,-0.2368,0.72],[-0.0573,-0.2280,0.72],[0.1459,-0.1771,0.72],[0.1347,-0.1923,0.72],[0.1296,-0.2087,0.72],[0.1299,-0.2228,0.72],[0.1186,-0.2397,0.72],[0.1208,-0.2529,0.72],[0.1187,-0.2689,0.72],[0.1100,-0.2157,0.72],[0.1053,-0.2005,0.72],[0.1008,-0.1810,0.72],[0.1761,-0.2098,0.72],[0.1762,-0.2247,0.72],[0.1757,-0.2428,0.72],[0.1733,-0.2565,0.72],[0.1801,-0.2753,0.72],[0.2090,-0.2703,0.72],[0.2117,-0.2546,0.72],[0.2126,-0.2362,0.72],[0.2136,-0.2208,0.72],[0.2122,-0.2011,0.72],[0.2064,-0.1863,0.72],[0.1890,-0.1815,0.72],[0.1778,-0.1934,0.72],[0.2537,-0.1894,0.72],[0.2556,-0.2031,0.72],[0.2554,-0.2176,0.72],[0.2523,-0.2372,0.72],[0.2534,-0.2529,0.72],[0.2596,-0.2698,0.72],[0.2736,-0.2795,0.72],[0.2903,-0.2679,0.72],[0.2934,-0.2546,0.72],[0.2913,-0.2346,0.72],[0.2912,-0.2181,0.72],[0.2931,-0.2062,0.72],[0.2927,-0.1859,0.72],[-0.4281,-0.3584,0.72],[-0.4106,-0.3608,0.72],[-0.4036,-0.3783,0.72],[-0.4022,-0.3954,0.72],[-0.4059,-0.4103,0.72],[-0.4072,-0.4301,0.72],[-0.4087,-0.4463,0.72],[-0.4350,-0.4498,0.72],[-0.4419,-0.4348,0.72],[-0.4423,-0.4164,0.72],[-0.4446,-0.3994,0.72],[-0.4455,-0.3846,0.72],[-0.4381,-0.3688,0.72],[-0.4796,-0.3603,0.72],[-0.4955,-0.3609,0.72],[-0.4997,-0.3765,0.72],[-0.4995,-0.3907,0.72],[-0.4898,-0.4053,0.72],[-0.4990,-0.4151,0.72],[-0.4979,-0.4300,0.72],[-0.3610,-0.4244,0.72],[-0.3642,-0.4058,0.72],[-0.3646,-0.3896,0.72],[-0.3607,-0.3745,0.72],[-0.3604,-0.3580,0.72],[-0.3390,-0.3595,0.72],[-0.3290,-0.3683,0.72],[-0.3276,-0.3836,0.72],[-0.3334,-0.3980,0.72],[-0.3292,-0.4193,0.72],[-0.3235,-0.4345,0.72],[-0.3605,-0.4433,0.72],[-0.2680,-0.3614,0.72],[-0.2482,-0.3590,0.72],[-0.2356,-0.3592,0.72],[-0.2461,-0.3782,0.72],[-0.2474,-0.3934,0.72],[-0.2448,-0.4093,0.72],[-0.2472,-0.4275,0.72],[-0.2474,-0.4438,0.72],[-0.1892,-0.4463,0.72],[-0.1935,-0.4284,0.72],[-0.1934,-0.4113,0.72],[-0.1919,-0.3968,0.72],[-0.1896,-0.3774,0.72],[-0.1899,-0.3612,0.72],[-0.1517,-0.3607,0.72],[-0.1536,-0.3820,0.72],[-0.1509,-0.3941,0.72],[-0.1534,-0.4151,0.72],[-0.1545,-0.4293,0.72],[-0.1541,-0.4451,0.72],[-0.1104,-0.4463,0.72],[-0.1122,-0.4341,0.72],[-0.1090,-0.4155,0.72],[-0.0998,-0.4017,0.72],[-0.1097,-0.3928,0.72],[-0.1129,-0.3781,0.72],[-0.1069,-0.3579,0.72],[-0.0889,-0.3612,0.72],[-0.0946,-0.4513,0.72],[-0.1769,-0.4014,0.72],[-0.0109,-0.3582,0.72],[-0.0262,-0.3692,0.72],[-0.0239,-0.3829,0.72],[-0.0153,-0.3973,0.72],[-0.0002,-0.4088,0.72],[0.0112,-0.4187,0.72],[0.0118,-0.4368,0.72],[0.0051,-0.4490,0.72],[-0.0204,-0.4529,0.72],[-0.0257,-0.4368,0.72],[0.0516,-0.4303,0.72],[0.0485,-0.4130,0.72],[0.0476,-0.3949,0.72],[0.0517,-0.3795,0.72],[0.0491,-0.3652,0.72],[0.0891,-0.3609,0.72],[0.0871,-0.3800,0.72],[0.0862,-0.3977,0.72],[0.0882,-0.4148,0.72],[0.0846,-0.4279,0.72],[0.0824,-0.4462,0.72],[0.0666,-0.4545,0.72],[0.0526,-0.4438,0.72],[0.1317,-0.4391,0.72],[0.1321,-0.4224,0.72],[0.1381,-0.4073,0.72],[0.1300,-0.3935,0.72],[0.1293,-0.3771,0.72],[0.1347,-0.3604,0.72],[0.1487,-0.3582,0.72],[0.1633,-0.3700,0.72],[0.1685,-0.3868,0.72],[0.1626,-0.3993,0.72],[0.2050,-0.3897,0.72],[0.2043,-0.3751,0.72],[0.2079,-0.3591,0.72],[0.2220,-0.3574,0.72],[0.2362,-0.3694,0.72],[0.2398,-0.3875,0.72],[0.2359,-0.4008,0.72],[0.2068,-0.4064,0.72],[0.2031,-0.4233,0.72],[0.2001,-0.4373,0.72],[0.2758,-0.4352,0.72],[0.2764,-0.4152,0.72],[0.2753,-0.4003,0.72],[0.2746,-0.3849,0.72],[0.2778,-0.3679,0.72],[0.2931,-0.3535,0.72],[0.3065,-0.3648,0.72],[0.3133,-0.3775,0.72],[0.3139,-0.3975,0.72],[0.3120,-0.4122,0.72],[0.3114,-0.4311,0.72],[0.3077,-0.4461,0.72],[0.2828,-0.4527,0.72],[0.3567,-0.4406,0.72],[0.3572,-0.4262,0.72],[0.3545,-0.4071,0.72],[0.3540,-0.3903,0.72],[0.3553,-0.3742,0.72],[0.3614,-0.3554,0.72],[0.3762,-0.3577,0.72],[0.3917,-0.3710,0.72],[0.3913,-0.3862,0.72],[0.3823,-0.4015,0.72],[0.3868,-0.4187,0.72],[0.3926,-0.4323,0.72],[0.4436,-0.4248,0.72],[0.4443,-0.4097,0.72],[0.4449,-0.3898,0.72],[0.4442,-0.3754,0.72],[0.4435,-0.3613,0.72],[0.4250,-0.3615,0.72],[0.4557,-0.3575,0.72],[0.4982,-0.3609,0.72],[0.4978,-0.3790,0.72],[0.5010,-0.3946,0.72],[0.4980,-0.4118,0.72],[0.5003,-0.4513,0.72],[0.4476,-0.4410,0.72],[0.0039,-0.3608,0.72]];

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
const T_PULL = T_LAST + 620; // camera eases back to show the whole number
const T_WORD = T_PULL + 950; // FOLLOWERS
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
const DW = 2.8; // damage layer
const DH = 2.45;
const SPAN = 2.15; // the block's width
const CW = 2048;
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

    // ---- the smoke that is left once the shooting stops ----
    // Not the per-impact puff above, which is gone in a second and a half.
    // This is the haze a few hundred rounds leave hanging in front of a wall:
    // it gathers after the last shot, drifts up and across, and is still
    // thinning out when the piece ends.
    const HAZE = 18;
    const haze = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: puffTex, transparent: true, depthWrite: false, opacity: 0 }),
      HAZE
    );
    haze.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    haze.frustumCulled = false;
    scene.add(haze);
    const hazeRnd = mulberry32(8080);
    const hazeSeed = Array.from({ length: HAZE }, () => ({
      x: (hazeRnd() - 0.5) * 2.4,
      y: PY + (hazeRnd() - 0.5) * 1.3,
      z: 0.2 + hazeRnd() * 0.8,
      rise: 0.09 + hazeRnd() * 0.17,
      drift: (hazeRnd() - 0.5) * 0.24,
      s0: 0.45 + hazeRnd() * 0.8,
      grow: 0.14 + hazeRnd() * 0.3,
      ph: hazeRnd() * 9,
    }));

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

      // ---- the haze, after the last round ----
      // Thickens as the last rounds land, then thins as it drifts off.
      const hz = ss(T_LAST - 900, T_LAST + 1400, t) * (1 - 0.4 * ss(T_LAST + 2600, END_MS, t));
      haze.material.opacity = 0.34 * hz;
      if (hz > 0.002) {
        const ht = Math.max(0, (t - (T_LAST - 400)) / 1000);
        for (let i = 0; i < HAZE; i++) {
          const z = hazeSeed[i];
          dummy.position.set(
            z.x + z.drift * ht + Math.sin(ht * 0.5 + z.ph) * 0.07,
            z.y + z.rise * ht,
            z.z + ht * 0.045
          );
          dummy.quaternion.copy(camera.quaternion);
          const sc = z.s0 + z.grow * ht;
          dummy.scale.set(sc, sc, sc);
          dummy.updateMatrix();
          haze.setMatrixAt(i, dummy.matrix);
        }
      } else {
        for (let i = 0; i < HAZE; i++) haze.setMatrixAt(i, hidden);
      }
      haze.instanceMatrix.needsUpdate = true;

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
    </div>
  );
}
