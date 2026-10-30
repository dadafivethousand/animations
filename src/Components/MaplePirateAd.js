// MaplePirateAd.js — a Jolly Roger snapping in the wind at the masthead; the
// camera pulls back and away to reveal a three-masted galleon running before
// the wind at golden hour.
//
// Real ocean (three's reflective Water with a generated tileable normal
// map), physical sky, a lofted hull painted in world coordinates (planks,
// wales, an ochre gunport strake), masts, yards, billowing sails, jibs,
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

const END_MS = 11000;
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

export default function MaplePirateAd() {
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
    su.turbidity.value = 7;
    su.rayleigh.value = 2.2;
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
    const ship = new THREE.Group();
    scene.add(ship);
    const hullG = new THREE.Group(); // everything that rolls and pitches
    ship.add(hullG);

    // hull paint, laid out in world x and y so features land where they belong
    const X2U = (x) => ((x + HL / 2) / HL) * 4096;
    const Y2V = (y) => (1 - (y + 3.5) / 8) * 1024;
    const hullCanvas = canvas(4096, 1024, (g, w, h) => {
      const r = mulberry32(21);
      g.fillStyle = "#3a2312";
      g.fillRect(0, 0, w, h);
      // planks: 0.26 m strakes, butts staggered
      for (let y = -3.5; y < 4.5; y += 0.26) {
        const y0 = Y2V(y + 0.26);
        const ph = Y2V(y) - y0;
        let x = -18 - r() * 6;
        while (x < 18) {
          const len = 5 + r() * 3;
          const l = 20 + r() * 8;
          g.fillStyle = `hsl(${24 + r() * 6}, ${42 + r() * 10}%, ${l * 0.6}%)`;
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
      // the ochre strake with the gunports
      g.fillStyle = "rgba(168,112,42,0.92)";
      g.fillRect(0, Y2V(2.45), w, Y2V(1.15) - Y2V(2.45));
      // wales
      g.fillStyle = "#120b06";
      g.fillRect(0, Y2V(0.95), w, Y2V(0.55) - Y2V(0.95));
      g.fillRect(0, Y2V(2.8), w, Y2V(2.45) - Y2V(2.8));
      g.fillRect(0, Y2V(4.6), w, Y2V(3.3) - Y2V(4.6));
      // gunports: black mouths, red-lined lids
      for (let x = -13; x <= 12.2; x += 2.4) {
        const u0 = X2U(x - 0.32);
        const u1 = X2U(x + 0.32);
        const v0 = Y2V(2.15);
        const v1 = Y2V(1.5);
        g.fillStyle = "#6e1a12";
        g.fillRect(u0 - 6, v0 - 6, u1 - u0 + 12, v1 - v0 + 12);
        g.fillStyle = "#050302";
        g.fillRect(u0, v0, u1 - u0, v1 - v0);
        // a streak of grime running down from each port
        const st = g.createLinearGradient(0, v1, 0, v1 + 90);
        st.addColorStop(0, "rgba(20,10,0,0.45)");
        st.addColorStop(1, "rgba(20,10,0,0)");
        g.fillStyle = st;
        g.fillRect(u0 + 4, v1 + 6, u1 - u0 - 8, 90);
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
    // cannon run out through the upper ports
    const iron = new THREE.MeshStandardMaterial({ color: "#1c1c1e", metalness: 0.6, roughness: 0.5 });
    const cannonGeo = new THREE.CylinderGeometry(0.13, 0.17, 1.4, 14);
    for (let x = -13; x <= 12.2; x += 2.4) {
      for (const s of [-1, 1]) {
        const c = new THREE.Mesh(cannonGeo, iron);
        c.rotation.x = Math.PI / 2;
        c.position.set(x, 1.83, s * (halfWidthAt(x, 1.83) + 0.25));
        c.castShadow = true;
        hullG.add(c);
      }
    }
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
      g.fillStyle = "#e9dcbd";
      g.fillRect(0, 0, w, h);
      // panels and seams
      for (let x = 0; x < w; x += 64) {
        g.fillStyle = `rgba(${r() < 0.5 ? "120,100,70" : "255,250,235"},${0.05 + r() * 0.06})`;
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
        g.fillStyle = "#d6c49e";
        g.fillRect(px, py, 90 + r() * 60, 70 + r() * 60);
        g.strokeStyle = "rgba(80,60,30,0.5)";
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
      g.strokeStyle = "rgba(90,70,40,0.6)";
      g.lineWidth = 8;
      g.strokeRect(4, 4, w - 8, h - 8);
    });
    const sailMat = new THREE.MeshStandardMaterial({ map: tex(sailCanvas, { aniso }), roughness: 0.92, side: THREE.DoubleSide, emissive: "#3a2a18", emissiveIntensity: 0.15 });
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
    function foreAftSail(pts, billow, side = 1) {
      // pts: [tack/foot-fore, head, clew/foot-aft] (and optional 4th: peak) in (x,y); billow along z
      const NU = 14;
      const NV = 12;
      const geo = new THREE.PlaneGeometry(1, 1, NU, NV);
      const m = new THREE.Mesh(geo, sailMat);
      m.castShadow = true;
      hullG.add(m);
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
      return { top1, top2, top3, ys };
    }
    const main = mast(-0.5, 34, (t1, t2, t3) => [[t1 - 1.0, 21], [t2 - 0.9, 15.5], [t3 - 1.6, 10]]);
    const fore = mast(8.8, 30, (t1, t2, t3) => [[t1 - 1.0, 18.5], [t2 - 0.9, 13.5], [t3 - 1.5, 9]]);
    const miz = mast(-10.6, 24, (t1, t2, t3) => [[t2 - 0.8, 10]]);
    // square sails on fore and main
    for (const [M, mx] of [[main, -0.5], [fore, 8.8]]) {
      const [c, tps, tg] = M.ys;
      squareSail(mx + 0.4, c[0], MAIN_DECK + 4.2, c[1] * 0.96, c[1] * 1.04, 2.0);
      squareSail(mx + 0.4, tps[0], c[0] + 0.3, tps[1] * 0.95, c[1] * 0.92, 1.6);
      squareSail(mx + 0.4, tg[0], tps[0] + 0.3, tg[1] * 0.94, tps[1] * 0.9, 1.1);
    }
    // mizzen topsail, and the spanker aft of the mizzen
    squareSail(-10.6 + 0.4, miz.ys[0][0], miz.top1 + 0.3, miz.ys[0][1] * 0.94, 12, 1.0);
    foreAftSail([V(-10.4, QD + 1.4, 0), V(-10.4, miz.top1 - 0.6, 0), V(-19.5, miz.top1 + 1.8, 0), V(-20.5, QD + 1.8, 0)], 1.0, -1);
    const gaff = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 9.6, 10), spar);
    gaff.rotation.z = Math.PI / 2 - 0.26;
    gaff.position.set(-15, miz.top1 + 0.6, 0);
    hullG.add(gaff);
    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 10.5, 10), spar);
    boom.rotation.z = Math.PI / 2 - 0.04;
    boom.position.set(-15.3, QD + 1.6, 0);
    hullG.add(boom);
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
    }

    // ---- the Jolly Roger at the main truck ----
    const flagCanvas = canvas(1024, 660, (g, w, h) => {
      const r = mulberry32(13);
      g.fillStyle = "#0d0d0e";
      g.fillRect(0, 0, w, h);
      // weave and wear
      for (let i = 0; i < 26000; i++) {
        g.fillStyle = `rgba(255,255,255,${r() * 0.035})`;
        g.fillRect(r() * w, r() * h, 2, 1);
      }
      for (let i = 0; i < 12; i++) {
        const gr = g.createRadialGradient(r() * w, r() * h, 0, r() * w, r() * h, 80 + r() * 120);
        gr.addColorStop(0, "rgba(60,50,40,0.18)");
        gr.addColorStop(1, "rgba(60,50,40,0)");
        g.fillStyle = gr;
        g.fillRect(0, 0, w, h);
      }
      const bone = "#ece4d2";
      const shade = "#b5ab98";
      const cx = 520;
      // crossbones, behind the skull
      const boneLine = (x0, y0, x1, y1) => {
        g.strokeStyle = shade;
        g.lineWidth = 44;
        g.lineCap = "round";
        g.beginPath();
        g.moveTo(x0, y0 + 4);
        g.lineTo(x1, y1 + 4);
        g.stroke();
        g.strokeStyle = bone;
        g.lineWidth = 38;
        g.beginPath();
        g.moveTo(x0, y0);
        g.lineTo(x1, y1);
        g.stroke();
        for (const [x, y] of [[x0, y0], [x1, y1]]) {
          const dx = x1 - x0;
          const dy = y1 - y0;
          const L = Math.hypot(dx, dy);
          const nx = -dy / L;
          const ny = dx / L;
          for (const s of [-1, 1]) {
            g.fillStyle = bone;
            g.beginPath();
            g.arc(x + nx * 24 * s, y + ny * 24 * s, 30, 0, Math.PI * 2);
            g.fill();
          }
        }
      };
      boneLine(cx - 250, 470, cx + 250, 610);
      boneLine(cx + 250, 470, cx - 250, 610);
      // the skull
      g.fillStyle = bone;
      g.beginPath();
      g.ellipse(cx, 255, 152, 142, 0, 0, Math.PI * 2);
      g.fill();
      g.beginPath();
      g.moveTo(cx - 118, 300);
      g.quadraticCurveTo(cx - 128, 400, cx - 92, 432);
      g.lineTo(cx + 92, 432);
      g.quadraticCurveTo(cx + 128, 400, cx + 118, 300);
      g.closePath();
      g.fill();
      // shading under the brow and down the cheek
      const sh = g.createRadialGradient(cx - 40, 190, 20, cx, 270, 190);
      sh.addColorStop(0, "rgba(255,255,255,0)");
      sh.addColorStop(1, "rgba(120,110,95,0.45)");
      g.fillStyle = sh;
      g.beginPath();
      g.ellipse(cx, 255, 152, 142, 0, 0, Math.PI * 2);
      g.fill();
      // sockets, nose, teeth
      g.fillStyle = "#0d0d0e";
      for (const s of [-1, 1]) {
        g.beginPath();
        g.ellipse(cx + 62 * s, 288, 50, 44, 0.15 * s, 0, Math.PI * 2);
        g.fill();
      }
      g.beginPath();
      g.moveTo(cx, 330);
      g.lineTo(cx - 24, 378);
      g.quadraticCurveTo(cx, 388, cx + 24, 378);
      g.closePath();
      g.fill();
      g.fillRect(cx - 88, 404, 176, 10);
      for (let i = -3; i <= 3; i++) g.fillRect(cx + i * 24 - 2, 398, 5, 36);
      // frayed fly end
      g.globalCompositeOperation = "destination-out";
      for (let y = 0; y < h; y += 6) {
        const d = 6 + r() * 26 + (r() < 0.08 ? 40 : 0);
        g.fillRect(w - d, y, d, 4 + r() * 4);
      }
      g.globalCompositeOperation = "source-over";
    });
    const FLAG_W = 3.4;
    const FLAG_H = 2.2;
    const flagGeo = new THREE.PlaneGeometry(FLAG_W, FLAG_H, 56, 36);
    const flagRest = flagGeo.attributes.position.array.slice();
    const flag = new THREE.Mesh(
      flagGeo,
      new THREE.MeshStandardMaterial({ map: tex(flagCanvas, { aniso }), roughness: 0.95, side: THREE.DoubleSide, alphaTest: 0.5, transparent: false })
    );
    flag.castShadow = true;
    const FLAG_X = -0.5 + 0.12; // luff at the mast
    const FLAG_Y = main.top3 + 2.3 - FLAG_H / 2; // flown from a pole above the truck, clear of the sails
    flag.position.set(FLAG_X, FLAG_Y, 0);
    hullG.add(flag);
    const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 2.6, 8), spar);
    flagPole.position.set(-0.5, main.top3 + 1.25, 0);
    hullG.add(flagPole);
    function waveFlag(t) {
      const p = flagGeo.attributes.position;
      const s = t / 1000;
      for (let i = 0; i < p.count; i++) {
        const x0 = flagRest[i * 3] + FLAG_W / 2; // 0 at the mast
        const y0 = flagRest[i * 3 + 1];
        const u = clamp01(x0 / FLAG_W); // a hair below 0 at the luff would make pow() NaN
        const amp = 0.38 * Math.pow(u, 1.15);
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

    // ---- post ----
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(window.devicePixelRatio || 1);
    composer.setSize(W, H);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.25, 0.5, 0.92));
    composer.addPass(new OutputPass());

    // ---- the camera move: close on the flag, back and away to the whole ship ----
    const flagCentre = V(FLAG_X + FLAG_W * 0.5, FLAG_Y + 0.05, 0.1);
    const shipCentre = V(1, 12.5, 0);
    const path = new THREE.CatmullRomCurve3([
      flagCentre.clone().add(V(-0.2, -0.1, 5.2)),
      flagCentre.clone().add(V(-0.8, 0.6, 10)),
      flagCentre.clone().add(V(-5, -3, 24)),
      V(-18, 20, 44),
      V(-30, 9, 52),
      V(-34, 8, 58),
    ]);
    const camKey = (k) => path.getPointAt(k);

    function renderAt(t) {
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

      // camera: hold on the flag, then pull back and away
      const k = ss(900, 8600, t);
      const kk = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const local = camKey(kk);
      // stay on the flag while the ship opens up beneath it, then settle on the whole ship
      const lookLocal = flagCentre.clone().lerp(shipCentre, Math.pow(ss(2200, 8600, t), 1.6));
      const drift = Math.max(0, t - 8600) / 1000;
      local.add(V(-drift * 0.6, drift * 0.1, drift * 0.9));
      // the camera rides with the ship but does not roll with it
      const origin = V(ship.position.x, hullG.position.y * 0.6, 0);
      camera.position.copy(local).add(origin);
      // close in, a touch of the hull's sway so the flag feels attached
      const swayIn = 1 - ss(900, 4000, t);
      camera.position.y += Math.sin(s * 0.9) * 0.6 * swayIn;
      camera.lookAt(lookLocal.add(origin));
      camera.fov = lerp(36, 42, ss(900, 8600, t));
      camera.updateProjectionMatrix();

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
        window.__pirateEnd = END_MS;
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
  }, []);

  return (
    <div className="pa-stage">
      <div className="pa-canvas" ref={mountRef} />
      <div className="pa-vignette" aria-hidden />
    </div>
  );
}
