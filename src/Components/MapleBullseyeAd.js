// MapleBullseyeAd.js — Maple Jiu Jitsu, 3,000 followers: an arrow, a bullseye.
//
// AIM: point-of-view down a nocked arrow at a target 30 m away on a range
// at golden hour. Release: the arrow leaves, the camera chases it and swings
// to the side in bullet time (shaft flexing, fletching spinning, mown grass
// rushing under it) while FOLLOWERS counts the distance. Cut to the target:
// it lands dead centre on a Maple leaf in the X ring, straw bursts, the
// shaft shudders. BULLSEYE.
//
// three.js, a pure function of time: ?render=1 hands the clock to
// tools/record-frames.js via window.__renderAt.
import React from "react";
import * as THREE from "three";
import "../Stylesheets/MapleBullseyeAd.css";

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
const T_RELEASE = 1900;
const T_SIDE = 5050; // cut to the target
const T_HIT = 6150;
const T_FRONT0 = T_HIT + 650;
const T_FRONT1 = T_FRONT0 + 1700;
const T_BULL = T_HIT + 250;
const T_THANKS = T_FRONT1 + 200;
const END_MS = T_THANKS + 3200;

// ---------------- the range (metres) ----------------
const DIST = 30;
const TARGET = new THREE.Vector3(0, 1.3, -DIST);
const TILT = -0.2; // target leans back
const FACE_R = 0.61;
const BOSS_R = 0.75;
const ARROW_L = 0.76;
const START_TIP = new THREE.Vector3(0, 1.46, -ARROW_L + 0.02);
const PEN = 0.11; // how far the point buries itself

// arrow tip along the flight, as a function of distance fraction u
const faceNormal = new THREE.Vector3(0, -Math.sin(TILT), Math.cos(TILT));
const ENTRY = TARGET.clone();
function tipAt(u) {
  const p = START_TIP.clone().lerp(ENTRY, u);
  p.y += Math.sin(Math.PI * u) * 0.22;
  return p;
}
function dirAt(u) {
  const a = tipAt(Math.max(0, u - 0.002));
  const b = tipAt(Math.min(1, u + 0.002));
  return b.sub(a).normalize();
}
// flight progress: a hard launch, then slow motion all the way in
function flightU(t) {
  if (t <= T_RELEASE) return 0;
  if (t >= T_HIT) return 1;
  const k = (t - T_RELEASE) / (T_HIT - T_RELEASE);
  // first 6% of the time covers 12% of the distance: the punch off the string
  return k < 0.06 ? (k / 0.06) ** 1.6 * 0.12 : 0.12 + 0.88 * ((k - 0.06) / 0.94);
}

