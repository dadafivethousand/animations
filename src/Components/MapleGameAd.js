// MapleGameAd.js — a Maple Jiu-Jitsu commercial played as open-world game
// footage (modern Leonida style: sunny Florida strip plaza, golden hour).
// An homage: no game logo, no game name.
//
//   0-3 s    drone shot swoops down to the player; mission title
//   3-10 s   third-person gameplay: he walks the sidewalk past palms and
//            parked cars, a text from Coach, minimap with the GPS route,
//            then turns into the yellow mission marker at the gym door
//   10-13 s  inside: he walks onto the mats; MISSION PASSED
//   13-18 s  end card
//
// Everything is a pure function of time; ?render=1 hands the clock to
// tools/record-frames.js via window.__renderAt.
import React from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import "../Stylesheets/MapleGameAd.css";
import mapleLogo from "../Images/maple-logo.png";
import mapleBjjLogo from "../Images/maple-bjj-logo.png";
import jjflLogo from "../Images/jiu-jitsu-for-life.png";

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
const T_BADGE = 350; // the publisher badge, on black
const T_DRONE = 1500; // the drone shot and the game's title card
const T_GAME = 3700; // drone lands behind the player, HUD up
const T_WALK = 3900;
const SPEED = 1.9; // m/s
// (the inside cut, mission passed and end card follow the arrival; see below)

// ---------------- the walk, as a path ----------------
// Down the sidewalk (-z), a left turn, and into the door on the left.
const FACADE_X = -3;
const DOOR_Z = -11;
const PATH = (() => {
  const pts = [];
  const push = (x, z) => pts.push(new THREE.Vector2(x, z));
  for (let z = 0.6; z > -9.3; z -= 0.1) push(0.4, z);
  const cx = -1.3;
  const cz = -9.3;
  const r = 1.7;
  for (let a = 0; a <= Math.PI / 2 + 1e-6; a += 0.02) push(cx + Math.cos(a) * r, cz - Math.sin(a) * r);
  for (let x = cx; x > -2.45; x -= 0.1) push(x, cz - r);
  // cumulative length
  const len = [0];
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + pts[i].distanceTo(pts[i - 1]));
  return { pts, len, total: len[len.length - 1] };
})();
function pathAt(s) {
  const { pts, len, total } = PATH;
  s = Math.max(0, Math.min(total - 1e-4, s));
  let lo = 0;
  let hi = len.length - 1;
  while (lo < hi - 1) {
    const m = (lo + hi) >> 1;
    if (len[m] <= s) lo = m;
    else hi = m;
  }
  const k = (s - len[lo]) / (len[hi] - len[lo] || 1);
  const a = pts[lo];
  const b = pts[hi];
  return { x: lerp(a.x, b.x, k), z: lerp(a.y, b.y, k), dx: b.x - a.x, dz: b.y - a.y };
}
// distance along the path at time t: ease into the walk, ease out at the marker
function walkS(t) {
  if (t < T_WALK) return 0;
  const T = (PATH.total / SPEED) * 1000 + 500;
  const k = clamp01((t - T_WALK) / T);
  // constant pace, eased in over the first step and out over the last
  const a = 0.06;
  const e = k < a ? (k * k) / (2 * a * (1 - a)) : k > 1 - a ? 1 - ((1 - k) * (1 - k)) / (2 * a * (1 - a)) : (k - a / 2) / (1 - a);
  return e * PATH.total;
}
const T_ARRIVE = T_WALK + (PATH.total / SPEED) * 1000 + 500;
// when he reaches the money on the walk
const T_PICK = (() => {
  for (let t = T_WALK; t < T_ARRIVE; t += 5) if (walkS(t) >= 6.8) return t;
  return T_ARRIVE;
})();
const T_INSIDE = T_ARRIVE + 250;
const T_PASSED = T_INSIDE + 800;
const T_END = T_INSIDE + 3000;
const END_MS = T_END + 4500;

// ---------------- canvas textures ----------------
function canvasTex(w, h, draw, { srgb = true, repeat = null } = {}) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  t.anisotropy = 8;
  return t;
}
function noise(g, w, h, n, a, rnd, light = true) {
  for (let i = 0; i < n; i++) {
    const v = rnd() < 0.5 ? 0 : 255;
    g.fillStyle = `rgba(${v},${v},${v},${rnd() * a})`;
    g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1 + rnd() * 2);
  }
}

