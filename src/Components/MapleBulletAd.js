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
// Seven lines — "3,000" / "FOLLOWERS" / "THANK YOU" / "FOR THE SUPPORT!"
// and then O, S, S stacked one per line —
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
// the block is 1.504 as tall as it is wide.
const HOLES = [[-0.3523,0.7538,1.0],[-0.3275,0.7498,1.0],[-0.3060,0.7476,1.0],[-0.2952,0.7235,1.0],[-0.2915,0.7008,1.0],[-0.2929,0.6812,1.0],[-0.2998,0.6567,1.0],[-0.3212,0.6321,1.0],[-0.3456,0.6372,1.0],[-0.2998,0.6217,1.0],[-0.2933,0.6014,1.0],[-0.2872,0.5754,1.0],[-0.2880,0.5564,1.0],[-0.2902,0.5319,1.0],[-0.2956,0.5076,1.0],[-0.3225,0.4953,1.0],[-0.3563,0.4923,1.0],[-0.3750,0.5112,1.0],[-0.3779,0.5334,1.0],[-0.3844,0.5555,1.0],[-0.3941,0.7037,1.0],[-0.3780,0.7211,1.0],[-0.3739,0.7423,1.0],[-0.2045,0.5099,1.0],[-0.1987,0.4848,1.0],[-0.2033,0.4613,1.0],[-0.2197,0.4456,1.0],[-0.0772,0.7535,1.0],[-0.0527,0.7485,1.0],[-0.0348,0.7353,1.0],[-0.0301,0.7092,1.0],[-0.0238,0.6876,1.0],[-0.0254,0.6663,1.0],[-0.0202,0.6422,1.0],[-0.0197,0.6218,1.0],[-0.0225,0.5959,1.0],[-0.0236,0.5731,1.0],[-0.0251,0.5538,1.0],[-0.0316,0.5265,1.0],[-0.0398,0.5088,1.0],[-0.0594,0.4937,1.0],[-0.1013,0.5001,1.0],[-0.1124,0.5203,1.0],[-0.1188,0.5452,1.0],[-0.1201,0.5667,1.0],[-0.1242,0.5922,1.0],[-0.1236,0.6118,1.0],[-0.1208,0.6333,1.0],[-0.1204,0.6598,1.0],[-0.1193,0.6788,1.0],[-0.1184,0.7067,1.0],[-0.1120,0.7281,1.0],[-0.1006,0.7490,1.0],[0.1219,0.7499,1.0],[0.1443,0.7481,1.0],[0.1627,0.7347,1.0],[0.1732,0.7124,1.0],[0.1740,0.6888,1.0],[0.1777,0.6657,1.0],[0.1796,0.6435,1.0],[0.1778,0.6191,1.0],[0.1775,0.5963,1.0],[0.1765,0.5765,1.0],[0.1727,0.5503,1.0],[0.1717,0.5267,1.0],[0.1632,0.5068,1.0],[0.1397,0.4930,1.0],[0.0949,0.5004,1.0],[0.0857,0.5224,1.0],[0.0814,0.5449,1.0],[0.0804,0.5671,1.0],[0.0769,0.5887,1.0],[0.0795,0.6113,1.0],[0.0758,0.6352,1.0],[0.0803,0.6598,1.0],[0.0777,0.6797,1.0],[0.0817,0.7047,1.0],[0.0902,0.7275,1.0],[0.0995,0.7481,1.0],[0.3230,0.7508,1.0],[0.3459,0.7473,1.0],[0.3620,0.7345,1.0],[0.3721,0.7115,1.0],[0.3756,0.6863,1.0],[0.3755,0.6675,1.0],[0.3753,0.6431,1.0],[0.3767,0.6203,1.0],[0.3752,0.6000,1.0],[0.3761,0.5733,1.0],[0.3736,0.5497,1.0],[0.3709,0.5295,1.0],[0.3636,0.5086,1.0],[0.3420,0.4930,1.0],[0.2971,0.5009,1.0],[0.2855,0.5214,1.0],[0.2808,0.5452,1.0],[0.2795,0.5651,1.0],[0.2791,0.5901,1.0],[0.2801,0.6139,1.0],[0.2777,0.6348,1.0],[0.2785,0.6600,1.0],[0.2788,0.6797,1.0],[0.2810,0.7031,1.0],[0.2863,0.7246,1.0],[0.3020,0.7475,1.0],[-0.4032,0.3855,1.0],[-0.3852,0.3884,1.0],[-0.4099,0.3617,1.0],[-0.4117,0.3438,1.0],[-0.3911,0.3314,1.0],[-0.4103,0.3164,1.0],[-0.4102,0.2956,1.0],[-0.4123,0.2694,1.0],[-0.3096,0.3923,1.0],[-0.3281,0.3778,1.0],[-0.3311,0.3543,1.0],[-0.3330,0.3340,1.0],[-0.3359,0.3125,1.0],[-0.3303,0.2899,1.0],[-0.3245,0.2637,1.0],[-0.2926,0.2674,1.0],[-0.2849,0.2863,1.0],[-0.2825,0.3096,1.0],[-0.2858,0.3330,1.0],[-0.2837,0.3575,1.0],[-0.2870,0.3786,1.0],[-0.2264,0.3806,1.0],[-0.2264,0.3594,1.0],[-0.2282,0.3348,1.0],[-0.2287,0.3154,1.0],[-0.2281,0.2888,1.0],[-0.2235,0.2698,1.0],[-0.2032,0.2672,1.0],[-0.1568,0.3795,1.0],[-0.1564,0.3600,1.0],[-0.1571,0.3366,1.0],[-0.1551,0.3143,1.0],[-0.1576,0.2921,1.0],[-0.1541,0.2658,1.0],[-0.1318,0.2645,1.0],[-0.0616,0.3907,1.0],[-0.0795,0.3773,1.0],[-0.0838,0.3581,1.0],[-0.0866,0.3316,1.0],[-0.0842,0.3104,1.0],[-0.0831,0.2866,1.0],[-0.0752,0.2681,1.0],[-0.0414,0.2678,1.0],[-0.0329,0.2883,1.0],[-0.0323,0.3134,1.0],[-0.0326,0.3336,1.0],[-0.0319,0.3550,1.0],[-0.0386,0.3793,1.0],[0.1449,0.3986,1.0],[0.1282,0.3783,1.0],[0.1254,0.3568,1.0],[0.1246,0.3317,1.0],[0.1195,0.3136,1.0],[0.1182,0.2904,1.0],[0.0910,0.2929,1.0],[0.0867,0.3139,1.0],[0.0853,0.3402,1.0],[0.0707,0.3597,1.0],[0.0708,0.3827,1.0],[0.0595,0.3401,1.0],[0.0538,0.3145,1.0],[0.0540,0.2946,1.0],[0.0233,0.2929,1.0],[0.0196,0.3185,1.0],[0.0210,0.3411,1.0],[0.0182,0.3609,1.0],[0.0155,0.3858,1.0],[0.1796,0.3628,1.0],[0.1755,0.3394,1.0],[0.1981,0.3301,1.0],[0.1760,0.3187,1.0],[0.1793,0.2920,1.0],[0.1769,0.2726,1.0],[0.1983,0.2662,1.0],[0.2036,0.3894,1.0],[0.1808,0.3854,1.0],[0.2615,0.3896,1.0],[0.2866,0.3909,1.0],[0.3017,0.3768,1.0],[0.3023,0.3494,1.0],[0.2998,0.3197,1.0],[0.2793,0.3320,1.0],[0.2562,0.3416,1.0],[0.2581,0.3641,1.0],[0.2568,0.3191,1.0],[0.2586,0.2939,1.0],[0.2558,0.2743,1.0],[0.3047,0.2759,1.0],[0.3084,0.2986,1.0],[0.3769,0.3912,1.0],[0.4013,0.3870,1.0],[0.3622,0.3779,1.0],[0.3590,0.3568,1.0],[0.3708,0.3364,1.0],[0.3915,0.3242,1.0],[0.4075,0.3033,1.0],[0.4091,0.2789,1.0],[0.3921,0.2616,1.0],[0.3657,0.2661,1.0],[0.3594,0.2851,1.0],[0.0468,0.1199,0.72],[0.0380,0.1046,0.72],[0.0360,0.0898,0.72],[0.0284,0.0726,0.72],[0.0331,0.0555,0.72],[0.0382,0.0401,0.72],[0.0422,0.0219,0.72],[0.0540,0.0143,0.72],[0.0046,0.0250,0.72],[0.0059,0.0452,0.72],[0.0061,0.0618,0.72],[0.0034,0.0790,0.72],[0.0042,0.0943,0.72],[0.0046,0.1080,0.72],[-0.0387,0.1116,0.72],[-0.0363,0.0970,0.72],[-0.0392,0.0770,0.72],[-0.0368,0.0620,0.72],[-0.0420,0.0440,0.72],[-0.0383,0.0297,0.72],[-0.0779,0.0288,0.72],[-0.0759,0.0452,0.72],[-0.0773,0.0602,0.72],[-0.0708,0.0799,0.72],[-0.0760,0.0925,0.72],[-0.0777,0.1121,0.72],[-0.1187,0.0968,0.72],[-0.1199,0.0805,0.72],[-0.1157,0.0617,0.72],[-0.1166,0.0454,0.72],[-0.1147,0.0274,0.72],[-0.1339,0.0426,0.72],[-0.1499,0.0474,0.72],[-0.1504,0.0635,0.72],[-0.1507,0.0779,0.72],[-0.1488,0.0970,0.72],[-0.1444,0.1120,0.72],[-0.1242,0.1125,0.72],[-0.1931,0.1090,0.72],[-0.1895,0.0912,0.72],[-0.1935,0.0789,0.72],[-0.1915,0.0581,0.72],[-0.1910,0.0421,0.72],[-0.1926,0.0276,0.72],[-0.1643,0.0164,0.72],[-0.1538,0.0268,0.72],[-0.2113,0.0710,0.72],[-0.2278,0.0746,0.72],[-0.2290,0.0951,0.72],[-0.2310,0.1127,0.72],[-0.2699,0.1141,0.72],[-0.2881,0.1126,0.72],[-0.3042,0.1151,0.72],[-0.2840,0.1001,0.72],[-0.2857,0.0822,0.72],[-0.2829,0.0639,0.72],[-0.2839,0.0487,0.72],[-0.2852,0.0322,0.72],[-0.2319,0.0282,0.72],[-0.2274,0.0424,0.72],[-0.2308,0.0606,0.72],[-0.0573,0.0694,0.72],[0.1459,0.1203,0.72],[0.1347,0.1051,0.72],[0.1296,0.0887,0.72],[0.1299,0.0746,0.72],[0.1186,0.0577,0.72],[0.1208,0.0445,0.72],[0.1187,0.0285,0.72],[0.1100,0.0817,0.72],[0.1053,0.0969,0.72],[0.1008,0.1164,0.72],[0.1761,0.0876,0.72],[0.1762,0.0728,0.72],[0.1757,0.0546,0.72],[0.1733,0.0409,0.72],[0.1801,0.0221,0.72],[0.2090,0.0271,0.72],[0.2117,0.0428,0.72],[0.2126,0.0612,0.72],[0.2136,0.0766,0.72],[0.2122,0.0963,0.72],[0.2064,0.1111,0.72],[0.1890,0.1159,0.72],[0.1778,0.1040,0.72],[0.2537,0.1080,0.72],[0.2556,0.0943,0.72],[0.2554,0.0798,0.72],[0.2523,0.0602,0.72],[0.2534,0.0445,0.72],[0.2596,0.0276,0.72],[0.2736,0.0179,0.72],[0.2903,0.0295,0.72],[0.2934,0.0428,0.72],[0.2913,0.0628,0.72],[0.2912,0.0793,0.72],[0.2931,0.0912,0.72],[0.2927,0.1115,0.72],[-0.4281,-0.0610,0.72],[-0.4106,-0.0634,0.72],[-0.4036,-0.0809,0.72],[-0.4022,-0.0980,0.72],[-0.4059,-0.1129,0.72],[-0.4072,-0.1327,0.72],[-0.4087,-0.1489,0.72],[-0.4350,-0.1523,0.72],[-0.4419,-0.1374,0.72],[-0.4423,-0.1190,0.72],[-0.4446,-0.1020,0.72],[-0.4455,-0.0872,0.72],[-0.4381,-0.0714,0.72],[-0.4796,-0.0629,0.72],[-0.4955,-0.0635,0.72],[-0.4997,-0.0791,0.72],[-0.4995,-0.0933,0.72],[-0.4898,-0.1079,0.72],[-0.4990,-0.1177,0.72],[-0.4979,-0.1325,0.72],[-0.3610,-0.1270,0.72],[-0.3642,-0.1084,0.72],[-0.3646,-0.0922,0.72],[-0.3607,-0.0771,0.72],[-0.3604,-0.0606,0.72],[-0.3390,-0.0621,0.72],[-0.3290,-0.0709,0.72],[-0.3276,-0.0862,0.72],[-0.3334,-0.1006,0.72],[-0.3292,-0.1219,0.72],[-0.3235,-0.1371,0.72],[-0.3605,-0.1459,0.72],[-0.2680,-0.0640,0.72],[-0.2482,-0.0616,0.72],[-0.2356,-0.0618,0.72],[-0.2461,-0.0808,0.72],[-0.2474,-0.0959,0.72],[-0.2448,-0.1119,0.72],[-0.2472,-0.1301,0.72],[-0.2474,-0.1464,0.72],[-0.1892,-0.1489,0.72],[-0.1935,-0.1309,0.72],[-0.1934,-0.1139,0.72],[-0.1919,-0.0993,0.72],[-0.1896,-0.0800,0.72],[-0.1899,-0.0638,0.72],[-0.1517,-0.0633,0.72],[-0.1536,-0.0846,0.72],[-0.1509,-0.0966,0.72],[-0.1534,-0.1177,0.72],[-0.1545,-0.1319,0.72],[-0.1541,-0.1476,0.72],[-0.1104,-0.1489,0.72],[-0.1122,-0.1367,0.72],[-0.1090,-0.1181,0.72],[-0.0998,-0.1043,0.72],[-0.1097,-0.0954,0.72],[-0.1129,-0.0806,0.72],[-0.1069,-0.0605,0.72],[-0.0889,-0.0638,0.72],[-0.0946,-0.1539,0.72],[-0.1769,-0.1040,0.72],[-0.0109,-0.0608,0.72],[-0.0262,-0.0718,0.72],[-0.0239,-0.0855,0.72],[-0.0153,-0.0999,0.72],[-0.0002,-0.1114,0.72],[0.0112,-0.1213,0.72],[0.0118,-0.1394,0.72],[0.0051,-0.1516,0.72],[-0.0204,-0.1555,0.72],[-0.0257,-0.1394,0.72],[0.0516,-0.1329,0.72],[0.0485,-0.1156,0.72],[0.0476,-0.0975,0.72],[0.0517,-0.0821,0.72],[0.0491,-0.0678,0.72],[0.0891,-0.0634,0.72],[0.0871,-0.0825,0.72],[0.0862,-0.1003,0.72],[0.0882,-0.1174,0.72],[0.0846,-0.1305,0.72],[0.0824,-0.1488,0.72],[0.0666,-0.1571,0.72],[0.0526,-0.1464,0.72],[0.1317,-0.1417,0.72],[0.1321,-0.1250,0.72],[0.1381,-0.1099,0.72],[0.1300,-0.0961,0.72],[0.1293,-0.0797,0.72],[0.1347,-0.0629,0.72],[0.1487,-0.0608,0.72],[0.1633,-0.0726,0.72],[0.1685,-0.0894,0.72],[0.1626,-0.1019,0.72],[0.2050,-0.0923,0.72],[0.2043,-0.0777,0.72],[0.2079,-0.0617,0.72],[0.2220,-0.0600,0.72],[0.2362,-0.0720,0.72],[0.2398,-0.0901,0.72],[0.2359,-0.1034,0.72],[0.2068,-0.1090,0.72],[0.2031,-0.1258,0.72],[0.2001,-0.1399,0.72],[0.2758,-0.1377,0.72],[0.2764,-0.1178,0.72],[0.2753,-0.1028,0.72],[0.2746,-0.0875,0.72],[0.2778,-0.0705,0.72],[0.2931,-0.0561,0.72],[0.3065,-0.0674,0.72],[0.3133,-0.0801,0.72],[0.3139,-0.1001,0.72],[0.3120,-0.1148,0.72],[0.3114,-0.1337,0.72],[0.3077,-0.1487,0.72],[0.2828,-0.1553,0.72],[0.3567,-0.1432,0.72],[0.3572,-0.1288,0.72],[0.3545,-0.1097,0.72],[0.3540,-0.0929,0.72],[0.3553,-0.0768,0.72],[0.3614,-0.0580,0.72],[0.3762,-0.0603,0.72],[0.3917,-0.0736,0.72],[0.3913,-0.0888,0.72],[0.3823,-0.1041,0.72],[0.3868,-0.1213,0.72],[0.3926,-0.1349,0.72],[0.4436,-0.1274,0.72],[0.4443,-0.1123,0.72],[0.4449,-0.0924,0.72],[0.4442,-0.0780,0.72],[0.4435,-0.0639,0.72],[0.4250,-0.0641,0.72],[0.4557,-0.0601,0.72],[0.4982,-0.0635,0.72],[0.4978,-0.0816,0.72],[0.5010,-0.0972,0.72],[0.4980,-0.1144,0.72],[0.5003,-0.1539,0.72],[0.4476,-0.1436,0.72],[0.0039,-0.0634,0.72],[-0.0066,-0.2852,0.72],[0.0068,-0.2840,0.72],[0.0140,-0.3025,0.72],[0.0181,-0.3176,0.72],[0.0168,-0.3358,0.72],[0.0206,-0.3483,0.72],[0.0196,-0.3673,0.72],[0.0099,-0.3815,0.72],[-0.0036,-0.3907,0.72],[-0.0196,-0.3807,0.72],[-0.0249,-0.3641,0.72],[-0.0251,-0.3440,0.72],[-0.0242,-0.3281,0.72],[-0.0202,-0.3125,0.72],[-0.0195,-0.2975,0.72],[-0.0112,-0.4638,0.72],[0.0049,-0.4662,0.72],[0.0171,-0.4825,0.72],[-0.0248,-0.4775,0.72],[-0.0213,-0.4948,0.72],[-0.0107,-0.5116,0.72],[0.0002,-0.5197,0.72],[0.0137,-0.5319,0.72],[0.0165,-0.5458,0.72],[0.0158,-0.5651,0.72],[-0.0019,-0.5701,0.72],[-0.0194,-0.5620,0.72],[-0.0200,-0.5492,0.72],[-0.0096,-0.6439,0.72],[0.0032,-0.6470,0.72],[0.0130,-0.6622,0.72],[-0.0233,-0.6610,0.72],[-0.0240,-0.6762,0.72],[-0.0124,-0.6893,0.72],[0.0017,-0.6984,0.72],[0.0140,-0.7121,0.72],[0.0176,-0.7298,0.72],[0.0160,-0.7456,0.72],[-0.0041,-0.7519,0.72],[-0.0199,-0.7474,0.72],[-0.0248,-0.7279,0.72]];

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
const DH = 3.6;
const SPAN = 2.05; // the block's width
const CW = 1800;
const CH = Math.round((CW * DH) / DW);
const HOLE_R = 11.5;

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

    // ---- the smoke that is left once the shooting stops ----
    // Not the per-impact puff above, which is gone in a second and a half.
    // This is the haze a few hundred rounds leave hanging in front of a wall:
    // it gathers after the last shot, drifts up and across, and is still
    // thinning out when the piece ends.
    const HAZE = 22;
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
      x: (hazeRnd() - 0.5) * 2.9,
      y: PY - 2.5 - hazeRnd() * 0.7, // well below the lettering
      z: 0.25 + hazeRnd() * 0.9,
      rise: 0.12 + hazeRnd() * 0.16,
      drift: (hazeRnd() - 0.5) * 0.3,
      s0: 0.5 + hazeRnd() * 0.85,
      grow: 0.18 + hazeRnd() * 0.3,
      ph: hazeRnd() * 9,
      rot: hazeRnd() * Math.PI * 2,
      spin: (hazeRnd() - 0.5) * 0.22,
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
      //
      // IT MUST NOT SWEEP THE LETTERING. Rising from below the block and
      // climbing past it put a bright cloud straight through the text about
      // two seconds after the last round: measured on the "3,000" band, the
      // mean went 113 -> 166 -> 113, which reads as the number flashing. It
      // now sits low and climbs slowly, and it is light enough that drifting
      // past anything costs a few points rather than fifty.
      const hz = ss(T_LAST - 1200, T_LAST + 900, t) * (1 - 0.72 * ss(T_LAST + 1900, END_MS - 500, t));
      haze.material.opacity = 0.17 * hz;
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
          dummy.rotateZ(z.rot + z.spin * ht); // it turns over as it climbs
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

      // ---- camera ----
      // In close while it is being shot, back off to read the whole number.
      // ONE DISTANCE, ALL THE WAY THROUGH. The piece used to end on a pull
      // back to reveal the block; it is framed to hold the whole block from
      // the first frame instead, so nothing moves under the viewer at the
      // moment the last round lands. Only a slow handheld float remains.
      const dist = 7.8;
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
