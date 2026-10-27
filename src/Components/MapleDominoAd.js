// MapleDominoAd.js — Maple Jiu Jitsu, 3,000 followers, as a domino run.
//
// A few hundred glossy navy dominoes stand on a maple-wood floor. The run
// comes up a straight line (the stem), traces the outline of the Maple leaf,
// then turns up the middle as a growth chain — each domino ~1.32x the last —
// into a giant that falls along the leaf's midrib with "3,000 FOLLOWERS" on
// its face. Camera: macro on the first domino, tracking along the wave,
// a three-quarter on the growth chain, then a crane to top-down.
//
// Real 3D (three.js): rounded boxes, clearcoat, soft shadows, a spotlight
// pool on the floor. Everything is a pure function of time, so:
//   - normally it plays in real time off requestAnimationFrame;
//   - with ?render=1 it waits, and tools/record-frames.js calls
//     window.__renderAt(ms) for every frame, so the export is perfectly
//     smooth however heavy the frame is.
import React from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import "../Stylesheets/MapleDominoAd.css";
import mapleLogo from "../Images/maple-logo.png";

// ---------------- helpers ----------------
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ss = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------- the run ----------------
// Domino, in cm: thickness along travel, height, width across travel.
const TH = 0.75;
const DH = 4.8;
const DW = 2.4;
const SPACING = 3.4;
const LEAF = 210; // cm from leaf base to apex

// Right half of the leaf, base -> apex, in leaf units (x right, y to apex).
const HALF = [
  [0.05, 0.1], [0.42, 0.04], [0.36, 0.18], [0.62, 0.4], [0.5, 0.44], [0.56, 0.62],
  [0.36, 0.52], [0.34, 0.6], [0.24, 0.52], [0.28, 0.82], [0.16, 0.76], [0, 1.0],
];

function resample(poly, step) {
  const out = [];
  let carry = 0;
  for (let i = 0; i < poly.length - 1; i++) {
    const [ax, az] = poly[i];
    const [bx, bz] = poly[i + 1];
    const L = Math.hypot(bx - ax, bz - az);
    let d = carry;
    while (d <= L) {
      out.push([lerp(ax, bx, d / L), lerp(az, bz, d / L)]);
      d += step;
    }
    carry = d - L;
  }
  return out;
}
function chaikin(poly, r = 0.14) {
  const out = [poly[0]];
  for (let i = 0; i < poly.length - 1; i++) {
    const [ax, az] = poly[i];
    const [bx, bz] = poly[i + 1];
    out.push([lerp(ax, bx, r), lerp(az, bz, r)]);
    out.push([lerp(ax, bx, 1 - r), lerp(az, bz, 1 - r)]);
  }
  out.push(poly[poly.length - 1]);
  return out;
}

function buildRun() {
  const toW = ([x, y]) => [x * LEAF, -y * LEAF];
  const right = HALF.map(toW);
  const left = HALF.slice(0, -1).reverse().map(([x, y]) => toW([-x, y]));
  const outline = chaikin([...right, ...left]);

  const stemTop = toW(HALF[0]);
  const leadIn = [[stemTop[0], 175], stemTop];

  const path = [...leadIn, ...outline.slice(1)];
  const pts = resample(path, SPACING);

  const dom = pts.map(([x, z], i) => ({ x, z, m: 1 }));
  // tangents
  for (let i = 0; i < dom.length; i++) {
    const a = dom[Math.max(0, i - 1)];
    const b = dom[Math.min(dom.length - 1, i + 1)];
    const L = Math.hypot(b.x - a.x, b.z - a.z) || 1;
    dom[i].tx = (b.x - a.x) / L;
    dom[i].tz = (b.z - a.z) / L;
  }

  // the turn from the base of the leaf into the midline, at size 1
  const last = dom[dom.length - 1];
  const turnR = 9;
  const cx = last.x;
  const cz = last.z - turnR;
  for (let a = 0.35; a <= Math.PI / 2; a += SPACING / turnR) {
    // quarter circle from heading +x to heading -z
    dom.push({ x: cx + Math.sin(a) * turnR, z: cz + Math.cos(a) * turnR, m: 1, tx: Math.cos(a), tz: -Math.sin(a) });
  }
  const nSmall = dom.length;

  // growth chain up the midline, then the giant
  let pz = dom[dom.length - 1].z;
  let px = dom[dom.length - 1].x;
  let prev = 1;
  const sizes = [1, 1, 1.32, 1.74, 2.3, 3.04, 4.0, 5.3, 7.0, 9.2, 12.2];
  for (let k = 0; k < sizes.length; k++) {
    const m = sizes[k];
    const gap = 0.56 * DH * prev;
    pz -= (TH * prev) / 2 + gap + (TH * m) / 2;
    px = lerp(px, 0, 0.55);
    dom.push({ x: px, z: pz, m, tx: 0, tz: -1, growth: true });
    prev = m;
  }
  dom[dom.length - 1].giant = true;
  return { dom, nSmall };
}