export default function MapleGameAd({
  missionTop = "MAPLE JIU-JITSU",
  missionName = "TRAINING DAY",
  objective = ["Go to ", "Maple Jiu-Jitsu", "."],
  textFrom = "Coach",
  textBody = "Class starts in 5. Don't be late 🥋",
  coachPhoto = null,
  address = "20 CRANSTON PARK AVE",
  site = "maplebjj.com",
}) {
  const mountRef = React.useRef(null);
  const R = React.useRef({}).current;
  const ref = (k) => (el) => {
    R[k] = el;
  };

  React.useEffect(() => {
    const renderMode = new URLSearchParams(window.location.search).get("render") === "1";
    const mount = mountRef.current;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const rnd = mulberry32(6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.72;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#e9b083", 80, 280);
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.05, 600);

    // ---- sky and sun: late afternoon ----
    // A painted dome rather than a physical sky: the physical model goes
    // white at a low sun and that haze is the opposite of the saturated look
    // this wants. Deep blue overhead, peach at the horizon, a warm bloom
    // round the sun.
    const sunDir = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(72), THREE.MathUtils.degToRad(-128));
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: { sunDir: { value: sunDir } },
      vertexShader: "varying vec3 vD; void main(){ vD = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position,1.0); gl_Position = p.xyww; }",
      fragmentShader: [
        "uniform vec3 sunDir; varying vec3 vD;",
        "void main(){",
        "  float h = clamp(vD.y, -0.2, 1.0);",
        "  vec3 hor = vec3(1.0, 0.74, 0.52);",
        "  vec3 low = vec3(0.98, 0.62, 0.55);",
        "  vec3 mid = vec3(0.36, 0.6, 0.92);",
        "  vec3 top = vec3(0.12, 0.33, 0.72);",
        "  vec3 c = mix(hor, low, smoothstep(0.0, 0.05, h));",
        "  c = mix(c, mid, smoothstep(0.02, 0.14, h));",
        "  c = mix(c, top, smoothstep(0.14, 0.55, h));",
        "  float s = max(0.0, dot(normalize(vD), normalize(sunDir)));",
        "  c += vec3(1.0, 0.7, 0.4) * pow(s, 12.0) * 0.6 + vec3(1.0, 0.9, 0.7) * pow(s, 400.0) * 3.0;",
        "  gl_FragColor = vec4(c * 1.35, 1.0);",
        "}",
      ].join("\n"),
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(300, 48, 24), skyMat);
    scene.add(sky);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(300, 48, 24), skyMat));
    scene.environment = pmrem.fromScene(envScene, 0.02).texture;
    scene.environmentIntensity = 0.6;

    const sun = new THREE.DirectionalLight("#ffbf80", 4.6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    sun.shadow.bias = -0.0003;
    sun.shadow.normalBias = 0.03;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 120;
    scene.add(sun, sun.target);
    scene.add(new THREE.HemisphereLight("#8fb6ff", "#7a5a3c", 0.55));

    // ---- materials ----
    const M = (o) => new THREE.MeshStandardMaterial(o);
    const asphalt = canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = "#38383b";
      g.fillRect(0, 0, w, h);
      noise(g, w, h, 30000, 0.12, rnd);
    }, { repeat: [10, 60] });
    const concrete = canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = "#a99f90";
      g.fillRect(0, 0, w, h);
      noise(g, w, h, 20000, 0.07, rnd);
      g.fillStyle = "rgba(60,50,40,0.35)";
      g.fillRect(0, 0, w, 3);
      g.fillRect(0, 0, 3, h);
    }, { repeat: [3.5, 40] });
    const stucco = (hex) => canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = hex;
      g.fillRect(0, 0, w, h);
      noise(g, w, h, 8000, 0.06, rnd);
    }, { repeat: [6, 2] });

    // ---- ground: the plaza's parking lot ----
    // Strip plazas front onto their own lot, not the street: painted stalls,
    // cars nose-in to the walk, light poles down the drive aisle.
    const lot = new THREE.Mesh(new THREE.PlaneGeometry(40, 240), M({ map: asphalt, roughness: 0.93 }));
    lot.rotation.x = -Math.PI / 2;
    lot.position.set(23, 0, -40);
    lot.receiveShadow = true;
    scene.add(lot);
    const paint = M({ color: "#efece2", roughness: 0.8 });
    for (let i = 0; i < 44; i++) {
      const z = 14 - i * 2.75;
      for (const x0 of [3.5, 15.3]) {
        const line = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 0.11), paint);
        line.rotation.x = -Math.PI / 2;
        line.position.set(x0 + 2.7, 0.004, z);
        scene.add(line);
      }
    }
    const walk = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.16, 240), M({ map: concrete, roughness: 0.9 }));
    walk.position.set(0, 0.08, -40);
    walk.receiveShadow = true;
    scene.add(walk);
    const curb = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.18, 240), M({ color: "#bdb6aa", roughness: 0.8 }));
    curb.position.set(3.1, 0.09, -40);
    curb.castShadow = true;
    scene.add(curb);
    // light poles down the drive aisle
    const poleMat = M({ color: "#3a3d40", metalness: 0.6, roughness: 0.45 });
    for (let i = 0; i < 6; i++) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 8, 12), poleMat);
      pole.position.set(12.6, 4, 10 - i * 22);
      pole.castShadow = true;
      scene.add(pole);
      const head = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.18, 1.1, 2, 0.05), poleMat);
      head.position.set(12.6, 8, 10 - i * 22 + 0.4);
      head.castShadow = true;
      scene.add(head);
    }
    // a few bollards and a bin on the walk
    for (const z of [3.6, -5.2, -16.8]) {
      const bol = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.9, 16), M({ color: "#f2c037", roughness: 0.5 }));
      bol.position.set(2.75, 0.61, z);
      bol.castShadow = true;
      scene.add(bol);
    }
    const bin = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.25, 0.95, 20), M({ color: "#2d4a3a", roughness: 0.6 }));
    bin.position.set(2.5, 0.64, 1.4);
    bin.castShadow = true;
    scene.add(bin);

    // ---- the strip plaza ----
    const plaza = new THREE.Group();
    scene.add(plaza);
    const glassMat = new THREE.MeshPhysicalMaterial({ color: "#1d2a33", roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.42, envMapIntensity: 1.6 });
    const frameMat = M({ color: "#2b2d30", metalness: 0.7, roughness: 0.35 });
    // Neighbours in their real order: the dentist next door on this side,
    // the nail salon on the far side.
    const units = [
      // z0, z1, colour, sign, sign colour
      [16, 4, "#efe6d8", "", "#000"],
      [4, -6.8, "#e6eef2", "DENTIST", "#1f6fd1"],
      [-15.2, -25, "#f3e3dc", "NAILS", "#d6336c"],
      [-25, -37, "#ebe4d4", "", "#000"],
    ];
    const noFace = new THREE.MeshBasicMaterial({ visible: false });
    function unit(z0, z1, col, sign, isGym, signCol = "#e23b3b") {
      const w = z0 - z1;
      const sm = M({ map: stucco(col), roughness: 0.92 });
      // box faces: +x is the shopfront; the gym leaves it open behind its glass
      const body = new THREE.Mesh(new THREE.BoxGeometry(10, 5.2, w), isGym ? [noFace, sm, sm, sm, sm, sm] : sm);
      body.position.set(FACADE_X - 5, 2.6, (z0 + z1) / 2);
      body.castShadow = true;
      body.receiveShadow = true;
      plaza.add(body);
      // fascia / sign band
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.1, w - 0.3), M({ color: isGym ? "#13234b" : "#ffffff", roughness: 0.6 }));
      band.position.set(FACADE_X + 0.2, 4.35, (z0 + z1) / 2);
      band.castShadow = true;
      plaza.add(band);
      if (!isGym) {
        // a shopfront: a lit room behind glass, aluminium framing, a door,
        // and the shop's name on the glass
        const zc = (z0 + z1) / 2;
        const gw = w - 1.0;
        const interior = canvasTex(1024, 300, (g, cw, ch) => {
          const lit = sign === "DENTIST" ? ["#eef6f8", "#cfe3ea"] : sign === "NAILS" ? ["#fbe9ef", "#f0c9d6"] : ["#d9d6cf", "#bdb8ae"];
          const gr = g.createLinearGradient(0, 0, 0, ch);
          gr.addColorStop(0, lit[0]);
          gr.addColorStop(1, lit[1]);
          g.fillStyle = gr;
          g.fillRect(0, 0, cw, ch);
          // ceiling lights
          for (let x = 60; x < cw; x += 160) {
            g.fillStyle = "rgba(255,255,255,0.95)";
            g.fillRect(x, 14, 90, 10);
          }
          if (sign === "DENTIST") {
            // reception desk, a chair under a lamp, a plant, a poster
            g.fillStyle = "#ffffff"; g.fillRect(90, 180, 260, 120);
            g.fillStyle = "#2aa1b8"; g.fillRect(90, 180, 260, 14);
            g.fillStyle = "#5bb7c9"; g.beginPath(); g.ellipse(640, 230, 120, 34, -0.25, 0, Math.PI * 2); g.fill();
            g.fillStyle = "#8a9aa3"; g.fillRect(630, 240, 18, 60);
            g.strokeStyle = "#8a9aa3"; g.lineWidth = 8; g.beginPath(); g.moveTo(760, 120); g.lineTo(700, 70); g.lineTo(620, 90); g.stroke();
            g.fillStyle = "#fffbe0"; g.beginPath(); g.arc(612, 96, 20, 0, Math.PI * 2); g.fill();
            g.fillStyle = "#3f7a3a"; g.beginPath(); g.ellipse(930, 200, 40, 70, 0, 0, Math.PI * 2); g.fill();
            g.fillStyle = "#ffffff"; g.fillRect(420, 70, 110, 140);
            g.fillStyle = "#2aa1b8"; g.font = "900 70px Inter, Arial"; g.textAlign = "center"; g.fillText("🦷", 475, 170);
          } else if (sign === "NAILS") {
            // manicure tables with lamps, chairs, a polish wall
            for (const x of [150, 470, 790]) {
              g.fillStyle = "#ffffff"; g.fillRect(x - 90, 200, 180, 22);
              g.fillStyle = "#d9b4c2"; g.fillRect(x - 80, 222, 12, 78); g.fillRect(x + 68, 222, 12, 78);
              g.fillStyle = "#3b3b45"; g.beginPath(); g.ellipse(x - 30, 245, 34, 46, 0, 0, Math.PI * 2); g.fill();
              g.strokeStyle = "#444"; g.lineWidth = 5; g.beginPath(); g.moveTo(x + 60, 200); g.lineTo(x + 60, 150); g.lineTo(x + 20, 140); g.stroke();
            }
            for (let i = 0; i < 40; i++) {
              g.fillStyle = `hsl(${(i * 37) % 360}, 70%, 55%)`;
              g.fillRect(40 + (i % 20) * 47, 70 + Math.floor(i / 20) * 34, 18, 24);
            }
          } else {
            g.fillStyle = "rgba(0,0,0,0.12)"; g.fillRect(120, 160, 780, 140);
          }
        });
        const back = new THREE.Mesh(new THREE.PlaneGeometry(gw, 2.8), M({ map: interior, emissive: "#ffffff", emissiveMap: interior, emissiveIntensity: sign ? 0.55 : 0.2, roughness: 0.9 }));
        back.rotation.y = Math.PI / 2;
        back.position.set(FACADE_X - 1.6, 1.55, zc);
        plaza.add(back);
        // the reveal walls and ceiling, so the glass has a room behind it
        const reveal = M({ color: "#d8d4cc", roughness: 0.9, side: THREE.DoubleSide });
        for (const zz of [zc + gw / 2, zc - gw / 2]) {
          const side = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.0, 0.02), reveal);
          side.position.set(FACADE_X - 0.8, 1.6, zz);
          plaza.add(side);
        }
        const ceil = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.02, gw), reveal);
        ceil.position.set(FACADE_X - 0.8, 3.06, zc);
        plaza.add(ceil);
        const floorIn = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.02, gw), M({ color: "#cfc8bd", roughness: 0.6 }));
        floorIn.position.set(FACADE_X - 0.8, 0.17, zc);
        plaza.add(floorIn);
        // cut the stucco box back where the shop's glass is
        body.material = [noFace, sm, sm, sm, sm, sm];
        const upper = new THREE.Mesh(new THREE.PlaneGeometry(w, 2.2), sm);
        upper.rotation.y = Math.PI / 2;
        upper.position.set(FACADE_X, 4.1, zc);
        plaza.add(upper);
        for (const [zz, ww] of [[z0 - 0.25, 0.5], [z1 + 0.25, 0.5]]) {
          const pier = new THREE.Mesh(new THREE.PlaneGeometry(ww, 3.0), sm);
          pier.rotation.y = Math.PI / 2;
          pier.position.set(FACADE_X, 1.5, zz);
          plaza.add(pier);
        }
        // glass and frames
        const win = new THREE.Mesh(new THREE.PlaneGeometry(gw, 2.9), glassMat);
        win.rotation.y = Math.PI / 2;
        win.position.set(FACADE_X + 0.02, 1.6, zc);
        plaza.add(win);
        const doorZ = sign === "NAILS" ? z0 - 1.6 : z1 + 1.6;
        const mz = [zc + gw / 2, zc - gw / 2, doorZ + 0.75, doorZ - 0.75];
        for (let k = 1; k < 4; k++) mz.push(lerp(zc + gw / 2, zc - gw / 2, k / 4));
        for (const z of mz) {
          if (Math.abs(z - doorZ) < 0.7) continue;
          const m = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.95, 0.07), frameMat);
          m.position.set(FACADE_X + 0.04, 1.6, z);
          plaza.add(m);
        }
        for (const y of [0.2, 3.05]) {
          const rail = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, gw), frameMat);
          rail.position.set(FACADE_X + 0.04, y, zc);
          plaza.add(rail);
        }
        const transom = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.07, 1.5), frameMat);
        transom.position.set(FACADE_X + 0.04, 2.45, doorZ);
        plaza.add(transom);
        const pull = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.7, 0.04), M({ color: "#c9ccd0", metalness: 0.9, roughness: 0.25 }));
        pull.position.set(FACADE_X + 0.1, 1.15, doorZ + (sign === "NAILS" ? -0.55 : 0.55));
        plaza.add(pull);
        // name and hours on the door glass
        if (sign) {
          const decal = canvasTex(512, 256, (g, cw, ch) => {
            g.fillStyle = "rgba(255,255,255,0.92)";
            g.textAlign = "center";
            g.font = "800 54px Inter, Arial";
            g.fillText(sign === "DENTIST" ? "FAMILY DENTAL" : "NAIL SPA", cw / 2, 90);
            g.font = "600 30px Inter, Arial";
            g.fillText("OPEN 9 – 7", cw / 2, 150);
          });
          const d = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.55), M({ map: decal, transparent: true, roughness: 0.4 }));
          d.rotation.y = Math.PI / 2;
          d.position.set(FACADE_X + 0.05, 1.75, doorZ);
          plaza.add(d);
        }
        const signTex = canvasTex(1024, 160, (g, cw, ch) => {
          if (!sign) return;
          // channel letters: a darker return under each lit face
          g.font = "900 110px Inter, Arial";
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillStyle = "rgba(0,0,0,0.35)";
          g.fillText(sign, cw / 2 + 4, ch / 2 + 10);
          g.fillStyle = signCol;
          g.font = "900 110px Inter, Arial";
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillText(sign, cw / 2, ch / 2 + 6);
        });
        const s = new THREE.Mesh(new THREE.PlaneGeometry(Math.min(w - 1, 6), 0.9), M({ map: signTex, transparent: true, roughness: 0.5 }));
        s.rotation.y = Math.PI / 2;
        s.position.set(FACADE_X + 0.42, 4.35, (z0 + z1) / 2);
        plaza.add(s);
      }
      // a canopy over the walk
      const can = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, w), M({ color: "#ffffff", roughness: 0.7 }));
      can.position.set(FACADE_X + 0.8, 3.55, (z0 + z1) / 2);
      can.castShadow = true;
      plaza.add(can);
    }
    for (const [z0, z1, c, s, sc] of units) unit(z0, z1, c, s, false, sc);

    // ---- the gym ----
    const GZ0 = -6.8;
    const GZ1 = -15.2;
    unit(GZ0, GZ1, "#f6f2ea", "", true);
    const gymSign = canvasTex(2048, 300, (g, cw, ch) => {
      g.fillStyle = "#ffffff";
      g.font = "900 190px Inter, Arial";
      g.textAlign = "left";
      g.textBaseline = "middle";
      g.fillText("MAPLE JIU-JITSU", 300, ch / 2 + 10);
    });
    const logoTex = new THREE.TextureLoader().load(mapleLogo);
    logoTex.colorSpace = THREE.SRGBColorSpace;
    const signMat = M({ map: gymSign, transparent: true, emissive: "#ffffff", emissiveMap: gymSign, emissiveIntensity: 1.4, roughness: 0.4 });
    const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 1.05), signMat);
    signMesh.rotation.y = Math.PI / 2;
    signMesh.position.set(FACADE_X + 0.42, 4.35, (GZ0 + GZ1) / 2 - 0.4);
    plaza.add(signMesh);
    const signLogo = new THREE.Mesh(
      new THREE.PlaneGeometry(0.95, 0.96),
      M({ map: logoTex, transparent: true, emissive: "#ffffff", emissiveMap: logoTex, emissiveIntensity: 1.0, roughness: 0.4 })
    );
    signLogo.rotation.y = Math.PI / 2;
    signLogo.position.set(FACADE_X + 0.43, 4.35, (GZ0 + GZ1) / 2 + 3.1);
    plaza.add(signLogo);

    // gym front: big windows, a glass door with a frame
    const gymWin = new THREE.Mesh(new THREE.PlaneGeometry(GZ0 - GZ1 - 0.6, 3.1), new THREE.MeshPhysicalMaterial({ color: "#2a3a44", roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.22, envMapIntensity: 1.8 }));
    gymWin.rotation.y = Math.PI / 2;
    gymWin.position.set(FACADE_X + 0.03, 1.75, (GZ0 + GZ1) / 2);
    plaza.add(gymWin);
    // frameless glass past the door, so the back wall reads clean through it
    for (const z of [GZ0 - 0.3, DOOR_Z + 0.8, GZ1 + 0.3]) {
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.2, 0.08), frameMat);
      mullion.position.set(FACADE_X + 0.05, 1.75, z);
      plaza.add(mullion);
    }
    const header = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, GZ0 - GZ1), frameMat);
    header.position.set(FACADE_X + 0.05, 3.3, (GZ0 + GZ1) / 2);
    plaza.add(header);
    // the door swings in as he reaches it
    const doorPivot = new THREE.Group();
    doorPivot.position.set(FACADE_X + 0.02, 0, DOOR_Z + 0.78);
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.4, 1.5), new THREE.MeshPhysicalMaterial({ color: "#2a3a44", roughness: 0.04, transparent: true, opacity: 0.35, envMapIntensity: 1.8 }));
    door.position.set(0, 1.2, -0.75);
    doorPivot.add(door);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.04), frameMat);
    handle.position.set(0.06, 1.1, -1.35);
    doorPivot.add(handle);
    plaza.add(doorPivot);

    // the gym inside: a room you can see through the glass
    const room = new THREE.Group();
    plaza.add(room);
    const matTex = canvasTex(512, 512, (g, w, h) => {
      for (let i = 0; i < 4; i++)
        for (let j = 0; j < 2; j++) {
          g.fillStyle = `hsl(218, 60%, ${36 + rnd() * 4}%)`;
          g.fillRect((i * w) / 4, (j * h) / 2, w / 4, h / 2);
          g.strokeStyle = "rgba(5,10,30,0.8)";
          g.lineWidth = 3;
          g.strokeRect((i * w) / 4, (j * h) / 2, w / 4, h / 2);
        }
    }, { repeat: [2.5, 2] });
    const mats = new THREE.Mesh(new THREE.PlaneGeometry(9.6, 8.2), M({ map: matTex, roughness: 0.8 }));
    mats.rotation.x = -Math.PI / 2;
    mats.position.set(FACADE_X - 5, 0.2, (GZ0 + GZ1) / 2);
    mats.receiveShadow = true;
    room.add(mats);
    const wallLogoTex = new THREE.TextureLoader().load(mapleBjjLogo);
    wallLogoTex.colorSpace = THREE.SRGBColorSpace;
    const wallLogo = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 1.75), M({ map: wallLogoTex, transparent: true, roughness: 0.6 }));
    wallLogo.rotation.y = Math.PI / 2;
    wallLogo.position.set(FACADE_X - 9.9, 3.05, -11.75);
    // the Jiu Jitsu For Life badge beside it; a disc, so the badge's own
    // square background never shows
    const jjflTex = new THREE.TextureLoader().load(jjflLogo);
    jjflTex.colorSpace = THREE.SRGBColorSpace;
    jjflTex.anisotropy = 8;
    const jjfl = new THREE.Mesh(new THREE.CircleGeometry(0.76, 64), M({ map: jjflTex, roughness: 0.6 }));
    jjfl.rotation.y = Math.PI / 2;
    jjfl.position.set(FACADE_X - 9.9, 3.0, -14.15);
    room.add(jjfl);
    // a navy stripe along the wall at mat height, like a real academy
    const stripe = new THREE.Mesh(new THREE.PlaneGeometry(GZ0 - GZ1 - 0.3, 0.9), M({ color: "#13234b", roughness: 0.8 }));
    stripe.rotation.y = Math.PI / 2;
    stripe.position.set(FACADE_X - 9.92, 0.65, (GZ0 + GZ1) / 2);
    room.add(stripe);
    room.add(wallLogo);
    // the room is inside the stucco box, so carve it: inner walls + ceiling lights
    const innerMat = M({ color: "#f5f3ef", roughness: 0.9, side: THREE.BackSide });
    const inner = new THREE.Mesh(new THREE.BoxGeometry(9.9, 4.9, GZ0 - GZ1 - 0.2), [noFace, innerMat, innerMat, innerMat, innerMat, innerMat]);
    inner.position.set(FACADE_X - 5, 2.45, (GZ0 + GZ1) / 2);
    room.add(inner);
    const roomLight = new THREE.PointLight("#fff3e0", 26, 18, 1.6);
    roomLight.position.set(FACADE_X - 5, 4.2, (GZ0 + GZ1) / 2);
    room.add(roomLight);
    const roomLight2 = roomLight.clone();
    roomLight2.position.x = FACADE_X - 1.8;
    room.add(roomLight2);

    // ---- a person, built from parts (the player and the students) ----
    const geo = {
      head: new THREE.SphereGeometry(0.105, 24, 18),
      hair: new THREE.SphereGeometry(0.11, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.58),
      neck: new THREE.CylinderGeometry(0.052, 0.058, 0.12, 12),
      torso: (() => {
        const prof = [
          [0.0, 0], [0.155, 0], [0.16, 0.08], [0.15, 0.2], [0.17, 0.34], [0.2, 0.46], [0.19, 0.52], [0.12, 0.56], [0.0, 0.57],
        ].map(([r, y]) => new THREE.Vector2(r, y));
        const g = new THREE.LatheGeometry(prof, 32);
        g.scale(1, 1, 0.62);
        return g;
      })(),
      shoulder: new THREE.SphereGeometry(0.075, 16, 12),
      sleeve: new THREE.CapsuleGeometry(0.068, 0.12, 6, 14),
      skirt: new THREE.CylinderGeometry(0.19, 0.22, 0.3, 24, 1, true),
      belt: new THREE.TorusGeometry(0.17, 0.02, 8, 32),
      knot: new RoundedBoxGeometry(0.07, 0.16, 0.03, 2, 0.01),
      upperArm: new THREE.CapsuleGeometry(0.057, 0.19, 6, 14),
      foreArm: new THREE.CapsuleGeometry(0.05, 0.19, 6, 14),
      hand: new THREE.SphereGeometry(0.045, 12, 10),
      palm: new RoundedBoxGeometry(0.036, 0.085, 0.082, 2, 0.016),
      finger: new THREE.CapsuleGeometry(0.0105, 0.026, 4, 8),
      joint: new THREE.SphereGeometry(1, 14, 10),
      eye: new THREE.SphereGeometry(0.012, 10, 8),
      brow: new RoundedBoxGeometry(0.035, 0.008, 0.012, 1, 0.003),
      nose: new THREE.SphereGeometry(0.016, 10, 8),
      mouth: new RoundedBoxGeometry(0.04, 0.006, 0.01, 1, 0.002),
      hips: new RoundedBoxGeometry(0.33, 0.2, 0.21, 3, 0.07),
      thigh: new THREE.CapsuleGeometry(0.09, 0.25, 6, 14),
      shin: new THREE.CapsuleGeometry(0.066, 0.29, 6, 14),
      shoe: new RoundedBoxGeometry(0.1, 0.085, 0.27, 3, 0.035),
      bag: new RoundedBoxGeometry(0.5, 0.26, 0.26, 4, 0.09),
      strap: new THREE.TorusGeometry(0.27, 0.012, 6, 32, Math.PI * 1.1),
    };
    function person({ skin, hair, top, shorts, shoes, logoBack = false, gi = false, bag = false, belt = "#f2f2ee" }) {
      const mat = (c, r = 0.7) => M({ color: c, roughness: r });
      const mSkin = mat(skin, 0.55);
      const mTop = mat(top, 0.85);
      const mShorts = mat(shorts, 0.8);
      const root = new THREE.Group();
      const pelvis = new THREE.Group();
      pelvis.position.y = 0.95;
      root.add(pelvis);
      const hips = new THREE.Mesh(geo.hips, mShorts);
      pelvis.add(hips);
      const spine = new THREE.Group();
      spine.position.y = 0.07;
      pelvis.add(spine);
      const torso = new THREE.Mesh(geo.torso, mTop);
      spine.add(torso);
      if (logoBack) {
        // the Maple mark on the back of his tee, where the camera sits
        const back = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.245), M({ map: logoTex, transparent: true, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -2 }));
        back.position.set(0, 0.36, 0.118);
        spine.add(back);
        // and a small one on the left chest
        const front = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.102), M({ map: logoTex, transparent: true, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -2 }));
        front.position.set(-0.075, 0.41, -0.121);
        front.rotation.y = Math.PI;
        spine.add(front);
      }
      if (gi) {
        // the jacket hangs past the hips, and the belt ties over it
        const skirt = new THREE.Mesh(geo.skirt, new THREE.MeshStandardMaterial({ color: top, roughness: 0.9, side: THREE.DoubleSide }));
        skirt.scale.z = 0.66;
        skirt.position.y = -0.06;
        spine.add(skirt);
        const bm = mat(belt, 0.7);
        const b = new THREE.Mesh(geo.belt, bm);
        b.rotation.x = Math.PI / 2;
        b.scale.set(1.05, 0.68, 1);
        b.position.y = 0.06;
        spine.add(b);
        const kn = new THREE.Mesh(geo.knot, bm);
        kn.position.set(0, -0.01, -0.12);
        spine.add(kn);
      }
      const neck = new THREE.Mesh(geo.neck, mSkin);
      neck.position.y = 0.6;
      spine.add(neck);
      const headG = new THREE.Group();
      headG.position.y = 0.73;
      spine.add(headG);
      const head = new THREE.Mesh(geo.head, mSkin);
      head.scale.set(0.95, 1.12, 1.02);
      headG.add(head);
      // a simple face: he is seen from the front once he is inside
      const dark = mat("#1a120c", 0.4);
      for (const sx of [-1, 1]) {
        const e = new THREE.Mesh(geo.eye, dark);
        e.position.set(0.036 * sx, 0.018, -0.094);
        headG.add(e);
        const b = new THREE.Mesh(geo.brow, mat(hair, 0.8));
        b.position.set(0.036 * sx, 0.045, -0.098);
        b.rotation.z = -0.12 * sx;
        headG.add(b);
      }
      const nose = new THREE.Mesh(geo.nose, mSkin);
      nose.scale.set(0.9, 1.2, 1.1);
      nose.position.set(0, -0.005, -0.104);
      headG.add(nose);
      const mouth = new THREE.Mesh(geo.mouth, mat("#7a3e32", 0.6));
      mouth.position.set(0, -0.048, -0.097);
      headG.add(mouth);
      const hairM = new THREE.Mesh(geo.hair, mat(hair, 0.75));
      hairM.position.set(0, 0.015, 0.012);
      hairM.rotation.x = 0.3;
      hairM.scale.set(0.98, 1.08, 1.04);
      headG.add(hairM);
      const limbs = {};
      for (const side of [-1, 1]) {
        const sh = new THREE.Group();
        sh.position.set(0.205 * side, 0.47, 0);
        spine.add(sh);
        sh.add(new THREE.Mesh(geo.shoulder, mTop));
        const upper = new THREE.Group();
        sh.add(upper);
        const sleeve = new THREE.Mesh(geo.sleeve, mTop);
        sleeve.position.y = -0.08;
        upper.add(sleeve);
        const ua = new THREE.Mesh(geo.upperArm, gi ? mTop : mSkin);
        ua.position.y = -0.15;
        upper.add(ua);
        const elbow = new THREE.Group();
        elbow.position.y = -0.29;
        upper.add(elbow);
        const ej = new THREE.Mesh(geo.joint, gi ? mTop : mSkin);
        ej.scale.setScalar(0.054);
        elbow.add(ej);
        const fa = new THREE.Mesh(geo.foreArm, gi ? mTop : mSkin);
        fa.position.y = -0.13;
        elbow.add(fa);
        // A relaxed hand: palm toward the leg, four equal fingers curled in,
        // the thumb along the front.
        const palm = new THREE.Mesh(geo.palm, mSkin);
        palm.position.set(0, -0.3, 0);
        elbow.add(palm);
        for (let f = 0; f < 4; f++) {
          const fg = new THREE.Mesh(geo.finger, mSkin);
          fg.position.set(-0.012 * side, -0.347, -0.027 + f * 0.018);
          fg.rotation.z = -0.75 * side;
          elbow.add(fg);
        }
        const thumb = new THREE.Mesh(geo.finger, mSkin);
        thumb.position.set(-0.016 * side, -0.295, -0.046);
        thumb.rotation.set(-0.25, 0, -0.35 * side);
        thumb.scale.y = 1.2;
        elbow.add(thumb);
        const hip = new THREE.Group();
        hip.position.set(0.095 * side, -0.04, 0);
        pelvis.add(hip);
        const th = new THREE.Mesh(geo.thigh, mShorts);
        th.position.y = -0.2;
        hip.add(th);
        const knee = new THREE.Group();
        knee.position.y = -0.43;
        hip.add(knee);
        const kj = new THREE.Mesh(geo.joint, gi ? mShorts : mSkin);
        kj.scale.setScalar(0.072);
        knee.add(kj);
        const sn = new THREE.Mesh(geo.shin, gi ? mShorts : mSkin);
        sn.position.y = -0.22;
        knee.add(sn);
        const ankle = new THREE.Group();
        ankle.position.y = -0.45;
        knee.add(ankle);
        const shoe = new THREE.Mesh(geo.shoe, gi ? mSkin : mat(shoes, 0.5));
        shoe.position.set(0, -0.02, -0.06);
        ankle.add(shoe);
        const bare = new THREE.Mesh(new RoundedBoxGeometry(0.088, 0.065, 0.235, 3, 0.025), mSkin);
        bare.position.set(0, 0.0, -0.06);
        bare.visible = false;
        bare.castShadow = true;
        ankle.add(bare);
        limbs[side] = { sh, upper, elbow, hip, knee, ankle, shoe, bare };
      }
      let bagG = null;
      if (bag) {
        bagG = new THREE.Group();
        bagG.position.set(0.24, 0.32, 0.05);
        const b = new THREE.Mesh(geo.bag, mat("#13234b", 0.6));
        b.rotation.y = Math.PI / 2;
        bagG.add(b);
        const strap = new THREE.Mesh(geo.strap, mat("#0d0d0f", 0.6));
        strap.rotation.set(0, Math.PI / 2, 0.35);
        strap.position.set(-0.1, 0.12, 0);
        bagG.add(strap);
        spine.add(bagG);
      }
      root.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      const barefoot = (on) => {
        for (const s2 of [-1, 1]) {
          limbs[s2].shoe.visible = !on;
          limbs[s2].bare.visible = on;
        }
      };
      return { root, pelvis, spine, headG, limbs, bagG, barefoot };
    }

    // gait: distance-driven so feet never slide
    function pose(P, phase, g, { lean = 0, breath = 0 } = {}) {
      const A = 0.42 * g;
      const B = 0.9 * g;
      for (const side of [-1, 1]) {
        const ph = phase + (side > 0 ? Math.PI : 0);
        const L = P.limbs[side];
        const th = A * Math.sin(ph);
        const flex = (B * Math.max(0, Math.cos(ph)) + 0.06) * g + (1 - g) * 0.04;
        // +x rotation swings a limb forward (he faces -z); knees fold back
        L.hip.rotation.x = th;
        L.knee.rotation.x = -flex;
        L.ankle.rotation.x = -(th - flex) * 0.9;
        L.upper.rotation.x = -0.85 * A * Math.sin(ph);
        L.upper.rotation.z = 0.08 * side;
        L.elbow.rotation.x = 0.22 + 0.25 * g + 0.15 * g * Math.max(0, Math.sin(ph));
      }
      P.pelvis.position.y = 0.95 + (0.025 * Math.abs(Math.cos(phase)) - 0.012) * g + breath * 0.004;
      P.pelvis.rotation.y = 0.07 * Math.sin(phase) * g;
      P.spine.rotation.y = -0.12 * Math.sin(phase) * g;
      P.spine.rotation.x = -lean;
      P.headG.rotation.y = 0.06 * Math.sin(phase) * g;
      if (P.bagG) {
        P.bagG.rotation.x = 0.12 * Math.sin(phase * 2) * g;
        P.bagG.position.y = 0.32 + 0.015 * Math.sin(phase * 2 + 1) * g;
      }
    }

    const player = person({ skin: "#c98f68", hair: "#1b120c", top: "#13234b", shorts: "#151517", shoes: "#f2f2f2", logoBack: true });
    scene.add(player.root);
    // his sneakers, left by the door inside
    for (const [dx, dz, ry] of [[0.0, 0.0, 0.2], [0.13, 0.07, -0.1]]) {
      const sn = new THREE.Mesh(geo.shoe, M({ color: "#f2f2f2", roughness: 0.5 }));
      sn.position.set(FACADE_X - 0.55 + dx, 0.24, DOOR_Z + 1.25 + dz);
      sn.rotation.y = ry + Math.PI / 2;
      sn.castShadow = true;
      room.add(sn);
    }

    // students inside, on the mats
    const students = [];
    const SKINS = ["#f1c9a5", "#d49a72", "#9a5f3e", "#e6b48e", "#6e432a", "#c98c64"];
    const GIS = ["#f4f3ef", "#f4f3ef", "#2a4c9c", "#f4f3ef", "#1b1c21", "#f4f3ef"];
    const BELTS = ["#f2f2ee", "#2350b3", "#5b2a8c", "#f2f2ee", "#6a3d1e", "#111114"];
    for (let i = 0; i < 6; i++) {
      const p = person({ skin: SKINS[i], hair: i % 3 ? "#2a1a10" : "#0e0e10", top: GIS[i], shorts: GIS[i], shoes: "#000", gi: true, belt: BELTS[i] });
      // lined up across the mats, facing the door he walks in through
      p.root.position.set(FACADE_X - 7.4 + (rnd() - 0.5) * 0.15, 0.2, DOOR_Z - 3.0 + i * 1.05);
      p.root.rotation.y = -Math.PI / 2 + (rnd() - 0.5) * 0.12;
      p.phase = rnd() * 6;
      room.add(p.root);
      students.push(p);
    }

    // ---- palms along the curb ----
    const frondTex = canvasTex(256, 1024, (g, w, h) => {
      // a frond: a rib with leaflets fanning off it
      g.clearRect(0, 0, w, h);
      g.strokeStyle = "#6f7a2a";
      g.lineWidth = 6;
      g.beginPath();
      g.moveTo(w / 2, h);
      g.lineTo(w / 2, 0);
      g.stroke();
      for (let y = 30; y < h - 20; y += 14) {
        const k = 1 - y / h;
        const len = (w / 2 - 8) * Math.sin(Math.PI * Math.min(1, (h - y) / h * 1.1)) * 0.98;
        for (const s of [-1, 1]) {
          g.strokeStyle = `hsl(${85 + rnd() * 20}, ${45 + rnd() * 15}%, ${22 + rnd() * 14}%)`;
          g.lineWidth = 5;
          g.beginPath();
          g.moveTo(w / 2, y);
          g.quadraticCurveTo(w / 2 + s * len * 0.6, y - 10 - k * 6, w / 2 + s * len, y + 26 + k * 20);
          g.stroke();
        }
      }
    }, {});
    const frondMat = new THREE.MeshStandardMaterial({ map: frondTex, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.8 });
    const barkTex = canvasTex(64, 512, (g, w, h) => {
      g.fillStyle = "#8b7356";
      g.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 10) {
        g.fillStyle = `rgba(50,35,20,${0.3 + rnd() * 0.3})`;
        g.fillRect(0, y, w, 3);
      }
    }, { repeat: [1, 3] });
    function palm(x, z, hgt, lean, seed) {
      const r2 = mulberry32(seed);
      const g = new THREE.Group();
      const pts = [];
      for (let i = 0; i <= 10; i++) {
        const k = i / 10;
        pts.push(new THREE.Vector3(Math.sin(k * 1.2) * lean, k * hgt, 0));
      }
      const trunk = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, 0.16, 10), M({ map: barkTex, roughness: 0.95 }));
      trunk.castShadow = true;
      g.add(trunk);
      const top = pts[pts.length - 1];
      for (let i = 0; i < 12; i++) {
        const fg = new THREE.Group();
        fg.position.copy(top);
        fg.rotation.y = (i / 12) * Math.PI * 2 + r2() * 0.3;
        const f = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 3.2, 1, 6), frondMat);
        // bend the frond down along its length
        const pos = f.geometry.attributes.position;
        for (let v = 0; v < pos.count; v++) {
          const y = pos.getY(v) + 1.6;
          pos.setY(v, y * 0.55 - y * y * 0.12);
          pos.setZ(v, y * 0.85);
        }
        f.geometry.computeVertexNormals();
        f.rotation.x = -0.35 - r2() * 0.35;
        f.castShadow = true;
        fg.add(f);
        g.add(fg);
      }
      g.position.set(x, 0.16, z);
      g.rotation.y = r2() * Math.PI * 2;
      scene.add(g);
      return g;
    }
    const palms = [];
    for (let i = 0; i < 9; i++) palms.push(palm(2.55, 6 - i * 8.5, 6.5 + (i % 3) * 0.8, 0.5 + (i % 2) * 0.3, 100 + i));
    for (let i = 0; i < 10; i++) palm(19 + (i % 2) * 2, 10 - i * 9, 7 + (i % 3), 0.4, 300 + i);

    // ---- parked cars ----
    function car(x, z, col, seed) {
      const g = new THREE.Group();
      const paint = new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.25, metalness: 0.5, clearcoat: 1, clearcoatRoughness: 0.08 });
      const body = new THREE.Mesh(new RoundedBoxGeometry(1.85, 0.62, 4.5, 4, 0.18), paint);
      body.position.y = 0.62;
      g.add(body);
      const cab = new THREE.Mesh(new RoundedBoxGeometry(1.6, 0.55, 2.3, 4, 0.2), paint);
      cab.position.set(0, 1.12, -0.2);
      g.add(cab);
      const glass = new THREE.Mesh(new RoundedBoxGeometry(1.64, 0.42, 2.12, 4, 0.16), new THREE.MeshPhysicalMaterial({ color: "#0c1218", roughness: 0.05, metalness: 0.2, envMapIntensity: 1.8 }));
      glass.position.set(0, 1.14, -0.2);
      g.add(glass);
      const tireMat = M({ color: "#111", roughness: 0.9 });
      const rimMat = M({ color: "#bbb", metalness: 0.9, roughness: 0.3 });
      for (const [wx, wz] of [[-0.86, 1.45], [0.86, 1.45], [-0.86, -1.45], [0.86, -1.45]]) {
        const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.26, 24), tireMat);
        tire.rotation.z = Math.PI / 2;
        tire.position.set(wx, 0.36, wz);
        g.add(tire);
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.27, 16), rimMat);
        rim.rotation.z = Math.PI / 2;
        rim.position.copy(tire.position);
        g.add(rim);
      }
      const lightMat = M({ color: "#ff3030", emissive: "#ff2020", emissiveIntensity: 0.6 });
      for (const lx of [-0.7, 0.7]) {
        const tl = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.1, 0.05), lightMat);
        tl.position.set(lx, 0.78, 2.26);
        g.add(tl);
      }
      g.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      g.position.set(x, 0, z);
      // nose-in: the car's length runs out into the lot
      g.rotation.y = Math.PI / 2 + (mulberry32(seed)() - 0.5) * 0.06;
      scene.add(g);
    }
    for (const [z, c, sd] of [[9.9, "#2c5fa8", 4], [4.4, "#e9ecef", 1], [1.65, "#8a8f96", 5], [-4.85, "#b3202a", 2], [-7.6, "#f2f2f0", 6], [-13.1, "#15171b", 3], [-18.6, "#3b5d4a", 7], [-24.1, "#d9d4c8", 8]]) {
      car(6.35, z, c, sd);
    }
    for (const [z, c, sd] of [[7.1, "#15171b", 9], [-1.1, "#c7c9cc", 10], [-10.35, "#6d1a1f", 11], [-21.35, "#f2f2f0", 12]]) {
      car(18.1, z, c, sd);
    }

    // ---- buildings across the lot ----
    const farCols = ["#f7d9c4", "#cfe9e0", "#f3e2b8", "#e9d3f0", "#d8e2f3"];
    for (let i = 0; i < 9; i++) {
      const h = 6 + (i % 4) * 4;
      const b = new THREE.Mesh(new THREE.BoxGeometry(10, h, 11), M({ map: stucco(farCols[i % 5]), roughness: 0.9 }));
      b.position.set(44, h / 2, 14 - i * 13);
      b.castShadow = true;
      b.receiveShadow = true;
      scene.add(b);
    }

    // ---- a money pickup on the walk: he walks through it ----
    const PICK_S = 6.8; // metres along his path
    const pickAt = pathAt(PICK_S);
    const billTex = canvasTex(256, 128, (g, w, h) => {
      g.fillStyle = "#6fbf5a";
      g.fillRect(0, 0, w, h);
      g.strokeStyle = "#2f6e2a";
      g.lineWidth = 8;
      g.strokeRect(8, 8, w - 16, h - 16);
      g.fillStyle = "#2f6e2a";
      g.font = "900 84px Inter, Arial";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("$", w / 2, h / 2 + 4);
    });
    const pickup = new THREE.Group();
    const billMat = new THREE.MeshStandardMaterial({ map: billTex, emissive: "#3fdc5a", emissiveMap: billTex, emissiveIntensity: 0.55, roughness: 0.6 });
    for (let i = 0; i < 5; i++) {
      const bill = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.016, 0.15), billMat);
      bill.position.y = i * 0.018;
      bill.rotation.y = (i - 2) * 0.12;
      bill.castShadow = true;
      pickup.add(bill);
    }
    const halo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.34, 0.9, 32, 1, true),
      new THREE.MeshBasicMaterial({
        map: canvasTex(16, 256, (g, w, h) => {
          const gr = g.createLinearGradient(0, 0, 0, h);
          gr.addColorStop(0, "rgba(90,255,120,0)");
          gr.addColorStop(1, "rgba(90,255,120,0.55)");
          g.fillStyle = gr;
          g.fillRect(0, 0, w, h);
        }),
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      })
    );
    halo.position.y = 0.2;
    pickup.add(halo);
    pickup.position.set(pickAt.x, 0.5, pickAt.z);
    scene.add(pickup);
    const sparkTex = canvasTex(64, 64, (g, w) => {
      const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      gr.addColorStop(0, "rgba(220,255,220,1)");
      gr.addColorStop(1, "rgba(80,255,120,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, w, w);
    });
    const sparks = Array.from({ length: 16 }, (_, i) => {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, transparent: true, depthWrite: false, toneMapped: false }));
      const a = (i / 16) * Math.PI * 2;
      sp.userData = { a, up: 0.6 + (i % 3) * 0.3 };
      sp.visible = false;
      scene.add(sp);
      return sp;
    });

    // ---- the mission marker: a yellow corona at the door ----
    const markerTex = canvasTex(16, 256, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, "rgba(255,220,60,0)");
      gr.addColorStop(0.6, "rgba(255,220,60,0.35)");
      gr.addColorStop(1, "rgba(255,220,60,0.85)");
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h);
    });
    const marker = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 1.5, 48, 1, true),
      new THREE.MeshBasicMaterial({ map: markerTex, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false, color: "#ffffff" })
    );
    marker.position.set(-2.35, 0.16 + 0.75, DOOR_Z);
    scene.add(marker);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.62, 48), new THREE.MeshBasicMaterial({ color: "#ffd23c", transparent: true, opacity: 0.9, toneMapped: false }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(-2.35, 0.17, DOOR_Z);
    scene.add(ring);

    // ---- post ----
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(window.devicePixelRatio || 1);
    composer.setSize(W, H);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.28, 0.5, 0.95));
    composer.addPass(new OutputPass());

    // ---- the radar: drawn from the same world the camera sees ----
    // North-up would be easier, but the game's radar turns with the player,
    // who always points up; so the route and the blip are placed in world
    // coordinates and the whole map is rotated by his heading.
    const DOOR = { x: -2.4, z: DOOR_Z };
    function drawRadar(P) {
      const c = R.mapcanvas;
      if (!c) return;
      const g = c.getContext("2d");
      const cw = c.width;
      const ch = c.height;
      const k = 9; // canvas px per metre
      const ox = cw / 2;
      const oy = ch * 0.64;
      g.save();
      g.fillStyle = "#3f4b53";
      g.fillRect(0, 0, cw, ch);
      g.translate(ox, oy);
      g.rotate(P.yaw);
      const rect = (x0, x1, z0, z1, col) => {
        g.fillStyle = col;
        g.fillRect((x0 - P.x) * k, (z0 - P.z) * k, (x1 - x0) * k, (z1 - z0) * k);
      };
      rect(3.1, 43, -200, 60, "#323b41"); // the lot
      rect(-3, 3.1, -200, 60, "#7a868d"); // the walk
      rect(-13, -3, -37, 16, "#5e6a71"); // the plaza
      rect(39, 49, -120, 20, "#5e6a71"); // across the lot
      // unit lines along the plaza
      g.strokeStyle = "#47525a";
      g.lineWidth = 2;
      for (const z of [4, -6.8, -15.2, -25]) {
        g.beginPath();
        g.moveTo((-13 - P.x) * k, (z - P.z) * k);
        g.lineTo((-3 - P.x) * k, (z - P.z) * k);
        g.stroke();
      }
      // stall lines
      g.strokeStyle = "rgba(255,255,255,0.18)";
      g.lineWidth = 1.5;
      for (let i = 0; i < 44; i++) {
        const z = 14 - i * 2.75;
        for (const x0 of [3.5, 15.3]) {
          g.beginPath();
          g.moveTo((x0 - P.x) * k, (z - P.z) * k);
          g.lineTo((x0 + 5.4 - P.x) * k, (z - P.z) * k);
          g.stroke();
        }
      }
      // the GPS route: what is left of his walk, to the door
      const { pts, len } = PATH;
      g.strokeStyle = "#f2c037";
      g.lineWidth = 7;
      g.lineCap = "round";
      g.lineJoin = "round";
      g.shadowColor = "rgba(0,0,0,0.6)";
      g.shadowBlur = 4;
      g.beginPath();
      g.moveTo(0, 0);
      for (let i = 0; i < pts.length; i++) if (len[i] > P.s) g.lineTo((pts[i].x - P.x) * k, (pts[i].y - P.z) * k);
      g.lineTo((DOOR.x - 0.9 - P.x) * k, (DOOR.z - P.z) * k);
      g.stroke();
      g.shadowBlur = 0;
      g.restore();
      // the blip, upright, kept on the edge if it is off the map
      const dx = DOOR.x - 0.9 - P.x;
      const dz = DOOR.z - P.z;
      const cs = Math.cos(P.yaw);
      const sn = Math.sin(P.yaw);
      let bx = ox + (dx * cs - dz * sn) * k;
      let by = oy + (dx * sn + dz * cs) * k;
      const m = 22;
      bx = Math.min(cw - m, Math.max(m, bx));
      by = Math.min(ch - m, Math.max(m, by));
      g.fillStyle = "#f2c037";
      g.strokeStyle = "#000";
      g.lineWidth = 3;
      g.beginPath();
      g.arc(bx, by, 17, 0, Math.PI * 2);
      g.fill();
      g.stroke();
      g.fillStyle = "#000";
      g.font = "900 20px Inter, Arial";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("M", bx, by + 1);
      // him: always at the middle, always pointing up
      g.fillStyle = "#fff";
      g.strokeStyle = "#000";
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(ox, oy - 16);
      g.lineTo(ox + 12, oy + 14);
      g.lineTo(ox, oy + 7);
      g.lineTo(ox - 12, oy + 14);
      g.closePath();
      g.fill();
      g.stroke();
    }

    // ---- frame ----
    const camPos = new THREE.Vector3();
    const camLook = new THREE.Vector3();
    function playerAt(t) {
      // outside: walking the path; inside: walking onto the mats
      if (t < T_INSIDE) {
        const s = walkS(t);
        const p = pathAt(s);
        const yaw = Math.atan2(-p.dx, -p.dz);
        const g = t < T_WALK ? 0 : Math.min(1, (walkS(t + 120) - s) / (SPEED * 0.12) + 0.0);
        return { x: p.x, z: p.z, yaw, s, g: clamp01(g) };
      }
      const k = clamp01((t - T_INSIDE) / 2900);
      const e = 1 - Math.pow(1 - k, 2);
      const s = 5.2 * e;
      const g = clamp01((1 - k) * 2.4);
      return { x: FACADE_X + 0.8 - s, z: DOOR_Z, yaw: Math.PI / 2, s: PATH.total + s, g };
    }
    function renderAt(t) {
      const P = playerAt(t);
      player.root.position.set(P.x, 0.16 + (t >= T_INSIDE ? 0.04 : 0), P.z);
      player.barefoot(t >= T_INSIDE); // shoes off at the door
      player.root.rotation.y = P.yaw;
      const stride = 1.45;
      pose(player, (P.s / stride) * Math.PI * 2, P.g, { lean: 0.04 * P.g, breath: Math.sin(t / 700) });
      // the line bows to him as the mission passes
      const bow = Math.sin(Math.PI * clamp01((t - T_PASSED + 200) / 1300)) * 0.55;
      students.forEach((st, i) => {
        const b = Math.sin(Math.PI * clamp01((t - T_PASSED + 200 - i * 60) / 1400)) * 0.85;
        pose(st, st.phase, 0, { lean: b, breath: Math.sin(t / 800 + st.phase) });
      });
      void bow;

      // the pickup turns and bobs until he walks through it
      const got = t >= T_PICK;
      pickup.visible = !got;
      pickup.rotation.y = t / 600;
      pickup.position.y = 0.42 + Math.sin(t / 260) * 0.05;
      const sk = (t - T_PICK) / 520;
      for (const sp of sparks) {
        sp.visible = sk >= 0 && sk < 1;
        if (!sp.visible) continue;
        const r = 0.15 + sk * 0.7;
        sp.position.set(pickAt.x + Math.cos(sp.userData.a) * r, 0.45 + sk * sp.userData.up, pickAt.z + Math.sin(sp.userData.a) * r);
        sp.scale.setScalar(0.22 * (1 - sk));
        sp.material.opacity = 1 - sk;
      }

      // door swings open as he arrives
      const open = ss(T_ARRIVE - 600, T_ARRIVE + 100, t) * (t < T_INSIDE + 1800 ? 1 : 1 - ss(T_INSIDE + 1800, T_INSIDE + 2400, t));
      doorPivot.rotation.y = open * 1.3; // swings in

      // marker pulses; gone once he is through it
      const mk = t < T_ARRIVE ? 1 : 1 - ss(T_ARRIVE, T_ARRIVE + 250, t);
      marker.material.opacity = (0.75 + 0.25 * Math.sin(t / 220)) * mk;
      ring.material.opacity = 0.9 * mk;
      marker.visible = ring.visible = mk > 0.01;

      // ---- camera ----
      if (t < T_INSIDE) {
        // third person, over the right shoulder, with a little lag
        const lagP = playerAt(Math.max(T_WALK, t - 280));
        const fx = -Math.sin(lagP.yaw);
        const fz = -Math.cos(lagP.yaw);
        const rx = -fz;
        const rz = fx;
        const tp = new THREE.Vector3(P.x - fx * 4.1 + rx * 0.85, 2.25, P.z - fz * 4.1 + rz * 0.85);
        const tl = new THREE.Vector3(P.x + fx * 5 + rx * 0.3, 1.2, P.z + fz * 5 + rz * 0.3);
        // drone: high and wide, swooping down onto the shoulder
        const k = easeIO(clamp01((t - T_DRONE) / (T_GAME - T_DRONE)));
        const dp = new THREE.Vector3(P.x + 9, 13, P.z + 11);
        const dl = new THREE.Vector3(P.x - 2, 1.5, P.z - 6);
        camPos.copy(dp).lerp(tp, k);
        camLook.copy(dl).lerp(tl, k);
        camPos.y += Math.sin(t / 380) * 0.012 * k; // handheld-ish bob with the stride
        camera.fov = lerp(58, 52, k);
      } else {
        // inside, by the far wall, watching him come in
        const k = (t - T_INSIDE) / (END_MS - T_INSIDE);
        // from behind the line of students, looking at the door he comes in by
        camPos.set(FACADE_X - 9.4 + k * 0.5, 1.68, DOOR_Z - 0.37);
        camLook.set(FACADE_X - 0.6, 1.25 - 0.1 * k, DOOR_Z - 0.1);
        camera.fov = 52;
      }
      camera.position.copy(camPos);
      camera.lookAt(camLook);
      camera.updateProjectionMatrix();
      // the sun's shadow box follows the action
      const fcs = new THREE.Vector3(P.x, 0, P.z);
      sun.target.position.copy(fcs);
      sun.position.copy(fcs).addScaledVector(sunDir, 60);
      const sc = sun.shadow.camera;
      sc.left = -18; sc.right = 18; sc.top = 18; sc.bottom = -18;
      sc.updateProjectionMatrix();
      composer.render();

      // ---- overlay ----
      const fx = (k, o, y = 0, s = 1) => {
        const el = R[k];
        if (!el) return;
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translateY(${y.toFixed(2)}px) scale(${s.toFixed(4)})`;
      };
      fx("badge", ss(T_BADGE, T_BADGE + 250, t) * (1 - ss(T_DRONE - 300, T_DRONE - 60, t)), 0, lerp(0.92, 1, ss(T_BADGE, T_BADGE + 900, t)));
      if (R.badgebg) R.badgebg.style.opacity = (1 - ss(T_DRONE - 120, T_DRONE + 200, t)).toFixed(3);
      fx("title", ss(T_DRONE + 250, T_DRONE + 650, t) * (1 - ss(T_GAME - 350, T_GAME, t)), 0, lerp(1.1, 1, ss(T_DRONE + 250, T_DRONE + 1200, t)));
      const hud = ss(T_GAME, T_GAME + 400, t) * (1 - ss(T_ARRIVE, T_ARRIVE + 300, t));
      fx("minimap", hud, (1 - ss(T_GAME, T_GAME + 400, t)) * 16);
      fx("cash", hud);
      fx("objective", ss(T_GAME + 1900, T_GAME + 2150, t) * (1 - ss(T_GAME + 5600, T_GAME + 5900, t)));
      const ph = ss(T_GAME + 2600, T_GAME + 2900, t) * (1 - ss(T_GAME + 5600, T_GAME + 5900, t));
      fx("phone", ph, (1 - ss(T_GAME + 2600, T_GAME + 2950, t)) * -60);
      drawRadar(P);
      // a big balance, with the odd payout landing
      const pay = ss(T_PICK, T_PICK + 450, t);
      if (R.money) R.money.textContent = "$" + Math.round(84672150 + 25000 * pay).toLocaleString("en-US");
      fx("plus", ss(T_PICK, T_PICK + 150, t) * (1 - ss(T_PICK + 1100, T_PICK + 1400, t)), -ss(T_PICK, T_PICK + 1400, t) * 12);
      // one wanted star, flashing
      // three of five wanted stars, flashing
      const starOn = Math.floor(t / 320) % 2 === 0;
      for (let i = 0; i < 3; i++) if (R["star" + i]) R["star" + i].style.fill = starOn ? "#ffffff" : "rgba(255,255,255,0.16)";
      const cut = t >= T_INSIDE - 250 && t < T_INSIDE + 250 ? 1 - Math.abs(t - T_INSIDE) / 250 : 0;
      if (R.fade) R.fade.style.opacity = Math.max(cut, ss(END_MS - 450, END_MS, t)).toFixed(3);
      fx("band", ss(T_PASSED, T_PASSED + 200, t) * (1 - ss(T_END - 300, T_END, t)));
      fx("passed", ss(T_PASSED + 100, T_PASSED + 260, t) * (1 - ss(T_END - 300, T_END, t)), 0, lerp(1.5, 1, ss(T_PASSED + 100, T_PASSED + 420, t)));
      fx("respect", ss(T_PASSED + 600, T_PASSED + 760, t) * (1 - ss(T_END - 300, T_END, t)));
      fx("endbg", ss(T_END, T_END + 500, t));
      fx("endlogo", ss(T_END + 200, T_END + 600, t), 0, lerp(0.8, 1, ss(T_END + 200, T_END + 700, t)));
      fx("endtitle", ss(T_END + 400, T_END + 800, t), (1 - ss(T_END + 400, T_END + 850, t)) * 10);
      fx("enroll", ss(T_END + 1000, T_END + 1300, t), (1 - ss(T_END + 1000, T_END + 1350, t)) * 10);
      fx("addr", ss(T_END + 1400, T_END + 1700, t), (1 - ss(T_END + 1400, T_END + 1750, t)) * 8);
    }

    let raf;
    let disposed = false;
    (async () => {
      try {
        await Promise.all([document.fonts.load("900 40px Inter"), document.fonts.load('400 60px "Bangers"')]);
      } catch (e) { /* fonts are a nicety */ }
      await new Promise((r) => setTimeout(r, 300)); // logo textures
      if (disposed) return;
      renderAt(0);
      if (renderMode) {
        window.__renderAt = (ms) => renderAt(ms);
        window.__gameEnd = END_MS;
        window.__gameMarks = { T_PICK, T_BADGE, T_DRONE, T_GAME, T_WALK, T_ARRIVE, T_INSIDE, T_PASSED, T_END, END_MS, STRIDE: 1.45, SPEED };
        window.__gameSteps = (() => {
          // footfall times, for the sound: a foot lands every half stride
          const out = [];
          let last = 0;
          for (let ms = 0; ms < END_MS; ms += 5) {
            const s = playerAt(ms).s;
            const k = Math.floor(s / (1.45 / 2));
            if (k > last) {
              out.push([ms, ms >= T_INSIDE ? 1 : 0]);
              last = k;
            }
          }
          return out;
        })();
        window.__ready = true;
        return;
      }
      const t0 = performance.now();
      const loop = (now) => {
        renderAt((now - t0) % END_MS);
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
  }, [R]);

  return (
    <div className="gg-stage">
      <div className="gg-canvas" ref={mountRef} />
      <div className="gg-grade" aria-hidden />

      {/* the publisher badge on black, then the title card over the drone shot */}
      <div className="gg-badgebg" ref={ref("badgebg")} />
      <div className="gg-badge" ref={ref("badge")}>
        <div className="gg-badge-box">M<span>★</span></div>
      </div>

      <div className="gg-title" ref={ref("title")}>
        <div className="gg-title-top">{missionTop}</div>
        <div className="gg-title-name">{missionName}</div>
      </div>

      <div className="gg-phone" ref={ref("phone")}>
        <div className="gg-phone-av"><img src={coachPhoto || mapleLogo} alt="" /></div>
        <div className="gg-phone-text">
          <div className="gg-phone-app">MESSAGES · now</div>
          <div className="gg-phone-from">{textFrom}</div>
          <div className="gg-phone-body">{textBody}</div>
        </div>
      </div>

      <div className="gg-tr" ref={ref("cash")}>
        <svg className="gg-fist" viewBox="0 0 64 64" aria-hidden>
          <g fill="#fff" stroke="#000" strokeWidth="2.5" strokeLinejoin="round">
            <rect x="17" y="44" width="28" height="16" rx="4" />
            <rect x="9" y="22" width="46" height="26" rx="9" />
            <rect x="9" y="10" width="12" height="22" rx="6" />
            <rect x="20.5" y="8" width="12" height="22" rx="6" />
            <rect x="32" y="9" width="12" height="22" rx="6" />
            <rect x="43.5" y="12" width="11" height="20" rx="5.5" />
            <path d="M7 34 C 7 28, 13 27, 18 30 L 34 36 C 38 38, 37 44, 32 44 L 15 44 C 10 44, 7 40, 7 34 Z" />
          </g>
        </svg>
        <div className="gg-stars">
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} viewBox="0 0 24 24" aria-hidden>
              <path ref={i < 3 ? ref("star" + i) : undefined} d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z" />
            </svg>
          ))}
        </div>
        <div className="gg-money"><span ref={ref("money")}>$84,672,150</span></div>
        <div className="gg-plus" ref={ref("plus")}>+$25,000</div>
      </div>

      <div className="gg-minimap" ref={ref("minimap")}>
        <div className="gg-map">
          <canvas ref={ref("mapcanvas")} width="408" height="302" />
        </div>
        <div className="gg-bars"><i className="gg-hp" /><i className="gg-ap" /></div>
      </div>

      <div className="gg-objective" ref={ref("objective")}>
        {objective[0]}<em>{objective[1]}</em>{objective[2]}
      </div>

      <div className="gg-band" ref={ref("band")} />
      <div className="gg-passed" ref={ref("passed")}>MISSION PASSED</div>
      <div className="gg-respect" ref={ref("respect")}>RESPECT +</div>

      <div className="gg-endbg" ref={ref("endbg")} />
      <div className="gg-end">
        <img className="gg-endlogo" ref={ref("endlogo")} src={mapleLogo} alt="Maple Jiu-Jitsu" />
        <div className="gg-endtitle" ref={ref("endtitle")}>MAPLE JIU-JITSU</div>
        <div className="gg-enroll" ref={ref("enroll")}>NOW ENROLLING</div>
        <div className="gg-addr" ref={ref("addr")}>
          <span>{address}</span>
          <span>{site}</span>
        </div>
      </div>

      <div className="gg-vignette" aria-hidden />
      <div className="gg-fade" ref={ref("fade")} aria-hidden />
    </div>
  );
}
