// MaplePirateAd.js — a Jolly Roger snapping in the wind at the masthead; the
// camera pulls back and away to reveal a three-masted galleon running before
// the wind at golden hour.
//
// Real ocean (three's reflective Water with a generated tileable normal
// map), physical sky, a lofted hull painted in world coordinates (planks,
// wales, two red gun strakes with cannon run out), masts, yards, torn sails, jibs,
// shrouds with ratlines, stays, cannon, stern lanterns, foam and wake.
//
// Pure function of time: ?render=1 hands the clock to tools/record-frames.js
// via window.__renderAt. Opens straight on the flag: no black.
import React from "react";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import "../Stylesheets/MaplePirateAd.css";
import { buildWarship } from "./MapleWarship";
import mapleLogo from "../Images/maple-logo.png";
import qrMaple from "../Images/qr-maplebjj.png";

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ss = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
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

const END_MS = 11500;
// the second scene: a Maple warship runs in from the horizon and draws up
// alongside the pirate
// It picks up on the pirate film's last frame (same clock, same camera), so
// the two cut together as one. Times below are from the start of this cut.
const NAVY_END = 8000;
const N_PUNCH0 = 500; // the camera snaps onto the warship
const N_PUNCH1 = 1100;
const N_BOTH0 = 5600; // from here the frame opens to hold both ships
// the third cut: picks up where the navy cut ends. The frame opens to the
// whole pirate, the destroyer fires, the pirate burns and goes down.
const STRIKE_END = 12500;
const S_ZOOM1 = 1600;
const S_LAUNCH = [1500, 1800, 2100, 2400];
const S_FLIGHT = 2200;
const S_MAIN_FALL = 4150;
const S_FORE_FALL = 4750;
const S_SINK0 = 5600;
const S_SINK1 = 12300;
const SHIP_V = 2.4; // m/s

// ---------------- the hull, as functions of x (bow at +18) ----------------
const HL = 36;
const tOf = (x) => (x + HL / 2) / HL; // 0 stern .. 1 bow
function halfBeam(x) {
  const t = tOf(x);
  if (t > 0.6) return 5 * Math.pow(Math.max(0, 1 - Math.pow((t - 0.6) / 0.4, 2.2)), 0.5);
  return 5 * (0.78 + 0.22 * Math.sin((t / 0.6) * (Math.PI / 2)));
}
function gunwale(x) {
  const t = tOf(x);
  return 3.0 + 1.6 * Math.pow(Math.max(0, (0.3 - t) / 0.3), 1.5) + 1.1 * Math.pow(Math.max(0, (t - 0.72) / 0.28), 2);
}
function keelY(x) {
  const t = tOf(x);
  return -3.2 + (t > 0.84 ? 3.4 * Math.pow((t - 0.84) / 0.16, 2) : 0) + (t < 0.05 ? 0.6 * (0.05 - t) / 0.05 : 0);
}
function widthFactor(v) {
  if (v < 0.55) return Math.pow(Math.sin((v / 0.55) * (Math.PI / 2)), 0.55);
  return 1 - 0.12 * Math.pow((v - 0.55) / 0.45, 1.5);
}
function halfWidthAt(x, y) {
  const k = keelY(x);
  const g = gunwale(x);
  const v = clamp01((y - k) / (g - k));
  return halfBeam(x) * widthFactor(v);
}

function canvas(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  return c;
}
function tex(c, { srgb = true, repeat = null, aniso = 8 } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  t.anisotropy = aniso;
  return t;
}

