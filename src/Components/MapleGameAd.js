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
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { makeHuman, poseHuman } from "./MapleGameHuman";
import "../Stylesheets/MapleGameAd.css";
import mapleLogo from "../Images/maple-logo.png";
import mapleBjjLogo from "../Images/maple-bjj-logo.png";

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
        // a shopfront: windows and a sign
        const win = new THREE.Mesh(new THREE.PlaneGeometry(w - 1.2, 2.6), glassMat);
        win.rotation.y = Math.PI / 2;
        win.position.set(FACADE_X + 0.02, 1.65, (z0 + z1) / 2);
        plaza.add(win);
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
    for (const z of [GZ0 - 0.3, DOOR_Z + 0.8, DOOR_Z - 0.8, GZ1 + 0.3]) {
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
    const wallLogo = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), M({ map: wallLogoTex, transparent: true, roughness: 0.6 }));
    wallLogo.rotation.y = Math.PI / 2;
    wallLogo.position.set(FACADE_X - 9.9, 2.7, (GZ0 + GZ1) / 2);
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

    // ---- people ----
    const player = makeHuman(
      { skin: "#c98f68", hair: "#1b120c", top: "#13234b", bottom: "#151517", shoes: "#f4f4f4", sleeve: "short", legs: "shorts" },
      { backDecal: logoTex }
    );
    scene.add(player.mesh);

    // students inside, lined up across the mats, facing the door
    const students = [];
    const SKINS = ["#f1c9a5", "#d49a72", "#9a5f3e", "#e6b48e", "#6e432a", "#c98c64"];
    const GIS = ["#f4f3ef", "#f4f3ef", "#2a4c9c", "#f4f3ef", "#1b1c21", "#f4f3ef"];
    const BELTS = ["#f2f2ee", "#2350b3", "#5b2a8c", "#f2f2ee", "#6a3d1e", "#111114"];
    const HAIRS = ["#2a1a10", "#0e0e10", "#5a3a20", "#2a1a10", "#0e0e10", "#a3784a"];
    for (let i = 0; i < 6; i++) {
      const p = makeHuman({ skin: SKINS[i], hair: HAIRS[i], top: GIS[i], bottom: GIS[i], sleeve: "long", legs: "long", gi: true, belt: BELTS[i], bald: i === 4 });
      p.mesh.position.set(FACADE_X - 7.4 + (rnd() - 0.5) * 0.15, 0.2, DOOR_Z - 3.0 + i * 1.05);
      p.mesh.rotation.y = -Math.PI / 2 + (rnd() - 0.5) * 0.12;
      p.mesh.scale.setScalar(0.94 + rnd() * 0.12);
      p.phase = rnd() * 6;
      room.add(p.mesh);
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
    const ao = new GTAOPass(scene, camera, W, H);
    ao.blendIntensity = 0.85;
    ao.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.2, thickness: 1.2, scale: 1.0 });
    composer.addPass(ao);
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.28, 0.5, 0.95));
    composer.addPass(new OutputPass());

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
      player.mesh.position.set(P.x, 0.16 + (t >= T_INSIDE ? 0.04 : 0), P.z);
      player.mesh.rotation.y = P.yaw;
      const stride = 1.45;
      poseHuman(player, (P.s / stride) * Math.PI * 2, P.g, { lean: 0.05 * P.g, breath: Math.sin(t / 700) });
      // the line bows to him as the mission passes
      const bow = Math.sin(Math.PI * clamp01((t - T_PASSED + 200) / 1300)) * 0.55;
      students.forEach((st, i) => {
        const b = Math.sin(Math.PI * clamp01((t - T_PASSED + 200 - i * 60) / 1400)) * 0.85;
        poseHuman(st, st.phase, 0, { lean: b, breath: Math.sin(t / 800 + st.phase) });
      });
      void bow;

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
      fx("logo6", ss(T_DRONE + 250, T_DRONE + 700, t) * (1 - ss(T_GAME - 450, T_GAME - 100, t)), 0, lerp(1.12, 1, ss(T_DRONE + 250, T_DRONE + 1400, t)));
      fx("title", ss(T_GAME + 150, T_GAME + 450, t) * (1 - ss(T_GAME + 1700, T_GAME + 2000, t)), 0, lerp(1.08, 1, ss(T_GAME + 150, T_GAME + 600, t)));
      const hud = ss(T_GAME, T_GAME + 400, t) * (1 - ss(T_ARRIVE, T_ARRIVE + 300, t));
      fx("minimap", hud, (1 - ss(T_GAME, T_GAME + 400, t)) * 16);
      fx("cash", hud);
      fx("objective", ss(T_GAME + 1900, T_GAME + 2150, t) * (1 - ss(T_GAME + 5600, T_GAME + 5900, t)));
      const ph = ss(T_GAME + 2600, T_GAME + 2900, t) * (1 - ss(T_GAME + 5600, T_GAME + 5900, t));
      fx("phone", ph, (1 - ss(T_GAME + 2600, T_GAME + 2950, t)) * -60);
      if (R.mapinner) {
        R.mapinner.style.transform = `rotate(${(P.yaw * 180) / Math.PI}deg) translateY(${(P.s * 6).toFixed(1)}px)`;
      }
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
        window.__gameMarks = { T_BADGE, T_DRONE, T_GAME, T_WALK, T_ARRIVE, T_INSIDE, T_PASSED, T_END, END_MS, STRIDE: 1.45, SPEED };
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
      <div className="gg-logo6" ref={ref("logo6")}>
        <div className="gg-logo6-words"><span>GRAND</span><span>THEFT</span><span>ARMBAR</span></div>
        <div className="gg-logo6-vi">VI</div>
      </div>

      <div className="gg-title" ref={ref("title")}>
        <div className="gg-title-top">{missionTop}</div>
        <div className="gg-title-name">{missionName}</div>
      </div>

      <div className="gg-phone" ref={ref("phone")}>
        <div className="gg-phone-app">MESSAGES · now</div>
        <div className="gg-phone-from">{textFrom}</div>
        <div className="gg-phone-body">{textBody}</div>
      </div>

      <div className="gg-cash" ref={ref("cash")}>$4,850</div>

      <div className="gg-minimap" ref={ref("minimap")}>
        <div className="gg-map">
          <div className="gg-mapinner" ref={ref("mapinner")}>
            <div className="gg-road" style={{ left: "47%", top: "-40%", width: "8%", height: "180%" }} />
            <div className="gg-road" style={{ left: "-40%", top: "30%", width: "180%", height: "7%" }} />
            <div className="gg-road" style={{ left: "-40%", top: "75%", width: "180%", height: "5%" }} />
            <div className="gg-gps" />
            <div className="gg-blip">M</div>
          </div>
          <div className="gg-me" />
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