// ---------------- schedule ----------------
const T0 = 1150; // first domino starts to tip
const FIRST_MS = 650; // it takes its time
const RUN_MS = 6900; // the rest of the small run
const GIANT_MS = 1350;

function schedule(dom, nSmall) {
  const n = dom.length;
  const start = new Array(n);
  const hit = new Array(n);
  start[0] = T0;
  hit[0] = T0 + FIRST_MS;
  for (let i = 1; i < nSmall; i++) {
    start[i] = hit[i - 1];
    // accelerate: the wave picks up speed as it goes
    const u = i / nSmall;
    const u2 = (i + 1) / nSmall;
    hit[i] = T0 + FIRST_MS + RUN_MS * (Math.pow(u2, 0.86) - Math.pow(1 / nSmall, 0.86)) / (1 - Math.pow(1 / nSmall, 0.86));
    if (hit[i] <= start[i]) hit[i] = start[i] + 4;
    void u;
  }
  // growth chain: slow motion, bigger falls take longer
  for (let i = nSmall; i < n; i++) {
    start[i] = hit[i - 1];
    const m = dom[i].m;
    hit[i] = start[i] + (dom[i].giant ? GIANT_MS : 120 * Math.sqrt(m) + 90);
  }
  return { start, hit, end: hit[n - 1] };
}

function angleAt(d, t, s, h) {
  const tau = t - s;
  if (tau <= 0) return 0;
  const dur = h - s;
  if (d.giant) return (Math.PI / 2) * Math.pow(clamp01(tau / dur), 2.25);
  const gapC = (SPACING - TH) / DH;
  const thc = Math.asin(Math.min(0.95, d.growth ? 0.56 : gapC));
  const rest = Math.min(1.33, thc + 0.66);
  if (tau < dur) return thc * Math.pow(tau / dur, 1.7);
  return thc + (rest - thc) * (1 - Math.exp(-(tau - dur) / (110 * Math.sqrt(d.m))));
}

// ---------------- textures ----------------
const PIPS = {
  0: [], 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
  6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
};
const NAVY = "#13234b";

function faceTexture(a, b) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = NAVY;
  g.fillRect(0, 0, 256, 512);
  // divider
  g.fillStyle = "rgba(235,238,245,0.9)";
  g.fillRect(28, 252, 200, 8);
  g.fillStyle = "rgba(255,255,255,1)";
  g.beginPath();
  g.arc(128, 256, 13, 0, Math.PI * 2);
  g.fill();
  const half = (n, oy) => {
    for (const [cx, cy] of PIPS[n]) {
      const x = 58 + cx * 70;
      const y = oy + 58 + cy * 70;
      const gr = g.createRadialGradient(x - 4, y - 5, 2, x, y, 22);
      gr.addColorStop(0, "#ffffff");
      gr.addColorStop(0.7, "#eef1f7");
      gr.addColorStop(1, "#b9c2d6");
      g.fillStyle = gr;
      g.beginPath();
      g.arc(x, y, 21, 0, Math.PI * 2);
      g.fill();
    }
  };
  half(a, 0);
  half(b, 256);
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  tx.anisotropy = 8;
  return tx;
}

