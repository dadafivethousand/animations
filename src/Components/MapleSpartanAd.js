// MapleSpartanAd.js — Maple Jiu-Jitsu as a 300-style Spartan charge.
//
//   A  "WHAT IS YOUR PROFESSION?" — the camera creeps up on a shield wall;
//      they raise their spears: AHOO!
//   B  three front-rank Spartans throw at the viewer in slow motion: two
//      whip past, the third hits the lens and the screen cracks
//   C  the phalanx charges straight at the camera; the lead shield slams
//      into the lens, cut to black
//   D  end card: one Maple shield in the dark, embers, TRAIN LIKE A SPARTAN
//
// Every shield is bronze with the Maple leaf and MAPLE JIU-JITSU round the
// rim. Pure function of time: ?render=1 hands the clock to
// tools/record-frames.js via window.__renderAt.
import React from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import "../Stylesheets/MapleSpartanAd.css";
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
const T_Q0 = 600; // "WHAT IS YOUR PROFESSION?"
const T_AHOO = 2500;
const T_B = 3300; // shot B: the throw
const RELEASES = [3750, 3950, 4150];
const FLIGHT = [1050, 1050, 1150];
const T_HIT = RELEASES[2] + FLIGHT[2]; // the third spear reaches the lens
const T_C = T_HIT + 650; // shot C: the charge
const RUN_V = 4.6; // m/s
const C_Z0 = -14; // front rank starts here
const CAM_C = new THREE.Vector3(0, 0.78, 2.3);
// the lead shield reaches the lens
const T_SLAM = T_C + 280 + ((1.45 - C_Z0) / RUN_V) * 1000;
const T_D = T_SLAM + 350; // end card
const END_MS = T_D + 5200;

const canvasTex = (w, h, draw, { srgb = true, repeat = null } = {}) => {
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
};

