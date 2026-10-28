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
// Sampled off Arial Black "3,000" on a jittered grid with a minimum spacing,
// then ordered per character from 12 o'clock clockwise so each burst traces
// its digit like a stroke instead of filling it in at random. x is in units
// of the number's own width; y is the same scale, so the set is 0.303 tall.
const HOLES = [[-0.4220,0.1266],[-0.4341,0.1406],[-0.4124,0.0539],[-0.4355,0.1053],[-0.4543,0.1410],[-0.4732,0.1235],[-0.4730,0.1054],[-0.4558,0.0823],[-0.4961,0.1113],[-0.4159,0.0362],[-0.4799,0.0847],[-0.5000,0.0909],[-0.4963,-0.0464],[-0.4708,-0.0343],[-0.4749,-0.0639],[-0.4567,-0.0459],[-0.4791,-0.0818],[-0.4404,-0.0513],[-0.4563,-0.0851],[-0.4178,-0.0642],[-0.4181,-0.0882],[-0.3968,-0.0927],[-0.3758,-0.0891],[-0.3783,-0.0689],[-0.3969,0.0099],[-0.3741,-0.0285],[-0.3471,-0.0699],[-0.3607,-0.0448],[-0.3450,-0.0516],[-0.3536,-0.0228],[-0.3652,-0.0090],[-0.3182,-0.0472],[-0.3206,-0.0257],[-0.3739,0.0153],[-0.3212,0.0061],[-0.3401,0.0116],[-0.3408,0.0317],[-0.3647,0.0334],[-0.3853,0.0323],[-0.3349,0.0645],[-0.3610,0.0628],[-0.3552,0.0907],[-0.3781,0.0673],[-0.3614,0.1080],[-0.3784,0.0867],[-0.3741,0.1410],[-0.3793,0.1222],[-0.3980,0.1254],[-0.3970,0.1480],[-0.2392,-0.0541],[-0.2407,-0.0720],[-0.2599,-0.0321],[-0.2614,-0.0612],[-0.2667,-0.0867],[-0.2392,-0.0903],[-0.2441,-0.1320],[-0.2477,-0.1516],[-0.2259,-0.1246],[-0.2206,-0.1439],[-0.2260,-0.1050],[-0.2078,-0.1031],[-0.1997,-0.0881],[-0.2058,-0.0673],[-0.2176,-0.0463],[-0.0662,0.1471],[-0.0724,0.1210],[-0.0852,0.1516],[-0.0935,0.1326],[-0.0875,0.1054],[-0.1105,0.1216],[-0.0900,0.0869],[-0.1294,0.1281],[-0.1259,0.1048],[-0.1119,0.0883],[-0.1451,0.1141],[-0.1321,0.0876],[-0.1488,0.0933],[-0.1115,0.0671],[-0.1430,0.0701],[-0.1278,0.0551],[-0.1478,0.0495],[-0.1129,0.0441],[-0.1266,0.0287],[-0.1481,0.0256],[-0.1594,-0.0104],[-0.1250,0.0052],[-0.1015,0.0162],[-0.1495,-0.0294],[-0.1254,-0.0252],[-0.1415,-0.0523],[-0.1231,-0.0852],[-0.0916,-0.0271],[-0.1015,-0.0494],[-0.0867,-0.0710],[-0.0630,-0.0803],[-0.0438,-0.0909],[-0.0461,-0.0689],[-0.0237,-0.0877],[-0.0324,-0.0445],[-0.0126,-0.0505],[0.0061,-0.0712],[-0.0227,-0.0150],[-0.0080,-0.0307],[0.0157,-0.0346],[-0.0285,0.0098],[0.0326,-0.0288],[-0.0120,0.0043],[0.0266,-0.0094],[0.0133,0.0082],[0.0128,0.0264],[0.0328,0.0237],[-0.0292,0.0345],[-0.0034,0.0337],[0.0165,0.0451],[-0.0116,0.0522],[0.0291,0.0704],[0.0125,0.0654],[0.0249,0.0884],[-0.0294,0.0636],[-0.0033,0.0875],[0.0132,0.1054],[-0.0041,0.1279],[-0.0248,0.1030],[-0.0348,0.0862],[-0.0288,0.1295],[-0.0235,0.1465],[-0.0455,0.1025],[-0.0534,0.1283],[0.1645,0.1260],[0.1442,0.1432],[0.1309,0.1276],[0.1294,0.1079],[0.1092,0.1221],[0.1057,0.1040],[0.1313,0.0684],[0.0942,0.0844],[0.1052,0.0648],[0.1128,0.0455],[0.0745,0.0517],[0.0934,0.0343],[0.1262,0.0240],[0.0896,0.0141],[0.0733,0.0077],[0.0830,-0.0125],[0.1018,-0.0134],[0.0923,-0.0346],[0.1318,-0.0076],[0.1115,-0.0425],[0.1015,-0.0638],[0.1328,-0.0287],[0.1216,-0.0608],[0.1111,-0.0814],[0.1428,-0.0880],[0.1518,-0.0691],[0.1676,-0.0912],[0.1838,-0.0690],[0.2053,-0.0926],[0.2023,-0.0506],[0.2240,-0.0870],[0.2242,-0.0530],[0.2203,-0.0306],[0.2065,-0.0088],[0.2424,-0.0416],[0.2572,-0.0330],[0.2034,0.0089],[0.2449,-0.0097],[0.2246,0.0117],[0.2677,0.0141],[0.2422,0.0264],[0.2206,0.0294],[0.2611,0.0447],[0.2389,0.0461],[0.2285,0.0638],[0.2610,0.0886],[0.2282,0.0856],[0.2412,0.1068],[0.2242,0.1227],[0.2041,0.0895],[0.2078,0.1118],[0.2035,0.1299],[0.1879,0.1068],[0.1902,0.1442],[0.1703,0.1493],[0.3928,0.1498],[0.3647,0.1478],[0.3740,0.1127],[0.3670,0.1298],[0.3362,0.1282],[0.3449,0.1084],[0.3465,0.0860],[0.3184,0.1119],[0.3602,0.0629],[0.3159,0.0950],[0.3227,0.0682],[0.3043,0.0712],[0.3411,0.0481],[0.3151,0.0456],[0.2997,0.0336],[0.3172,0.0249],[0.3404,0.0246],[0.3646,0.0247],[0.3071,0.0059],[0.3220,-0.0072],[0.3562,0.0045],[0.3193,-0.0277],[0.3170,-0.0526],[0.3474,-0.0294],[0.3381,-0.0441],[0.3378,-0.0682],[0.3670,-0.0244],[0.3657,-0.0495],[0.3556,-0.0871],[0.3838,-0.0511],[0.3775,-0.0899],[0.3829,-0.0722],[0.3938,-0.1016],[0.4018,-0.0666],[0.4031,-0.0870],[0.4227,-0.0618],[0.4351,-0.0890],[0.4605,-0.0864],[0.4375,-0.0329],[0.4553,-0.0543],[0.4815,-0.0659],[0.4718,-0.0470],[0.4633,-0.0322],[0.4343,-0.0047],[0.4559,-0.0114],[0.4776,-0.0097],[0.4833,0.0093],[0.4579,0.0251],[0.4381,0.0289],[0.4949,0.0348],[0.5000,0.0548],[0.4609,0.0524],[0.4830,0.0632],[0.4401,0.0483],[0.4946,0.0824],[0.4579,0.0704],[0.4715,0.0835],[0.4746,0.1134],[0.4568,0.0943],[0.4378,0.0858],[0.4607,0.1231],[0.4376,0.1235],[0.4231,0.1104],[0.4190,0.1290],[0.4209,0.1483],[0.4003,0.1298]];

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
      left = 14 + Math.floor(r() * 9);
      if (i) t += 105 + r() * 80; // swing onto the next run
    }
    out.push(t);
    t += 20 + r() * 6;
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
const DW = 2.95; // damage layer
const DH = 1.32;
const SPAN = 2.2; // the number's width
const CW = 2560;
const CH = Math.round((CW * DH) / DW);
const HOLE_R = 16;

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
  x.fillStyle = "#3a3f46";
  x.fillRect(0, 0, CW, CH);
  // rolled-steel mottling
  for (let i = 0; i < 2600; i++) {
    const px = r() * CW;
    const py = r() * CH;
    const rad = 18 + r() * 90;
    const g = x.createRadialGradient(px, py, 0, px, py, rad);
    const v = r() > 0.5 ? 255 : 0;
    g.addColorStop(0, `rgba(${v},${v},${v},${0.016 + r() * 0.03})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g;
    x.fillRect(px - rad, py - rad, rad * 2, rad * 2);
  }
  // brushed grain, horizontal
  for (let i = 0; i < 2600; i++) {
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
  // old scuffs and a little rust in the corners
  for (let i = 0; i < 70; i++) {
    const px = r() * CW;
    const py = r() * CH;
    x.strokeStyle = `rgba(20,16,14,${0.05 + r() * 0.12})`;
    x.lineWidth = 1 + r() * 3;
    x.beginPath();
    x.moveTo(px, py);
    x.lineTo(px + (r() - 0.5) * 240, py + (r() - 0.5) * 90);
    x.stroke();
  }
  for (let i = 0; i < 160; i++) {
    const edge = r();
    const px = edge < 0.5 ? r() * CW * 0.16 + (r() < 0.5 ? 0 : CW * 0.84) : r() * CW;
    const py = edge < 0.5 ? r() * CH : r() * CH * 0.16 + (r() < 0.5 ? 0 : CH * 0.84);
    const rad = 10 + r() * 60;
    const g = x.createRadialGradient(px, py, 0, px, py, rad);
    g.addColorStop(0, `rgba(122,74,38,${0.05 + r() * 0.1})`);
    g.addColorStop(1, "rgba(122,74,38,0)");
    x.fillStyle = g;
    x.fillRect(px - rad, py - rad, rad * 2, rad * 2);
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
  const [emis, ex] = mk();
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
    const R = HOLE_R * sh.scale;

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
    torn(cx, px, py, R, sh, 1.42);
    cx.fillStyle = "#8d949d";
    cx.fill();
    torn(cx, px, py, R, sh, 1.2);
    cx.fillStyle = "#cdd5de";
    cx.fill();
    torn(ax, px, py, R, sh, 1.42);
    ax.fillStyle = "#ffffff";
    ax.fill();
    torn(bx, px, py, R, sh, 1.36);
    bx.fillStyle = "#f2f2f2"; // standing proud
    bx.fill();
    torn(rx, px, py, R, sh, 1.28);
    rx.fillStyle = "rgba(0,0,0,0.85)"; // and polished, so it catches the key
    rx.fill();

    // The pit itself.
    torn(cx, px, py, R, sh, 1);
    cx.fillStyle = "#050607";
    cx.fill();
    torn(bx, px, py, R, sh, 1);
    bx.fillStyle = "#060606"; // sunk
    bx.fill();

    // And a little of the room behind, through the hole. Small and sharp:
    // a glow wider than the hole reads as a lamp, not as daylight through
    // a 9 mm gap, and 249 lamps is a string of fairy lights.
    g = ex.createRadialGradient(px, py, 0, px, py, R * 0.78);
    g.addColorStop(0, "rgba(255,236,204,1)");
    g.addColorStop(0.5, "rgba(255,192,116,0.42)");
    g.addColorStop(1, "rgba(255,170,90,0)");
    ex.fillStyle = g;
    ex.fillRect(px - R, py - R, R * 2, R * 2);
    torn(ex, px, py, R, sh, 0.38); // the hot centre stays small: the pit is
    ex.fillStyle = "#fff3dd";      // what makes it read as a hole at all
    ex.fill();
  }

  function reset() {
    for (const c of [cx, bx, rx, ex, ax]) c.clearRect(0, 0, CW, CH);
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
  const texEmis = tex(emis, true);
  const texAlpha = tex(alpha, false);

  let drawn = 0;
  return {
    texColour,
    texBump,
    texRough,
    texEmis,
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
      texEmis.needsUpdate = true;
      texAlpha.needsUpdate = true;
    },
  };
}

export default function MapleBulletAd({
  label = "FOLLOWERS",
  thanks = "THANK YOU",
  signoff = "SEE YOU ON THE MATS",
  site = "maplebjj.com",
}) {
  const mountRef = React.useRef(null);
  const refs = {
    count: React.useRef(null),
    num: React.useRef(null),
    word: React.useRef(null),
    foot: React.useRef(null),
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
    scene.background = new THREE.Color("#07090c");
    scene.fog = new THREE.FogExp2("#0a0d12", 0.055);
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.05, 200);

    // ---- light ----
    // One hard key raking down the wall from the left, because a raking light
    // is the only thing that shows brushed grain and the lip standing proud of
    // a hole. A cool fill from the right keeps the steel blue rather than
    // grey, and a low warm bounce stands in for the room behind. No floor and
    // no back wall: the steel fills the frame, so anything built behind it is
    // never seen and only lights things it should not.
    const key = new THREE.SpotLight("#dce9ff", 1500, 34, 0.8, 0.6, 1.25);
    key.position.set(-5.2, 6.4, 5.6);
    key.target.position.set(0.3, PY - 0.2, 0);
    scene.add(key, key.target);
    const fill2 = new THREE.DirectionalLight("#8fb8ff", 0.8);
    fill2.position.set(5.5, 1.6, 4.2);
    scene.add(fill2);
    const warm = new THREE.DirectionalLight("#ffb978", 0.35);
    warm.position.set(0.5, -2.2, 3.0);
    scene.add(warm);
    scene.add(new THREE.AmbientLight("#44566e", 0.55));

    // ---- the wall, and the damage on it ----
    const steelTex = new THREE.CanvasTexture(steelCanvas());
    steelTex.colorSpace = THREE.SRGBColorSpace;
    steelTex.wrapS = steelTex.wrapT = THREE.RepeatWrapping;
    steelTex.repeat.set(1, 1);
    steelTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(WALLW, WALLH),
      new THREE.MeshStandardMaterial({ map: steelTex, roughness: 0.46, metalness: 0.78, color: "#6e757e" })
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
      roughness: 1,
      metalness: 0.9,
      emissiveMap: dmg.texEmis,
      emissive: new THREE.Color("#ffdcae"),
      emissiveIntensity: 1.0,
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
    const MUZZLE = new THREE.Vector3(2.1, 0.5, 8.4); // behind and right of camera

    // ---- impact flash ----
    const flash = new THREE.PointLight("#ffd9a0", 0, 6, 2);
    scene.add(flash);

    // ---- dust in the beam ----
    const MOTES = 220;
    const motes = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(0.012, 0.012),
      new THREE.MeshBasicMaterial({ color: "#cfe2ff", transparent: true, opacity: 0.25, depthWrite: false }),
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
      dmgMat.emissiveIntensity = 0.9 + 0.5 * ss(0, HOLES.length, n) + 0.5 * ss(T_PULL, T_WORD, t);

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
        if (dt < 0 || dt > 110) continue;
        const e = Math.exp(-dt / 34);
        if (e > fl) {
          fl = e;
          const w = toWorld(HOLES[i]);
          fx = w[0];
          fy = w[1];
        }
      }
      flash.intensity = fl * 9;
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
      // so the number is one shape. 6.55 puts the 2.2 m number at ~82% of the
      // frame, 8.30 at ~65%, which is the cap the safe margin asks for.
      const dist = lerp(6.55, 8.3, pull);
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
      const gone = ss(T_PULL + 300, T_PULL + 800, t);
      setFx(refs.count.current, fire * (1 - gone), 0, 1);
      if (refs.num.current) {
        const v = Math.round((3000 * n) / HOLES.length);
        refs.num.current.textContent = v.toLocaleString("en-US");
      }
      setFx(refs.word.current, ss(T_WORD, T_WORD + 420, t), (1 - ss(T_WORD, T_WORD + 520, t)) * 14);
      setFx(refs.foot.current, ss(T_THANKS, T_THANKS + 600, t), (1 - ss(T_THANKS, T_THANKS + 700, t)) * 12);
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
      <div className="bu-word" ref={refs.word}>{label}</div>
      <div className="bu-foot" ref={refs.foot}>
        <div className="bu-thanks">{thanks}</div>
        <div className="bu-sign">{signoff}</div>
        <div className="bu-site">{site}</div>
      </div>
    </div>
  );
}