function giantTexture(logoImg) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 2048;
  const g = c.getContext("2d");
  g.fillStyle = NAVY;
  g.fillRect(0, 0, 1024, 2048);
  g.strokeStyle = "rgba(255,255,255,0.85)";
  g.lineWidth = 10;
  g.strokeRect(60, 60, 904, 1928);
  if (logoImg && logoImg.naturalWidth) {
    const w = 560;
    const h = (logoImg.naturalHeight / logoImg.naturalWidth) * w;
    g.drawImage(logoImg, 512 - w / 2, 300, w, h);
  }
  g.fillStyle = "#ffffff";
  g.textAlign = "center";
  g.textBaseline = "alphabetic";
  g.font = '400 470px "Bebas Neue", Impact, sans-serif';
  g.fillText("3,000", 512, 1420);
  g.font = '400 170px "Bebas Neue", Impact, sans-serif';
  g.fillStyle = "#e9c46a";
  g.fillText("FOLLOWERS", 512, 1640);
  g.font = '800 64px Inter, Arial, sans-serif';
  g.fillStyle = "rgba(255,255,255,0.8)";
  g.fillText("THANK YOU", 512, 1810);
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  tx.anisotropy = 16;
  return tx;
}

function woodTexture() {
  const S = 2048; // = 200 cm
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  const rnd = mulberry32(5);
  const plank = S / 16; // 12.5 cm planks, running along z
  for (let p = 0; p < 16; p++) {
    let y = -rnd() * S;
    while (y < S) {
      const len = (0.35 + rnd() * 0.75) * S;
      const hue = 30 + rnd() * 6;
      const light = 50 + rnd() * 9;
      g.fillStyle = `hsl(${hue}, ${44 + rnd() * 10}%, ${light}%)`;
      g.fillRect(p * plank, y, plank, len);
      // grain
      for (let k = 0; k < 26; k++) {
        const x0 = p * plank + rnd() * plank;
        g.strokeStyle = `hsla(${hue - 4}, 45%, ${light - 12 - rnd() * 10}%, ${0.08 + rnd() * 0.16})`;
        g.lineWidth = 0.6 + rnd() * 1.8;
        g.beginPath();
        const ph = rnd() * 6.28;
        const amp = 1 + rnd() * 5;
        for (let yy = y; yy <= y + len; yy += 16) {
          const xx = x0 + Math.sin(yy * 0.004 + ph) * amp + Math.sin(yy * 0.017 + ph * 2) * amp * 0.3;
          if (yy === y) g.moveTo(xx, yy);
          else g.lineTo(xx, yy);
        }
        g.stroke();
      }
      // end joint
      g.fillStyle = "rgba(60,35,15,0.55)";
      g.fillRect(p * plank, y, plank, 2);
      y += len;
    }
    // long seam
    g.fillStyle = "rgba(55,32,14,0.6)";
    g.fillRect(p * plank, 0, 2, S);
  }
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
  return tx;
}

function softDot() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  const tx = new THREE.CanvasTexture(c);
  return tx;
}

// ---------------- overlay ----------------
function setFx(el, opacity, y = 0, scale = 1) {
  if (!el) return;
  el.style.opacity = opacity.toFixed(3);
  el.style.transform = `translateY(${y.toFixed(2)}px) scale(${scale.toFixed(3)})`;
}

