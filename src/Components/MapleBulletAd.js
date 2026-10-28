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
// has air around it. The two lines below it get the same treatment one step
// further — a finer round again and their own tracking — because they are
// the smallest text on the wall and were the hardest to read. Three
// calibres in all: heavy for the number, fine for FOLLOWERS, finer still
// for the thanks. Every hole is then nudged a few pixels off
// its sampled position, because a hand-shot group is never a clean copy and
// three identical zeros look printed.
//
// Each entry is [x, y, calibre]; x is in units of the block's own width, and
// the block is 0.940 as tall as it is wide.
const HOLES = [[-0.3579,0.4319,1.0],[-0.3517,0.2810,1.0],[-0.3480,0.2643,1.0],[-0.3410,0.2429,1.0],[-0.3404,0.4626,1.0],[-0.3157,0.3645,1.0],[-0.2953,0.3634,1.0],[-0.2806,0.3613,1.0],[-0.2781,0.3489,1.0],[-0.2663,0.3285,1.0],[-0.2653,0.3089,1.0],[-0.2657,0.2857,1.0],[-0.2691,0.2686,1.0],[-0.2743,0.2484,1.0],[-0.2843,0.2350,1.0],[-0.3083,0.2336,1.0],[-0.3074,0.4683,1.0],[-0.2830,0.4636,1.0],[-0.2694,0.4421,1.0],[-0.2672,0.4217,1.0],[-0.2700,0.4050,1.0],[-0.1870,0.2496,0.72],[-0.1864,0.2322,0.72],[-0.1881,0.2177,0.72],[-0.1964,0.1981,0.72],[-0.2047,0.1881,0.72],[-0.1061,0.4350,1.0],[-0.1125,0.4174,1.0],[-0.1132,0.3952,1.0],[-0.1130,0.3761,1.0],[-0.1148,0.3521,1.0],[-0.1133,0.3321,1.0],[-0.1152,0.3124,1.0],[-0.1102,0.2906,1.0],[-0.1061,0.2725,1.0],[-0.0797,0.4681,1.0],[-0.0968,0.4615,1.0],[-0.0585,0.4707,1.0],[-0.0413,0.4598,1.0],[-0.0961,0.2403,1.0],[-0.0726,0.2336,1.0],[-0.0280,0.4352,1.0],[-0.0256,0.4142,1.0],[-0.0245,0.3949,1.0],[-0.0223,0.3731,1.0],[-0.0245,0.3542,1.0],[-0.0241,0.3311,1.0],[-0.0229,0.3093,1.0],[-0.0236,0.2912,1.0],[-0.0274,0.2685,1.0],[-0.0375,0.2485,1.0],[0.1027,0.4700,1.0],[0.1228,0.4709,1.0],[0.1444,0.4555,1.0],[0.1517,0.4347,1.0],[0.1561,0.4164,1.0],[0.1603,0.3952,1.0],[0.1588,0.3738,1.0],[0.1608,0.3527,1.0],[0.1614,0.3323,1.0],[0.1592,0.3103,1.0],[0.1580,0.2894,1.0],[0.1542,0.2717,1.0],[0.1472,0.2503,1.0],[0.1382,0.2355,1.0],[0.1153,0.2341,1.0],[0.0878,0.2368,1.0],[0.0734,0.2716,1.0],[0.0697,0.2916,1.0],[0.0684,0.3123,1.0],[0.0699,0.3327,1.0],[0.0682,0.3526,1.0],[0.0700,0.3733,1.0],[0.0674,0.3949,1.0],[0.0725,0.4171,1.0],[0.0737,0.4349,1.0],[0.0838,0.4601,1.0],[0.2758,0.4668,1.0],[0.2631,0.4561,1.0],[0.2560,0.4287,1.0],[0.2533,0.4085,1.0],[0.2502,0.3897,1.0],[0.2524,0.3680,1.0],[0.2519,0.3454,1.0],[0.2511,0.3274,1.0],[0.2501,0.3055,1.0],[0.2540,0.2856,1.0],[0.2566,0.2675,1.0],[0.2647,0.2457,1.0],[0.3061,0.4677,1.0],[0.3261,0.4620,1.0],[0.3363,0.4390,1.0],[0.3404,0.4177,1.0],[0.3420,0.3989,1.0],[0.3413,0.3771,1.0],[0.3416,0.3570,1.0],[0.3430,0.3340,1.0],[0.3425,0.3148,1.0],[0.3423,0.2948,1.0],[0.3376,0.2735,1.0],[0.3307,0.2515,1.0],[0.3197,0.2360,1.0],[0.2926,0.2336,1.0],[-0.4449,0.1323,0.72],[-0.4605,0.1318,0.72],[-0.4603,0.1092,0.72],[-0.4638,0.0961,0.72],[-0.4508,0.0772,0.72],[-0.4635,0.0723,0.72],[-0.4628,0.0571,0.72],[-0.4625,0.0401,0.72],[-0.4623,0.0265,0.72],[-0.4374,0.0779,0.72],[-0.3591,0.1369,0.72],[-0.3675,0.1248,0.72],[-0.3697,0.1081,0.72],[-0.3713,0.0948,0.72],[-0.3734,0.0806,0.72],[-0.3708,0.0656,0.72],[-0.3719,0.0472,0.72],[-0.3700,0.0350,0.72],[-0.3649,0.0196,0.72],[-0.3355,0.0162,0.72],[-0.3303,0.0299,0.72],[-0.3250,0.0454,0.72],[-0.3227,0.0592,0.72],[-0.3223,0.0744,0.72],[-0.3223,0.0907,0.72],[-0.3246,0.1045,0.72],[-0.3278,0.1212,0.72],[-0.3368,0.1354,0.72],[-0.2524,0.1307,0.72],[-0.2542,0.1189,0.72],[-0.2544,0.1010,0.72],[-0.2541,0.0883,0.72],[-0.2546,0.0727,0.72],[-0.2531,0.0579,0.72],[-0.2550,0.0432,0.72],[-0.2547,0.0254,0.72],[-0.2437,0.0194,0.72],[-0.2288,0.0193,0.72],[-0.1676,0.1282,0.72],[-0.1669,0.1157,0.72],[-0.1682,0.0978,0.72],[-0.1665,0.0839,0.72],[-0.1672,0.0679,0.72],[-0.1667,0.0552,0.72],[-0.1663,0.0391,0.72],[-0.1644,0.0230,0.72],[-0.1505,0.0218,0.72],[-0.1394,0.0199,0.72],[-0.0441,0.1354,0.72],[-0.0358,0.1194,0.72],[-0.0321,0.1065,0.72],[-0.0320,0.0893,0.72],[-0.0318,0.0751,0.72],[-0.0308,0.0583,0.72],[-0.0341,0.0466,0.72],[-0.0365,0.0321,0.72],[-0.0427,0.0176,0.72],[-0.0728,0.0201,0.72],[-0.0763,0.0359,0.72],[-0.0807,0.0500,0.72],[-0.0806,0.0653,0.72],[-0.0791,0.0796,0.72],[-0.0809,0.0927,0.72],[-0.0783,0.1100,0.72],[-0.0758,0.1249,0.72],[-0.0713,0.1373,0.72],[0.0326,0.1324,0.72],[0.0339,0.1151,0.72],[0.0354,0.1014,0.72],[0.0373,0.0846,0.72],[0.0353,0.0690,0.72],[0.0393,0.0562,0.72],[0.0404,0.0418,0.72],[0.0589,0.0370,0.72],[0.0676,0.0613,0.72],[0.1395,0.1343,0.72],[0.1356,0.1196,0.72],[0.1337,0.1015,0.72],[0.1309,0.0880,0.72],[0.1317,0.0737,0.72],[0.1280,0.0561,0.72],[0.1218,0.0318,0.72],[0.1093,0.0366,0.72],[0.1019,0.0494,0.72],[0.0985,0.0625,0.72],[0.0979,0.0775,0.72],[0.0923,0.0927,0.72],[0.0851,0.0994,0.72],[0.0735,0.0932,0.72],[0.0824,0.1158,0.72],[0.2241,0.1337,0.72],[0.2032,0.1304,0.72],[0.2042,0.1118,0.72],[0.2052,0.0946,0.72],[0.2036,0.0806,0.72],[0.2023,0.0688,0.72],[0.2031,0.0545,0.72],[0.2042,0.0377,0.72],[0.2063,0.0214,0.72],[0.2196,0.0195,0.72],[0.2344,0.0206,0.72],[0.2304,0.0772,0.72],[0.2132,0.0792,0.72],[0.3185,0.1347,0.72],[0.3360,0.1332,0.72],[0.3403,0.1185,0.72],[0.3431,0.1030,0.72],[0.3382,0.0915,0.72],[0.3316,0.0800,0.72],[0.3334,0.0715,0.72],[0.3426,0.0545,0.72],[0.3454,0.0420,0.72],[0.3455,0.0240,0.72],[0.2972,0.0264,0.72],[0.2977,0.0407,0.72],[0.2980,0.0537,0.72],[0.2959,0.0700,0.72],[0.2977,0.0828,0.72],[0.2956,0.0973,0.72],[0.2981,0.1136,0.72],[0.2958,0.1287,0.72],[0.3159,0.0811,0.72],[0.4330,0.1389,0.72],[0.4458,0.1370,0.72],[0.4533,0.1197,0.72],[0.4202,0.1371,0.72],[0.4113,0.1247,0.72],[0.4095,0.1127,0.72],[0.4134,0.0995,0.72],[0.4186,0.0902,0.72],[0.4344,0.0791,0.72],[0.4491,0.0679,0.72],[0.4546,0.0527,0.72],[0.4574,0.0388,0.72],[0.4540,0.0259,0.72],[0.4340,0.0169,0.72],[0.4171,0.0192,0.72],[0.4104,0.0343,0.72],[-0.3347,-0.2159,0.56],[-0.3207,-0.2156,0.56],[-0.3149,-0.2193,0.56],[-0.3132,-0.2315,0.56],[-0.3161,-0.2397,0.56],[-0.3146,-0.2542,0.56],[-0.3142,-0.2652,0.56],[-0.3154,-0.2750,0.56],[-0.3137,-0.2854,0.56],[-0.3143,-0.2991,0.56],[-0.2933,-0.2171,0.56],[-0.2506,-0.2220,0.56],[-0.2515,-0.2315,0.56],[-0.2529,-0.2422,0.56],[-0.2503,-0.2555,0.56],[-0.2515,-0.2651,0.56],[-0.2512,-0.2747,0.56],[-0.2516,-0.2849,0.56],[-0.2528,-0.2972,0.56],[-0.2148,-0.2984,0.56],[-0.2155,-0.2861,0.56],[-0.2165,-0.2747,0.56],[-0.2186,-0.2556,0.56],[-0.2267,-0.2573,0.56],[-0.2405,-0.2562,0.56],[-0.2150,-0.2427,0.56],[-0.2165,-0.2328,0.56],[-0.2171,-0.2217,0.56],[-0.1600,-0.2207,0.56],[-0.1461,-0.2188,0.56],[-0.1400,-0.2272,0.56],[-0.1375,-0.2361,0.56],[-0.1380,-0.2470,0.56],[-0.1349,-0.2597,0.56],[-0.1352,-0.2721,0.56],[-0.1345,-0.2813,0.56],[-0.1428,-0.2851,0.56],[-0.1541,-0.2838,0.56],[-0.1668,-0.2850,0.56],[-0.1684,-0.2705,0.56],[-0.1663,-0.2608,0.56],[-0.1654,-0.2496,0.56],[-0.1638,-0.2389,0.56],[-0.1698,-0.3001,0.56],[-0.1766,-0.3066,0.56],[-0.1314,-0.2986,0.56],[-0.0485,-0.2185,0.56],[-0.0499,-0.2309,0.56],[-0.0490,-0.2426,0.56],[-0.0488,-0.2541,0.56],[-0.0512,-0.2671,0.56],[-0.0513,-0.2751,0.56],[-0.0518,-0.2887,0.56],[-0.0500,-0.2994,0.56],[-0.0863,-0.3006,0.56],[-0.0867,-0.2902,0.56],[-0.0859,-0.2764,0.56],[-0.0859,-0.2675,0.56],[-0.0853,-0.2508,0.56],[-0.0845,-0.2404,0.56],[-0.0850,-0.2325,0.56],[-0.0862,-0.2184,0.56],[-0.0742,-0.2579,0.56],[-0.0633,-0.2608,0.56],[0.0499,-0.2085,0.56],[0.0416,-0.2136,0.56],[0.0322,-0.2247,0.56],[0.0256,-0.2450,0.56],[0.0249,-0.2580,0.56],[0.0146,-0.2577,0.56],[0.0010,-0.2598,0.56],[0.0015,-0.2452,0.56],[-0.0002,-0.2336,0.56],[-0.0009,-0.2207,0.56],[0.0015,-0.2761,0.56],[0.0007,-0.2873,0.56],[0.0012,-0.2992,0.56],[0.0352,-0.2966,0.56],[0.0316,-0.2806,0.56],[0.0268,-0.2735,0.56],[0.1541,-0.2136,0.56],[0.1493,-0.2256,0.56],[0.1458,-0.2382,0.56],[0.1339,-0.2566,0.56],[0.1232,-0.2521,0.56],[0.1232,-0.2447,0.56],[0.1167,-0.2277,0.56],[0.1183,-0.2175,0.56],[0.1328,-0.2760,0.56],[0.1330,-0.2864,0.56],[0.1341,-0.2970,0.56],[0.2120,-0.2142,0.56],[0.2245,-0.2151,0.56],[0.2314,-0.2304,0.56],[0.2311,-0.2417,0.56],[0.2335,-0.2514,0.56],[0.2306,-0.2629,0.56],[0.2320,-0.2760,0.56],[0.2301,-0.2863,0.56],[0.2283,-0.2973,0.56],[0.2160,-0.3060,0.56],[0.2036,-0.3039,0.56],[0.1994,-0.2885,0.56],[0.1943,-0.2761,0.56],[0.1944,-0.2644,0.56],[0.1955,-0.2545,0.56],[0.1972,-0.2412,0.56],[0.1979,-0.2301,0.56],[0.2016,-0.2174,0.56],[0.3176,-0.2218,0.56],[0.3196,-0.2327,0.56],[0.3178,-0.2473,0.56],[0.3170,-0.2569,0.56],[0.3173,-0.2677,0.56],[0.3172,-0.2785,0.56],[0.3140,-0.2930,0.56],[0.3125,-0.3020,0.56],[0.3007,-0.3031,0.56],[0.2893,-0.3011,0.56],[0.2832,-0.2911,0.56],[0.2827,-0.2771,0.56],[0.2837,-0.2681,0.56],[0.2816,-0.2552,0.56],[0.2805,-0.2437,0.56],[0.2837,-0.2341,0.56],[0.2816,-0.2225,0.56],[-0.4877,-0.3814,0.56],[-0.4987,-0.3851,0.56],[-0.4982,-0.4016,0.56],[-0.4982,-0.4111,0.56],[-0.4993,-0.4236,0.56],[-0.4912,-0.4221,0.56],[-0.4795,-0.4249,0.56],[-0.4995,-0.4376,0.56],[-0.4982,-0.4480,0.56],[-0.5005,-0.4636,0.56],[-0.4794,-0.3811,0.56],[-0.4272,-0.3790,0.56],[-0.4376,-0.3968,0.56],[-0.4383,-0.4050,0.56],[-0.4397,-0.4182,0.56],[-0.4404,-0.4305,0.56],[-0.4389,-0.4421,0.56],[-0.4398,-0.4510,0.56],[-0.4344,-0.4655,0.56],[-0.4214,-0.4702,0.56],[-0.4078,-0.4600,0.56],[-0.4031,-0.4514,0.56],[-0.4019,-0.4399,0.56],[-0.4020,-0.4289,0.56],[-0.4034,-0.4188,0.56],[-0.4039,-0.4076,0.56],[-0.4050,-0.3961,0.56],[-0.4116,-0.3813,0.56],[-0.3435,-0.3824,0.56],[-0.3526,-0.3835,0.56],[-0.3574,-0.3956,0.56],[-0.3552,-0.4075,0.56],[-0.3558,-0.4213,0.56],[-0.3561,-0.4302,0.56],[-0.3580,-0.4404,0.56],[-0.3574,-0.4529,0.56],[-0.3563,-0.4654,0.56],[-0.3218,-0.4639,0.56],[-0.3234,-0.4529,0.56],[-0.3235,-0.4425,0.56],[-0.3294,-0.4302,0.56],[-0.3300,-0.4211,0.56],[-0.3250,-0.4110,0.56],[-0.3221,-0.3971,0.56],[-0.3301,-0.3828,0.56],[-0.3432,-0.4223,0.56],[-0.2520,-0.3803,0.56],[-0.2422,-0.3840,0.56],[-0.2315,-0.3821,0.56],[-0.2196,-0.3837,0.56],[-0.2352,-0.3955,0.56],[-0.2356,-0.4086,0.56],[-0.2360,-0.4188,0.56],[-0.2330,-0.4312,0.56],[-0.2335,-0.4406,0.56],[-0.2332,-0.4535,0.56],[-0.2351,-0.4631,0.56],[-0.1777,-0.3852,0.56],[-0.1768,-0.3979,0.56],[-0.1753,-0.4077,0.56],[-0.1767,-0.4207,0.56],[-0.1752,-0.4313,0.56],[-0.1763,-0.4417,0.56],[-0.1775,-0.4529,0.56],[-0.1781,-0.4647,0.56],[-0.1408,-0.4625,0.56],[-0.1422,-0.4518,0.56],[-0.1417,-0.4414,0.56],[-0.1412,-0.4277,0.56],[-0.1418,-0.4208,0.56],[-0.1392,-0.4112,0.56],[-0.1407,-0.4000,0.56],[-0.1424,-0.3848,0.56],[-0.1547,-0.4210,0.56],[-0.1656,-0.4220,0.56],[-0.0828,-0.3815,0.56],[-0.0935,-0.3829,0.56],[-0.0930,-0.3973,0.56],[-0.0929,-0.4079,0.56],[-0.0945,-0.4233,0.56],[-0.0816,-0.4250,0.56],[-0.0961,-0.4350,0.56],[-0.0962,-0.4485,0.56],[-0.0947,-0.4588,0.56],[-0.0917,-0.4685,0.56],[-0.0768,-0.4655,0.56],[-0.0711,-0.3820,0.56],[0.0099,-0.3765,0.56],[0.0036,-0.3823,0.56],[-0.0013,-0.3920,0.56],[-0.0038,-0.4024,0.56],[-0.0003,-0.4103,0.56],[0.0212,-0.4260,0.56],[0.0309,-0.4342,0.56],[0.0319,-0.4486,0.56],[0.0310,-0.4571,0.56],[0.0278,-0.4667,0.56],[0.0167,-0.4718,0.56],[0.0010,-0.4659,0.56],[-0.0011,-0.4512,0.56],[0.0312,-0.3932,0.56],[0.0210,-0.3800,0.56],[0.1108,-0.3865,0.56],[0.1106,-0.3959,0.56],[0.1131,-0.4092,0.56],[0.1123,-0.4197,0.56],[0.1108,-0.4297,0.56],[0.1134,-0.4438,0.56],[0.1108,-0.4525,0.56],[0.1023,-0.4682,0.56],[0.0903,-0.4706,0.56],[0.0817,-0.4674,0.56],[0.0773,-0.4550,0.56],[0.0764,-0.4426,0.56],[0.0761,-0.4311,0.56],[0.0750,-0.4207,0.56],[0.0753,-0.4102,0.56],[0.0772,-0.3982,0.56],[0.0746,-0.3869,0.56],[0.1729,-0.3824,0.56],[0.1857,-0.3841,0.56],[0.1929,-0.3966,0.56],[0.1907,-0.4059,0.56],[0.1891,-0.4203,0.56],[0.1812,-0.4264,0.56],[0.1701,-0.4276,0.56],[0.1576,-0.4252,0.56],[0.1570,-0.4160,0.56],[0.1563,-0.4028,0.56],[0.1597,-0.3922,0.56],[0.1582,-0.3837,0.56],[0.1574,-0.4398,0.56],[0.1568,-0.4507,0.56],[0.1584,-0.4645,0.56],[0.2383,-0.3817,0.56],[0.2327,-0.3931,0.56],[0.2317,-0.4045,0.56],[0.2348,-0.4145,0.56],[0.2339,-0.4261,0.56],[0.2460,-0.4273,0.56],[0.2573,-0.4263,0.56],[0.2651,-0.4179,0.56],[0.2655,-0.4070,0.56],[0.2668,-0.3949,0.56],[0.2640,-0.3858,0.56],[0.2525,-0.3809,0.56],[0.2339,-0.4395,0.56],[0.2316,-0.4535,0.56],[0.2342,-0.4626,0.56],[0.3160,-0.3803,0.56],[0.3071,-0.3961,0.56],[0.3076,-0.4084,0.56],[0.3087,-0.4191,0.56],[0.3054,-0.4307,0.56],[0.3055,-0.4400,0.56],[0.3090,-0.4522,0.56],[0.3141,-0.4697,0.56],[0.3290,-0.4694,0.56],[0.3403,-0.4635,0.56],[0.3426,-0.4473,0.56],[0.3429,-0.4373,0.56],[0.3420,-0.4266,0.56],[0.3414,-0.4130,0.56],[0.3436,-0.4023,0.56],[0.3386,-0.3926,0.56],[0.3364,-0.3800,0.56],[0.4034,-0.3793,0.56],[0.4129,-0.3836,0.56],[0.4250,-0.3981,0.56],[0.4193,-0.4139,0.56],[0.4140,-0.4227,0.56],[0.4045,-0.4203,0.56],[0.3878,-0.4202,0.56],[0.3900,-0.4341,0.56],[0.3876,-0.4456,0.56],[0.3909,-0.4579,0.56],[0.4251,-0.4555,0.56],[0.4231,-0.4647,0.56],[0.4231,-0.4453,0.56],[0.4177,-0.4314,0.56],[0.3874,-0.4079,0.56],[0.3885,-0.3987,0.56],[0.3911,-0.3852,0.56],[0.4596,-0.3818,0.56],[0.4729,-0.3815,0.56],[0.4802,-0.3828,0.56],[0.4795,-0.3938,0.56],[0.4820,-0.4076,0.56],[0.4818,-0.4164,0.56],[0.4786,-0.4300,0.56],[0.4819,-0.4404,0.56],[0.4794,-0.4518,0.56],[0.4782,-0.4624,0.56],[0.4987,-0.3808,0.56]];

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

