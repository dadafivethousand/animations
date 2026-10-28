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
// the block is 0.850 as tall as it is wide.
const HOLES = [[-0.3571,0.3867,1.0],[-0.3509,0.2350,1.0],[-0.3471,0.2181,1.0],[-0.3401,0.1966,1.0],[-0.3394,0.4177,1.0],[-0.3146,0.3190,1.0],[-0.2941,0.3178,1.0],[-0.2794,0.3157,1.0],[-0.2768,0.3033,1.0],[-0.2650,0.2828,1.0],[-0.2640,0.2630,1.0],[-0.2643,0.2397,1.0],[-0.2678,0.2225,1.0],[-0.2730,0.2022,1.0],[-0.2830,0.1887,1.0],[-0.3072,0.1873,1.0],[-0.3063,0.4234,1.0],[-0.2818,0.4186,1.0],[-0.2681,0.3970,1.0],[-0.2658,0.3765,1.0],[-0.2686,0.3597,1.0],[-0.1852,0.2035,0.72],[-0.1846,0.1859,0.72],[-0.1863,0.1713,0.72],[-0.1947,0.1516,0.72],[-0.2030,0.1415,0.72],[-0.1038,0.3898,1.0],[-0.1103,0.3722,1.0],[-0.1110,0.3498,1.0],[-0.1108,0.3306,1.0],[-0.1126,0.3065,1.0],[-0.1110,0.2864,1.0],[-0.1130,0.2666,1.0],[-0.1080,0.2447,1.0],[-0.1038,0.2264,1.0],[-0.0773,0.4231,1.0],[-0.0945,0.4165,1.0],[-0.0560,0.4257,1.0],[-0.0387,0.4148,1.0],[-0.0938,0.1940,1.0],[-0.0702,0.1873,1.0],[-0.0253,0.3901,1.0],[-0.0229,0.3689,1.0],[-0.0218,0.3495,1.0],[-0.0196,0.3276,1.0],[-0.0218,0.3086,1.0],[-0.0214,0.2853,1.0],[-0.0202,0.2634,1.0],[-0.0209,0.2452,1.0],[-0.0247,0.2224,1.0],[-0.0349,0.2023,1.0],[0.1062,0.4251,1.0],[0.1264,0.4260,1.0],[0.1481,0.4105,1.0],[0.1554,0.3896,1.0],[0.1598,0.3712,1.0],[0.1641,0.3498,1.0],[0.1626,0.3283,1.0],[0.1646,0.3070,1.0],[0.1652,0.2866,1.0],[0.1629,0.2644,1.0],[0.1618,0.2435,1.0],[0.1580,0.2257,1.0],[0.1509,0.2042,1.0],[0.1419,0.1893,1.0],[0.1188,0.1878,1.0],[0.0911,0.1906,1.0],[0.0766,0.2255,1.0],[0.0729,0.2457,1.0],[0.0716,0.2665,1.0],[0.0732,0.2870,1.0],[0.0714,0.3070,1.0],[0.0733,0.3278,1.0],[0.0706,0.3496,1.0],[0.0758,0.3719,1.0],[0.0770,0.3898,1.0],[0.0871,0.4151,1.0],[0.2803,0.4219,1.0],[0.2674,0.4111,1.0],[0.2604,0.3835,1.0],[0.2576,0.3633,1.0],[0.2545,0.3443,1.0],[0.2567,0.3225,1.0],[0.2562,0.2998,1.0],[0.2553,0.2817,1.0],[0.2544,0.2596,1.0],[0.2583,0.2396,1.0],[0.2610,0.2214,1.0],[0.2691,0.1995,1.0],[0.3107,0.4227,1.0],[0.3308,0.4170,1.0],[0.3411,0.3939,1.0],[0.3452,0.3725,1.0],[0.3468,0.3535,1.0],[0.3461,0.3316,1.0],[0.3464,0.3114,1.0],[0.3478,0.2883,1.0],[0.3473,0.2690,1.0],[0.3471,0.2488,1.0],[0.3424,0.2274,1.0],[0.3354,0.2053,1.0],[0.3244,0.1897,1.0],[0.2971,0.1873,1.0],[-0.4446,0.0854,0.72],[-0.4603,0.0850,0.72],[-0.4601,0.0622,0.72],[-0.4636,0.0491,0.72],[-0.4505,0.0300,0.72],[-0.4633,0.0251,0.72],[-0.4626,0.0098,0.72],[-0.4623,-0.0073,0.72],[-0.4621,-0.0210,0.72],[-0.4371,0.0308,0.72],[-0.3583,0.0901,0.72],[-0.3668,0.0779,0.72],[-0.3689,0.0611,0.72],[-0.3706,0.0478,0.72],[-0.3727,0.0335,0.72],[-0.3701,0.0184,0.72],[-0.3712,-0.0001,0.72],[-0.3692,-0.0124,0.72],[-0.3641,-0.0279,0.72],[-0.3345,-0.0313,0.72],[-0.3294,-0.0175,0.72],[-0.3240,-0.0020,0.72],[-0.3217,0.0120,0.72],[-0.3213,0.0272,0.72],[-0.3213,0.0436,0.72],[-0.3236,0.0575,0.72],[-0.3268,0.0742,0.72],[-0.3359,0.0886,0.72],[-0.2510,0.0838,0.72],[-0.2528,0.0720,0.72],[-0.2530,0.0540,0.72],[-0.2527,0.0412,0.72],[-0.2532,0.0255,0.72],[-0.2517,0.0106,0.72],[-0.2536,-0.0042,0.72],[-0.2533,-0.0220,0.72],[-0.2422,-0.0281,0.72],[-0.2272,-0.0282,0.72],[-0.1657,0.0813,0.72],[-0.1650,0.0687,0.72],[-0.1663,0.0508,0.72],[-0.1646,0.0367,0.72],[-0.1653,0.0207,0.72],[-0.1648,0.0079,0.72],[-0.1644,-0.0083,0.72],[-0.1625,-0.0245,0.72],[-0.1485,-0.0257,0.72],[-0.1373,-0.0276,0.72],[-0.0415,0.0885,0.72],[-0.0331,0.0725,0.72],[-0.0295,0.0595,0.72],[-0.0294,0.0422,0.72],[-0.0292,0.0279,0.72],[-0.0282,0.0110,0.72],[-0.0314,-0.0008,0.72],[-0.0339,-0.0153,0.72],[-0.0401,-0.0299,0.72],[-0.0703,-0.0274,0.72],[-0.0738,-0.0115,0.72],[-0.0783,0.0026,0.72],[-0.0782,0.0181,0.72],[-0.0767,0.0325,0.72],[-0.0785,0.0456,0.72],[-0.0759,0.0630,0.72],[-0.0733,0.0779,0.72],[-0.0688,0.0904,0.72],[0.0356,0.0856,0.72],[0.0370,0.0681,0.72],[0.0384,0.0544,0.72],[0.0404,0.0375,0.72],[0.0384,0.0218,0.72],[0.0424,0.0089,0.72],[0.0435,-0.0056,0.72],[0.0621,-0.0104,0.72],[0.0708,0.0141,0.72],[0.1431,0.0875,0.72],[0.1392,0.0727,0.72],[0.1373,0.0545,0.72],[0.1345,0.0408,0.72],[0.1353,0.0265,0.72],[0.1316,0.0088,0.72],[0.1253,-0.0156,0.72],[0.1128,-0.0108,0.72],[0.1053,0.0021,0.72],[0.1019,0.0153,0.72],[0.1014,0.0303,0.72],[0.0957,0.0456,0.72],[0.0884,0.0524,0.72],[0.0768,0.0461,0.72],[0.0858,0.0688,0.72],[0.2283,0.0869,0.72],[0.2072,0.0836,0.72],[0.2082,0.0648,0.72],[0.2092,0.0475,0.72],[0.2076,0.0335,0.72],[0.2063,0.0216,0.72],[0.2071,0.0072,0.72],[0.2082,-0.0097,0.72],[0.2103,-0.0261,0.72],[0.2237,-0.0280,0.72],[0.2386,-0.0269,0.72],[0.2345,0.0301,0.72],[0.2173,0.0320,0.72],[0.3232,0.0879,0.72],[0.3408,0.0863,0.72],[0.3451,0.0715,0.72],[0.3480,0.0560,0.72],[0.3430,0.0444,0.72],[0.3364,0.0328,0.72],[0.3382,0.0243,0.72],[0.3474,0.0072,0.72],[0.3503,-0.0054,0.72],[0.3504,-0.0234,0.72],[0.3017,-0.0211,0.72],[0.3023,-0.0067,0.72],[0.3026,0.0064,0.72],[0.3005,0.0227,0.72],[0.3023,0.0356,0.72],[0.3001,0.0502,0.72],[0.3026,0.0667,0.72],[0.3004,0.0818,0.72],[0.3206,0.0339,0.72],[0.4383,0.0921,0.72],[0.4513,0.0901,0.72],[0.4588,0.0728,0.72],[0.4255,0.0903,0.72],[0.4165,0.0778,0.72],[0.4147,0.0657,0.72],[0.4186,0.0524,0.72],[0.4238,0.0431,0.72],[0.4397,0.0320,0.72],[0.4545,0.0207,0.72],[0.4600,0.0054,0.72],[0.4629,-0.0086,0.72],[0.4595,-0.0216,0.72],[0.4393,-0.0306,0.72],[0.4224,-0.0283,0.72],[0.4156,-0.0131,0.72],[-0.3262,-0.1695,0.56],[-0.3092,-0.1701,0.56],[-0.3005,-0.1710,0.56],[-0.3121,-0.1871,0.56],[-0.3151,-0.1954,0.56],[-0.3136,-0.2100,0.56],[-0.3132,-0.2210,0.56],[-0.3144,-0.2308,0.56],[-0.3126,-0.2413,0.56],[-0.3132,-0.2531,0.56],[-0.2493,-0.1746,0.56],[-0.2492,-0.1871,0.56],[-0.2501,-0.1957,0.56],[-0.2515,-0.2083,0.56],[-0.2489,-0.2227,0.56],[-0.2501,-0.2352,0.56],[-0.2497,-0.2448,0.56],[-0.2140,-0.2436,0.56],[-0.2152,-0.2332,0.56],[-0.2132,-0.2230,0.56],[-0.2148,-0.2096,0.56],[-0.2272,-0.2096,0.56],[-0.2398,-0.2095,0.56],[-0.2127,-0.1988,0.56],[-0.2152,-0.1862,0.56],[-0.2134,-0.1727,0.56],[-0.1577,-0.1732,0.56],[-0.1460,-0.1744,0.56],[-0.1390,-0.1810,0.56],[-0.1355,-0.1906,0.56],[-0.1360,-0.2038,0.56],[-0.1325,-0.2127,0.56],[-0.1331,-0.2237,0.56],[-0.1309,-0.2373,0.56],[-0.1445,-0.2384,0.56],[-0.1562,-0.2363,0.56],[-0.1646,-0.2400,0.56],[-0.1636,-0.2217,0.56],[-0.1620,-0.2114,0.56],[-0.1637,-0.1978,0.56],[-0.1615,-0.1880,0.56],[-0.1721,-0.2577,0.56],[-0.1304,-0.2555,0.56],[-0.0460,-0.1722,0.56],[-0.0452,-0.1846,0.56],[-0.0455,-0.1937,0.56],[-0.0459,-0.2064,0.56],[-0.0492,-0.2208,0.56],[-0.0617,-0.2173,0.56],[-0.0710,-0.2117,0.56],[-0.0801,-0.2048,0.56],[-0.0802,-0.1910,0.56],[-0.0844,-0.1817,0.56],[-0.0845,-0.1725,0.56],[-0.0840,-0.2204,0.56],[-0.0843,-0.2328,0.56],[-0.0835,-0.2418,0.56],[-0.0835,-0.2557,0.56],[-0.0487,-0.2446,0.56],[-0.0497,-0.2332,0.56],[0.0460,-0.1681,0.56],[0.0361,-0.1787,0.56],[0.0321,-0.1918,0.56],[0.0287,-0.2109,0.56],[0.0178,-0.2116,0.56],[0.0057,-0.2110,0.56],[0.0029,-0.1983,0.56],[0.0020,-0.1893,0.56],[0.0032,-0.1747,0.56],[0.0051,-0.2239,0.56],[0.0038,-0.2366,0.56],[0.0044,-0.2514,0.56],[0.0341,-0.2378,0.56],[0.0363,-0.2505,0.56],[0.0320,-0.2282,0.56],[0.1626,-0.1652,0.56],[0.1545,-0.1713,0.56],[0.1507,-0.1868,0.56],[0.1480,-0.1965,0.56],[0.1403,-0.2112,0.56],[0.1293,-0.2072,0.56],[0.1273,-0.1964,0.56],[0.1228,-0.1814,0.56],[0.1185,-0.1686,0.56],[0.1353,-0.2241,0.56],[0.1382,-0.2366,0.56],[0.1354,-0.2528,0.56],[0.2294,-0.1692,0.56],[0.2326,-0.1795,0.56],[0.2347,-0.1899,0.56],[0.2368,-0.2006,0.56],[0.2361,-0.2154,0.56],[0.2372,-0.2258,0.56],[0.2365,-0.2384,0.56],[0.2315,-0.2517,0.56],[0.2225,-0.2585,0.56],[0.2062,-0.2568,0.56],[0.2019,-0.2443,0.56],[0.1990,-0.2318,0.56],[0.2010,-0.2199,0.56],[0.1992,-0.2096,0.56],[0.1991,-0.1980,0.56],[0.2024,-0.1854,0.56],[0.2040,-0.1701,0.56],[0.3212,-0.1726,0.56],[0.3223,-0.1884,0.56],[0.3240,-0.1978,0.56],[0.3238,-0.2095,0.56],[0.3237,-0.2205,0.56],[0.3214,-0.2354,0.56],[0.3214,-0.2435,0.56],[0.3158,-0.2573,0.56],[0.3054,-0.2584,0.56],[0.2924,-0.2540,0.56],[0.2895,-0.2420,0.56],[0.2863,-0.2337,0.56],[0.2886,-0.2208,0.56],[0.2853,-0.2076,0.56],[0.2871,-0.1981,0.56],[0.2848,-0.1880,0.56],[0.2862,-0.1739,0.56],[-0.4890,-0.3382,0.56],[-0.4996,-0.3386,0.56],[-0.5017,-0.3546,0.56],[-0.4985,-0.3679,0.56],[-0.5006,-0.3790,0.56],[-0.4857,-0.3778,0.56],[-0.4986,-0.3949,0.56],[-0.4982,-0.4087,0.56],[-0.4982,-0.4182,0.56],[-0.4774,-0.3374,0.56],[-0.4225,-0.3311,0.56],[-0.4317,-0.3378,0.56],[-0.4366,-0.3515,0.56],[-0.4373,-0.3620,0.56],[-0.4396,-0.3729,0.56],[-0.4403,-0.3832,0.56],[-0.4372,-0.3955,0.56],[-0.4382,-0.4086,0.56],[-0.4293,-0.4216,0.56],[-0.4184,-0.4254,0.56],[-0.4105,-0.4234,0.56],[-0.4034,-0.4075,0.56],[-0.4042,-0.3936,0.56],[-0.4036,-0.3834,0.56],[-0.4038,-0.3720,0.56],[-0.4034,-0.3588,0.56],[-0.4035,-0.3492,0.56],[-0.4099,-0.3348,0.56],[-0.3510,-0.3361,0.56],[-0.3400,-0.3374,0.56],[-0.3291,-0.3394,0.56],[-0.3216,-0.3546,0.56],[-0.3273,-0.3682,0.56],[-0.3302,-0.3769,0.56],[-0.3403,-0.3780,0.56],[-0.3557,-0.3750,0.56],[-0.3544,-0.3632,0.56],[-0.3549,-0.3532,0.56],[-0.3553,-0.3965,0.56],[-0.3572,-0.4067,0.56],[-0.3566,-0.4193,0.56],[-0.3203,-0.4214,0.56],[-0.3208,-0.4094,0.56],[-0.3234,-0.3984,0.56],[-0.3254,-0.3888,0.56],[-0.2466,-0.3355,0.56],[-0.2300,-0.3387,0.56],[-0.2174,-0.3353,0.56],[-0.2325,-0.3517,0.56],[-0.2330,-0.3640,0.56],[-0.2337,-0.3752,0.56],[-0.2316,-0.3844,0.56],[-0.2331,-0.3995,0.56],[-0.2319,-0.4081,0.56],[-0.2323,-0.4201,0.56],[-0.1756,-0.3407,0.56],[-0.1760,-0.3548,0.56],[-0.1764,-0.3651,0.56],[-0.1734,-0.3775,0.56],[-0.1739,-0.3840,0.56],[-0.1736,-0.3971,0.56],[-0.1755,-0.4067,0.56],[-0.1759,-0.4179,0.56],[-0.1388,-0.4183,0.56],[-0.1373,-0.4052,0.56],[-0.1386,-0.3954,0.56],[-0.1372,-0.3862,0.56],[-0.1382,-0.3766,0.56],[-0.1395,-0.3650,0.56],[-0.1400,-0.3541,0.56],[-0.1388,-0.3395,0.56],[-0.1525,-0.3762,0.56],[-0.1634,-0.3773,0.56],[-0.0782,-0.3349,0.56],[-0.0911,-0.3374,0.56],[-0.0905,-0.3564,0.56],[-0.0919,-0.3680,0.56],[-0.0937,-0.3775,0.56],[-0.0937,-0.3900,0.56],[-0.0932,-0.4025,0.56],[-0.0909,-0.4133,0.56],[-0.0883,-0.4223,0.56],[-0.0745,-0.4224,0.56],[-0.0782,-0.3778,0.56],[0.0145,-0.3334,0.56],[0.0046,-0.3389,0.56],[-0.0005,-0.3479,0.56],[0.0033,-0.3691,0.56],[0.0257,-0.3824,0.56],[0.0306,-0.3902,0.56],[0.0370,-0.4005,0.56],[0.0361,-0.4128,0.56],[0.0290,-0.4206,0.56],[0.0189,-0.4264,0.56],[0.0054,-0.4228,0.56],[-0.0009,-0.4076,0.56],[0.0320,-0.3450,0.56],[0.0260,-0.3332,0.56],[0.1168,-0.3405,0.56],[0.1150,-0.3531,0.56],[0.1150,-0.3626,0.56],[0.1147,-0.3751,0.56],[0.1168,-0.3878,0.56],[0.1134,-0.3971,0.56],[0.1141,-0.4090,0.56],[0.1095,-0.4240,0.56],[0.0973,-0.4260,0.56],[0.0847,-0.4220,0.56],[0.0807,-0.4086,0.56],[0.0813,-0.3992,0.56],[0.0805,-0.3869,0.56],[0.0781,-0.3741,0.56],[0.0808,-0.3654,0.56],[0.0800,-0.3513,0.56],[0.0772,-0.3413,0.56],[0.1785,-0.3361,0.56],[0.1897,-0.3396,0.56],[0.1940,-0.3509,0.56],[0.1949,-0.3614,0.56],[0.1936,-0.3726,0.56],[0.1859,-0.3803,0.56],[0.1748,-0.3820,0.56],[0.1633,-0.3814,0.56],[0.1608,-0.3938,0.56],[0.1606,-0.4065,0.56],[0.1601,-0.4177,0.56],[0.1635,-0.3694,0.56],[0.1613,-0.3558,0.56],[0.1616,-0.3399,0.56],[0.2517,-0.3365,0.56],[0.2644,-0.3396,0.56],[0.2690,-0.3495,0.56],[0.2693,-0.3641,0.56],[0.2677,-0.3737,0.56],[0.2635,-0.3811,0.56],[0.2486,-0.3820,0.56],[0.2364,-0.3804,0.56],[0.2357,-0.3923,0.56],[0.2374,-0.4062,0.56],[0.2387,-0.4191,0.56],[0.2369,-0.3706,0.56],[0.2359,-0.3592,0.56],[0.2390,-0.3463,0.56],[0.2409,-0.3371,0.56],[0.3284,-0.3335,0.56],[0.3398,-0.3354,0.56],[0.3457,-0.3479,0.56],[0.3470,-0.3598,0.56],[0.3483,-0.3705,0.56],[0.3484,-0.3832,0.56],[0.3492,-0.3945,0.56],[0.3476,-0.4048,0.56],[0.3405,-0.4228,0.56],[0.3317,-0.4243,0.56],[0.3159,-0.4205,0.56],[0.3117,-0.4097,0.56],[0.3122,-0.3993,0.56],[0.3133,-0.3872,0.56],[0.3100,-0.3760,0.56],[0.3101,-0.3625,0.56],[0.3136,-0.3519,0.56],[0.3159,-0.3410,0.56],[0.3994,-0.3349,0.56],[0.4118,-0.3376,0.56],[0.4207,-0.3356,0.56],[0.4287,-0.3531,0.56],[0.4258,-0.3652,0.56],[0.4205,-0.3726,0.56],[0.4265,-0.3875,0.56],[0.4272,-0.3996,0.56],[0.4307,-0.4098,0.56],[0.4295,-0.4177,0.56],[0.3924,-0.4201,0.56],[0.3960,-0.4080,0.56],[0.3950,-0.3953,0.56],[0.3935,-0.3852,0.56],[0.3954,-0.3741,0.56],[0.3928,-0.3626,0.56],[0.3951,-0.3528,0.56],[0.4050,-0.3767,0.56],[0.4760,-0.3377,0.56],[0.4895,-0.3382,0.56],[0.4988,-0.3368,0.56],[0.4855,-0.3536,0.56],[0.4839,-0.3615,0.56],[0.4839,-0.3731,0.56],[0.4850,-0.3867,0.56],[0.4867,-0.3988,0.56],[0.4841,-0.4087,0.56],[0.4860,-0.4180,0.56]];

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
const DH = 2.4;
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
