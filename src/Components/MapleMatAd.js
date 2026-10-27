// MapleMatAd.js — Maple Jiu Jitsu, 3,000 followers: the mat from above.
//
// Straight down on an empty blue tatami. One student walks in and takes a
// spot in the middle: follower #1.
// The camera rises while more and more students arrive and line up in rows,
// until 3,000 of them stand in the shape of the Maple leaf (white gis on a
// blue mat, a single-file stem). A bow ripples out from the centre.
// "EVERY ONE OF YOU IS ON THIS MAT."
//
// three.js, instanced: 3,000 people x 3 parts is three draw calls. Like
// MapleDominoAd it is a pure function of time: ?render=1 hands the clock
// to tools/record-frames.js via window.__renderAt.
import React from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import "../Stylesheets/MapleMatAd.css";
import mapleLogo from "../Images/maple-logo.png";

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

// ---------------- timeline (ms) ----------------
const T_FIRST = 1700; // #1 is in place
const T_FULL = 10600; // #3,000 is in place
const T_BOW = T_FULL + 900;
const BOW_SPREAD = 1500;
const T_OUT = T_BOW + BOW_SPREAD + 300;
const END_MS = T_OUT + 3300;

const COUNT = 3000;
const SPACING = 0.8; // m between students in a row
const H0 = 8.6; // camera height at the start, m
const H1 = 168; // at the end