function engraveCanvases() {
  const EW = 2048;
  const EH = 420;
  const mk = () => {
    const c = document.createElement("canvas");
    c.width = EW;
    c.height = EH;
    return [c, c.getContext("2d")];
  };
  const setType = (x) => {
    x.font = '700 210px Impact, "Arial Narrow", sans-serif';
    x.textAlign = "center";
    x.textBaseline = "middle";
  };
  const CX = EW / 2;
  const CY = EH / 2 + 6;

  // DEPTH, for the renderer to light.
  const [bump, bx] = mk();
  bx.fillStyle = "#808080";
  bx.fillRect(0, 0, EW, EH);
  setType(bx);
  bx.filter = "blur(4px)";
  bx.fillStyle = "#121212";
  bx.fillText(ENGRAVE_TEXT, CX, CY);
  bx.filter = "none";

  // AND THE WALLS OF THE CUT, BAKED.
  // The bump alone was not enough. This decal is transparent, so it only
  // renders where the letters are — and the chamfer lives just OUTSIDE the
  // stroke, where there was no alpha for it to be drawn into. Painting the
  // walls directly fixes that, and makes the effect hold wherever the light
  // happens to sit.
  //
  // The key is up and to the left, so the far wall of a groove is the lit
  // one: a highlight peeks out below and right of each stroke, a shadow
  // above and left, and the floor of the cut sits darker than the surface
  // between them.
  const [tint, tx] = mk();
  setType(tx);
  tx.filter = "blur(2.5px)";
  tx.fillStyle = "rgba(240,245,250,0.7)";
  tx.fillText(ENGRAVE_TEXT, CX + 4, CY + 4);
  tx.fillStyle = "rgba(12,14,17,0.55)";
  tx.fillText(ENGRAVE_TEXT, CX - 3, CY - 3);
  tx.filter = "blur(1.5px)";
  tx.fillStyle = "rgba(56,60,66,0.85)";
  tx.fillText(ENGRAVE_TEXT, CX, CY);
  tx.filter = "none";

  return [bump, tint];
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
    // Few and brief. Rounds land every twelve milliseconds, so a puff that
    // lives a second and a half has a hundred neighbours alive beside it —
    // and at the end of the burst they stop being individual wisps and
    // become one bright clump hanging over the last word. Twelve slots, half
    // a second each: a round still smokes, but nothing can accumulate.
    const PUFFS = 12;
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
        if (dt < 0 || dt > 0.55) {
          puffs.setMatrixAt(p, hidden);
          continue;
        }
        const [wx, wy] = toWorld(HOLES[i]);
        const u = dt / 0.55;
        dummy.position.set(wx, wy + dt * 0.3, 0.1 + dt * 0.22);
        dummy.quaternion.copy(camera.quaternion);
        const sc = 0.05 + dt * 0.3;
        dummy.scale.set(sc, sc, sc);
        dummy.updateMatrix();
        puffs.setMatrixAt(p, dummy.matrix);
      }
      puffs.instanceMatrix.needsUpdate = true;
      puffs.material.opacity = 0.12;

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

      // The mark fades up before the first round. Driven from here so it
      // stays a function of t: the recorder steps the clock by hand.
      engMat.opacity = ss(180, 820, t);

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