export default function MaplePirateAd({ variant = "pirate" }) {
  // ?scene=pirate|navy overrides the prop, so one dev server can render both cuts
  const sceneParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("scene") : null;
  const cut = sceneParam || variant;
  const strike = cut === "strike";
  const navy = cut === "navy" || strike;
  const mountRef = React.useRef(null);

  React.useEffect(() => {
    const renderMode = new URLSearchParams(window.location.search).get("render") === "1";
    const mount = mountRef.current;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const rnd = mulberry32(1717);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    const aniso = renderer.capabilities.getMaxAnisotropy();

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#e7b58f", 400, 2600);
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 20000);

    // ---- sky and sun: golden hour ----
    const sunDir = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(82), THREE.MathUtils.degToRad(58));
    const sky = new Sky();
    sky.scale.setScalar(10000);
    const su = sky.material.uniforms;
    su.turbidity.value = 9;
    su.rayleigh.value = 2.8;
    su.mieCoefficient.value = 0.005;
    su.mieDirectionalG.value = 0.85;
    su.sunPosition.value.copy(sunDir);
    scene.add(sky);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    const skyEnv = new Sky();
    skyEnv.scale.setScalar(10000);
    for (const k of ["turbidity", "rayleigh", "mieCoefficient", "mieDirectionalG"]) skyEnv.material.uniforms[k].value = su[k].value;
    skyEnv.material.uniforms.sunPosition.value.copy(sunDir);
    envScene.add(skyEnv);
    scene.environment = pmrem.fromScene(envScene).texture;
    scene.environmentIntensity = 0.7;

    const sun = new THREE.DirectionalLight("#ffd2a0", 3.2);
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.05;
    Object.assign(sun.shadow.camera, { left: -32, right: 32, top: 32, bottom: -32, near: 1, far: 200 });
    scene.add(sun, sun.target);
    scene.add(new THREE.HemisphereLight("#9fbbe0", "#2a3a44", 0.6));

    // clouds: soft cumulus far off
    const cloudTex = tex(canvas(512, 256, (g, w, h) => {
      const r = mulberry32(5);
      for (let i = 0; i < 70; i++) {
        const x = w * (0.15 + r() * 0.7);
        const y = h * (0.45 + r() * 0.35) - Math.sin(((x / w) - 0.15) / 0.7 * Math.PI) * h * 0.25;
        const rr = 30 + r() * 70;
        const gr = g.createRadialGradient(x, y - rr * 0.2, 0, x, y, rr);
        gr.addColorStop(0, "rgba(255,240,230,0.45)");
        gr.addColorStop(0.6, "rgba(240,215,205,0.2)");
        gr.addColorStop(1, "rgba(220,190,190,0)");
        g.fillStyle = gr;
        g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
      }
    }));
    for (let i = 0; i < 16; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex, transparent: true, depthWrite: false, fog: false, color: "#ffd9c0" }));
      const a = rnd() * Math.PI * 2;
      const d = 2500 + rnd() * 2500;
      sp.position.set(Math.cos(a) * d, 250 + rnd() * 450, Math.sin(a) * d);
      sp.scale.set(1400 + rnd() * 1200, 500 + rnd() * 300, 1);
      scene.add(sp);
    }

    // ---- the ocean ----
    const normalsTex = (() => {
      const S = 512;
      const c = canvas(S, S, () => {});
      const g = c.getContext("2d");
      const img = g.createImageData(S, S);
      const r = mulberry32(99);
      const waves = Array.from({ length: 28 }, () => ({
        kx: Math.floor(r() * 9) - 4 || 1,
        ky: Math.floor(r() * 9) - 4 || 2,
        a: 0.4 + r(),
        p: r() * 6.28,
      }));
      for (const w of waves) {
        w.kx *= 1 + Math.floor(r() * 3);
        w.ky *= 1 + Math.floor(r() * 3);
        w.a /= Math.hypot(w.kx, w.ky);
      }
      for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
          let dx = 0;
          let dy = 0;
          for (const w of waves) {
            const ph = (2 * Math.PI * (w.kx * x + w.ky * y)) / S + w.p;
            const c2 = Math.cos(ph) * w.a * 2 * Math.PI;
            dx += c2 * w.kx;
            dy += c2 * w.ky;
          }
          const n = new THREE.Vector3(-dx * 0.05, -dy * 0.05, 1).normalize();
          const o = (y * S + x) * 4;
          img.data[o] = (n.x * 0.5 + 0.5) * 255;
          img.data[o + 1] = (n.y * 0.5 + 0.5) * 255;
          img.data[o + 2] = (n.z * 0.5 + 0.5) * 255;
          img.data[o + 3] = 255;
        }
      }
      g.putImageData(img, 0, 0);
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      return t;
    })();
    const water = new Water(new THREE.PlaneGeometry(20000, 20000), {
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals: normalsTex,
      sunDirection: sunDir.clone(),
      sunColor: 0xffd7a8,
      waterColor: 0x0a3a52,
      distortionScale: 2.6,
      fog: true,
    });
    // Open sea, not a lake: real water reflects ~2% looking straight down and
    // only goes mirror-like at grazing angles. The stock shader starts at 30%,
    // which turns the whole sea into a reflection of the sky and ship.
    water.material.fragmentShader = water.material.fragmentShader
      .replace("float rf0 = 0.3;", "float rf0 = 0.02;")
      .replace(
        "float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );",
        "float reflectance = 0.75 * (rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 ));"
      )
      .replace(
        "vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;",
        "vec3 scatter = waterColor * (0.55 + 0.45 * max( 0.0, dot( surfaceNormal, eyeDirection ) )) + vec3(0.0, 0.02, 0.025) * max(0.0, surfaceNormal.y - 0.9) * 8.0;"
      );
    water.material.needsUpdate = true;
    water.rotation.x = -Math.PI / 2;
    water.material.uniforms.size.value = 1.6;
    scene.add(water);

    // ---- the ship ----
    let rigLines = null;
    const ship = new THREE.Group();
    scene.add(ship);
    const hullG = new THREE.Group(); // everything that rolls and pitches
    ship.add(hullG);

    // hull paint, laid out in world x and y so features land where they belong
    const X2U = (x) => ((x + HL / 2) / HL) * 4096;
    const Y2V = (y) => (1 - (y + 3.5) / 8) * 1024;
    const hullCanvas = canvas(4096, 1024, (g, w, h) => {
      const r = mulberry32(21);
      g.fillStyle = "#151210";
      g.fillRect(0, 0, w, h);
      // planks: 0.26 m strakes, butts staggered
      for (let y = -3.5; y < 4.5; y += 0.26) {
        const y0 = Y2V(y + 0.26);
        const ph = Y2V(y) - y0;
        let x = -18 - r() * 6;
        while (x < 18) {
          const len = 5 + r() * 3;
          const l = 20 + r() * 8;
          g.fillStyle = `hsl(${22 + r() * 8}, ${18 + r() * 10}%, ${l * 0.32}%)`;
          g.fillRect(X2U(x), y0, X2U(x + len) - X2U(x), ph);
          // grain
          for (let k = 0; k < 6; k++) {
            g.fillStyle = `rgba(0,0,0,${0.05 + r() * 0.08})`;
            g.fillRect(X2U(x), y0 + r() * ph, X2U(x + len) - X2U(x), 1);
          }
          g.fillStyle = "rgba(10,5,0,0.7)";
          g.fillRect(X2U(x), y0, 2, ph);
          x += len;
        }
        g.fillStyle = "rgba(8,4,0,0.65)";
        g.fillRect(0, y0, w, 2);
      }
      // below the waterline: tarred, weedy at the line
      g.fillStyle = "rgba(25,22,18,0.82)";
      g.fillRect(0, Y2V(-0.05), w, h);
      const wl = g.createLinearGradient(0, Y2V(0.25), 0, Y2V(-0.4));
      wl.addColorStop(0, "rgba(60,80,40,0)");
      wl.addColorStop(0.5, "rgba(60,80,40,0.5)");
      wl.addColorStop(1, "rgba(30,40,25,0)");
      g.fillStyle = wl;
      g.fillRect(0, Y2V(0.25), w, Y2V(-0.4) - Y2V(0.25));
      // two blood-red gun strakes, black wales between them
      const RED = "rgba(122,18,16,0.95)";
      g.fillStyle = RED;
      g.fillRect(0, Y2V(1.25), w, Y2V(0.42) - Y2V(1.25));
      g.fillRect(0, Y2V(2.55), w, Y2V(1.65) - Y2V(2.55));
      g.fillStyle = "#070505";
      g.fillRect(0, Y2V(1.65), w, Y2V(1.25) - Y2V(1.65));
      g.fillRect(0, Y2V(2.95), w, Y2V(2.55) - Y2V(2.95));
      g.fillRect(0, Y2V(0.42), w, Y2V(0.1) - Y2V(0.42));
      g.fillRect(0, Y2V(4.6), w, Y2V(3.4) - Y2V(4.6));
      // gold beading along the strakes
      g.fillStyle = "#a8782a";
      for (const y of [1.25, 1.65, 2.55, 2.95]) g.fillRect(0, Y2V(y) - 3, w, 5);
      // two tiers of gunports: black mouths, red lids raised above them
      for (const [y0, y1] of [[1.0, 0.55], [2.35, 1.85]]) {
        for (let x = -13.2; x <= 12.4; x += 1.6) {
          const u0 = X2U(x - 0.27);
          const u1 = X2U(x + 0.27);
          const v0 = Y2V(y0);
          const v1 = Y2V(y1);
          g.fillStyle = "#3a0806";
          g.fillRect(u0 - 5, v0 - 26, u1 - u0 + 10, 22);
          g.fillStyle = "#020101";
          g.fillRect(u0, v0, u1 - u0, v1 - v0);
          g.strokeStyle = "#a8782a";
          g.lineWidth = 3;
          g.strokeRect(u0 - 2, v0 - 2, u1 - u0 + 4, v1 - v0 + 4);
          const st = g.createLinearGradient(0, v1, 0, v1 + 70);
          st.addColorStop(0, "rgba(0,0,0,0.5)");
          st.addColorStop(1, "rgba(0,0,0,0)");
          g.fillStyle = st;
          g.fillRect(u0 + 4, v1 + 4, u1 - u0 - 8, 70);
        }
      }
      // weathering
      for (let i = 0; i < 3000; i++) {
        g.fillStyle = `rgba(${r() < 0.5 ? "0,0,0" : "120,100,80"},${r() * 0.08})`;
        g.fillRect(r() * w, r() * h, 2 + r() * 12, 1 + r() * 3);
      }
    });
    const hullTex = tex(hullCanvas, { aniso });
    const hullMat = new THREE.MeshStandardMaterial({ map: hullTex, roughness: 0.78, side: THREE.DoubleSide });

    // lofted hull: port gunwale -> keel -> starboard gunwale, station by station
    {
      const NX = 110;
      const NY = 26;
      const pos = [];
      const uv = [];
      const idx = [];
      for (let i = 0; i <= NX; i++) {
        const x = -HL / 2 + (HL * i) / NX;
        const hb = halfBeam(x);
        const k = keelY(x);
        const gw = gunwale(x);
        for (let j = 0; j <= 2 * NY; j++) {
          const s = j < NY ? 1 : -1;
          const v = s > 0 ? 1 - j / NY : (j - NY) / NY;
          const y = lerp(k, gw, v);
          const z = s * hb * widthFactor(v);
          pos.push(x, y, z);
          uv.push((x + HL / 2) / HL, (y + 3.5) / 8);
        }
      }
      const row = 2 * NY + 1;
      for (let i = 0; i < NX; i++)
        for (let j = 0; j < 2 * NY; j++) {
          const a = i * row + j;
          const b = a + row;
          idx.push(a, b, a + 1, a + 1, b, b + 1);
        }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      const hull = new THREE.Mesh(geo, hullMat);
      hull.castShadow = true;
      hull.receiveShadow = true;
      hullG.add(hull);
    }

    // the transom: dark wood, gold trim, lit stern windows, the ship's name
    {
      const x = -HL / 2;
      const pts = [];
      const N = 30;
      for (let j = 0; j <= N; j++) {
        const v = j / N;
        const y = lerp(keelY(x), gunwale(x), v);
        pts.push(new THREE.Vector2(halfBeam(x) * widthFactor(v), y));
      }
      for (let j = N; j >= 0; j--) {
        const v = j / N;
        const y = lerp(keelY(x), gunwale(x), v);
        pts.push(new THREE.Vector2(-halfBeam(x) * widthFactor(v), y));
      }
      const shape = new THREE.Shape(pts);
      const geo = new THREE.ShapeGeometry(shape, 1);
      const y0 = keelY(x);
      const y1 = gunwale(x);
      const hw = halfBeam(x);
      const p = geo.attributes.position;
      const uvs = [];
      for (let i = 0; i < p.count; i++) uvs.push((p.getX(i) + hw) / (2 * hw), (p.getY(i) - y0) / (y1 - y0));
      geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      const tc = canvas(1024, 1024, (g, w, h) => {
        const V = (y) => (1 - (y - y0) / (y1 - y0)) * h;
        g.fillStyle = "#2a170b";
        g.fillRect(0, 0, w, h);
        g.fillStyle = "rgba(25,22,18,0.85)";
        g.fillRect(0, V(0), w, h);
        // gold mouldings
        for (const y of [1.0, 2.9, 3.6]) {
          g.fillStyle = "#b8862e";
          g.fillRect(0, V(y + 0.06), w, V(y - 0.06) - V(y + 0.06));
        }
        // a row of lit stern windows
        for (let i = 0; i < 5; i++) {
          const cx = w * (0.22 + i * 0.14);
          const gl = g.createLinearGradient(0, V(4.3), 0, V(3.75));
          gl.addColorStop(0, "#ffd88a");
          gl.addColorStop(1, "#e89a3a");
          g.fillStyle = "#b8862e";
          g.fillRect(cx - 44, V(4.38), 88, V(3.68) - V(4.38));
          g.fillStyle = gl;
          g.fillRect(cx - 36, V(4.3), 72, V(3.75) - V(4.3));
          g.fillStyle = "#3a2410";
          g.fillRect(cx - 2, V(4.3), 4, V(3.75) - V(4.3));
          g.fillRect(cx - 36, (V(4.3) + V(3.75)) / 2 - 2, 72, 4);
        }
        // the name
        g.fillStyle = "#e0b04e";
        g.font = "700 96px Georgia, serif";
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText("MAPLE", w / 2, V(3.25));
      });
      const transom = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex(tc, { aniso }), roughness: 0.6, emissive: "#ffb060", emissiveMap: tex(tc, { aniso }), emissiveIntensity: 0.0, side: THREE.DoubleSide }));
      transom.rotation.y = -Math.PI / 2;
      transom.position.x = x;
      // the windows glow: a second, emissive pass of just the panes
      const glow = canvas(1024, 1024, (g, w, h) => {
        const V = (y) => (1 - (y - y0) / (y1 - y0)) * h;
        g.fillStyle = "#000";
        g.fillRect(0, 0, w, h);
        for (let i = 0; i < 5; i++) {
          const cx = w * (0.22 + i * 0.14);
          g.fillStyle = "#ffcf80";
          g.fillRect(cx - 36, V(4.3), 72, V(3.75) - V(4.3));
        }
      });
      transom.material.emissiveMap = tex(glow, { aniso });
      transom.material.emissiveIntensity = 1.6;
      hullG.add(transom);
    }

    // decks
    const deckTex = tex(canvas(1024, 256, (g, w, h) => {
      const r = mulberry32(31);
      for (let y = 0; y < h; y += 16) {
        g.fillStyle = `hsl(30, 30%, ${44 + r() * 10}%)`;
        g.fillRect(0, y, w, 16);
        g.fillStyle = "rgba(30,15,5,0.6)";
        g.fillRect(0, y, w, 1.5);
        for (let x = r() * 200; x < w; x += 200 + r() * 120) g.fillRect(x, y, 2, 16);
      }
      for (let i = 0; i < 1500; i++) {
        g.fillStyle = `rgba(0,0,0,${r() * 0.06})`;
        g.fillRect(r() * w, r() * h, 6 + r() * 30, 1);
      }
    }), { repeat: [4, 2], aniso });
    const deckMat = new THREE.MeshStandardMaterial({ map: deckTex, roughness: 0.85 });
    function deckStrip(x0, x1, y) {
      const N = 40;
      const pos = [];
      const uv = [];
      const idx = [];
      for (let i = 0; i <= N; i++) {
        const x = lerp(x0, x1, i / N);
        const hw = halfWidthAt(x, y) - 0.05;
        pos.push(x, y, -hw, x, y, hw);
        uv.push(x / 9, 0, x / 9, 1);
        if (i < N) idx.push(2 * i, 2 * i + 1, 2 * i + 2, 2 * i + 2, 2 * i + 1, 2 * i + 3);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, deckMat);
      m.receiveShadow = true;
      m.castShadow = true;
      hullG.add(m);
    }
    const MAIN_DECK = 2.0;
    const QD = 3.5;
    const FC = 3.1;
    deckStrip(-9, 10, MAIN_DECK);
    deckStrip(-HL / 2 + 0.02, -9, QD);
    deckStrip(10, 16.6, FC);
    // bulkheads at the break of the quarterdeck and forecastle
    const bulkTex = tex(canvas(512, 128, (g, w, h) => {
      g.fillStyle = "#4a2c16";
      g.fillRect(0, 0, w, h);
      g.fillStyle = "#b8862e";
      g.fillRect(0, 0, w, 6);
      g.fillStyle = "#1a0e06";
      for (const x of [w * 0.3, w * 0.62]) g.fillRect(x, 26, 54, h - 26);
      g.fillStyle = "rgba(255,200,120,0.8)";
      g.fillRect(w * 0.45, 34, 30, 22);
    }), { aniso });
    for (const [x, y0, y1] of [[-9, MAIN_DECK, QD], [10, MAIN_DECK, FC]]) {
      const hw = halfWidthAt(x, y1) - 0.05;
      const b = new THREE.Mesh(new THREE.PlaneGeometry(2 * hw, y1 - y0), new THREE.MeshStandardMaterial({ map: bulkTex, roughness: 0.8, side: THREE.DoubleSide }));
      b.rotation.y = Math.PI / 2;
      b.position.set(x, (y0 + y1) / 2, 0);
      hullG.add(b);
    }
    // a cap rail round the gunwale
    const woodDark = new THREE.MeshStandardMaterial({ color: "#2a170a", roughness: 0.7 });
    for (const s of [-1, 1]) {
      const pts = [];
      for (let i = 0; i <= 60; i++) {
        const x = -HL / 2 + (HL * i) / 60;
        pts.push(new THREE.Vector3(x, gunwale(x) + 0.05, s * (halfBeam(x) * widthFactor(1) + 0.02)));
      }
      const rail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.09, 8), woodDark);
      rail.castShadow = true;
      hullG.add(rail);
    }
    // cannon run out through both tiers of ports
    const iron = new THREE.MeshStandardMaterial({ color: "#161618", metalness: 0.65, roughness: 0.45 });
    const cannonGeo = new THREE.CylinderGeometry(0.12, 0.16, 1.3, 14);
    const muzzleGeo = new THREE.TorusGeometry(0.13, 0.035, 8, 16);
    const guns = []; // the side facing camera, for the broadside
    for (const y of [0.78, 2.1]) {
      for (let x = -13.2; x <= 12.4; x += 1.6) {
        for (const s2 of [-1, 1]) {
          const z = s2 * (halfWidthAt(x, y) + 0.32);
          const c = new THREE.Mesh(cannonGeo, iron);
          c.rotation.x = Math.PI / 2;
          c.position.set(x, y, z);
          c.castShadow = true;
          hullG.add(c);
          const mz = new THREE.Mesh(muzzleGeo, iron);
          mz.position.set(x, y, z + s2 * 0.65);
          hullG.add(mz);
          if (s2 > 0) guns.push(new THREE.Vector3(x, y, z + 0.7));
        }
      }
    }
    guns.sort((a, b) => b.x - a.x || a.y - b.y);
    // barrels, a hatch, the wheel
    const barrelMat = new THREE.MeshStandardMaterial({ color: "#5a3a1e", roughness: 0.75 });
    for (const [x, z] of [[4, 2.2], [4.7, 2.5], [4.2, 1.6], [-5, -2.4], [-5.6, -2.0]]) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.8, 16), barrelMat);
      b.position.set(x, MAIN_DECK + 0.4, z);
      b.castShadow = true;
      hullG.add(b);
    }
    const hatch = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.3, 2.2), woodDark);
    hatch.position.set(2.5, MAIN_DECK + 0.15, 0);
    hullG.add(hatch);
    const wheel = new THREE.Group();
    const wr = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.05, 8, 32), woodDark);
    wheel.add(wr);
    for (let i = 0; i < 8; i++) {
      const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.5, 6), woodDark);
      sp.rotation.z = (i * Math.PI) / 8;
      wheel.add(sp);
    }
    wheel.rotation.y = Math.PI / 2;
    wheel.position.set(-12, QD + 1.1, 0);
    hullG.add(wheel);
    // stern lanterns
    for (const s of [-1, 1]) {
      const lan = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 10), new THREE.MeshStandardMaterial({ color: "#ffcf80", emissive: "#ffb050", emissiveIntensity: 3 }));
      lan.position.set(-HL / 2 - 0.2, gunwale(-HL / 2) + 0.7, s * 2.6);
      hullG.add(lan);
    }

    // ---- masts, yards, sails ----
    const spar = new THREE.MeshStandardMaterial({ color: "#5e3d1f", roughness: 0.7 });
    const sailCanvas = canvas(1024, 1024, (g, w, h) => {
      const r = mulberry32(8);
      g.fillStyle = "#f1ece0";
      g.fillRect(0, 0, w, h);
      // panels and seams
      for (let x = 0; x < w; x += 64) {
        g.fillStyle = `rgba(${r() < 0.5 ? "150,135,110" : "255,255,250"},${0.04 + r() * 0.05})`;
        g.fillRect(x, 0, 64, h);
        g.fillStyle = "rgba(90,70,40,0.35)";
        g.fillRect(x, 0, 2, h);
      }
      // reef bands
      for (const y of [h * 0.14, h * 0.26]) {
        g.fillStyle = "rgba(90,70,40,0.4)";
        g.fillRect(0, y, w, 5);
        for (let x = 20; x < w; x += 46) {
          g.fillStyle = "rgba(60,45,25,0.6)";
          g.fillRect(x, y - 10, 3, 24);
        }
      }
      // weather: dirtier toward the foot, a few patches and stains
      const dg = g.createLinearGradient(0, 0, 0, h);
      dg.addColorStop(0, "rgba(80,60,30,0)");
      dg.addColorStop(1, "rgba(80,60,30,0.28)");
      g.fillStyle = dg;
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 4; i++) {
        const px = r() * (w - 140);
        const py = r() * (h - 140);
        g.fillStyle = "#e6dfcf";
        g.fillRect(px, py, 90 + r() * 60, 70 + r() * 60);
        g.strokeStyle = "rgba(120,110,95,0.35)";
        g.lineWidth = 2;
        g.setLineDash([6, 5]);
        g.strokeRect(px, py, 90, 70);
        g.setLineDash([]);
      }
      for (let i = 0; i < 18; i++) {
        const gr = g.createRadialGradient(r() * w, r() * h, 0, r() * w, r() * h, 40 + r() * 80);
        gr.addColorStop(0, "rgba(90,70,40,0.12)");
        gr.addColorStop(1, "rgba(90,70,40,0)");
        g.fillStyle = gr;
        g.fillRect(0, 0, w, h);
      }
      // bolt rope round the edge
      g.strokeStyle = "rgba(150,135,110,0.55)";
      g.lineWidth = 8;
      g.strokeRect(4, 4, w - 8, h - 8);
    });
    const sailMat = new THREE.MeshStandardMaterial({ map: tex(sailCanvas, { aniso }), roughness: 0.92, side: THREE.DoubleSide });
    const sails = [];
    // a square sail: between two yards, billowing forward (+x)
    function squareSail(mx, yTop, yBot, wTop, wBot, billow) {
      const NU = 18;
      const NV = 14;
      const geo = new THREE.PlaneGeometry(1, 1, NU, NV);
      const m = new THREE.Mesh(geo, sailMat);
      m.castShadow = true;
      m.receiveShadow = true;
      hullG.add(m);
      sails.push({ m, kind: "square", mx, yTop, yBot, wTop, wBot, billow, NU, NV, ph: rnd() * 6 });
    }
    function foreAftSail(pts, billow, side = 1, parent = hullG) {
      // pts: [tack/foot-fore, head, clew/foot-aft] (and optional 4th: peak) in (x,y); billow along z
      const NU = 14;
      const NV = 12;
      const geo = new THREE.PlaneGeometry(1, 1, NU, NV);
      const m = new THREE.Mesh(geo, sailMat);
      m.castShadow = true;
      parent.add(m);
      sails.push({ m, kind: "foreaft", pts, billow, side, NU, NV, ph: rnd() * 6 });
    }
    const lines = []; // rigging: pairs of points in hull space
    const L2 = (a, b) => lines.push(a.clone(), b.clone());
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    function mast(mx, H, yards) {
      const g = new THREE.Group();
      hullG.add(g);
      const base = MAIN_DECK;
      const top1 = base + H * 0.45;
      const top2 = base + H * 0.76;
      const top3 = base + H;
      const seg = (y0, y1, r0, r1) => {
        const c = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, y1 - y0, 14), spar);
        c.position.set(mx, (y0 + y1) / 2, 0);
        c.castShadow = true;
        g.add(c);
      };
      seg(base - 0.5, top1 + 0.6, 0.42, 0.34);
      seg(top1 - 1.2, top2 + 0.5, 0.27, 0.2);
      seg(top2 - 0.8, top3, 0.15, 0.08);
      // fighting top and crosstrees
      const plat = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.16, 20), spar);
      plat.position.set(mx, top1, 0);
      plat.castShadow = true;
      g.add(plat);
      const ct = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 2.4), spar);
      ct.position.set(mx, top2, 0);
      g.add(ct);
      const truck = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), spar);
      truck.position.set(mx, top3 + 0.05, 0);
      g.add(truck);
      // yards
      const ys = [];
      for (const [y, len] of yards(top1, top2, top3)) {
        const yd = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, len, 10), spar);
        yd.rotation.x = Math.PI / 2;
        yd.position.set(mx + 0.35, y, 0);
        yd.castShadow = true;
        g.add(yd);
        ys.push([y, len]);
        // braces from the yard arms aft and down
        for (const s of [-1, 1]) L2(V(mx + 0.35, y, (s * len) / 2), V(mx - 7, gunwale(mx - 7) + 0.1, s * halfBeam(mx - 7) * 0.92));
      }
      // shrouds with ratlines, both sides
      for (const s of [-1, 1]) {
        const chain = [];
        for (const dx of [-1.8, -1.0, -0.2, 0.6]) {
          const cx = mx + dx;
          const bot = V(cx, gunwale(cx) + 0.15, s * (halfBeam(cx) * widthFactor(1) + 0.15));
          const tp = V(mx, top1 - 0.4, s * 0.35);
          L2(tp, bot);
          chain.push([tp, bot]);
        }
        for (let k = 1; k < 16; k++) {
          const f = k / 16;
          for (let c = 0; c < chain.length - 1; c++) {
            const a = chain[c][1].clone().lerp(chain[c][0], f);
            const b = chain[c + 1][1].clone().lerp(chain[c + 1][0], f);
            L2(a, b);
          }
        }
        // topmast shrouds from the top's rim
        for (const dz of [1.0, 1.4]) L2(V(mx, top2 - 0.3, s * 0.2), V(mx - 0.4, top1 + 0.08, s * dz));
        // backstays to the side, well aft
        L2(V(mx, top3 - 0.6, 0), V(mx - 6, gunwale(mx - 6) + 0.1, s * halfBeam(mx - 6) * 0.95));
      }
      return { top1, top2, top3, ys, g, mx };
    }
    const main = mast(-0.5, 34, (t1, t2, t3) => [[t1 - 1.0, 21], [t2 - 0.9, 15.5], [t3 - 1.6, 10]]);
    const fore = mast(8.8, 30, (t1, t2, t3) => [[t1 - 1.0, 18.5], [t2 - 0.9, 13.5], [t3 - 1.5, 9]]);
    const miz = mast(-10.6, 24, (t1, t2, t3) => [[t2 - 0.8, 10]]);
    // square sails on fore and main
    for (const [M, mx] of [[main, -0.5], [fore, 8.8]]) {
      const [c, tps, tg] = M.ys;
      squareSail(mx + 0.4, c[0], MAIN_DECK + 6.4, c[1] * 0.78, c[1] * 0.84, 1.6);
      squareSail(mx + 0.4, tps[0], c[0] + 1.2, tps[1] * 0.78, c[1] * 0.74, 1.3);
      squareSail(mx + 0.4, tg[0], tps[0] + 1.0, tg[1] * 0.78, tps[1] * 0.74, 0.9);
    }
    // mizzen topsail, and the spanker aft of the mizzen
    squareSail(-10.6 + 0.4, miz.ys[0][0], miz.top1 + 1.2, miz.ys[0][1] * 0.78, 9.5, 0.8);
    // The spanker swings on the mizzen: gaff, boom and sail together, eased
    // out to leeward the way it would be set, not flat along the centreline.
    // Gaff and boom are laid between the sail's own corners so it is laced
    // to them exactly.
    const spankerG = new THREE.Group();
    spankerG.position.set(-10.4, 0, 0);
    spankerG.rotation.y = -0.42;
    hullG.add(spankerG);
    const tack = V(0.1, QD + 1.5, 0);
    const throat = V(0.1, miz.top1 - 0.9, 0);
    const peak = V(-7.4, miz.top1 + 0.9, 0);
    const clew = V(-8.0, QD + 1.65, 0);
    foreAftSail([tack, throat, peak, clew], 0.7, -1, spankerG);
    const sparBetween = (a, b, r0) => {
      const d = b.clone().sub(a);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r0, d.length() + 0.4, 10), spar);
      m.position.copy(a).addScaledVector(d, 0.5);
      m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
      m.castShadow = true;
      spankerG.add(m);
    };
    sparBetween(throat, peak, 0.09); // gaff
    sparBetween(tack, clew, 0.1); // boom
    // bowsprit and jibboom
    const bsA = V(15.6, FC + 0.6, 0);
    const bsB = V(29, FC + 5.2, 0);
    {
      const d = bsB.clone().sub(bsA);
      const bs = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.32, d.length(), 12), spar);
      bs.position.copy(bsA).addScaledVector(d, 0.5);
      bs.quaternion.setFromUnitVectors(V(0, 1, 0), d.clone().normalize());
      bs.castShadow = true;
      hullG.add(bs);
    }
    const onBs = (f) => bsA.clone().lerp(bsB, f);
    // jibs: fore-and-aft triangles from the foremast to the bowsprit
    foreAftSail([onBs(0.45), V(8.8 + 0.3, fore.top2 - 0.5, 0), onBs(0.45)], 1.2, 1);
    foreAftSail([onBs(0.72), V(8.8 + 0.3, fore.top3 - 1.2, 0), onBs(0.72)], 1.0, 1);
    foreAftSail([onBs(0.97), V(8.8 + 0.3, fore.top3 - 0.3, 0), onBs(0.97)], 0.8, 1);
    // stays
    L2(V(-0.5, main.top1 - 0.2, 0), V(8.8, MAIN_DECK + 1.5, 0));
    L2(V(-0.5, main.top2 - 0.2, 0), V(8.8, fore.top1 + 0.2, 0));
    L2(V(-0.5, main.top3 - 0.3, 0), V(8.8, fore.top2, 0));
    L2(V(8.8, fore.top1 - 0.2, 0), onBs(0.18));
    L2(V(8.8, fore.top2 - 0.2, 0), onBs(0.5));
    L2(V(8.8, fore.top3 - 0.2, 0), onBs(1.0));
    L2(V(-10.6, miz.top1 - 0.2, 0), V(-0.5, MAIN_DECK + 1.5, 0));
    L2(V(-10.6, miz.top3 - 0.3, 0), V(-0.5, main.top1 + 0.3, 0));
    // bobstay
    L2(onBs(0.9), V(17.6, 0.6, 0));
    {
      const geo = new THREE.BufferGeometry().setFromPoints(lines);
      const rig = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: "#1d140c", transparent: true, opacity: 0.85 }));
      hullG.add(rig);
      rigLines = rig;
    }

    // ---- the Jolly Roger at the main truck ----
    // A modern Jolly Roger: flat, crisp, graphic. Matte black field, a clean
    // white skull drawn in hard-edged shapes, and two razor sabres crossed
    // beneath it. No grime and no rags; a tidy hem.
    const flagCanvas = canvas(1600, 1040, (g, w, h) => {
      g.fillStyle = "#0b0b0c";
      g.fillRect(0, 0, w, h);
      // a faint, even cloth weave so it still reads as fabric up close
      for (let y = 0; y < h; y += 4) {
        g.fillStyle = "rgba(255,255,255,0.018)";
        g.fillRect(0, y, w, 1);
      }
      // hem and hoist tape
      g.fillStyle = "#161618";
      g.fillRect(0, 0, 54, h);
      g.strokeStyle = "rgba(255,255,255,0.10)";
      g.lineWidth = 2;
      g.setLineDash([10, 8]);
      g.strokeRect(22, 22, w - 44, h - 44);
      g.beginPath();
      g.moveTo(54, 22);
      g.lineTo(54, h - 22);
      g.stroke();
      g.setLineDash([]);

      const WHITE = "#f4f3ef";
      const SHADE = "#c9c7c0";
      const INK = "#0b0b0c";
      const cx = 820;
      const cy = 420;

      // ---- the sabres, drawn first and crossed below the jaw ----
      function sabre(flip) {
        g.save();
        g.translate(cx, 880);
        g.scale(flip, 1);
        g.rotate(-0.36);
        // blade: slim, curved, a long sharp clip point
        g.beginPath();
        g.moveTo(-20, -11);
        g.quadraticCurveTo(300, -26, 560, -86);
        g.lineTo(640, -122); // the point
        g.lineTo(590, -70);
        g.quadraticCurveTo(320, 12, -20, 11);
        g.closePath();
        g.fillStyle = WHITE;
        g.fill();
        // the bevel along the edge: a hard second tone, no gradient
        g.beginPath();
        g.moveTo(-20, 3);
        g.quadraticCurveTo(320, 2, 590, -76);
        g.lineTo(640, -122);
        g.lineTo(585, -82);
        g.quadraticCurveTo(310, -8, -20, -3);
        g.closePath();
        g.fillStyle = SHADE;
        g.fill();
        // fuller: a thin dark groove
        g.strokeStyle = INK;
        g.lineWidth = 3;
        g.beginPath();
        g.moveTo(20, -6);
        g.quadraticCurveTo(260, -18, 470, -64);
        g.stroke();
        // guard: a sharp crossbar with a knuckle bow
        g.fillStyle = WHITE;
        g.beginPath();
        g.moveTo(-28, -46);
        g.lineTo(-14, -46);
        g.lineTo(-14, 46);
        g.lineTo(-28, 46);
        g.closePath();
        g.fill();
        g.lineWidth = 9;
        g.strokeStyle = WHITE;
        g.beginPath();
        g.moveTo(-22, 40);
        g.quadraticCurveTo(-110, 56, -168, 14);
        g.stroke();
        // grip, wrapped; a pointed pommel
        g.fillStyle = WHITE;
        g.fillRect(-160, -13, 130, 26);
        g.fillStyle = INK;
        for (let k = 0; k < 7; k++) g.fillRect(-152 + k * 17, -13, 5, 26);
        g.fillStyle = WHITE;
        g.beginPath();
        g.moveTo(-160, -17);
        g.lineTo(-196, 0);
        g.lineTo(-160, 17);
        g.closePath();
        g.fill();
        g.restore();
      }
      sabre(1);
      sabre(-1);

      // ---- the skull: hard-edged, two flat tones ----
      g.save();
      g.translate(cx, cy);
      const cranium = () => {
        g.beginPath();
        g.moveTo(0, -250);
        g.bezierCurveTo(150, -250, 222, -150, 216, -40);
        g.bezierCurveTo(212, 22, 196, 56, 170, 80);
        g.lineTo(150, 168);
        g.lineTo(108, 210);
        g.lineTo(-108, 210);
        g.lineTo(-150, 168);
        g.lineTo(-170, 80);
        g.bezierCurveTo(-196, 56, -212, 22, -216, -40);
        g.bezierCurveTo(-222, -150, -150, -250, 0, -250);
        g.closePath();
      };
      cranium();
      g.fillStyle = WHITE;
      g.fill();
      // a single crisp shadow plane down the right side
      g.save();
      cranium();
      g.clip();
      g.fillStyle = SHADE;
      g.beginPath();
      g.moveTo(120, -260);
      g.bezierCurveTo(200, -150, 230, -20, 160, 230);
      g.lineTo(260, 230);
      g.lineTo(260, -260);
      g.closePath();
      g.fill();
      g.restore();
      // sockets: angular, mean
      for (const s2 of [-1, 1]) {
        g.save();
        g.scale(s2, 1);
        g.beginPath();
        g.moveTo(26, 10);
        g.lineTo(160, -4);
        g.lineTo(172, 42);
        g.quadraticCurveTo(160, 112, 104, 120);
        g.quadraticCurveTo(46, 118, 30, 82);
        g.closePath();
        g.fillStyle = INK;
        g.fill();
        g.restore();
      }
      // nose: a sharp inverted heart
      g.fillStyle = INK;
      g.beginPath();
      g.moveTo(0, 116);
      g.lineTo(-30, 176);
      g.lineTo(-10, 186);
      g.lineTo(0, 172);
      g.lineTo(10, 186);
      g.lineTo(30, 176);
      g.closePath();
      g.fill();
      // cheek cuts
      for (const s2 of [-1, 1]) {
        g.beginPath();
        g.moveTo(140 * s2, 140);
        g.lineTo(104 * s2, 170);
        g.lineTo(112 * s2, 178);
        g.closePath();
        g.fill();
      }
      // jaw: a separate block, a gap above it
      g.fillStyle = INK;
      g.fillRect(-112, 210, 224, 18);
      g.beginPath();
      g.moveTo(-104, 228);
      g.lineTo(104, 228);
      g.lineTo(92, 318);
      g.lineTo(40, 346);
      g.lineTo(-40, 346);
      g.lineTo(-92, 318);
      g.closePath();
      g.fillStyle = WHITE;
      g.fill();
      // teeth: clean vertical cuts top and bottom
      g.fillStyle = INK;
      for (let k = -3; k <= 3; k++) {
        g.fillRect(k * 28 - 3, 176, 6, 34);
        g.fillRect(k * 28 - 3, 228, 6, 36);
      }
      g.restore();
    });
    // a bump map from the same art, so the bone and blades sit proud of the cloth
    const flagBump = canvas(1600, 1040, (g, w, h) => {
      g.drawImage(flagCanvas, 0, 0);
      const d = g.getImageData(0, 0, w, h);
      for (let i = 0; i < d.data.length; i += 4) {
        const l = (d.data[i] + d.data[i + 1] + d.data[i + 2]) / 3;
        d.data[i] = d.data[i + 1] = d.data[i + 2] = l;
        d.data[i + 3] = 255;
      }
      g.putImageData(d, 0, 0);
    });
    const FLAG_W = 4.6;
    const FLAG_H = 3.0;
    const flagGeo = new THREE.PlaneGeometry(FLAG_W, FLAG_H, 90, 56);
    const flagRest = flagGeo.attributes.position.array.slice();
    const flag = new THREE.Mesh(
      flagGeo,
      new THREE.MeshStandardMaterial({ map: tex(flagCanvas, { aniso }), bumpMap: tex(flagBump, { srgb: false, aniso }), bumpScale: 1.4, roughness: 0.97, side: THREE.DoubleSide, alphaTest: 0.5, transparent: false })
    );
    flag.castShadow = true;
    const FLAG_X = -0.5 + 0.12; // luff at the mast
    const FLAG_Y = main.top3 + 3.1 - FLAG_H / 2; // flown from a pole above the truck, clear of the sails
    flag.position.set(FLAG_X, FLAG_Y, 0);
    hullG.add(flag);
    const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 3.4, 8), spar);
    flagPole.position.set(-0.5, main.top3 + 1.6, 0);
    hullG.add(flagPole);
    const PEN_L = 9;
    const penGeo = new THREE.PlaneGeometry(PEN_L, 0.5, 60, 2);
    penGeo.translate(PEN_L / 2, 0, 0);
    {
      // taper to a swallowtail
      const p = penGeo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const u = p.getX(i) / PEN_L;
        p.setY(i, p.getY(i) * (1 - 0.8 * u));
      }
    }
    const penRest = penGeo.attributes.position.array.slice();
    const pennant = new THREE.Mesh(penGeo, new THREE.MeshStandardMaterial({ color: "#8e1311", roughness: 0.9, side: THREE.DoubleSide }));
    pennant.position.set(8.8 + 0.05, fore.top3 + 0.1, 0);
    pennant.rotation.y = Math.PI; // streams aft with the wind
    // (the pennant is not flown)
    function wavePennant(t) {
      const p = penGeo.attributes.position;
      const s2 = t / 1000;
      for (let i = 0; i < p.count; i++) {
        const x0 = penRest[i * 3];
        const u = x0 / PEN_L;
        p.setXYZ(i, x0, penRest[i * 3 + 1] - 0.6 * u * u + 0.18 * u * Math.sin(x0 * 0.9 - s2 * 6), 0.5 * u * Math.sin(x0 * 0.8 - s2 * 7.5));
      }
      p.needsUpdate = true;
      penGeo.computeVertexNormals();
    }
    function waveFlag(t) {
      const p = flagGeo.attributes.position;
      const s = t / 1000;
      for (let i = 0; i < p.count; i++) {
        const x0 = flagRest[i * 3] + FLAG_W / 2; // 0 at the mast
        const y0 = flagRest[i * 3 + 1];
        const u = clamp01(x0 / FLAG_W); // a hair below 0 at the luff would make pow() NaN
        const amp = 0.5 * Math.pow(u, 1.15);
        const z =
          amp * Math.sin(x0 * 2.1 - s * 7.5 + y0 * 0.5) +
          amp * 0.35 * Math.sin(x0 * 4.3 - s * 11.0 - y0 * 1.3) +
          amp * 0.12 * Math.sin(x0 * 9.0 - s * 17.0 + y0 * 2.0);
        const droop = -0.12 * u * u + 0.04 * u * Math.sin(s * 3 + y0);
        p.setXYZ(i, x0 - 0.04 * u * Math.abs(Math.sin(x0 * 2.1 - s * 7.5)), y0 + droop, z);
      }
      p.needsUpdate = true;
      flagGeo.computeVertexNormals();
    }

    function shapeSails(t) {
      const s = t / 1000;
      for (const S of sails) {
        const p = S.m.geometry.attributes.position;
        const nu = S.NU + 1;
        for (let i = 0; i < p.count; i++) {
          const iu = i % nu;
          const iv = Math.floor(i / nu);
          const u = iu / S.NU; // 0..1 across
          const v = iv / S.NV; // 0 top .. 1 bottom
          const breathe = 1 + 0.05 * Math.sin(s * 1.6 + S.ph) + 0.02 * Math.sin(s * 4.1 + u * 5 + S.ph);
          if (S.kind === "square") {
            const w = lerp(S.wTop, S.wBot, v);
            const z = (u - 0.5) * w;
            const y = lerp(S.yTop, S.yBot, v);
            const bell = Math.sin(Math.PI * u) * Math.pow(Math.sin(Math.PI * (0.12 + 0.8 * v)), 0.9);
            p.setXYZ(i, S.mx + S.billow * bell * breathe + 0.05 * Math.sin(u * 14 + s * 6 + S.ph) * v, y - 0.25 * bell * v, z);
          } else {
            // fore-and-aft: bilinear between the corners, bellying sideways
            const [a, b, c, d] = S.pts.length === 4 ? S.pts : [S.pts[0], S.pts[1], S.pts[1], S.pts[2]];
            const top = b.clone().lerp(c, u);
            const bot = a.clone().lerp(d, u);
            const P = top.lerp(bot, v);
            const bell = Math.sin(Math.PI * u) * Math.sin(Math.PI * clamp01(0.1 + 0.85 * v));
            p.setXYZ(i, P.x, P.y, S.side * S.billow * bell * breathe);
          }
        }
        p.needsUpdate = true;
        S.m.geometry.computeVertexNormals();
      }
    }

    // ---- foam at the waterline, a bow wave and the wake ----
    const foamCanvas = canvas(512, 512, (g, w, h) => {
      const r = mulberry32(4);
      for (let i = 0; i < 2600; i++) {
        const x = r() * w;
        const y = r() * h;
        const rr = 2 + r() * 10;
        const gr = g.createRadialGradient(x, y, 0, x, y, rr);
        gr.addColorStop(0, `rgba(255,255,255,${0.35 + r() * 0.5})`);
        gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr;
        g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
      }
    });
    const foamTex = tex(foamCanvas, { repeat: [6, 1], aniso });
    const foamMat = new THREE.MeshBasicMaterial({ map: foamTex, transparent: true, depthWrite: false, color: "#f4efe6", opacity: 0.85 });
    const foamFade = tex(canvas(4, 128, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, "rgba(255,255,255,1)");
      gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h);
    }), { srgb: false });
    foamMat.alphaMap = foamFade;
    const foams = [];
    for (const s of [-1, 1]) {
      const N = 60;
      const pos = [];
      const uv = [];
      const idx = [];
      for (let i = 0; i <= N; i++) {
        const x = -HL / 2 + (HL * i) / N;
        const hw = halfWidthAt(x, 0.1);
        const width = 0.5 + 1.8 * Math.pow(Math.max(0, tOf(x) - 0.55) / 0.45, 1.5);
        pos.push(x, 0.06, s * (hw + 0.05), x, 0.06, s * (hw + 0.05 + width));
        uv.push(i / N, 0, i / N, 1);
        if (i < N) idx.push(2 * i, 2 * i + 2, 2 * i + 1, 2 * i + 1, 2 * i + 2, 2 * i + 3);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      geo.setIndex(idx);
      const m = new THREE.Mesh(geo, foamMat);
      m.renderOrder = 2;
      ship.add(m);
      foams.push(m);
    }
    const wakeTex = tex(foamCanvas, { repeat: [4, 10], aniso });
    const wakeAlpha = tex(canvas(128, 512, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, "rgba(255,255,255,0.9)");
      gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h);
      g.globalCompositeOperation = "destination-in";
      const gx = g.createLinearGradient(0, 0, w, 0);
      gx.addColorStop(0, "rgba(0,0,0,0)");
      gx.addColorStop(0.3, "rgba(0,0,0,1)");
      gx.addColorStop(0.7, "rgba(0,0,0,1)");
      gx.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gx;
      g.fillRect(0, 0, w, h);
    }), { srgb: false });
    const wakeGeo = new THREE.PlaneGeometry(1, 1, 1, 20);
    {
      const p = wakeGeo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const along = p.getY(i) + 0.5; // 0 at the stern .. 1 far
        p.setXYZ(i, -HL / 2 - along * 70, 0.05, p.getX(i) * (8 + along * 24));
      }
    }
    const wake = new THREE.Mesh(wakeGeo, new THREE.MeshBasicMaterial({ map: wakeTex, alphaMap: wakeAlpha, transparent: true, depthWrite: false, color: "#e9f0f0", opacity: 0.7 }));
    {
      // uv: v along the wake (alpha fades with distance)
      const uvA = wakeGeo.attributes.uv;
      for (let i = 0; i < uvA.count; i++) uvA.setXY(i, uvA.getX(i), 1 - uvA.getY(i));
    }
    wake.renderOrder = 2;
    ship.add(wake);

    // ---- gulls ----
    const gullMat = new THREE.MeshStandardMaterial({ color: "#f2f2ee", roughness: 0.8, side: THREE.DoubleSide });
    const gullTipMat = new THREE.MeshStandardMaterial({ color: "#2a2a2a", side: THREE.DoubleSide });
    const gulls = Array.from({ length: 6 }, (_, i) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.3, 4, 8), gullMat);
      body.rotation.z = Math.PI / 2;
      g.add(body);
      const wings = [];
      for (const s of [-1, 1]) {
        const wg = new THREE.Group();
        const w1 = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.5), gullMat);
        w1.rotation.x = -Math.PI / 2;
        w1.position.z = 0.25 * s;
        wg.add(w1);
        const tip = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.18), gullTipMat);
        tip.rotation.x = -Math.PI / 2;
        tip.position.set(-0.02, 0, 0.58 * s);
        wg.add(tip);
        g.add(wg);
        wings.push({ wg, s });
      }
      g.scale.setScalar(1.3);
      ship.add(g);
      return { g, wings, r: 9 + i * 3.5, h: 24 + rnd() * 16, sp: 0.25 + rnd() * 0.2, ph: rnd() * 6, cx: -4 + rnd() * 8 };
    });

    // ---- the Maple warship (second scene only) ----
    let ws = null;
    let wsSpray = null;
    if (navy) {
      const logoTex = new THREE.TextureLoader().load(mapleLogo);
      logoTex.colorSpace = THREE.SRGBColorSpace;
      const qrTex = new THREE.TextureLoader().load(qrMaple);
      qrTex.colorSpace = THREE.SRGBColorSpace;
      qrTex.anisotropy = aniso;
      ws = buildWarship({ aniso, logoTex, qrTex, foamMat, wakeTex, wakeAlpha, scale: 1.6 });
      scene.add(ws.group);
      const sprayTex = tex(canvas(64, 64, (g, w) => {
        const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
        gr.addColorStop(0, "rgba(255,255,255,0.9)");
        gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr;
        g.fillRect(0, 0, w, w);
      }));
      wsSpray = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: sprayTex, transparent: true, depthWrite: false, color: "#f4f8fa" }), 160);
      wsSpray.frustumCulled = false;
      wsSpray.renderOrder = 3;
      scene.add(wsSpray);
      wsSpray.userData.seed = Array.from({ length: 160 }, () => ({ sd: rnd() < 0.5 ? -1 : 1, ph: rnd(), out: 2 + rnd() * 6, up: 1.5 + rnd() * 4, sz: 0.8 + rnd() * 2 }));
    }
    // ---- the strike: missiles, fire, smoke, debris, the pirate going down ----
    const SK = {};
    if (strike) {
      const glow = (stops) =>
        tex(canvas(128, 128, (g, w) => {
          const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
          stops.forEach(([o, c]) => gr.addColorStop(o, c));
          g.fillStyle = gr;
          g.fillRect(0, 0, w, w);
        }));
      const fireT = glow([[0, "rgba(255,250,220,1)"], [0.25, "rgba(255,190,80,0.95)"], [0.6, "rgba(255,90,20,0.45)"], [1, "rgba(200,40,0,0)"]]);
      const smokeT = tex(canvas(256, 256, (g, w) => {
        const r = mulberry32(91);
        for (let i = 0; i < 50; i++) {
          const a = r() * Math.PI * 2;
          const rad = Math.pow(r(), 0.6) * w * 0.28;
          const x = w / 2 + Math.cos(a) * rad;
          const y = w / 2 + Math.sin(a) * rad;
          const br = w * (0.08 + r() * 0.18);
          const gr = g.createRadialGradient(x, y, 0, x, y, br);
          gr.addColorStop(0, `rgba(255,255,255,${0.2 + r() * 0.2})`);
          gr.addColorStop(1, "rgba(255,255,255,0)");
          g.fillStyle = gr;
          g.fillRect(x - br, y - br, br * 2, br * 2);
        }
        g.globalCompositeOperation = "destination-in";
        const m = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
        m.addColorStop(0, "rgba(0,0,0,1)");
        m.addColorStop(0.6, "rgba(0,0,0,0.85)");
        m.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = m;
        g.fillRect(0, 0, w, w);
      }));
      const inst = (n, mat) => {
        const m = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), mat, n);
        m.frustumCulled = false;
        m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        scene.add(m);
        return m;
      };
      // smoke uses per-instance colour: white missile exhaust, black oil smoke
      SK.smoke = inst(900, new THREE.MeshBasicMaterial({ map: smokeT, transparent: true, depthWrite: false, opacity: 0.9, fog: true }));
      SK.smoke.renderOrder = 3;
      // per-puff fade: an alpha per instance, so a puff thins out instead of darkening
      SK.smokeA = new THREE.InstancedBufferAttribute(new Float32Array(900), 1);
      SK.smokeA.setUsage(THREE.DynamicDrawUsage);
      SK.smoke.geometry.setAttribute("aAlpha", SK.smokeA);
      SK.smoke.material.onBeforeCompile = (sh) => {
        sh.vertexShader = sh.vertexShader
          .replace("#include <common>", "#include <common>\nattribute float aAlpha;\nvarying float vAlpha;")
          .replace("#include <begin_vertex>", "#include <begin_vertex>\nvAlpha = aAlpha;");
        sh.fragmentShader = sh.fragmentShader
          .replace("#include <common>", "#include <common>\nvarying float vAlpha;")
          .replace("vec4 diffuseColor = vec4( diffuse, opacity );", "vec4 diffuseColor = vec4( diffuse, opacity * vAlpha );");
      };
      SK.fire = inst(260, new THREE.MeshBasicMaterial({ map: fireT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
      SK.fire.renderOrder = 4;
      SK.debris = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: "#3a2414", roughness: 0.9 }), 160);
      SK.debris.frustumCulled = false;
      SK.debris.castShadow = true;
      scene.add(SK.debris);
      SK.light = new THREE.PointLight("#ffb060", 0, 140, 1.6);
      scene.add(SK.light);
      // the missiles
      SK.missiles = S_LAUNCH.map(() => {
        const g = new THREE.Group();
        const white = new THREE.MeshStandardMaterial({ color: "#e8ecf0", roughness: 0.4, metalness: 0.3 });
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 5.2, 16), white);
        g.add(body);
        const nose = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.3, 16), white);
        nose.position.y = 3.25;
        g.add(nose);
        for (let k = 0; k < 4; k++) {
          const fin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.0, 0.9), new THREE.MeshStandardMaterial({ color: "#2a3340" }));
          fin.position.set(Math.cos((k * Math.PI) / 2) * 0.5, -2.2, Math.sin((k * Math.PI) / 2) * 0.5);
          fin.rotation.y = (-k * Math.PI) / 2;
          g.add(fin);
        }
        const flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: fireT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
        flame.position.y = -3.4;
        flame.scale.set(2.6, 4.2, 1);
        g.add(flame);
        g.visible = false;
        scene.add(g);
        return g;
      });
      // where each one lands on the pirate, in its hull coordinates
      SK.targets = [V(-1.5, 3.2, 1.6), V(9.5, 3.6, 1.0), V(-13.5, 4.6, 0.8), V(3.5, 2.6, -1.4)];
      SK.rnd = Array.from({ length: 4 }, (_, i) => mulberry32(500 + i));
      SK.debrisSeed = Array.from({ length: 160 }, (_, i) => {
        const r = mulberry32(900 + i);
        return { k: i % 4, vx: (r() - 0.5) * 12, vy: 5 + r() * 13, vz: (r() - 0.2) * 12, sx: 0.2 + r() * 1.1, sy: 0.08 + r() * 0.14, sz: 0.12 + r() * 0.3, spin: (r() - 0.5) * 12 };
      });
      SK.smokeSeed = Array.from({ length: 4 * 70 }, (_, i) => {
        const r = mulberry32(1300 + i);
        return { k: Math.floor(i / 70), born: r() * 6000, dx: (r() - 0.5) * 4, dz: (r() - 0.5) * 4, rise: 3 + r() * 4, size: 3 + r() * 5, rot: r() * 6.28 };
      });
      // the sails that belong to each mast fall with it
      const reparent = (m, g) => {
        if (!m) return;
        m.parent.remove(m);
        g.add(m);
      };
      [0, 1, 2].forEach((i) => reparent(sails[i] && sails[i].m, main.g));
      [3, 4, 5].forEach((i) => reparent(sails[i] && sails[i].m, fore.g));
      reparent(flag, main.g);
      reparent(flagPole, main.g);
    }
    const impactT = (k) => S_LAUNCH[k] + S_FLIGHT;
    // a missile's flight: straight up out of the cell, over, and down onto its mark
    function missilePath(k, u) {
      const tl = S_LAUNCH[k];
      const ti = impactT(k);
      // where the cell was at launch, and the mark at impact (both move with the ships)
      const wsx = (tt) => V(SHIP_V * ((END_MS + NAVY_END + tt) / 1000) + NP2.x, 0, NP2.z);
      const yaw = Math.atan2(-(NP2.z - NP0.z), NP2.x - NP0.x);
      const c = ws.cells[k].clone().multiplyScalar(1.6);
      const p0 = wsx(tl).add(V(c.x * Math.cos(yaw) + c.z * Math.sin(yaw), c.y, -c.x * Math.sin(yaw) + c.z * Math.cos(yaw)));
      const tg = SK.targets[k];
      const p3 = V(SHIP_V * ((END_MS + NAVY_END + ti) / 1000) + tg.x, tg.y, tg.z);
      const p1 = p0.clone().add(V(0, 70, 0));
      const p2 = p3.clone().add(V(10, 55, 6));
      const a = p0.clone().lerp(p1, u);
      const b = p1.clone().lerp(p2, u);
      const c2 = p2.clone().lerp(p3, u);
      return a.lerp(b, u).lerp(b.clone().lerp(c2, u), u);
    }
    const flightU = (k, tt) => {
      const x = clamp01((tt - S_LAUNCH[k]) / S_FLIGHT);
      return x * x * (1.4 - 0.4 * x); // a slow climb off the rail, then fast
    };

    // the warship's track, in the pirate's frame: in off the horizon behind
    // it, curving down to station a few lengths off its quarter
    // a straight run in, decelerating to a stop off the pirate's quarter
    const NP2 = V(100, 0, -58);
    const NP0 = NP2.clone().add(V(232, 0, 22)); // in from the right, flank to the camera
    const navyK = (tn) => {
      const u = clamp01(tn / (NAVY_END - 500));
      return 1 - Math.pow(1 - u, 2.1);
    };
    function warshipRel(tn) {
      return NP0.clone().lerp(NP2, navyK(tn));
    }

    // ---- post ----
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(window.devicePixelRatio || 1);
    composer.setSize(W, H);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.25, 0.5, 0.92));
    composer.addPass(new OutputPass());

    // ---- the camera move: close on the flag, back and away to the whole ship ----
    const flagCentre = V(FLAG_X + FLAG_W * 0.5, FLAG_Y + 0.05, 0.1);
    const shipCentre = V(5, 15, 0); // bowsprit to stern, waterline to flag
    const path = new THREE.CatmullRomCurve3([
      flagCentre.clone().add(V(-0.1, -0.2, 11.5)),
      flagCentre.clone().add(V(-0.9, 0.4, 15.5)),
      flagCentre.clone().add(V(-5, -3, 24)),
      V(-18, 20, 44),
      V(-44, 12, 82),
      V(-56, 14, 112),
    ]);
    const camKey = (k) => path.getPointAt(k);

    // ---- the strike, frame by frame ----
    function runStrike(t3, s) {
      let shake = 0;
      // the pirate burns, loses its masts, lists and goes under
      const sink = ss(S_SINK0, S_SINK1, t3);
      const sinkY = Math.pow(sink, 2.6) * 30;
      hullG.rotation.x += 0.52 * ss(S_SINK0 - 600, S_SINK1 - 1500, t3); // lists toward us
      hullG.rotation.z += -0.32 * Math.pow(sink, 1.3); // bow goes first
      hullG.position.y -= sinkY;
      const fall = (g, mx, t0, ax) => {
        const k = clamp01((t3 - t0) / 1500);
        const a = Math.pow(k, 2.2) * 1.45;
        const pivot = V(mx, 2.0, 0);
        g.rotation.set(ax === "x" ? a : 0, 0, ax === "z" ? -a : 0);
        g.position.copy(pivot).sub(pivot.clone().applyEuler(g.rotation));
      };
      fall(main.g, -0.5, S_MAIN_FALL, "x");
      fall(fore.g, 8.8, S_FORE_FALL, "z");
      if (rigLines) rigLines.material.opacity = 0.85 * (1 - ss(impactT(0), impactT(0) + 600, t3));
      for (const f of foams) f.material.opacity = 0.85 * (1 - ss(S_SINK0, S_SINK0 + 2500, t3));
      wake.material.opacity = 0.7 * (1 - ss(S_SINK0 - 1000, S_SINK0 + 2000, t3));
      hullG.updateMatrixWorld(true);
      for (let k = 0; k < 4; k++) {
        const di = (t3 - impactT(k)) / 1000;
        if (di >= 0) shake = Math.max(shake, 0.9 * Math.exp(-di * 3.5));
      }
      return { shake, sinkY, sink };
    }
    // the effects face the camera, so they run once it is placed
    function runStrikeFx(t3, sink) {
      const dmy = new THREE.Object3D();
      const hide = new THREE.Matrix4().makeScale(0, 0, 0);
      let light = 0;
      let lightPos = null;

      // missiles in the air
      let si = 0;
      const smoke = SK.smoke;
      const putSmoke = (p, size, alpha, rot, colour) => {
        if (si >= smoke.count) return;
        dmy.position.copy(p);
        dmy.quaternion.copy(camera.quaternion);
        dmy.rotateZ(rot);
        dmy.scale.setScalar(size);
        dmy.updateMatrix();
        smoke.setMatrixAt(si, dmy.matrix);
        smoke.setColorAt(si, colour);
        SK.smokeA.setX(si, Math.max(0, alpha));
        si++;
      };
      const WHITE = new THREE.Color("#d4d2ce");
      const BLACK = new THREE.Color("#2b2724");
      SK.missiles.forEach((m, k) => {
        const tl = S_LAUNCH[k];
        const ti = impactT(k);
        m.visible = t3 >= tl && t3 < ti;
        if (m.visible) {
          const u = flightU(k, t3);
          const p = missilePath(k, u);
          const q = missilePath(k, Math.min(1, u + 0.01));
          m.position.copy(p);
          m.quaternion.setFromUnitVectors(V(0, 1, 0), q.sub(p).normalize());
          m.children[m.children.length - 1].scale.set(2.4 + Math.random() * 0.6, 4 + Math.random() * 1.2, 1);
        }
        // the trail: fixed puffs laid along the flight, each ageing from when it was laid
        for (let j = 0; j < 56; j++) {
          const tp = tl + (j / 56) * S_FLIGHT;
          if (tp > t3) break;
          const age = (t3 - tp) / 1000;
          if (age > 4.5) continue;
          const p = missilePath(k, flightU(k, tp));
          p.y += age * 0.8;
          putSmoke(p, 2.0 + age * 2.2, Math.min(1, 1.15 - age * 0.22), j * 1.7, WHITE);
        }
        // the launch: a flash and a bank of white smoke on the destroyer's deck
        const dl = (t3 - tl) / 1000;
        if (dl >= 0 && dl < 3) {
          const p0 = missilePath(k, 0);
          for (let j = 0; j < 8; j++) putSmoke(p0.clone().add(V((j - 4) * 1.6, 1 + dl * 3 + (j % 3), (j % 2) * 3 - 1.5)), 5 + dl * 4, Math.max(0, 0.7 - dl * 0.22), j, WHITE);
          if (dl < 0.25) {
            light = Math.max(light, 1 - dl / 0.25);
            lightPos = p0;
          }
        }
        // the hit: fireball, then black smoke rising off the wreck
        const di = (t3 - ti) / 1000;
        if (di >= 0) {
          const hit = SK.targets[k].clone().applyMatrix4(hullG.matrixWorld);
          if (di < 0.3) {
            light = Math.max(light, 1.4 * (1 - di / 0.3));
            lightPos = hit;
          }
          for (const S2 of SK.smokeSeed) {
            if (S2.k !== k) continue;
            const a = di * 1000 - S2.born;
            if (a < 0 || a > 6500) continue;
            const ag = a / 1000;
            putSmoke(hit.clone().add(V(S2.dx + ag * 2.2, ag * S2.rise * 1.3 + 1.5, S2.dz - ag * 0.8)), S2.size * (0.5 + ag * 0.6), 1.0 * Math.min(1, ag * 3) * Math.max(0, 1 - ag / 5.5) * (1 - ss(0.25, 0.85, sink)), S2.rot + ag * 0.3, BLACK);
          }
        }
      });
      for (; si < smoke.count; si++) smoke.setMatrixAt(si, hide);
      smoke.instanceMatrix.needsUpdate = true;
      if (smoke.instanceColor) smoke.instanceColor.needsUpdate = true;
      SK.smokeA.needsUpdate = true;

      // fire: a fireball on impact, then flames that keep burning on the deck
      let fi = 0;
      const fire = SK.fire;
      for (let k = 0; k < 4; k++) {
        const di = (t3 - impactT(k)) / 1000;
        if (di < 0) continue;
        const r = SK.rnd[k];
        void r;
        const hit = SK.targets[k].clone().applyMatrix4(hullG.matrixWorld);
        // fireball
        if (di < 1.4) {
          for (let j = 0; j < 14; j++) {
            const a = (j / 14) * Math.PI * 2;
            const spread = Math.pow(di / 1.4, 0.5) * 9;
            dmy.position.copy(hit).add(V(Math.cos(a) * spread * 0.6, Math.sin(j * 1.3) * spread * 0.4 + di * 6, Math.sin(a) * spread * 0.6));
            dmy.quaternion.copy(camera.quaternion);
            dmy.scale.setScalar((6 + j % 4 * 2) * (0.5 + di) * (1 - di / 1.6));
            dmy.updateMatrix();
            if (fi < fire.count) fire.setMatrixAt(fi++, dmy.matrix);
          }
        }
        // burning on: flames riding the hull until it goes under
        if (t3 < S_SINK1 - 1500) {
          for (let j = 0; j < 9; j++) {
            const loc = SK.targets[k].clone().add(V((j - 4) * 0.9, 0.6 + (j % 3) * 0.5, ((j * 7) % 5 - 2) * 0.5));
            dmy.position.copy(loc.applyMatrix4(hullG.matrixWorld));
            dmy.quaternion.copy(camera.quaternion);
            const fl = 0.75 + 0.25 * Math.sin(t3 * 0.03 + j * 2.1 + k) + 0.15 * Math.sin(t3 * 0.071 + j);
            dmy.scale.set(2.4 * fl * Math.min(1, di * 2), 3.8 * fl * Math.min(1, di * 2), 1);
            dmy.updateMatrix();
            if (fi < fire.count) fire.setMatrixAt(fi++, dmy.matrix);
          }
        }
      }
      for (; fi < fire.count; fi++) fire.setMatrixAt(fi, hide);
      fire.instanceMatrix.needsUpdate = true;

      // debris: planks and splinters thrown out of each hit
      const deb = SK.debris;
      SK.debrisSeed.forEach((D2, i) => {
        const di = (t3 - impactT(D2.k)) / 1000;
        if (di < 0) {
          deb.setMatrixAt(i, hide);
          return;
        }
        const hit0 = SK.targets[D2.k].clone().add(V(SHIP_V * ((END_MS + NAVY_END + impactT(D2.k)) / 1000), 0, 0));
        let y = hit0.y + D2.vy * di - 4.9 * di * di;
        if (y < -1) {
          deb.setMatrixAt(i, hide);
          return;
        }
        dmy.position.set(hit0.x + D2.vx * di, Math.max(0, y), hit0.z + D2.vz * di);
        dmy.rotation.set(D2.spin * di, D2.spin * di * 0.7, D2.spin * di * 0.4);
        dmy.scale.set(D2.sx, D2.sy, D2.sz);
        dmy.updateMatrix();
        deb.setMatrixAt(i, dmy.matrix);
      });
      deb.instanceMatrix.needsUpdate = true;

      SK.light.intensity = light * 900;
      if (lightPos) SK.light.position.copy(lightPos).add(V(0, 3, 4));
    }

    // the pirate film's camera, as a pose at time t (it keeps drifting after
    // the film ends, which is where the navy cut takes over)
    function pirateCam(t, s) {
      const k = ss(900, 8600, t);
      const kk = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const local = camKey(kk);
      const lookLocal = flagCentre.clone().lerp(shipCentre, Math.pow(ss(2200, 8600, t), 1.6));
      const drift = Math.max(0, t - 8600) / 1000;
      local.add(V(-drift * 0.4, drift * 0.1, drift * 0.6));
      const origin = V(ship.position.x, hullG.position.y * 0.6, 0);
      const pos = local.add(origin);
      const swayIn = 1 - ss(900, 4000, t);
      pos.y += Math.sin(s * 0.9) * 0.6 * swayIn;
      return { pos, look: lookLocal.add(origin), fov: lerp(36, 42, ss(900, 8600, t)) };
    }
    const fitFov = (dist, len) => {
      // vertical fov that puts len metres across ~80% of the tall frame's width
      const hHalf = Math.atan((len * 0.5) / 0.8 / dist);
      return THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hHalf) / camera.aspect));
    };
    const mixPose = (a, b, w) => ({ pos: a.pos.clone().lerp(b.pos, w), look: a.look.clone().lerp(b.look, w), fov: lerp(a.fov, b.fov, w) });

    function renderAt(tIn) {
      // the navy cut runs on from the pirate film's last frame: one clock
      const t3 = tIn; // strike-cut time
      const tn = strike ? NAVY_END + tIn : tIn;
      const t = navy ? tn + END_MS : tIn;
      const s = t / 1000;
      // the ship runs east, rolling and pitching in the swell
      ship.position.set(SHIP_V * s, 0, 0);
      hullG.rotation.set(Math.sin(s * 0.9) * 0.035, 0, Math.sin(s * 0.62 + 1) * 0.018);
      hullG.position.y = Math.sin(s * 0.75) * 0.14 - 0.05;
      water.material.uniforms.time.value = s * 0.7;
      foamTex.offset.x = -s * 0.12;
      wakeTex.offset.y = s * 0.05;
      waveFlag(t);
      shapeSails(t);
      for (const G2 of gulls) {
        const a = s * G2.sp + G2.ph;
        G2.g.position.set(G2.cx + Math.cos(a) * G2.r, G2.h + Math.sin(s * 0.7 + G2.ph) * 1.2, Math.sin(a) * G2.r);
        G2.g.rotation.y = -a;
        const flap = Math.sin(s * 9 + G2.ph);
        for (const w of G2.wings) w.wg.rotation.x = w.s * flap * 0.5;
      }

      if (navy && ws) {
        // ---- the warship ----
        const rel0 = warshipRel(tn);
        const rel1 = warshipRel(tn + 50);
        const P = V(ship.position.x + rel0.x, 0, rel0.z);
        const vx = (rel1.x - rel0.x) / 0.05 + SHIP_V;
        const vz = (rel1.z - rel0.z) / 0.05;
        ws.group.position.copy(P);
        // it holds one heading the whole way in: the line it is running
        void vx;
        void vz;
        ws.group.rotation.y = Math.atan2(-(NP2.z - NP0.z), NP2.x - NP0.x);
        const relSpd = Math.hypot(rel1.x - rel0.x, rel1.z - rel0.z) / 0.05;
        const fast = clamp01(relSpd / 32);
        ws.hull.rotation.set(Math.sin(s * 0.7 + 2) * 0.012 - 0.015 * fast * Math.sign(-vz), 0, -0.006 * fast + Math.sin(s * 0.5) * 0.006);
        ws.hull.position.y = Math.sin(s * 0.6 + 1) * 0.12;
        ws.update(tn, fast);
        ws.group.updateMatrixWorld(true);
        const dmy2 = new THREE.Object3D();
        const seeds = wsSpray.userData.seed;
        for (let i = 0; i < seeds.length; i++) {
          const S2 = seeds[i];
          const u = (s * 1.4 + S2.ph) % 1;
          const x = ws.WL / 2 - 6 - u * 12;
          const local = V(x, 0.4 + S2.up * 0.6 * Math.sin(Math.PI * u) * fast, S2.sd * (ws.halfAt(x, 0.5) + S2.out * u));
          dmy2.position.copy(local).applyMatrix4(ws.group.matrixWorld);
          dmy2.quaternion.copy(camera.quaternion);
          dmy2.scale.setScalar(S2.sz * 0.55 * (0.5 + u) * (0.3 + 0.7 * fast));
          dmy2.updateMatrix();
          wsSpray.setMatrixAt(i, dmy2.matrix);
        }
        wsSpray.instanceMatrix.needsUpdate = true;
        wsSpray.material.opacity = 0.8 * fast;

        // ---- the camera ----
        const A = pirateCam(t, s); // where the pirate film left us
        const centre = P.clone().add(V(0, 14, 0));
        const B = { pos: A.pos.clone(), look: centre, fov: 0 };
        // stay where the pirate film left us; the lens does the work. It
        // punches in on the warship far off, then holds it in frame as it
        // runs straight in, opening up as it grows; at the end it holds both.
        const pirateMid = V(ship.position.x + 3, 12, 0);
        const both = centre.clone().lerp(pirateMid, 0.5);
        // how wide things look from here: only the part across the line of sight counts
        const across = (v, from) => {
          const d = from.clone().sub(A.pos).setY(0).normalize();
          const h = v.clone().setY(0);
          return Math.abs(h.x * d.z - h.z * d.x);
        };
        const hdg = V(Math.cos(ws.group.rotation.y), 0, -Math.sin(ws.group.rotation.y));
        const shipW = across(hdg.clone().multiplyScalar(ws.WLw), centre) + 26;
        const span = across(P.clone().sub(V(ship.position.x, 0, 0)), both) + 60;
        B.fov = fitFov(A.pos.distanceTo(centre), shipW * 0.98);
        let pose = A;
        if (tn >= N_PUNCH0) pose = mixPose(A, B, ss(N_PUNCH0, N_PUNCH1, tn));
        if (tn >= N_PUNCH1) pose = { pos: A.pos.clone(), look: centre, fov: fitFov(A.pos.distanceTo(centre), shipW * 0.98) };
        if (tn >= N_BOTH0) {
          const w = ss(N_BOTH0, NAVY_END - 600, tn);
          const fBoth = fitFov(A.pos.distanceTo(both), span);
          pose = { pos: A.pos.clone(), look: centre.clone().lerp(both, w), fov: lerp(pose.fov, Math.min(40, Math.max(pose.fov, fBoth)), w) };
        }
        if (strike) {
          const r = runStrike(t3, s);
          // open the frame to take in the whole pirate as well
          const wide = ss(0, S_ZOOM1, t3);
          const pirateC = V(ship.position.x + 4, 14, 0);
          pose = {
            pos: pose.pos.clone(),
            look: pose.look.clone().lerp(pirateC.clone().lerp(centre, 0.22 * (1 - ss(S_SINK0, S_SINK0 + 2500, t3)) + 0.78 * ss(9000, 11800, t3)), wide).add(V(0, -Math.min(r.sinkY, 12) * 0.35, 0)),
            fov: lerp(pose.fov, Math.max(pose.fov, 54), wide),
          };
          pose.pos.x += Math.sin(t3 * 0.09) * r.shake;
          pose.pos.y += Math.cos(t3 * 0.077) * r.shake;
        }
        camera.position.copy(pose.pos);
        camera.lookAt(pose.look);
        camera.fov = pose.fov;
        camera.updateProjectionMatrix();
        if (strike) {
          camera.updateMatrixWorld();
          runStrikeFx(t3, ss(S_SINK0, S_SINK1, t3));
        }
        const focus = pose.look.clone().setY(0);
        sun.position.copy(focus).addScaledVector(sunDir, 160);
        sun.target.position.copy(focus);
        const box = tn < N_PUNCH0 ? 32 : 70;
        Object.assign(sun.shadow.camera, { left: -box, right: box, top: box, bottom: -box, far: 320 });
        sun.shadow.camera.updateProjectionMatrix();
        composer.render();
        return;
      }

      // camera: hold on the flag, then pull back and away (riding with the
      // ship, never rolling with it)
      {
        const pc = pirateCam(t, s);
        camera.position.copy(pc.pos);
        camera.lookAt(pc.look);
        camera.fov = pc.fov;
        camera.updateProjectionMatrix();
      }

      // sun and its shadow box follow the ship
      sun.position.copy(ship.position).addScaledVector(sunDir, 120);
      sun.target.position.copy(ship.position).add(V(0, 10, 0));
      composer.render();
    }

    let raf;
    let disposed = false;
    (async () => {
      if (disposed) return;
      renderAt(0);
      if (renderMode) {
        window.__renderAt = (ms) => renderAt(ms);
        window.__pirateEnd = strike ? STRIKE_END : navy ? NAVY_END : END_MS;
        window.__ready = true;
        return;
      }
      const t0 = performance.now();
      const loop = (now) => {
        renderAt((now - t0) % (strike ? STRIKE_END : navy ? NAVY_END : END_MS));
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
  }, [navy, strike]);

  return (
    <div className="pa-stage">
      <div className="pa-canvas" ref={mountRef} />
      <div className="pa-vignette" aria-hidden />
    </div>
  );
}