// The leaf (apex up), in leaf units, same outline the domino run uses.
const HALF = [
  [0.05, 0.1], [0.42, 0.04], [0.36, 0.18], [0.62, 0.4], [0.5, 0.44], [0.56, 0.62],
  [0.36, 0.52], [0.34, 0.6], [0.24, 0.52], [0.28, 0.82], [0.16, 0.76], [0, 1.0],
];
const LEAF_POLY = [...HALF, ...HALF.slice(0, -1).reverse().map(([x, y]) => [-x, y])];
function inPoly(x, y, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function inLeaf(x, y) {
  if (y < 0.1 && y > -0.16 && Math.abs(x) < 0.012) return true; // the stem, single file
  return inPoly(x, y, LEAF_POLY);
}

function buildCrowd() {
  // Grid of spots inside the leaf; pick the leaf size that holds ~3,000.
  const spots = (scale) => {
    const out = [];
    const n = Math.ceil((scale * 0.7) / SPACING);
    for (let r = -Math.ceil((scale * 0.2) / SPACING); r <= Math.ceil((scale * 1.05) / SPACING); r++) {
      for (let c = -n; c <= n; c++) {
        const x = c * SPACING + (r % 2 ? SPACING / 2 : 0) * 0;
        const y = r * SPACING;
        if (inLeaf(x / scale, y / scale)) out.push([x, y]);
      }
    }
    // the stem: one file down the middle
    for (let y = 0.09 * scale; y > -0.16 * scale; y -= SPACING) {
      if (!out.some(([ox, oy]) => Math.abs(ox) < 0.01 && Math.abs(oy - y) < SPACING * 0.5)) out.push([0, y]);
    }
    return out;
  };
  let lo = 20;
  let hi = 120;
  for (let k = 0; k < 40; k++) {
    const mid = (lo + hi) / 2;
    if (spots(mid).length < COUNT) lo = mid;
    else hi = mid;
  }
  const scale = hi;
  let pts = spots(scale);
  const rnd = mulberry32(3000);
  // trim the overshoot at random: a missing person here and there is a real crowd
  while (pts.length > COUNT) pts.splice(Math.floor(rnd() * pts.length), 1);

  // world: x right, z = -y (apex away from the bottom of the frame)
  const cy = 0.46 * scale; // where follower #1 stands
  const people = pts.map(([x, y]) => ({
    x: x + (rnd() - 0.5) * 0.12,
    z: -(y - cy) + (rnd() - 0.5) * 0.12,
    d: 0,
  }));
  for (const p of people) p.d = Math.hypot(p.x, p.z);
  people.sort((a, b) => a.d - b.d);
  // follower #1 dead centre
  people[0].x = 0;
  people[0].z = 0;
  return { people, scale, cy };
}

// ---------------- camera height ----------------
function heightAt(t) {
  const k = easeIO(clamp01((t - 1400) / (T_FULL + 800 - 1400)));
  // exponential climb feels like a steady pull back
  return H0 * Math.pow(H1 / H0, k) + Math.max(0, t - T_FULL - 800) * 0.0006;
}
const FOV = 40;
const halfWidthAt = (h, aspect) => h * Math.tan((FOV * Math.PI) / 360) * aspect;

// ---------------- textures ----------------
function matTextures() {
  // 8 m square at 256 px/m; vinyl tatami panels 1 x 2 m, staggered by column.
  const PX = 256;
  const S = 8 * PX;
  const rnd = mulberry32(11);
  const mk = () => {
    const c = document.createElement("canvas");
    c.width = c.height = S;
    return [c, c.getContext("2d")];
  };
  const [cc, cg] = mk(); // colour
  const [hc, hg] = mk(); // height
  const [rc, rg] = mk(); // roughness
  hg.fillStyle = "rgb(150,150,150)";
  hg.fillRect(0, 0, S, S);
  rg.fillStyle = "rgb(170,170,170)";
  rg.fillRect(0, 0, S, S);

  const panels = [];
  for (let col = 0; col < 8; col++) {
    const off = col % 2 ? PX : 0;
    for (let r = -1; r < 5; r++) panels.push([col * PX, r * 2 * PX + off]);
  }
  for (const [x, y] of panels) {
    // colour: each panel its own dye lot, with soft mottling and a few scuffs
    const l = 33 + rnd() * 3.5;
    const sat = 56 + rnd() * 8;
    cg.fillStyle = `hsl(218, ${sat}%, ${l}%)`;
    cg.fillRect(x, y, PX, 2 * PX);
    for (let k = 0; k < 14; k++) {
      const gx = x + rnd() * PX;
      const gy = y + rnd() * 2 * PX;
      const gr = cg.createRadialGradient(gx, gy, 0, gx, gy, 40 + rnd() * 90);
      const d = (rnd() - 0.5) * 6;
      gr.addColorStop(0, `hsla(218, ${sat}%, ${l + d}%, 0.5)`);
      gr.addColorStop(1, `hsla(218, ${sat}%, ${l + d}%, 0)`);
      cg.fillStyle = gr;
      cg.fillRect(x, y, PX, 2 * PX);
    }
    // wear: a few soft, slightly lighter patches where feet land most
    for (let k = 0; k < 3; k++) {
      const gx = x + rnd() * PX;
      const gy = y + rnd() * 2 * PX;
      const gr = cg.createRadialGradient(gx, gy, 0, gx, gy, 30 + rnd() * 50);
      gr.addColorStop(0, "rgba(190,205,235,0.06)");
      gr.addColorStop(1, "rgba(190,205,235,0)");
      cg.fillStyle = gr;
      cg.fillRect(x, y, PX, 2 * PX);
    }
    // the tatami weave: fine ridges down the length, a faint cross-tie
    for (let k = 0; k < PX; k += 4) {
      hg.fillStyle = "rgba(255,255,255,0.35)";
      hg.fillRect(x + k, y, 2, 2 * PX);
    }
    for (let k = 0; k < 2 * PX; k += 22) {
      hg.fillStyle = "rgba(0,0,0,0.12)";
      hg.fillRect(x, y + k, PX, 2);
    }
    rg.fillStyle = `rgb(${150 + rnd() * 40},0,0)`;
    rg.fillRect(x, y, PX, 2 * PX);
  }
  // seams: a rounded edge on every panel, down into a tight groove
  for (const [x, y] of panels) {
    for (let e = 0; e < 7; e++) {
      const v = Math.round(40 + (e / 7) * 110);
      hg.strokeStyle = `rgb(${v},${v},${v})`;
      hg.lineWidth = 1;
      hg.strokeRect(x + e + 0.5, y + e + 0.5, PX - 2 * e - 1, 2 * PX - 2 * e - 1);
    }
    cg.strokeStyle = "rgba(4,10,28,0.65)";
    cg.lineWidth = 2;
    cg.strokeRect(x + 1, y + 1, PX - 2, 2 * PX - 2);
    rg.strokeStyle = "rgb(235,235,235)";
    rg.lineWidth = 4;
    rg.strokeRect(x + 2, y + 2, PX - 4, 2 * PX - 4);
  }
  // normal map from the height field
  const hd = hg.getImageData(0, 0, S, S).data;
  const [nc, ng] = mk();
  const nd = ng.createImageData(S, S);
  const H = (i, j) => hd[(((j + S) % S) * S + ((i + S) % S)) * 4] / 255;
  const k = 2.2;
  for (let j = 0; j < S; j++) {
    for (let i = 0; i < S; i++) {
      const dx = (H(i + 1, j) - H(i - 1, j)) * k;
      const dy = (H(i, j + 1) - H(i, j - 1)) * k;
      const l = Math.hypot(dx, dy, 1);
      const o = (j * S + i) * 4;
      nd.data[o] = ((-dx / l) * 0.5 + 0.5) * 255;
      nd.data[o + 1] = ((dy / l) * 0.5 + 0.5) * 255;
      nd.data[o + 2] = ((1 / l) * 0.5 + 0.5) * 255;
      nd.data[o + 3] = 255;
    }
  }
  ng.putImageData(nd, 0, 0);
  // roughness lives in green for three.js
  const rd = rg.getImageData(0, 0, S, S);
  for (let o = 0; o < rd.data.length; o += 4) {
    rd.data[o + 1] = Math.max(rd.data[o], rd.data[o + 1] * 0 + rd.data[o]);
    rd.data[o + 2] = 0;
  }
  rg.putImageData(rd, 0, 0);

  const wrap = (c, srgb) => {
    const tx = new THREE.CanvasTexture(c);
    if (srgb) tx.colorSpace = THREE.SRGBColorSpace;
    tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
    return tx;
  };
  return { map: wrap(cc, true), normal: wrap(nc, false), rough: wrap(rc, false) };
}

function lapelTexture() {
  // greyscale, multiplied by each student's gi colour
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, 256, 256);
  // fabric weave
  for (let y = 0; y < 256; y += 3) {
    g.fillStyle = "rgba(0,0,0,0.035)";
    g.fillRect(0, y, 256, 1);
  }
  // the two lapels crossing
  for (const s of [1, -1]) {
    g.save();
    g.translate(128, 128);
    g.scale(s, 1);
    g.rotate(-0.62);
    g.fillStyle = "#e3e3e3";
    g.fillRect(-20, -200, 40, 400);
    g.fillStyle = "#b9b9b9";
    g.fillRect(-21, -200, 3, 400);
    g.fillRect(18, -200, 3, 400);
    g.restore();
  }
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  return tx;
}

function contactTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "rgba(0,0,0,0.75)");
  gr.addColorStop(0.45, "rgba(0,0,0,0.35)");
  gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function setFx(el, opacity, y = 0, scale = 1) {
  if (!el) return;
  el.style.opacity = opacity.toFixed(3);
  el.style.transform = `translateY(${y.toFixed(2)}px) scale(${scale.toFixed(3)})`;
}

export default function MapleMatAd({
  intro = "ONE MAT.",
  label = "FOLLOWERS",
  out1 = "EVERY ONE OF YOU",
  out2 = "IS ON THIS MAT.",
  thanks = "THANK YOU",
  signoff = "SEE YOU ON THE MATS",
  site = "maplebjj.com",
}) {
  const mountRef = React.useRef(null);
  const refs = {
    intro: React.useRef(null),
    count: React.useRef(null),
    num: React.useRef(null),
    label: React.useRef(null),
    out: React.useRef(null),
    foot: React.useRef(null),
  };

  React.useEffect(() => {
    const renderMode = new URLSearchParams(window.location.search).get("render") === "1";
    const mount = mountRef.current;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const aspect = W / H;

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0b1a3a");
    const camera = new THREE.PerspectiveCamera(FOV, aspect, 0.1, 2000);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.42;

    // overhead gym light: nearly straight down, soft-edged shadows
    const sun = new THREE.DirectionalLight("#fff4e6", 2.1);
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.02;
    sun.shadow.radius = 6;
    sun.shadow.blurSamples = 16;
    scene.add(sun, sun.target);
    const fill = new THREE.DirectionalLight("#dfe8ff", 0.45);
    fill.position.set(40, 80, -30);
    scene.add(fill);
    scene.add(new THREE.HemisphereLight("#f2f5ff", "#203466", 0.7));

    // ---- the mat ----
    const mt = matTextures();
    const aniso = renderer.capabilities.getMaxAnisotropy();
    for (const tx of [mt.map, mt.normal, mt.rough]) {
      tx.anisotropy = aniso;
      tx.repeat.set(60, 60);
    }
    const mat = new THREE.Mesh(
      new THREE.PlaneGeometry(480, 480),
      new THREE.MeshStandardMaterial({
        map: mt.map,
        normalMap: mt.normal,
        normalScale: new THREE.Vector2(0.7, 0.7),
        roughnessMap: mt.rough,
        roughness: 1,
      })
    );
    mat.rotation.x = -Math.PI / 2;
    mat.receiveShadow = true;
    scene.add(mat);

    // ---- the crowd ----
    const { people } = buildCrowd();
    const N = people.length;
    const rnd = mulberry32(7);

    const giMat = new THREE.MeshStandardMaterial({ roughness: 0.92 });
    const lapelMat = new THREE.MeshStandardMaterial({ roughness: 0.92, map: lapelTexture() });
    const skinMat = new THREE.MeshStandardMaterial({ roughness: 0.55 });
    const hairMat = new THREE.MeshStandardMaterial({ roughness: 0.7 });
    const beltMat = new THREE.MeshStandardMaterial({ roughness: 0.8 });

    const flat = (g, rx) => { g.rotateX(rx); return g; };
    const parts = {
      torso: [new RoundedBoxGeometry(0.4, 0.6, 0.23, 2, 0.07), lapelMat, 1],
      delt: [new THREE.SphereGeometry(0.078, 12, 8), giMat, 2],
      neck: [new THREE.CylinderGeometry(0.05, 0.055, 0.14, 10), skinMat, 1],
      head: [new THREE.SphereGeometry(0.1, 18, 12), skinMat, 1],
      hair: [new THREE.SphereGeometry(0.108, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.56), hairMat, 1],
      belt: [flat(new THREE.TorusGeometry(0.2, 0.024, 6, 26), Math.PI / 2), beltMat, 1],
      tails: [new THREE.BoxGeometry(0.1, 0.22, 0.016), beltMat, 1],
      arm: [new THREE.CapsuleGeometry(0.048, 0.5, 4, 8), giMat, 2],
      hand: [new THREE.SphereGeometry(0.045, 10, 8), skinMat, 2],
      leg: [new THREE.CapsuleGeometry(0.085, 0.72, 4, 10), giMat, 2],
      foot: [new THREE.SphereGeometry(1, 10, 8), skinMat, 2],
    };
    const M = {};
    for (const [k, [geo, m, per]] of Object.entries(parts)) {
      const im = new THREE.InstancedMesh(geo, m, N * per);
      im.castShadow = true;
      im.receiveShadow = true;
      im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      im.frustumCulled = false;
      scene.add(im);
      M[k] = im;
    }
    // soft contact shadow under each student, so nobody floats
    const contact = new THREE.InstancedMesh(
      flat(new THREE.PlaneGeometry(1, 1), -Math.PI / 2),
      new THREE.MeshBasicMaterial({ map: contactTexture(), transparent: true, depthWrite: false, opacity: 0.55 }),
      N
    );
    contact.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    contact.frustumCulled = false;
    contact.renderOrder = 1;
    scene.add(contact);

    const GI = ["#f4f3ef", "#f4f3ef", "#f4f3ef", "#efeeea", "#f7f6f1", "#2a4c9c", "#1b1c21"];
    const SKIN = ["#f1c9a5", "#e6b48e", "#d49a72", "#b97a54", "#9a5f3e", "#6e432a", "#f4d6bd", "#c98c64"];
    const HAIR = ["#1b120c", "#2a1a10", "#3b2616", "#5a3a20", "#0e0e10", "#a3784a", "#c9a273", "#7a4a2a"];
    const BELT = [["#f2f2ee", 0.5], ["#2350b3", 0.26], ["#5b2a8c", 0.11], ["#6a3d1e", 0.08], ["#111114", 0.05]];
    const pickBelt = () => {
      let r = rnd();
      for (const [c, w] of BELT) if ((r -= w) < 0) return c;
      return BELT[0][0];
    };
    const col = new THREE.Color();
    const setCol = (mesh, i, per, c) => {
      col.set(c);
      for (let q = 0; q < per; q++) mesh.setColorAt(i * per + q, col);
    };

    // arrival schedule: #1 alone, then a handful, then the flood
    const visHalf = (t) => halfWidthAt(heightAt(t), aspect);
    const dMax = people[N - 1].d;
    const fillR = (t) => {
      const h = heightAt(t);
      return dMax * Math.pow(clamp01((h - H0) / (heightAt(T_FULL) - H0)), 0.82);
    };
    const table = [];
    for (let t = T_FIRST; t <= T_FULL; t += 10) table.push([t, fillR(t)]);
    const arriveAt = (d) => {
      for (const [t, r] of table) if (r >= d) return t;
      return T_FULL;
    };
    for (let i = 0; i < N; i++) {
      const p = people[i];
      let a = i === 0 ? T_FIRST : arriveAt(p.d);
      if (i > 0 && i < 8) a = T_FIRST + 500 + i * 380;
      if (i > 0) a = Math.min(a + (rnd() - 0.5) * 160, T_FULL);
      if (i === N - 1) a = T_FULL;
      p.arrive = a;
      let ang = Math.atan2(p.z, p.x);
      if (i === 0) ang = Math.PI / 2 + 0.22; // #1 walks up from the bottom of the frame
      ang += (rnd() - 0.5) * 0.5;
      p.speed = lerp(1.5, 6.5, clamp01((a - T_FIRST) / (T_FULL - T_FIRST)));
      let dist = visHalf(a) * 1.35 + 1.5;
      let dur = (dist / p.speed) * 1000;
      for (let k = 0; k < 3; k++) {
        dist = visHalf(a - dur) * 1.4 + 1.5;
        dur = (dist / p.speed) * 1000;
      }
      if (i === 0) {
        dist = visHalf(0) / aspect + 1.2;
        p.speed = 1.5;
        dur = (dist / p.speed) * 1000;
      }
      p.sx = p.x + Math.cos(ang) * dist;
      p.sz = p.z + Math.sin(ang) * dist;
      p.depart = a - dur;
      p.phase = rnd() * 6.28;
      p.s = 0.92 + rnd() * 0.16;
      p.w = 0.92 + rnd() * 0.18;
      const gi = i === 0 ? GI[0] : GI[Math.floor(rnd() * GI.length)];
      const skin = SKIN[Math.floor(rnd() * SKIN.length)];
      const hair = rnd() < 0.08 ? skin : HAIR[Math.floor(rnd() * HAIR.length)];
      const belt = i === 0 ? "#111114" : pickBelt();
      for (const k of ["torso", "delt", "arm", "leg"]) setCol(M[k], i, parts[k][2], gi);
      for (const k of ["neck", "head", "hand", "foot"]) setCol(M[k], i, parts[k][2], skin);
      setCol(M.hair, i, 1, hair);
      setCol(M.belt, i, 1, belt);
      setCol(M.tails, i, 1, belt);
    }
    for (const im of Object.values(M)) im.instanceColor.needsUpdate = true;

    // ---- per-frame skinning, by hand ----
    const HIP = 0.98;
    const hidden = new THREE.Matrix4().makeScale(0, 0, 0);
    const mPerson = new THREE.Matrix4();
    const mUpper = new THREE.Matrix4();
    const mBow = new THREE.Matrix4();
    const mA = new THREE.Matrix4();
    const mB = new THREE.Matrix4();
    const mOut = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const v = new THREE.Vector3();
    const sc = new THREE.Vector3();
    const Y = new THREE.Vector3(0, 1, 0);
    const T = (x, y, z) => new THREE.Matrix4().makeTranslation(x, y, z);
    const Sm = (x, y, z) => new THREE.Matrix4().makeScale(x, y, z);
    const mul = (...ms) => ms.reduce((acc, m) => acc.multiply(m), new THREE.Matrix4());
    // static locals (upper body, relative to the person)
    const L = {
      torso: T(0, 1.2, 0),
      deltL: mul(T(-0.205, 1.44, 0), Sm(1, 0.9, 1.1)),
      deltR: mul(T(0.205, 1.44, 0), Sm(1, 0.9, 1.1)),
      neck: T(0, 1.55, 0),
      head: mul(T(0, 1.67, -0.005), Sm(0.95, 1.12, 1.02)),
      hair: mul(T(0, 1.685, 0.014), new THREE.Matrix4().makeRotationX(0.38), Sm(0.98, 1.08, 1.04)),
      belt: mul(T(0, 0.93, 0), Sm(1.09, 1, 0.72)),
      tails: T(0, 0.8, -0.142),
    };
    const T_HIP = T(0, HIP, 0);
    const T_NHIP = T(0, -HIP, 0);
    const LEG = T(0, -0.445, 0);
    const FOOT = mul(T(0, -0.94, -0.06), Sm(0.045, 0.03, 0.11));
    const ARM = T(0, -0.3, 0);
    const HAND = mul(T(0, -0.64, 0), Sm(0.9, 1.3, 0.7));
    const HIPJ = { [-1]: T(-0.1, HIP, 0), 1: T(0.1, HIP, 0) };
    const SHJ = { [-1]: mul(T(-0.218, 1.42, 0), new THREE.Matrix4().makeRotationZ(-0.09)), 1: mul(T(0.218, 1.42, 0), new THREE.Matrix4().makeRotationZ(0.09)) };
    const mC = new THREE.Matrix4();
    const set = (mesh, idx, base, local) => {
      mOut.multiplyMatrices(base, local);
      mesh.setMatrixAt(idx, mOut);
    };

    function crowdAt(t) {
      let arrived = 0;
      for (let i = 0; i < N; i++) {
        const p = people[i];
        if (t < p.depart) {
          for (const [k, im] of Object.entries(M)) {
            const per = parts[k][2];
            for (let qq = 0; qq < per; qq++) im.setMatrixAt(i * per + qq, hidden);
          }
          contact.setMatrixAt(i, hidden);
          continue;
        }
        let x, z, yaw, lift = 0, swing = 0, sway = 0;
        const walkYaw = Math.atan2(-(p.x - p.sx), -(p.z - p.sz));
        if (t < p.arrive) {
          const k = (t - p.depart) / (p.arrive - p.depart);
          const e = 1 - Math.pow(1 - k, 1.8);
          x = lerp(p.sx, p.x, e);
          z = lerp(p.sz, p.z, e);
          yaw = walkYaw;
          // stride: ~1.4 m a full cycle, quicker and longer when running
          const v0 = p.speed * (1 - e * 0.7);
          const ph = ((t - p.depart) / 1000) * (v0 / 1.4) * Math.PI * 2 + p.phase;
          const amp = Math.min(0.75, 0.32 + v0 * 0.07);
          swing = Math.sin(ph) * amp * Math.min(1, (1 - k) * 4 + 0.15);
          lift = Math.abs(Math.cos(ph)) * 0.025 * Math.min(1, v0 / 2);
          sway = Math.sin(ph) * 0.05;
        } else {
          arrived++;
          x = p.x;
          z = p.z;
          const k = ss(p.arrive, p.arrive + 450, t);
          let dy = 0 - walkYaw;
          while (dy > Math.PI) dy -= Math.PI * 2;
          while (dy < -Math.PI) dy += Math.PI * 2;
          yaw = walkYaw + dy * k;
          sway = Math.sin(t / 900 + p.phase) * 0.015;
        }
        const bt = t - (T_BOW + (p.d / dMax) * BOW_SPREAD);
        const bow = bt > 0 ? Math.sin(Math.PI * clamp01(bt / 1100)) * 0.6 : 0;

        q.setFromAxisAngle(Y, yaw);
        mPerson.compose(v.set(x, lift, z), q, sc.set(p.s * p.w, p.s, p.s));
        // upper body hinges forward at the hip for the bow, twists a little in the walk
        mBow.makeRotationY(sway);
        if (bow) mBow.multiply(mA.makeRotationX(-bow));
        mUpper.multiplyMatrices(mPerson, T_HIP).multiply(mBow).multiply(T_NHIP);

        set(M.torso, i, mUpper, L.torso);
        set(M.delt, i * 2, mUpper, L.deltL);
        set(M.delt, i * 2 + 1, mUpper, L.deltR);
        set(M.neck, i, mUpper, L.neck);
        set(M.head, i, mUpper, L.head);
        set(M.hair, i, mUpper, L.hair);
        set(M.belt, i, mPerson, L.belt);
        set(M.tails, i, mPerson, L.tails);

        // legs and feet swing from the hip
        for (const [side, sgn] of [[0, -1], [1, 1]]) {
          const sw = swing * sgn;
          mA.multiplyMatrices(mPerson, HIPJ[sgn]).multiply(mB.makeRotationX(sw));
          set(M.leg, i * 2 + side, mA, LEG);
          set(M.foot, i * 2 + side, mA, FOOT);
          // arms swing opposite, from the shoulder
          const asw = -swing * sgn * 0.8;
          mA.multiplyMatrices(mUpper, SHJ[sgn]).multiply(mC.makeRotationX(asw));
          set(M.arm, i * 2 + side, mA, ARM);
          set(M.hand, i * 2 + side, mA, HAND);
        }
        mOut.compose(v.set(x, 0.004, z), q, sc.set(0.95 * p.w, 1, 0.8));
        contact.setMatrixAt(i, mOut);
      }
      for (const im of Object.values(M)) im.instanceMatrix.needsUpdate = true;
      contact.instanceMatrix.needsUpdate = true;
      return arrived;
    }

    // ---- camera ----
    let minZ = Infinity, maxZ = -Infinity;
    for (const p of people) { minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z); }
    const midZ = (minZ + maxZ) / 2;
    function cameraAt(t) {
      const h = heightAt(t);
      const k = easeIO(clamp01((t - 2500) / (T_FULL + 600 - 2500)));
      const cz = lerp(-0.6, midZ, k);
      camera.position.set(0, h, cz + 0.001);
      const rot = lerp(-0.22, 0, easeIO(clamp01(t / (T_FULL + 1500))));
      camera.up.set(Math.sin(rot), 0, -Math.cos(rot));
      camera.lookAt(0, 0, cz);
      // shadow frustum follows the view so the shadows stay sharp at every height
      const r = halfWidthAt(h, 1) * 1.25 + 2;
      const sc = sun.shadow.camera;
      sc.left = -r; sc.right = r; sc.top = r; sc.bottom = -r;
      sc.near = 1; sc.far = 400;
      sc.updateProjectionMatrix();
      sun.target.position.set(0, 0, cz);
      sun.position.set(-14, 100, cz + 20);
    }

    function renderAt(t) {
      const arrived = crowdAt(t);
      cameraAt(t);
      renderer.render(scene, camera);

      setFx(refs.intro.current, ss(200, 650, t) * (1 - ss(1350, 1650, t)), (1 - ss(200, 800, t)) * 8);
      if (refs.num.current) refs.num.current.textContent = Math.min(COUNT, arrived).toLocaleString("en-US");
      if (refs.label.current) refs.label.current.textContent = arrived === 1 ? label.replace(/S$/, "") : label;
      const done = ss(T_FULL, T_FULL + 250, t);
      setFx(refs.count.current, ss(T_FIRST - 200, T_FIRST + 300, t) * (1 - ss(T_OUT - 500, T_OUT, t)), 0, 1 + 0.3 * done * (1 - ss(T_FULL + 250, T_FULL + 700, t)) + 0.1 * done);
      if (refs.count.current) refs.count.current.classList.toggle("mm-gold", arrived >= COUNT);
      setFx(refs.out.current, ss(T_OUT, T_OUT + 700, t), (1 - ss(T_OUT, T_OUT + 800, t)) * 10);
      setFx(refs.foot.current, ss(T_OUT + 1100, T_OUT + 1700, t), (1 - ss(T_OUT + 1100, T_OUT + 1800, t)) * 10);
    }

    let raf;
    let disposed = false;
    const ready = (async () => {
      try {
        await document.fonts.load('400 100px "Bebas Neue"');
        await document.fonts.load("800 40px Inter");
      } catch (e) { /* fonts are a nicety */ }
    })();
    ready.then(() => {
      if (disposed) return;
      renderAt(0);
      if (renderMode) {
        window.__renderAt = (ms) => renderAt(ms);
        window.__matEnd = END_MS;
        window.__matArrivals = people.map((p) => Math.round(p.arrive)).sort((a, b) => a - b);
        window.__matMarks = { T_FIRST, T_FULL, T_BOW, T_OUT, END_MS };
        window.__ready = true;
        return;
      }
      const t0 = performance.now();
      const loop = (now) => {
        renderAt(now - t0);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="mm-stage">
      <div className="mm-canvas" ref={mountRef} />
      <div className="mm-vignette" aria-hidden />

      <div className="mm-intro" ref={refs.intro}>{intro}</div>

      <div className="mm-count" ref={refs.count}>
        <div className="mm-num" ref={refs.num}>0</div>
        <div className="mm-label" ref={refs.label}>{label}</div>
      </div>

      <div className="mm-out" ref={refs.out}>
        <img src={mapleLogo} alt="Maple Jiu Jitsu" />
        <div className="mm-o1">{out1}</div>
        <div className="mm-o2">{out2}</div>
      </div>

      <div className="mm-foot" ref={refs.foot}>
        <div className="mm-thanks">{thanks}</div>
        <div className="mm-sign">{signoff}</div>
        <div className="mm-site">{site}</div>
      </div>
    </div>
  );
}