// ---------------- textures ----------------
const HALF = [
  [0.05, 0.1], [0.42, 0.04], [0.36, 0.18], [0.62, 0.4], [0.5, 0.44], [0.56, 0.62],
  [0.36, 0.52], [0.34, 0.6], [0.24, 0.52], [0.28, 0.82], [0.16, 0.76], [0, 1.0],
];
function faceTexture() {
  const S = 2048;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  const rnd = mulberry32(4);
  // straw showing round the paper face
  g.fillStyle = "#c9a35d";
  g.fillRect(0, 0, S, S);
  for (let k = 0; k < 9000; k++) {
    g.strokeStyle = `hsla(${38 + rnd() * 10}, ${40 + rnd() * 25}%, ${45 + rnd() * 25}%, 0.5)`;
    g.lineWidth = 1 + rnd() * 2;
    const x = rnd() * S;
    const y = rnd() * S;
    const a = rnd() * Math.PI;
    const l = 20 + rnd() * 70;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    g.stroke();
  }
  const C = S / 2;
  const R = (FACE_R / BOSS_R) * C;
  const zones = ["#f4f1e8", "#f4f1e8", "#1c1c1e", "#1c1c1e", "#2a8fd6", "#2a8fd6", "#e2312e", "#e2312e", "#ffd31c", "#ffd31c"];
  for (let z = 0; z < 10; z++) {
    const r = R * (1 - z / 10);
    g.fillStyle = zones[z];
    g.beginPath();
    g.arc(C, C, r, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = z === 2 || z === 3 ? "rgba(255,255,255,0.75)" : "rgba(20,20,20,0.7)";
    g.lineWidth = 3;
    g.stroke();
  }
  // X ring
  g.strokeStyle = "rgba(20,20,20,0.6)";
  g.lineWidth = 2;
  g.beginPath();
  g.arc(C, C, R * 0.05, 0, Math.PI * 2);
  g.stroke();
  // the Maple leaf, dead centre
  const L = R * 0.075;
  g.fillStyle = "#13234b";
  g.beginPath();
  const pts = [...HALF, ...HALF.slice(0, -1).reverse().map(([x, y]) => [-x, y])];
  pts.forEach(([x, y], i) => {
    const X = C + x * L * 1.6;
    const Y = C - (y - 0.45) * L * 1.6;
    if (i === 0) g.moveTo(X, Y);
    else g.lineTo(X, Y);
  });
  g.closePath();
  g.fill();
  g.fillRect(C - L * 0.04, C + 0.35 * L * 1.6, L * 0.08, L * 0.35);
  // ring numbers, small, at the 3 o'clock line
  g.font = "bold 34px Arial";
  g.textAlign = "center";
  g.textBaseline = "middle";
  for (let z = 0; z < 10; z++) {
    const r = R * (1 - (z + 0.5) / 10);
    g.fillStyle = z === 2 || z === 3 ? "#f4f1e8" : "#1c1c1e";
    g.fillText(String(z + 1), C + r, C);
  }
  // paper: a little tooth and a few old holes
  for (let k = 0; k < 40000; k++) {
    g.fillStyle = `rgba(${rnd() < 0.5 ? "0,0,0" : "255,255,255"},${rnd() * 0.05})`;
    g.fillRect(rnd() * S, rnd() * S, 2, 2);
  }
  for (let k = 0; k < 26; k++) {
    const a = rnd() * Math.PI * 2;
    const r = R * (0.15 + rnd() * 0.8);
    g.fillStyle = "rgba(30,20,10,0.75)";
    g.beginPath();
    g.arc(C + Math.cos(a) * r, C + Math.sin(a) * r, 5 + rnd() * 3, 0, Math.PI * 2);
    g.fill();
  }
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  tx.anisotropy = 16;
  return tx;
}
function strawTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 256;
  const g = c.getContext("2d");
  const rnd = mulberry32(8);
  g.fillStyle = "#b8914c";
  g.fillRect(0, 0, 1024, 256);
  for (let k = 0; k < 6000; k++) {
    g.strokeStyle = `hsla(${36 + rnd() * 12}, ${35 + rnd() * 30}%, ${35 + rnd() * 30}%, 0.6)`;
    g.lineWidth = 1 + rnd() * 2;
    const x = rnd() * 1024;
    const y = rnd() * 256;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + (rnd() - 0.5) * 10, y + (rnd() - 0.5) * 80);
    g.stroke();
  }
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  tx.wrapS = THREE.RepeatWrapping;
  return tx;
}
function grassTexture() {
  // 8 m square: four 2 m mowing stripes running down the range
  const S = 2048;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  const rnd = mulberry32(12);
  for (let b = 0; b < 4; b++) {
    g.fillStyle = b % 2 ? "#5e8a2e" : "#6f9a36";
    g.fillRect((b * S) / 4, 0, S / 4, S);
  }
  for (let k = 0; k < 160000; k++) {
    const x = rnd() * S;
    const y = rnd() * S;
    g.fillStyle = `hsla(${78 + rnd() * 26}, ${40 + rnd() * 30}%, ${22 + rnd() * 30}%, ${0.25 + rnd() * 0.35})`;
    g.fillRect(x, y, 1 + rnd() * 2, 3 + rnd() * 7);
  }
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
  return tx;
}

function setFx(el, opacity, y = 0, scale = 1) {
  if (!el) return;
  el.style.opacity = opacity.toFixed(3);
  el.style.transform = `translateY(${y.toFixed(2)}px) scale(${scale.toFixed(3)})`;
}