export default function MapleDominoAd({
  intro = "IT STARTS WITH ONE.",
  label = "FOLLOWERS",
  outro1 = "ONE BY ONE,",
  outro2 = "YOU GOT US HERE.",
  thanks = "THANK YOU",
  signoff = "SEE YOU ON THE MATS",
  site = "maplebjj.com",
}) {
  const mountRef = React.useRef(null);
  const refs = {
    intro: React.useRef(null),
    count: React.useRef(null),
    num: React.useRef(null),
    outro: React.useRef(null),
    foot: React.useRef(null),
  };

  React.useEffect(() => {
    const renderMode = new URLSearchParams(window.location.search).get("render") === "1";
    const mount = mountRef.current;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const BG = new THREE.Color("#0f0a07");
    scene.background = BG;
    scene.fog = new THREE.Fog(BG, 300, 1400);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.24;

    const camera = new THREE.PerspectiveCamera(40, W / H, 0.4, 6000);

    // ---- lights ----
    const key = new THREE.SpotLight("#fff1dc", 2.7, 0, 0.62, 0.8, 0);
    key.position.set(-260, 620, 180);
    key.target.position.set(0, 0, -40);
    key.castShadow = true;
    key.shadow.mapSize.set(4096, 4096);
    key.shadow.bias = -0.00015;
    key.shadow.normalBias = 0.04;
    key.shadow.camera.near = 300;
    key.shadow.camera.far = 1200;
    key.shadow.radius = 4;
    scene.add(key, key.target);
    scene.add(new THREE.HemisphereLight("#ffe6c8", "#2a170a", 0.35));
    const rim = new THREE.DirectionalLight("#bcd2ff", 0.55);
    rim.position.set(300, 120, -500);
    scene.add(rim);

    // ---- floor ----
    const wood = woodTexture();
    wood.anisotropy = renderer.capabilities.getMaxAnisotropy();
    wood.repeat.set(20, 20);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(4000, 4000),
      new THREE.MeshPhysicalMaterial({ map: wood, roughness: 0.55, clearcoat: 0.22, clearcoatRoughness: 0.45 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // ---- dominoes ----
    const { dom, nSmall } = buildRun();
    const sched = schedule(dom, nSmall);
    const rnd = mulberry32(3000);

    const bodyGeo = new RoundedBoxGeometry(TH, DH, DW, 3, 0.13);
    const faceGeo = new THREE.PlaneGeometry(DW - 0.3, DH - 0.3);
    const bodyMat = new THREE.MeshPhysicalMaterial({ color: NAVY, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1 });
    const faceMats = Array.from({ length: 12 }, () =>
      new THREE.MeshPhysicalMaterial({
        map: faceTexture(Math.floor(rnd() * 7), Math.floor(rnd() * 7)),
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      })
    );
    const logoImg = new Image();
    const giantMat = new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1 });

    const pivots = dom.map((d, i) => {
      const pivot = new THREE.Group();
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.set(-TH / 2, DH / 2, 0);
      body.castShadow = true;
      body.receiveShadow = true;
      const front = new THREE.Mesh(faceGeo, faceMats[Math.floor(rnd() * faceMats.length)]);
      front.position.set(0.004, DH / 2, 0);
      front.rotation.y = Math.PI / 2;
      const back = new THREE.Mesh(faceGeo, d.giant ? giantMat : faceMats[Math.floor(rnd() * faceMats.length)]);
      back.position.set(-TH - 0.004, DH / 2, 0);
      back.rotation.y = -Math.PI / 2;
      pivot.add(body, front, back);
      const fx = d.x + d.tx * (TH * d.m) / 2;
      const fz = d.z + d.tz * (TH * d.m) / 2;
      pivot.position.set(fx, 0, fz);
      pivot.rotation.order = "YZX";
      pivot.rotation.y = Math.atan2(-d.tz, d.tx);
      // tiny irregularity, like a hand set them
      pivot.rotation.y += (rnd() - 0.5) * 0.06 * (d.growth ? 0.2 : 1);
      pivot.scale.setScalar(d.m);
      scene.add(pivot);
      return pivot;
    });
    const giant = dom.length - 1;

    // ---- dust on the giant's landing ----
    const dotTex = softDot();
    const dust = Array.from({ length: 34 }, (_, i) => {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTex, color: "#d9c3a5", transparent: true, opacity: 0, depthWrite: false }));
      const a = (i / 34) * Math.PI * 2;
      sp.userData = { a, r: 0.6 + rnd() * 0.5, s: 0.7 + rnd() * 0.8 };
      scene.add(sp);
      return sp;
    });

    // ---- camera poses ----
    const P = new THREE.Vector3();
    const T = new THREE.Vector3();
    const U = new THREE.Vector3();
    const tmp = new THREE.Vector3();

    function frontAt(t) {
      // fractional position of the wave front along the run
      const { start, hit } = sched;
      let lo = 0;
      let hi = dom.length - 1;
      if (t <= start[0]) return { x: dom[0].x, z: dom[0].z, tx: dom[0].tx, tz: dom[0].tz, i: 0 };
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (start[mid] <= t) lo = mid;
        else hi = mid - 1;
      }
      const i = Math.min(lo, dom.length - 2);
      const f = clamp01((t - start[i]) / (hit[i] - start[i]));
      const a = dom[i];
      const b = dom[i + 1];
      return { x: lerp(a.x, b.x, f), z: lerp(a.z, b.z, f), tx: lerp(a.tx, b.tx, f), tz: lerp(a.tz, b.tz, f), i: i + f };
    }
    function smoothFront(t) {
      let x = 0, z = 0, tx = 0, tz = 0, i = 0;
      const K = 9;
      for (let k = 0; k < K; k++) {
        const f = frontAt(t + (k / (K - 1) - 0.5) * 900);
        x += f.x; z += f.z; tx += f.tx; tz += f.tz; i += f.i;
      }
      const L = Math.hypot(tx, tz) || 1;
      return { x: x / K, z: z / K, tx: tx / L, tz: tz / L, i: i / K };
    }

    const growthStart = sched.start[nSmall];
    const giantStart = sched.start[giant];
    const giantLand = sched.hit[giant];
    const T_A = 2100; // macro -> tracking
    const T_C = growthStart - 600; // tracking -> growth chain
    const T_D0 = giantLand + 500; // crane up
    const T_D1 = T_D0 + 2100;
    const END_MS = T_D1 + 2900;
    const LEAF_CZ = -92;

    function poseA(t, out) {
      const d0 = dom[0];
      const k = ss(0, T_A + 600, t);
      out.pos.set(d0.x + 3.2 - k * 1.2, 4.2 + k * 1.6, d0.z + 22 - k * 7);
      out.tgt.set(d0.x - 1.2, 2.2, d0.z - 60);
      out.up.set(0, 1, 0);
      out.fov = 34;
    }
    function poseB(t, out) {
      const f = smoothFront(t);
      const prog = clamp01((t - T_A) / (T_C - T_A));
      const back = lerp(26, 62, prog);
      const height = lerp(9, 46, prog);
      // sit outside the leaf, looking across the front
      let ox = f.x - 0;
      let oz = f.z - (-90);
      const ol = Math.hypot(ox, oz) || 1;
      ox /= ol;
      oz /= ol;
      const side = lerp(14, 40, prog);
      out.pos.set(f.x - f.tx * back + ox * side, height, f.z - f.tz * back + oz * side);
      out.tgt.set(f.x + f.tx * 22, 1.5, f.z + f.tz * 22);
      out.up.set(0, 1, 0);
      out.fov = lerp(36, 44, prog);
    }
    function poseC(t, out) {
      const k = ss(T_C, T_D0, t);
      const gz = dom[giant].z;
      out.pos.set(lerp(62, 92, k), lerp(26, 70, k), lerp(dom[nSmall].z + 30, gz + 60, k));
      out.tgt.set(0, lerp(4, 10, k), lerp(dom[nSmall].z - 30, gz - 25, k));
      out.up.set(0, 1, 0);
      out.fov = 42;
    }
    function poseD(t, out) {
      const k = (t - T_D1) / 1000;
      out.pos.set(0, 860 - k * 18, LEAF_CZ + 0.01);
      out.tgt.set(0, 0, LEAF_CZ);
      out.up.set(0, 0, -1);
      out.fov = 40;
    }
    const pa = { pos: new THREE.Vector3(), tgt: new THREE.Vector3(), up: new THREE.Vector3(), fov: 40 };
    const pb = { pos: new THREE.Vector3(), tgt: new THREE.Vector3(), up: new THREE.Vector3(), fov: 40 };
    function blend(a, b, k) {
      a.pos.lerp(b.pos, k);
      a.tgt.lerp(b.tgt, k);
      a.up.lerp(b.up, k).normalize();
      a.fov = lerp(a.fov, b.fov, k);
    }
    function cameraAt(t) {
      if (t < T_A + 700) {
        poseA(t, pa);
        if (t > T_A) {
          poseB(t, pb);
          blend(pa, pb, easeIO(clamp01((t - T_A) / 700)));
        }
      } else if (t < T_C + 900) {
        poseB(t, pa);
        if (t > T_C) {
          poseC(t, pb);
          blend(pa, pb, easeIO(clamp01((t - T_C) / 900)));
        }
      } else if (t < T_D0) {
        poseC(t, pa);
      } else {
        poseC(Math.min(t, T_D0), pa);
        poseD(Math.max(t, T_D1), pb);
        const k = easeIO(clamp01((t - T_D0) / (T_D1 - T_D0)));
        // arc up rather than a straight line
        blend(pa, pb, k);
        pa.pos.y += Math.sin(k * Math.PI) * 60;
      }
      // the giant hits the floor
      const sh = t > giantLand ? 1.4 * Math.exp(-(t - giantLand) / 320) : 0;
      if (sh > 0.01) {
        pa.pos.x += Math.sin(t * 0.09) * sh;
        pa.pos.y += Math.cos(t * 0.077) * sh;
      }
      camera.position.copy(pa.pos);
      camera.up.copy(pa.up);
      camera.fov = pa.fov;
      camera.updateProjectionMatrix();
      camera.lookAt(pa.tgt);
      // fog follows the shot, so the pool of light always reads
      const dist = pa.pos.distanceTo(pa.tgt);
      scene.fog.near = dist * 1.1 + 60;
      scene.fog.far = dist * 2.8 + 300;
    }

    // ---- one frame ----
    function renderAt(t) {
      for (let i = 0; i < dom.length; i++) {
        const th = angleAt(dom[i], t, sched.start[i], sched.hit[i]);
        pivots[i].rotation.z = -th;
      }
      // dust
      const dt = t - giantLand;
      const gd = dom[giant];
      for (const sp of dust) {
        if (dt < 0) {
          sp.material.opacity = 0;
          continue;
        }
        const k = dt / 1400;
        const { a, r, s } = sp.userData;
        const L = DH * gd.m;
        // around the footprint of the fallen giant
        const cx = gd.x + Math.cos(a) * (DW * gd.m * 0.55 + r * 20 * k + 3);
        const cz = gd.z - L / 2 + Math.sin(a) * (L * 0.55 + r * 20 * k + 3);
        sp.position.set(cx, 2 + 8 * k * s, cz);
        sp.scale.setScalar((8 + 26 * k) * s);
        sp.material.opacity = 0.45 * (1 - clamp01(k)) * ss(0, 0.08, k);
      }
      cameraAt(t);
      renderer.render(scene, camera);

      // ---- overlay ----
      setFx(refs.intro.current, ss(250, 700, t) * (1 - ss(T_A - 300, T_A + 200, t)), (1 - ss(250, 900, t)) * 8);
      const fallen = Math.max(0, frontAt(t).i);
      const count = t >= giantLand ? 3000 : Math.min(2999, Math.round((3000 * fallen) / (dom.length - 1)));
      if (refs.num.current) refs.num.current.textContent = count.toLocaleString("en-US");
      const landed = ss(giantLand, giantLand + 250, t);
      setFx(refs.count.current, ss(T_A - 200, T_A + 300, t) * (1 - ss(T_D0 + 200, T_D0 + 900, t)), 0, 1 + 0.35 * landed * (1 - ss(giantLand + 250, giantLand + 700, t)) + 0.12 * landed);
      if (refs.count.current) refs.count.current.classList.toggle("md-gold", t >= giantLand);
      setFx(refs.outro.current, ss(T_D1 - 300, T_D1 + 400, t), (1 - ss(T_D1 - 300, T_D1 + 500, t)) * 10);
      setFx(refs.foot.current, ss(T_D1 + 900, T_D1 + 1500, t), (1 - ss(T_D1 + 900, T_D1 + 1600, t)) * 10);
    }

    let raf;
    let disposed = false;
    const ready = (async () => {
      try {
        await document.fonts.load('400 100px "Bebas Neue"');
        await document.fonts.load("800 40px Inter");
      } catch (e) { /* fonts are a nicety */ }
      await new Promise((res) => {
        logoImg.onload = res;
        logoImg.onerror = res;
        logoImg.src = mapleLogo;
      });
      giantMat.map = giantTexture(logoImg);
      giantMat.needsUpdate = true;
    })();

    ready.then(() => {
      if (disposed) return;
      renderAt(0);
      if (renderMode) {
        window.__renderAt = (ms) => renderAt(ms);
        window.__dominoEnd = END_MS;
        window.__dominoHits = sched.hit.map((h, i) => ({ t: Math.round(h), m: dom[i].m, giant: !!dom[i].giant }));
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
    <div className="md-stage">
      <div className="md-canvas" ref={mountRef} />
      <div className="md-vignette" aria-hidden />

      <div className="md-intro" ref={refs.intro}>{intro}</div>

      <div className="md-count" ref={refs.count}>
        <div className="md-num" ref={refs.num}>0</div>
        <div className="md-label">{label}</div>
      </div>

      <div className="md-outro" ref={refs.outro}>
        <img src={mapleLogo} alt="Maple Jiu Jitsu" />
        <div className="md-o1">{outro1}</div>
        <div className="md-o2">{outro2}</div>
      </div>

      <div className="md-foot" ref={refs.foot}>
        <div className="md-thanks">{thanks}</div>
        <div className="md-sign">{signoff}</div>
        <div className="md-site">{site}</div>
      </div>
    </div>
  );
}