export default function MapleSpartanAd({
  question = "WHAT IS YOUR PROFESSION?",
  shout = "AHOO!",
  name = "MAPLE JIU-JITSU",
  tag = "TRAIN LIKE A SPARTAN",
  enroll = "NOW ENROLLING",
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
    const rnd = mulberry32(300);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const FOG = new THREE.Color("#c98a4e");
    const fogObj = new THREE.Fog(FOG, 14, 70);
    scene.fog = fogObj;
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.03, 400);
    const world = new THREE.Group();
    scene.add(world);

    // ---- a burning amber sky ----
    const sunDir = new THREE.Vector3(-0.9, 0.18, -0.25).normalize();
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
        "  vec3 hor = vec3(1.0, 0.62, 0.3);",
        "  vec3 mid = vec3(0.72, 0.34, 0.16);",
        "  vec3 top = vec3(0.2, 0.08, 0.06);",
        "  vec3 c = mix(hor, mid, smoothstep(0.0, 0.18, h));",
        "  c = mix(c, top, smoothstep(0.18, 0.7, h));",
        "  float s = max(0.0, dot(normalize(vD), sunDir));",
        "  c += vec3(1.0, 0.7, 0.4) * pow(s, 8.0) * 0.35;",
        "  gl_FragColor = vec4(c, 1.0);",
        "}",
      ].join("\n"),
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(300, 48, 24), skyMat);
    world.add(sky);

    const sun = new THREE.DirectionalLight("#ffc690", 3.4);
    sun.position.set(-9, 11, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 80 });
    scene.add(sun, sun.target);
    const fillL = new THREE.HemisphereLight("#ffb27a", "#4a2a18", 0.9);
    scene.add(fillL);
    const rim = new THREE.DirectionalLight("#ff9a55", 1.4);
    rim.position.set(7, 5, -10);
    scene.add(rim);

    // ---- the ground: packed dust ----
    const dirt = canvasTex(1024, 1024, (g, w, h) => {
      g.fillStyle = "#8a6440";
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 90000; i++) {
        const v = rnd();
        g.fillStyle = v < 0.5 ? `rgba(60,38,20,${rnd() * 0.18})` : `rgba(200,160,110,${rnd() * 0.12})`;
        g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 3, 1 + rnd() * 3);
      }
      for (let i = 0; i < 260; i++) {
        g.fillStyle = `rgba(50,32,18,${0.15 + rnd() * 0.25})`;
        g.beginPath();
        g.ellipse(rnd() * w, rnd() * h, 2 + rnd() * 6, 1 + rnd() * 4, rnd() * 3, 0, Math.PI * 2);
        g.fill();
      }
    }, { repeat: [24, 24] });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshStandardMaterial({ map: dirt, roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    world.add(ground);
    // rocks and far ridges in the haze
    const rockMat = new THREE.MeshStandardMaterial({ color: "#6e5038", roughness: 1 });
    for (let i = 0; i < 40; i++) {
      const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.15 + rnd() * 0.5, 0), rockMat);
      const x = (rnd() - 0.5) * 30;
      const z = -4 - rnd() * 40;
      if (Math.abs(x) < 4.5 && z > -18) continue;
      r.position.set(x, 0.05, z);
      r.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
      r.castShadow = true;
      world.add(r);
    }
    for (let i = 0; i < 9; i++) {
      const hill = new THREE.Mesh(new THREE.SphereGeometry(14 + rnd() * 10, 24, 12), new THREE.MeshStandardMaterial({ color: "#8c5a34", roughness: 1 }));
      hill.scale.y = 0.28;
      hill.position.set((i - 4) * 22 + (rnd() - 0.5) * 8, -2, -70 - rnd() * 20);
      world.add(hill);
    }

    // ---- the shield face: bronze, the Maple leaf, MAPLE JIU-JITSU round the rim ----
    const logoImg = new Image();
    logoImg.src = mapleLogo;
    function shieldCanvas() {
      const S = 1024;
      const c = document.createElement("canvas");
      c.width = c.height = S;
      const g = c.getContext("2d");
      const C = S / 2;
      let gr = g.createRadialGradient(C * 0.8, C * 0.7, 40, C, C, C);
      gr.addColorStop(0, "#f0c46a");
      gr.addColorStop(0.45, "#c48a35");
      gr.addColorStop(0.85, "#7a4f1e");
      gr.addColorStop(1, "#4a2e10");
      g.fillStyle = gr;
      g.fillRect(0, 0, S, S);
      // hammered bronze
      const r2 = mulberry32(7);
      for (let i = 0; i < 2600; i++) {
        const x = r2() * S;
        const y = r2() * S;
        const rr = 3 + r2() * 9;
        const g2 = g.createRadialGradient(x - rr / 3, y - rr / 3, 0, x, y, rr);
        g2.addColorStop(0, "rgba(255,230,170,0.16)");
        g2.addColorStop(1, "rgba(60,30,10,0.12)");
        g.fillStyle = g2;
        g.beginPath();
        g.arc(x, y, rr, 0, Math.PI * 2);
        g.fill();
      }
      // rim band
      g.lineWidth = 46;
      g.strokeStyle = "#5a3814";
      g.beginPath();
      g.arc(C, C, C - 30, 0, Math.PI * 2);
      g.stroke();
      g.lineWidth = 6;
      g.strokeStyle = "#e8b75c";
      g.beginPath();
      g.arc(C, C, C - 56, 0, Math.PI * 2);
      g.stroke();
      // MAPLE JIU-JITSU round the top, set into the bronze
      const text = " MAPLE  JIU-JITSU ";
      g.font = '900 80px "Cinzel", Georgia, serif';
      g.textAlign = "center";
      g.textBaseline = "middle";
      const rad = C - 120;
      const span = Math.PI * 1.05;
      for (let i = 0; i < text.length; i++) {
        const a = -Math.PI / 2 - span / 2 + (span * (i + 0.5)) / text.length;
        g.save();
        g.translate(C + Math.cos(a) * rad, C + Math.sin(a) * rad);
        g.rotate(a + Math.PI / 2);
        g.fillStyle = "rgba(255,225,160,0.55)";
        g.fillText(text[i], 2, 3);
        g.fillStyle = "#3a1f0a";
        g.fillText(text[i], 0, 0);
        g.restore();
      }
      // the leaf, embossed dark into the middle
      if (logoImg.complete && logoImg.naturalWidth) {
        const t = document.createElement("canvas");
        t.width = t.height = 560;
        const tg = t.getContext("2d");
        tg.drawImage(logoImg, 0, 0, 560, 560 * (logoImg.naturalHeight / logoImg.naturalWidth));
        tg.globalCompositeOperation = "source-in";
        tg.fillStyle = "#3a1f0a";
        tg.fillRect(0, 0, 560, 560);
        g.globalAlpha = 0.5;
        g.drawImage(t, C - 280 + 4, C - 250 + 5);
        g.globalAlpha = 1;
        const hi = document.createElement("canvas");
        hi.width = hi.height = 560;
        const hg = hi.getContext("2d");
        hg.drawImage(t, 0, 0);
        hg.globalCompositeOperation = "source-in";
        hg.fillStyle = "rgba(255,220,150,0.5)";
        hg.fillRect(0, 0, 560, 560);
        g.drawImage(hi, C - 280 - 3, C - 250 - 3);
        g.drawImage(t, C - 280, C - 250);
      }
      return c;
    }
    const shieldTex = new THREE.CanvasTexture(document.createElement("canvas"));
    shieldTex.colorSpace = THREE.SRGBColorSpace;
    shieldTex.anisotropy = 16;
    shieldTex.center.set(0.5, 0.5);
    shieldTex.rotation = Math.PI / 2; // the cylinder cap's UVs sit a quarter turn off
    const bronze = new THREE.MeshStandardMaterial({ color: "#a4732c", metalness: 0.85, roughness: 0.38 });
    const shieldFaceMat = new THREE.MeshStandardMaterial({ map: shieldTex, metalness: 0.7, roughness: 0.42 });
    const woodMat = new THREE.MeshStandardMaterial({ color: "#4a3018", roughness: 0.9 });

    // ---- geometry shared by every Spartan ----
    const G = {
      torso: (() => {
        const prof = [
          [0.0, 0], [0.155, 0], [0.16, 0.08], [0.15, 0.2], [0.17, 0.34], [0.205, 0.46], [0.195, 0.52], [0.12, 0.56], [0.0, 0.57],
        ].map(([r, y]) => new THREE.Vector2(r, y));
        const g = new THREE.LatheGeometry(prof, 32);
        g.scale(1, 1, 0.64);
        return g;
      })(),
      pec: new THREE.SphereGeometry(0.085, 14, 10),
      shoulder: new THREE.SphereGeometry(0.085, 16, 12),
      upperArm: new THREE.CapsuleGeometry(0.058, 0.2, 6, 12),
      foreArm: new THREE.CapsuleGeometry(0.05, 0.2, 6, 12),
      bracer: new THREE.CylinderGeometry(0.056, 0.052, 0.14, 14),
      hand: new THREE.SphereGeometry(0.046, 12, 10),
      neck: new THREE.CylinderGeometry(0.058, 0.064, 0.12, 12),
      helmet: new THREE.SphereGeometry(0.135, 28, 20),
      cheek: new RoundedBoxGeometry(0.06, 0.13, 0.05, 2, 0.02),
      slit: new RoundedBoxGeometry(0.13, 0.024, 0.02, 1, 0.008),
      noseSlit: new RoundedBoxGeometry(0.026, 0.09, 0.02, 1, 0.008),
      crest: new THREE.TorusGeometry(0.15, 0.045, 10, 28, Math.PI),
      skirt: new THREE.CylinderGeometry(0.19, 0.25, 0.32, 24, 1, true),
      belt: new THREE.TorusGeometry(0.175, 0.025, 8, 28),
      thigh: new THREE.CapsuleGeometry(0.085, 0.26, 6, 12),
      shin: new THREE.CapsuleGeometry(0.062, 0.3, 6, 12),
      greave: new THREE.CylinderGeometry(0.074, 0.064, 0.32, 16),
      sandal: new RoundedBoxGeometry(0.1, 0.05, 0.26, 2, 0.02),
      shieldDisc: new THREE.CylinderGeometry(0.46, 0.46, 0.05, 56),
      shieldRim: new THREE.TorusGeometry(0.455, 0.028, 10, 56),
      shaft: new THREE.CylinderGeometry(0.016, 0.016, 2.5, 8),
      tip: new THREE.ConeGeometry(0.035, 0.26, 10),
      butt: new THREE.ConeGeometry(0.022, 0.12, 8),
    };
    const skinTones = ["#b9774d", "#a8693f", "#c4865a", "#9c5f38", "#b07048"];
    const skirtTex = canvasTex(256, 64, (g, w, h) => {
      g.fillStyle = "#5a3a20";
      g.fillRect(0, 0, w, h);
      for (let x = 0; x < w; x += 16) {
        g.fillStyle = "rgba(0,0,0,0.45)";
        g.fillRect(x, 0, 2, h);
        g.fillStyle = "rgba(255,200,140,0.12)";
        g.fillRect(x + 3, 0, 2, h);
      }
    });
    const skirtMat = new THREE.MeshStandardMaterial({ map: skirtTex, roughness: 0.85, side: THREE.DoubleSide });
    const leatherMat = new THREE.MeshStandardMaterial({ color: "#4a2c16", roughness: 0.8 });
    const crestMat = new THREE.MeshStandardMaterial({ color: "#9e1a1c", roughness: 0.95 });
    const capeMat = new THREE.MeshStandardMaterial({ color: "#8e1517", roughness: 0.9, side: THREE.DoubleSide });
    const darkMat = new THREE.MeshStandardMaterial({ color: "#0b0705", roughness: 1 });

    function makeSpear() {
      // tip along +y; held at the balance point (the origin)
      const g = new THREE.Group();
      const shaft = new THREE.Mesh(G.shaft, woodMat);
      shaft.position.y = -0.35;
      g.add(shaft);
      const tip = new THREE.Mesh(G.tip, bronze);
      tip.position.y = 1.03;
      g.add(tip);
      const butt = new THREE.Mesh(G.butt, bronze);
      butt.position.y = -1.66;
      butt.rotation.x = Math.PI;
      g.add(butt);
      g.traverse((o) => o.isMesh && (o.castShadow = true));
      return g;
    }
    function makeShield() {
      const g = new THREE.Group();
      const disc = new THREE.Mesh(G.shieldDisc, [bronze, shieldFaceMat, woodMat]);
      disc.rotation.x = Math.PI / 2; // face (+y cap) toward +z
      g.add(disc);
      const rimM = new THREE.Mesh(G.shieldRim, bronze);
      rimM.position.z = 0.025;
      g.add(rimM);
      g.traverse((o) => o.isMesh && (o.castShadow = true));
      return g;
    }

    // a Spartan, facing +z
    function spartan(seed) {
      const r = mulberry32(seed);
      const skin = new THREE.MeshStandardMaterial({ color: skinTones[Math.floor(r() * skinTones.length)], roughness: 0.6 });
      const root = new THREE.Group();
      const pelvis = new THREE.Group();
      pelvis.position.y = 0.95;
      root.add(pelvis);
      const skirt = new THREE.Mesh(G.skirt, skirtMat);
      skirt.position.y = -0.1;
      skirt.scale.z = 0.75;
      pelvis.add(skirt);
      const belt = new THREE.Mesh(G.belt, bronze);
      belt.rotation.x = Math.PI / 2;
      belt.scale.set(1.05, 0.75, 1);
      belt.position.y = 0.04;
      pelvis.add(belt);
      const spine = new THREE.Group();
      spine.position.y = 0.04;
      pelvis.add(spine);
      spine.add(new THREE.Mesh(G.torso, skin));
      for (const s of [-1, 1]) {
        const p = new THREE.Mesh(G.pec, skin);
        p.scale.set(1.15, 0.75, 0.55);
        p.position.set(0.08 * s, 0.42, 0.075);
        spine.add(p);
      }
      const neck = new THREE.Mesh(G.neck, skin);
      neck.position.y = 0.6;
      spine.add(neck);
      const head = new THREE.Group();
      head.position.y = 0.74;
      spine.add(head);
      const helm = new THREE.Mesh(G.helmet, bronze);
      helm.scale.set(0.92, 1.12, 1.05);
      head.add(helm);
      for (const s of [-1, 1]) {
        const ch = new THREE.Mesh(G.cheek, bronze);
        ch.position.set(0.05 * s, -0.09, 0.095);
        ch.rotation.y = -0.35 * s;
        head.add(ch);
      }
      const slit = new THREE.Mesh(G.slit, darkMat);
      slit.position.set(0, 0.015, 0.135);
      head.add(slit);
      const ns = new THREE.Mesh(G.noseSlit, darkMat);
      ns.position.set(0, -0.06, 0.128);
      head.add(ns);
      const crest = new THREE.Mesh(G.crest, crestMat);
      crest.scale.z = 0.42;
      crest.rotation.y = Math.PI / 2;
      crest.position.y = 0.07;
      head.add(crest);
      // the cape: hangs from the shoulders, deformed per frame
      const capeGeo = new THREE.PlaneGeometry(0.62, 1.25, 6, 12);
      capeGeo.translate(0, -0.625, 0);
      const cape = new THREE.Mesh(capeGeo, capeMat);
      cape.position.set(0, 0.54, -0.13);
      cape.userData.rest = capeGeo.attributes.position.array.slice();
      spine.add(cape);
      const limbs = {};
      for (const s of [-1, 1]) {
        const sh = new THREE.Group();
        sh.position.set(0.215 * s, 0.47, 0);
        spine.add(sh);
        sh.add(new THREE.Mesh(G.shoulder, skin));
        const ua = new THREE.Mesh(G.upperArm, skin);
        ua.position.y = -0.15;
        sh.add(ua);
        const elbow = new THREE.Group();
        elbow.position.y = -0.3;
        sh.add(elbow);
        const fa = new THREE.Mesh(G.foreArm, skin);
        fa.position.y = -0.13;
        elbow.add(fa);
        const br = new THREE.Mesh(G.bracer, leatherMat);
        br.position.y = -0.16;
        elbow.add(br);
        const hand = new THREE.Group();
        hand.position.y = -0.3;
        elbow.add(hand);
        hand.add(new THREE.Mesh(G.hand, skin));
        const hip = new THREE.Group();
        hip.position.set(0.1 * s, -0.05, 0);
        pelvis.add(hip);
        const th = new THREE.Mesh(G.thigh, skin);
        th.position.y = -0.2;
        hip.add(th);
        const knee = new THREE.Group();
        knee.position.y = -0.43;
        hip.add(knee);
        const sn = new THREE.Mesh(G.shin, skin);
        sn.position.y = -0.21;
        knee.add(sn);
        const gv = new THREE.Mesh(G.greave, bronze);
        gv.position.y = -0.21;
        knee.add(gv);
        const ankle = new THREE.Group();
        ankle.position.y = -0.45;
        knee.add(ankle);
        const sd = new THREE.Mesh(G.sandal, leatherMat);
        sd.position.set(0, -0.02, 0.05);
        ankle.add(sd);
        limbs[s] = { sh, elbow, hand, hip, knee, ankle };
      }
      // shield on the left, carried in front of the chest
      const shield = makeShield();
      shield.position.set(-0.1, 0.32, 0.46);
      shield.rotation.y = 0.12;
      spine.add(shield);
      // spear in the right hand
      const spear = makeSpear();
      limbs[1].hand.add(spear);
      root.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      root.scale.setScalar(0.96 + r() * 0.1);
      return { root, pelvis, spine, head, limbs, cape, spear, shield, phase: r() * 6 };
    }

    function pose(S, { phase = 0, g = 0, lean = 0, spearArm = 0, spearFlip = false, sway = 0 }) {
      const A = 0.55 * g;
      const K = 1.15 * g;
      for (const s of [-1, 1]) {
        const L = S.limbs[s];
        const ph = phase + (s > 0 ? Math.PI : 0);
        const th = -A * Math.sin(ph);
        const flex = (K * Math.max(0, Math.cos(ph)) + 0.08) * g + (1 - g) * 0.06;
        L.hip.rotation.x = th - lean * 0.6;
        L.knee.rotation.x = flex;
        L.ankle.rotation.x = -(th + flex) * 0.8;
      }
      // shield arm: forward and bent, hidden behind the shield
      const left = S.limbs[-1];
      left.sh.rotation.set(-0.75, 0, 0.28);
      left.elbow.rotation.x = -0.95;
      left.hand.visible = false;
      // spear arm
      const right = S.limbs[1];
      right.sh.rotation.set(spearArm, 0, -0.12);
      right.elbow.rotation.x = spearArm < -0.5 ? -0.25 : -0.15;
      S.spear.rotation.x = spearFlip ? Math.PI : 0;
      S.pelvis.position.y = 0.95 + (0.05 * Math.abs(Math.cos(phase)) - 0.03) * g;
      S.pelvis.rotation.y = 0.1 * Math.sin(phase) * g;
      S.spine.rotation.set(lean, -0.1 * Math.sin(phase) * g + sway, 0);
      S.head.rotation.x = -lean * 0.6;
    }
    function capeWave(S, t, wind) {
      const geo = S.cape.geometry;
      const pos = geo.attributes.position;
      const rest = S.cape.userData.rest;
      for (let i = 0; i < pos.count; i++) {
        const x = rest[i * 3];
        const y = rest[i * 3 + 1]; // 0 .. -1.25
        const d = -y / 1.25;
        const z = -wind * d * d * 0.9 - 0.05 * d + Math.sin(t * 0.009 + d * 5 + x * 6 + S.phase) * 0.06 * d * (0.4 + wind);
        pos.setXYZ(i, x * (1 + d * 0.25), y * (1 - wind * 0.25 * d), z);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    }

    // ---- the phalanx ----
    const army = [];
    const ROWS = [7, 7, 6, 5];
    ROWS.forEach((n, row) => {
      for (let i = 0; i < n; i++) {
        const S = spartan(1000 + row * 31 + i);
        const x = (i - (n - 1) / 2) * 0.98 + (row % 2 ? 0.49 : 0) * 0;
        S.home = new THREE.Vector3(x + (rnd() - 0.5) * 0.08, 0, -6 - row * 1.35 + (rnd() - 0.5) * 0.1);
        S.row = row;
        S.delay = rnd() * 160 + row * 70;
        S.speed = RUN_V * (0.95 + rnd() * 0.1);
        world.add(S.root);
        army.push(S);
      }
    });
    // the three throwers: the front rank's middle three
    const throwers = [2, 3, 4].map((i) => army[i]);
    // a fourth Spartan at the very front of the charge, dead centre: his shield hits the lens
    const lead = army[3];

    // thrown spears
    const flying = RELEASES.map(() => {
      const sp = makeSpear();
      sp.visible = false;
      world.add(sp);
      return sp;
    });
    const CAM_B = new THREE.Vector3(0.05, 1.12, 1.35);
    const LOOK_B = new THREE.Vector3(0, 1.45, -6);
    const TARGETS = [new THREE.Vector3(-0.7, 1.25, 1.7), new THREE.Vector3(0.65, 1.4, 1.7), CAM_B.clone().add(new THREE.Vector3(0, -0.02, -0.12))];
    function spearAt(k, t) {
      const S = throwers[k];
      const start = new THREE.Vector3(S.home.x + 0.24, 2.05, S.home.z + 0.15);
      const end = TARGETS[k];
      const u = (t - RELEASES[k]) / FLIGHT[k];
      const p = start.clone().lerp(end, u);
      p.y += 4 * u * (1 - u) * 0.9;
      return { p, u, start, end };
    }

    // ---- dust in the air ----
    const dustTex = canvasTex(64, 64, (g, w) => {
      const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      gr.addColorStop(0, "rgba(255,225,180,0.9)");
      gr.addColorStop(1, "rgba(255,225,180,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, w, w);
    });
    const DUST = 420;
    const dust = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: dustTex, transparent: true, depthWrite: false, opacity: 0.22, blending: THREE.AdditiveBlending, fog: false }),
      DUST
    );
    dust.frustumCulled = false;
    const dustSeed = Array.from({ length: DUST }, () => ({
      x: (rnd() - 0.5) * 14,
      y: rnd() * 4,
      z: -2.5 - rnd() * 20,
      s: 0.01 + rnd() * 0.03,
      v: 0.1 + rnd() * 0.3,
    }));
    scene.add(dust);
    // kicked-up dust in the charge: big soft puffs behind the runners
    const puffTex = canvasTex(128, 128, (g, w) => {
      const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      gr.addColorStop(0, "rgba(190,140,90,0.55)");
      gr.addColorStop(1, "rgba(190,140,90,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, w, w);
    });
    const PUFF = 160;
    const puffs = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: puffTex, transparent: true, depthWrite: false }), PUFF);
    puffs.frustumCulled = false;
    world.add(puffs);

    // ---- the end card: one shield in the dark ----
    const hero = new THREE.Group();
    const heroShield = makeShield();
    hero.add(heroShield);
    const heroSpearA = makeSpear();
    const heroSpearB = makeSpear();
    heroSpearA.rotation.z = 0.55;
    heroSpearB.rotation.z = -0.55;
    heroSpearA.position.z = heroSpearB.position.z = -0.12;
    hero.add(heroSpearA, heroSpearB);
    hero.position.set(0, 0, 0);
    scene.add(hero);
    const heroKey = new THREE.SpotLight("#ffbf7a", 40, 12, 0.6, 0.6, 1.4);
    heroKey.position.set(-1.6, 2.2, 3.2);
    heroKey.target = heroShield;
    const heroRim = new THREE.PointLight("#ff5a2a", 12, 6, 1.6);
    heroRim.position.set(1.4, -0.6, -1.2);
    scene.add(heroKey, heroRim);
    const EMBER = 140;
    const embers = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: dustTex, transparent: true, depthWrite: false, color: "#ff8a3a", blending: THREE.AdditiveBlending, fog: false, toneMapped: false }),
      EMBER
    );
    embers.frustumCulled = false;
    const emberSeed = Array.from({ length: EMBER }, () => ({ x: (rnd() - 0.5) * 3, z: (rnd() - 0.5) * 2, v: 0.15 + rnd() * 0.35, s: 0.008 + rnd() * 0.018, p: rnd() * 10 }));
    scene.add(embers);

    // ---- post ----
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(window.devicePixelRatio || 1);
    composer.setSize(W, H);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.22, 0.5, 0.95));
    composer.addPass(new OutputPass());

    const dummy = new THREE.Object3D();
    const hidden = new THREE.Matrix4().makeScale(0, 0, 0);
    const look = new THREE.Vector3();

    function renderAt(t) {
      const inD = t >= T_D;
      world.visible = !inD;
      hero.visible = inD;
      heroKey.visible = heroRim.visible = inD;
      embers.visible = inD;
      dust.visible = !inD;
      sun.visible = fillL.visible = rim.visible = !inD;
      scene.background = inD ? new THREE.Color("#050302") : null;
      scene.fog = inD ? null : fogObj;

      if (!inD) {
        const charge = t >= T_C;
        for (const S of army) {
          if (!charge) {
            S.root.position.copy(S.home);
            S.root.rotation.y = 0;
            // the spear goes up on AHOO, and the throwers wind up and throw
            let arm = 0.15;
            let flip = false;
            const a = clamp01((t - T_AHOO) / 180) * (1 - ss(T_AHOO + 650, T_AHOO + 950, t));
            arm = lerp(0.15, Math.PI - 0.15, a);
            const k = throwers.indexOf(S);
            if (k >= 0) {
              const rel = RELEASES[k];
              const wind = ss(rel - 420, rel - 60, t);
              const fire = ss(rel - 60, rel + 90, t);
              if (t > rel - 420) arm = lerp(lerp(0.15, 2.45, wind), -1.25, fire);
              if (t > rel + 600) arm = lerp(-1.25, 0.15, ss(rel + 600, rel + 1100, t));
              S.spear.visible = t < rel;
            } else S.spear.visible = true;
            pose(S, { phase: S.phase, g: 0, spearArm: arm, spearFlip: flip, sway: Math.sin(t / 900 + S.phase) * 0.03 });
            capeWave(S, t, 0.15);
          } else {
            // the charge: rows advance at a sprint, spears lowered
            const tt = Math.max(0, t - T_C - S.delay);
            const accel = 0.28;
            const dist = tt < accel * 1000 ? (S.speed * (tt / 1000) ** 2) / (2 * accel) : S.speed * (tt / 1000 - accel / 2);
            const z0 = C_Z0 - S.row * 1.35 + (S.home.z + 6 + S.row * 1.35);
            S.root.position.set(S.home.x, 0, z0 + dist);
            S.root.rotation.y = 0;
            S.spear.visible = true;
            pose(S, { phase: (dist / 1.9) * Math.PI * 2 + S.phase, g: clamp01(tt / 300), lean: 0.32, spearArm: -1.3, spearFlip: true });
            capeWave(S, t, 0.85);
          }
        }

        // flying spears
        for (let k = 0; k < flying.length; k++) {
          const sp = flying[k];
          const u = (t - RELEASES[k]) / FLIGHT[k];
          sp.visible = !charge && u >= 0 && u < (k === 2 ? 1 : 1.35);
          if (!sp.visible) continue;
          const { p } = spearAt(k, t);
          const q = spearAt(k, t + 8).p;
          sp.position.copy(p);
          const dir = q.sub(p).normalize();
          sp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
          sp.rotateY(t * 0.004);
        }

        // ---- camera ----
        if (t < T_B) {
          const k = easeIO(clamp01(t / T_B));
          camera.position.set(lerp(-0.55, -0.1, k), lerp(0.62, 0.95, k), lerp(3.2, 1.9, k));
          look.set(0, lerp(1.15, 1.4, k), -6);
          camera.fov = 40;
        } else if (!charge) {
          camera.position.copy(CAM_B);
          look.copy(LOOK_B);
          camera.fov = 40;
          // impact
          const d = t - T_HIT;
          if (d > 0) {
            const a = 0.06 * Math.exp(-d / 180);
            camera.position.x += Math.sin(d * 0.11) * a;
            camera.position.y += Math.cos(d * 0.093) * a;
          }
        } else {
          camera.position.copy(CAM_C);
          look.set(0, 1.25, -8);
          // shake that grows as they close
          const lz = lead.root.position.z;
          const close = clamp01((lz + 10) / 11.5);
          const a = 0.004 + 0.03 * close * close;
          camera.position.x += Math.sin(t * 0.071) * a + Math.sin(t * 0.19) * a * 0.5;
          camera.position.y += Math.cos(t * 0.083) * a;
          camera.fov = 44;
        }
        camera.lookAt(look);
        camera.updateProjectionMatrix();

        // dust motes
        for (let i = 0; i < DUST; i++) {
          const d = dustSeed[i];
          dummy.position.set(d.x + Math.sin(t / 2000 + i) * 0.3, (d.y + (t / 1000) * d.v * 0.2) % 4, d.z);
          dummy.quaternion.copy(camera.quaternion);
          dummy.scale.setScalar(d.s * 3);
          dummy.updateMatrix();
          dust.setMatrixAt(i, dummy.matrix);
        }
        dust.instanceMatrix.needsUpdate = true;
        // puffs kicked up behind the charge
        let pi = 0;
        if (charge) {
          for (const S of army) {
            for (let j = 0; j < 6 && pi < PUFF; j++, pi++) {
              const age = ((t - T_C) / 1000 + j * 0.17 + S.phase) % 1.0;
              dummy.position.set(S.root.position.x + Math.sin(j + S.phase) * 0.25, 0.15 + age * 0.6, S.root.position.z - 0.4 - age * 1.6);
              dummy.quaternion.copy(camera.quaternion);
              dummy.scale.setScalar(0.4 + age * 1.4);
              dummy.updateMatrix();
              puffs.setMatrixAt(pi, dummy.matrix);
            }
          }
        }
        for (; pi < PUFF; pi++) puffs.setMatrixAt(pi, hidden);
        puffs.instanceMatrix.needsUpdate = true;
        puffs.material.opacity = 0.5;
      } else {
        // ---- end card ----
        const k = (t - T_D) / 1000;
        hero.rotation.y = Math.sin(k * 0.7) * 0.12;
        hero.position.y = 0.02 + Math.sin(k * 1.2) * 0.01;
        camera.position.set(0, 0.05, 3.7 - k * 0.12);
        camera.fov = 40;
        camera.lookAt(0, 0.05, 0);
        camera.updateProjectionMatrix();
        for (let i = 0; i < EMBER; i++) {
          const e = emberSeed[i];
          const y = ((k * e.v + e.p) % 3) - 1.5;
          dummy.position.set(e.x + Math.sin(k + i) * 0.1, y, e.z);
          dummy.quaternion.copy(camera.quaternion);
          dummy.scale.setScalar(e.s * 3);
          dummy.updateMatrix();
          embers.setMatrixAt(i, dummy.matrix);
        }
        embers.instanceMatrix.needsUpdate = true;
      }
      composer.render();

      // ---- overlay ----
      const fx = (key, o, y = 0, s = 1) => {
        const el = R[key];
        if (!el) return;
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translateY(${y.toFixed(2)}px) scale(${s.toFixed(4)})`;
      };
      fx("q", ss(T_Q0, T_Q0 + 400, t) * (1 - ss(T_AHOO - 250, T_AHOO, t)), (1 - ss(T_Q0, T_Q0 + 600, t)) * 8);
      fx("ahoo", ss(T_AHOO, T_AHOO + 90, t) * (1 - ss(T_AHOO + 700, T_AHOO + 950, t)), 0, lerp(1.6, 1, ss(T_AHOO, T_AHOO + 260, t)));
      // the crack: on the hit, gone at the cut
      const cr = t >= T_HIT && t < T_C;
      if (R.crack) {
        R.crack.style.opacity = cr ? "1" : "0";
        R.crack.style.transform = `scale(${cr ? lerp(0.7, 1, ss(T_HIT, T_HIT + 70, t)) : 1})`;
      }
      let flash = 0;
      if (t >= T_HIT && t < T_HIT + 220) flash = 1 - (t - T_HIT) / 220;
      if (t >= T_C && t < T_C + 160) flash = Math.max(flash, 0.7 * (1 - (t - T_C) / 160));
      if (R.flash) R.flash.style.opacity = (flash * 0.85).toFixed(3);
      let black = 1 - ss(0, 450, t);
      if (t >= T_SLAM && t < T_D) black = 1;
      if (t >= T_D) black = 1 - ss(T_D, T_D + 600, t);
      black = Math.max(black, ss(END_MS - 450, END_MS, t));
      if (R.black) R.black.style.opacity = black.toFixed(3);
      fx("name", ss(T_D + 400, T_D + 900, t), 0, lerp(1.15, 1, ss(T_D + 400, T_D + 1100, t)));
      fx("tag", ss(T_D + 1200, T_D + 1600, t), (1 - ss(T_D + 1200, T_D + 1700, t)) * 10);
      fx("enroll", ss(T_D + 2000, T_D + 2400, t), (1 - ss(T_D + 2000, T_D + 2450, t)) * 8);
    }

    let raf;
    let disposed = false;
    (async () => {
      try {
        await Promise.all([document.fonts.load('900 80px "Cinzel"'), document.fonts.load('700 40px "Cinzel"')]);
      } catch (e) { /* fonts are a nicety */ }
      await new Promise((res) => (logoImg.complete ? res() : (logoImg.onload = logoImg.onerror = res)));
      shieldTex.image = shieldCanvas();
      shieldTex.needsUpdate = true;
      if (disposed) return;
      renderAt(0);
      if (renderMode) {
        window.__renderAt = (ms) => renderAt(ms);
        window.__spartaEnd = END_MS;
        window.__spartaMarks = { T_Q0, T_AHOO, T_B, RELEASES, FLIGHT, T_HIT, T_C, T_SLAM, T_D, END_MS };
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

  // the crack, drawn once
  const crackRef = React.useCallback((el) => {
    R.crack = el;
    if (!el || el.dataset.drawn) return;
    el.dataset.drawn = "1";
    const c = el;
    const w = (c.width = 1080);
    const h = (c.height = 1920);
    const g = c.getContext("2d");
    const r = mulberry32(55);
    const cx = w * 0.5;
    const cy = h * 0.47;
    const rays = [];
    for (let i = 0; i < 17; i++) {
      const a = (i / 17) * Math.PI * 2 + (r() - 0.5) * 0.3;
      const len = 380 + r() * 900;
      const pts = [[cx, cy]];
      let x = cx;
      let y = cy;
      let aa = a;
      for (let s = 0; s < 10; s++) {
        aa += (r() - 0.5) * 0.35;
        x += Math.cos(aa) * (len / 10);
        y += Math.sin(aa) * (len / 10);
        pts.push([x, y]);
      }
      rays.push(pts);
    }
    const stroke = (pts, wd, col) => {
      g.strokeStyle = col;
      g.lineWidth = wd;
      g.beginPath();
      pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
      g.stroke();
    };
    for (const p of rays) stroke(p, 6, "rgba(0,0,0,0.35)");
    for (const p of rays) stroke(p, 2.2, "rgba(255,255,255,0.85)");
    // rings
    for (const rr of [60, 140, 260]) {
      for (let i = 0; i < rays.length; i++) {
        const a = rays[i];
        const b = rays[(i + 1) % rays.length];
        const k = Math.min(a.length - 1, Math.round(rr / 90));
        if (r() < 0.25) continue;
        stroke([a[k], b[k]], 1.6, "rgba(255,255,255,0.7)");
      }
    }
    // the impact itself
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, 70);
    gr.addColorStop(0, "rgba(255,255,255,0.9)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.beginPath();
    g.arc(cx, cy, 70, 0, Math.PI * 2);
    g.fill();
  }, [R]);

  return (
    <div className="sp-stage">
      <div className="sp-canvas" ref={mountRef} />
      <div className="sp-grade" aria-hidden />
      <div className="sp-q" ref={ref("q")}>{question}</div>
      <div className="sp-ahoo" ref={ref("ahoo")}>{shout}</div>
      <canvas className="sp-crack" ref={crackRef} aria-hidden />
      <div className="sp-flash" ref={ref("flash")} aria-hidden />
      <div className="sp-end">
        <div className="sp-name" ref={ref("name")}>{name}</div>
        <div className="sp-spacer" />
        <div className="sp-tag" ref={ref("tag")}>{tag}</div>
        <div className="sp-enroll" ref={ref("enroll")}>
          <span>{enroll}</span>
          <span>{address}</span>
          <span>{site}</span>
        </div>
      </div>
      <div className="sp-vignette" aria-hidden />
      <div className="sp-black" ref={ref("black")} aria-hidden />
    </div>
  );
}