export default function MapleBullseyeAd({
  aim = "AIM.",
  label = "FOLLOWERS",
  bull = "BULLSEYE.",
  thanks = "THANK YOU",
  signoff = "SEE YOU ON THE MATS",
  site = "maplebjj.com",
}) {
  const mountRef = React.useRef(null);
  const refs = {
    aim: React.useRef(null),
    count: React.useRef(null),
    num: React.useRef(null),
    bull: React.useRef(null),
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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#f2d4ad", 28, 115);
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.01, 1000);

    // sky: golden hour gradient on a big dome
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(500, 32, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {},
        vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader:
          "varying vec3 vP; void main(){ float h = clamp(vP.y, -0.1, 1.0);" +
          " vec3 hor = vec3(1.0, 0.82, 0.6); vec3 mid = vec3(0.62, 0.74, 0.9); vec3 top = vec3(0.28, 0.45, 0.75);" +
          " vec3 c = mix(hor, mid, smoothstep(0.0, 0.18, h)); c = mix(c, top, smoothstep(0.18, 0.7, h));" +
          " gl_FragColor = vec4(c, 1.0); }",
      })
    );
    scene.add(sky);

    // ---- light ----
    const sun = new THREE.DirectionalLight("#ffd8a8", 3.0);
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    sun.shadow.bias = -0.0002;
    sun.shadow.normalBias = 0.01;
    scene.add(sun, sun.target);
    scene.add(new THREE.HemisphereLight("#cfe0ff", "#4b5a2a", 0.9));

    // ---- ground ----
    const grass = grassTexture();
    grass.anisotropy = renderer.capabilities.getMaxAnisotropy();
    grass.repeat.set(50, 50);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ map: grass, roughness: 0.95 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    // shooting line
    const line = new THREE.Mesh(new THREE.PlaneGeometry(14, 0.06), new THREE.MeshStandardMaterial({ color: "#f4f1e8", roughness: 0.9 }));
    line.rotation.x = -Math.PI / 2;
    line.position.set(0, 0.003, -0.1);
    scene.add(line);

    // ---- tree line ----
    const rnd = mulberry32(3000);
    const treeGeo = new THREE.SphereGeometry(1, 14, 10);
    const trees = new THREE.InstancedMesh(treeGeo, new THREE.MeshStandardMaterial({ color: "#2f4a22", roughness: 1 }), 260);
    const dm = new THREE.Object3D();
    const tc = new THREE.Color();
    for (let i = 0; i < 260; i++) {
      const r = 2 + rnd() * 3.5;
      dm.position.set((rnd() - 0.5) * 160, r * 0.8 + rnd() * 2, -62 - rnd() * 22);
      dm.scale.set(r * (0.8 + rnd() * 0.5), r * (1 + rnd() * 0.6), r);
      dm.updateMatrix();
      trees.setMatrixAt(i, dm.matrix);
      trees.setColorAt(i, tc.setHSL(0.24 + rnd() * 0.06, 0.4, 0.15 + rnd() * 0.1));
    }
    scene.add(trees);

    // ---- targets ----
    const faceTx = faceTexture();
    const straw = strawTexture();
    straw.repeat.set(3, 1);
    const strawMat = new THREE.MeshStandardMaterial({ map: straw, roughness: 1 });
    const faceMat = new THREE.MeshStandardMaterial({ map: faceTx, roughness: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ color: "#6b4a2b", roughness: 0.85 });
    function makeTarget(x) {
      const g = new THREE.Group();
      const tilt = new THREE.Group();
      tilt.rotation.x = TILT;
      const boss = new THREE.Mesh(new THREE.CylinderGeometry(BOSS_R, BOSS_R, 0.34, 72, 1), [strawMat, faceMat, strawMat]);
      boss.rotation.x = Math.PI / 2;
      boss.rotation.y = Math.PI; // leaf upright
      boss.position.z = -0.17;
      boss.castShadow = true;
      boss.receiveShadow = true;
      tilt.add(boss);
      g.add(tilt);
      // tripod
      for (const [lx, lz, rz, rx] of [[-0.55, -0.15, 0.18, 0.12], [0.55, -0.15, -0.18, 0.12], [0, -0.75, 0, -0.42]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.9, 0.05), woodMat);
        leg.position.set(lx, -0.35, lz);
        leg.rotation.set(rx, 0, rz);
        leg.castShadow = true;
        g.add(leg);
      }
      g.position.set(x, TARGET.y, TARGET.z);
      scene.add(g);
      return { g, tilt };
    }
    const target = makeTarget(0);
    makeTarget(-3.6);
    makeTarget(3.6);

    // ---- bow riser at the start ----
    const riser = new THREE.Group();
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.62, 0.05), new THREE.MeshPhysicalMaterial({ color: "#5a3820", roughness: 0.35, clearcoat: 0.8 }));
    grip.castShadow = true;
    riser.add(grip);
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.012, 0.04), new THREE.MeshStandardMaterial({ color: "#111", roughness: 0.6 }));
    shelf.position.set(0.02, -0.005, 0);
    riser.add(shelf);
    riser.position.set(-0.024, START_TIP.y + 0.004, START_TIP.z + 0.12);
    scene.add(riser);

    // ---- the arrow (built along +z: nock at 0, point at ARROW_L) ----
    const arrow = new THREE.Group();
    scene.add(arrow);
    const carbon = new THREE.MeshPhysicalMaterial({ color: "#151517", roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.3 });
    let shaft = null;
    const SEG = 28;
    function buildShaft(bend) {
      const pts = [];
      for (let i = 0; i <= SEG; i++) {
        const s = i / SEG;
        const [bx, by] = bend(s);
        pts.push(new THREE.Vector3(bx, by, s * (ARROW_L - 0.04)));
      }
      const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.0038, 10, false);
      if (shaft) {
        shaft.geometry.dispose();
        shaft.geometry = geo;
      } else {
        shaft = new THREE.Mesh(geo, carbon);
        shaft.castShadow = true;
        arrow.add(shaft);
      }
      return pts;
    }
    buildShaft(() => [0, 0]);
    const point = new THREE.Mesh(new THREE.ConeGeometry(0.0045, 0.045, 12), new THREE.MeshStandardMaterial({ color: "#b9bec6", metalness: 0.9, roughness: 0.25 }));
    point.rotation.x = Math.PI / 2;
    arrow.add(point);
    const nock = new THREE.Mesh(new THREE.CylinderGeometry(0.0042, 0.0042, 0.02, 10), new THREE.MeshStandardMaterial({ color: "#13234b", roughness: 0.4 }));
    nock.rotation.x = Math.PI / 2;
    arrow.add(nock);
    const tail = new THREE.Group(); // fletching + cresting ride the tail of the shaft
    arrow.add(tail);
    const vaneShape = new THREE.Shape();
    vaneShape.moveTo(0, 0);
    vaneShape.quadraticCurveTo(0.012, 0.018, 0.07, 0.006);
    vaneShape.lineTo(0.075, 0);
    vaneShape.closePath();
    const vaneGeo = new THREE.ShapeGeometry(vaneShape, 12);
    const vaneCols = ["#ffc93c", "#13234b", "#ffc93c"];
    vaneCols.forEach((c, i) => {
      const holder = new THREE.Group();
      holder.rotation.z = (i * Math.PI * 2) / 3;
      const vane = new THREE.Mesh(vaneGeo, new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, side: THREE.DoubleSide }));
      vane.rotation.y = -Math.PI / 2;
      vane.position.set(0, 0.0036, 0.025);
      vane.castShadow = true;
      holder.add(vane);
      tail.add(holder);
    });
    for (const [z, c] of [[0.115, "#ffc93c"], [0.125, "#13234b"], [0.135, "#ffc93c"]]) {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.0041, 0.0041, 0.008, 10), new THREE.MeshStandardMaterial({ color: c, roughness: 0.4 }));
      ring.rotation.x = Math.PI / 2;
      ring.position.z = z;
      tail.add(ring);
    }

    // ---- straw burst ----
    const BITS = 90;
    const bits = new THREE.InstancedMesh(new THREE.BoxGeometry(0.003, 0.003, 0.05), new THREE.MeshStandardMaterial({ roughness: 1 }), BITS);
    bits.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    bits.frustumCulled = false;
    const bitData = Array.from({ length: BITS }, (_, i) => {
      const a = rnd() * Math.PI * 2;
      const sp = 0.6 + rnd() * 1.8;
      bits.setColorAt(i, tc.set(i % 9 === 0 ? "#ffd31c" : i % 13 === 0 ? "#e2312e" : `hsl(${38 + rnd() * 10}, 45%, ${45 + rnd() * 20}%)`));
      return { vx: Math.cos(a) * sp * 0.6, vy: Math.sin(a) * sp * 0.6 + 0.4, vz: 0.6 + rnd() * 1.6, rx: rnd() * 20, ry: rnd() * 20, life: 0.8 + rnd() * 0.9 };
    });
    bits.instanceColor.needsUpdate = true;
    scene.add(bits);
    const hidden = new THREE.Matrix4().makeScale(0, 0, 0);

    // ---- arrow pose at time t ----
    const tmp = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    const hitDir = dirAt(1);
    const tipFinal = ENTRY.clone().addScaledVector(hitDir, PEN);
    function arrowAt(t) {
      const u = flightU(t);
      let tip, dir;
      if (t < T_HIT) {
        tip = tipAt(u);
        dir = dirAt(u);
      } else {
        tip = tipFinal.clone();
        dir = hitDir.clone();
      }
      // breathing sway while aiming
      if (t < T_RELEASE) {
        tip.x += Math.sin(t / 700) * 0.002;
        tip.y += Math.sin(t / 900) * 0.0015;
      }
      const nockPos = tip.clone().addScaledVector(dir, -ARROW_L);
      arrow.position.copy(nockPos);
      arrow.up.copy(up);
      arrow.lookAt(tmp.copy(nockPos).add(dir));
      // spin from the fletching
      const spin = t > T_RELEASE ? Math.min(t, T_HIT) - T_RELEASE : 0;
      arrow.rotateZ(spin * 0.0016);

      // archer's paradox in flight, cantilever shudder in the target
      let bend;
      if (t > T_RELEASE && t < T_HIT) {
        const tt = (t - T_RELEASE) / 1000;
        const amp = 0.012 * Math.exp(-tt * 0.9);
        const w = Math.sin(tt * Math.PI * 2 * 2.2);
        bend = (s) => [Math.sin(Math.PI * s) * amp * w - amp * w * 0.5 * (1 - s), 0];
      } else if (t >= T_HIT) {
        const tt = (t - T_HIT) / 1000;
        const amp = 0.05 * Math.exp(-tt * 2.6);
        const wx = Math.sin(tt * Math.PI * 2 * 4.2);
        const wy = Math.cos(tt * Math.PI * 2 * 4.2 + 0.6) * 0.5;
        bend = (s) => {
          const f = (1 - s) * (1 - s);
          return [f * amp * wx, f * amp * wy];
        };
      } else bend = () => [0, 0];
      const pts = buildShaft(bend);
      point.position.set(pts[SEG].x, pts[SEG].y, ARROW_L - 0.022);
      nock.position.set(pts[0].x, pts[0].y, 0.006);
      tail.position.set(pts[2].x, pts[2].y, 0);
      return { tip, dir, u };
    }

    // ---- camera ----
    const P = new THREE.Vector3();
    const L = new THREE.Vector3();
    const P2 = new THREE.Vector3();
    const L2 = new THREE.Vector3();
    const frontPos = new THREE.Vector3(0, 1.36, -DIST + 4.3);
    function cameraAt(t, a) {
      const mid = a.tip.clone().addScaledVector(a.dir, -ARROW_L * 0.5);
      if (t < T_SIDE) {
        // A: point of view down the arrow; B: chase, swinging round to the side
        const aimPos = new THREE.Vector3(0.0, 1.528, 0.26);
        const aimLook = TARGET.clone();
        if (t < T_RELEASE + 120) {
          P.copy(aimPos);
          L.copy(aimLook);
        } else {
          const k = easeIO(clamp01((t - T_RELEASE - 120) / 900));
          const orbit = lerp(0.06, 0.4, easeIO(clamp01((t - T_RELEASE - 300) / 2400)));
          const side = new THREE.Vector3().crossVectors(a.dir, up).normalize();
          const dist = lerp(0.5, 0.74, easeIO(clamp01((t - T_RELEASE - 150) / 1800)));
          P2.copy(mid)
            .addScaledVector(a.dir, -Math.cos(orbit) * dist)
            .addScaledVector(side, Math.sin(orbit) * dist)
            .addScaledVector(up, 0.06 + 0.07 * Math.sin(orbit));
          L2.copy(mid).addScaledVector(a.dir, 0.14);
          P.copy(aimPos).lerp(P2, k);
          L.copy(aimLook).lerp(L2, k);
        }
        camera.fov = 38;
      } else {
        // C: beside the target, watching it come in; D: square on
        const cPos = new THREE.Vector3(0.42, 1.43, -DIST + 2.5);
        const lookC = new THREE.Vector3(-0.05, 1.3, -DIST);
        const k = easeIO(clamp01((t - T_FRONT0) / (T_FRONT1 - T_FRONT0)));
        P.copy(cPos).lerp(frontPos, k);
        L.copy(lookC).lerp(new THREE.Vector3(0, 1.33, -DIST), k);
        camera.fov = 40;
        // slow push after it settles
        P.z -= Math.max(0, t - T_FRONT1) * 0.00006;
      }
      const sh = t > T_HIT ? 0.012 * Math.exp(-(t - T_HIT) / 260) : 0;
      if (sh > 0.0005) {
        P.x += Math.sin(t * 0.11) * sh;
        P.y += Math.cos(t * 0.093) * sh;
      }
      camera.position.copy(P);
      camera.up.set(0, 1, 0);
      camera.updateProjectionMatrix();
      camera.lookAt(L);
      // shadows follow the action
      const focus = t < T_SIDE ? mid : TARGET;
      sun.position.set(focus.x - 14, focus.y + 9, focus.z + 12);
      sun.target.position.copy(focus);
      const sc = sun.shadow.camera;
      sc.left = -3; sc.right = 3; sc.top = 3; sc.bottom = -3; sc.near = 1; sc.far = 50;
      sc.updateProjectionMatrix();
    }

    // ---- frame ----
    const dummy = new THREE.Object3D();
    function renderAt(t) {
      const a = arrowAt(t);
      riser.visible = t < T_RELEASE + 120;
      // target jolt
      const j = t > T_HIT ? Math.exp(-(t - T_HIT) / 180) * Math.sin(((t - T_HIT) / 1000) * Math.PI * 2 * 5) : 0;
      target.tilt.rotation.x = TILT - 0.025 * j;
      target.g.position.z = TARGET.z - 0.012 * Math.max(0, j);
      // straw
      for (let i = 0; i < BITS; i++) {
        const b = bitData[i];
        const tt = (t - T_HIT) / 1000;
        if (tt < 0 || tt > b.life) {
          bits.setMatrixAt(i, hidden);
          continue;
        }
        dummy.position.set(ENTRY.x + b.vx * tt, ENTRY.y + b.vy * tt - 4.9 * tt * tt, ENTRY.z + b.vz * tt + 0.02);
        dummy.rotation.set(b.rx * tt, b.ry * tt, 0);
        const sc = 1 - tt / b.life;
        dummy.scale.set(sc, sc, sc);
        dummy.updateMatrix();
        bits.setMatrixAt(i, dummy.matrix);
      }
      bits.instanceMatrix.needsUpdate = true;
      cameraAt(t, a);
      renderer.render(scene, camera);

      // ---- overlay ----
      setFx(refs.aim.current, ss(250, 650, t) * (1 - ss(T_RELEASE - 250, T_RELEASE + 50, t)), (1 - ss(250, 800, t)) * 8);
      const n = Math.round(3000 * a.u);
      if (refs.num.current) refs.num.current.textContent = n.toLocaleString("en-US");
      const hit = ss(T_HIT, T_HIT + 200, t);
      setFx(refs.count.current, ss(T_RELEASE + 150, T_RELEASE + 550, t), 0, 1 + 0.3 * hit * (1 - ss(T_HIT + 200, T_HIT + 650, t)) + 0.1 * hit);
      if (refs.count.current) refs.count.current.classList.toggle("bx-gold", t >= T_HIT);
      setFx(refs.bull.current, ss(T_BULL, T_BULL + 250, t) * (1 - ss(T_THANKS - 400, T_THANKS, t)), 0, 1 + 0.4 * (1 - ss(T_BULL, T_BULL + 350, t)));
      setFx(refs.foot.current, ss(T_THANKS, T_THANKS + 600, t), (1 - ss(T_THANKS, T_THANKS + 700, t)) * 10);
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
        window.__bullEnd = END_MS;
        window.__bullMarks = { T_RELEASE, T_SIDE, T_HIT, T_FRONT0, T_THANKS, END_MS };
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
    <div className="bx-stage">
      <div className="bx-canvas" ref={mountRef} />
      <div className="bx-vignette" aria-hidden />
      <div className="bx-aim" ref={refs.aim}>{aim}</div>
      <div className="bx-count" ref={refs.count}>
        <div className="bx-num" ref={refs.num}>0</div>
        <div className="bx-label">{label}</div>
      </div>
      <div className="bx-bull" ref={refs.bull}>{bull}</div>
      <div className="bx-foot" ref={refs.foot}>
        <div className="bx-thanks">{thanks}</div>
        <div className="bx-sign">{signoff}</div>
        <div className="bx-site">{site}</div>
      </div>
    </div>
  );
}
