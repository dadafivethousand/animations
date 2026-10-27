// MapleMatAd.js — Maple Jiu Jitsu, 3,000 followers: the mat from above.
//
// Straight down on an empty blue tatami with the Maple logo printed in the
// middle. One student walks in and takes a spot on the logo: follower #1.
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
  const cy = 0.46 * scale; // where follower #1 stands: on the logo
  const people = pts.map(([x, y]) => ({
    x: x + (rnd() - 0.5) * 0.12,
    z: -(y - cy) + (rnd() - 0.5) * 0.12,
    d: 0,
  }));
  for (const p of people) p.d = Math.hypot(p.x, p.z);
  people.sort((a, b) => a.d - b.d);
  // follower #1 exactly on the logo
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
function matTexture() {
  // 8 m square, 128 px per metre; 1 x 2 m tatami, staggered
  const PX = 128;
  const S = 8 * PX;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  const rnd = mulberry32(11);
  for (let col = 0; col < 8; col++) {
    const off = col % 2 ? PX : 0;
    for (let r = -1; r < 5; r++) {
      const y = r * 2 * PX + off;
      const l = 38 + rnd() * 3;
      g.fillStyle = `hsl(219, 62%, ${l}%)`;
      g.fillRect(col * PX, y, PX, 2 * PX);
      // vinyl tatami weave
      g.globalAlpha = 0.06;
      for (let k = 0; k < 2 * PX; k += 3) {
        g.fillStyle = k % 6 ? "#ffffff" : "#000000";
        g.fillRect(col * PX, y + k, PX, 1);
      }
      g.globalAlpha = 1;
      // seams
      g.fillStyle = "rgba(6,14,36,0.75)";
      g.fillRect(col * PX, y, PX, 2);
      g.fillRect(col * PX, y, 2, 2 * PX);
    }
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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0b1a3a");
    const camera = new THREE.PerspectiveCamera(FOV, aspect, 0.1, 2000);

    // gym light: high, slightly off-axis so everyone throws a short shadow
    const sun = new THREE.DirectionalLight("#fff6ea", 2.3);
    sun.position.set(-30, 100, 40);
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    sun.shadow.bias = -0.0003;
    sun.shadow.normalBias = 0.02;
    scene.add(sun, sun.target);
    scene.add(new THREE.HemisphereLight("#eef3ff", "#1b2c55", 1.1));

    // ---- the mat ----
    const matTx = matTexture();
    matTx.anisotropy = renderer.capabilities.getMaxAnisotropy();
    matTx.repeat.set(60, 60);
    const mat = new THREE.Mesh(
      new THREE.PlaneGeometry(480, 480),
      new THREE.MeshStandardMaterial({ map: matTx, roughness: 0.78 })
    );
    mat.rotation.x = -Math.PI / 2;
    mat.receiveShadow = true;
    scene.add(mat);

    const logoTx = new THREE.TextureLoader().load(mapleLogo);
    logoTx.colorSpace = THREE.SRGBColorSpace;
    logoTx.anisotropy = 8;
    const logo = new THREE.Mesh(
      new THREE.PlaneGeometry(2.7, 2.74),
      new THREE.MeshStandardMaterial({ map: logoTx, transparent: true, roughness: 0.7, depthWrite: false })
    );
    logo.rotation.x = -Math.PI / 2;
    logo.position.set(0, 0.005, -1.2);
    logo.receiveShadow = true;
    scene.add(logo);

    // ---- the crowd ----
    const { people } = buildCrowd();
    const N = people.length;
    const rnd = mulberry32(7);

    const torsoGeo = new THREE.CapsuleGeometry(0.16, 0.62, 4, 12);
    const shoulderGeo = new THREE.SphereGeometry(1, 18, 12);
    const headGeo = new THREE.SphereGeometry(0.1, 16, 12);
    const armGeo = new THREE.CapsuleGeometry(0.055, 0.5, 4, 8);
    const giMat = new THREE.MeshStandardMaterial({ roughness: 0.85 });
    const headMat = new THREE.MeshStandardMaterial({ roughness: 0.6 });
    const legGeo = new THREE.CapsuleGeometry(0.13, 0.62, 4, 10);
    const legs = new THREE.InstancedMesh(legGeo, giMat, N);
    const arms = new THREE.InstancedMesh(armGeo, giMat, N * 2);
    const torsos = new THREE.InstancedMesh(torsoGeo, giMat, N);
    const shoulders = new THREE.InstancedMesh(shoulderGeo, giMat, N);
    const heads = new THREE.InstancedMesh(headGeo, headMat, N);
    for (const m of [legs, arms, torsos, shoulders, heads]) {
      m.castShadow = true;
      m.receiveShadow = true;
      m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      m.frustumCulled = false;
      scene.add(m);
    }
    const GI = ["#f3f2ee", "#f3f2ee", "#f3f2ee", "#eeeeea", "#f6f5f0", "#284a99", "#1a1b20"];
    const HAIR = ["#1b120c", "#2a1a10", "#3b2616", "#5a3a20", "#0e0e10", "#a3784a", "#c69c7a", "#8a5a3a"];
    const col = new THREE.Color();

    // arrival schedule: #1 alone, then a handful, then the flood
    const visHalf = (t) => halfWidthAt(heightAt(t), aspect);
    const dMax = people[N - 1].d;
    const fillR = (t) => {
      const h = heightAt(t);
      return dMax * Math.pow(clamp01((h - H0) / (heightAt(T_FULL) - H0)), 0.82);
    };
    // invert fillR by sampling
    const table = [];
    for (let t = T_FIRST; t <= T_FULL; t += 10) table.push([t, fillR(t)]);
    const arriveAt = (d) => {
      for (const [t, r] of table) if (r >= d) return t;
      return T_FULL;
    };
    for (let i = 0; i < N; i++) {
      const p = people[i];
      let a = i === 0 ? T_FIRST : Math.max(arriveAt(p.d), T_FIRST + 700 + i * 420 * (i < 8 ? 1 : 0));
      if (i > 0 && i < 8) a = T_FIRST + 500 + i * 380;
      if (i > 0) a = Math.min(a + (rnd() - 0.5) * 160, T_FULL);
      if (i === N - 1) a = T_FULL;
      p.arrive = a;
      // come in from outside the frame as it was when they set off
      let ang = Math.atan2(p.z, p.x);
      if (i === 0) ang = Math.PI / 2 + 0.22; // #1 walks up from the bottom of the frame
      ang += (rnd() - 0.5) * 0.5;
      const speed = lerp(1.6, 7, clamp01((a - T_FIRST) / (T_FULL - T_FIRST)));
      let dist = visHalf(a) * 1.35 + 1.5;
      let dur = (dist / speed) * 1000;
      // make sure the start really is off screen when they leave
      for (let k = 0; k < 3; k++) {
        dist = visHalf(a - dur) * 1.4 + 1.5;
        dur = (dist / speed) * 1000;
      }
      if (i === 0) {
        // from just off the bottom edge, at a walk
        dist = visHalf(0) / aspect + 1.2;
        dur = (dist / 2.2) * 1000;
      }
      p.sx = p.x + Math.cos(ang) * dist;
      p.sz = p.z + Math.sin(ang) * dist;
      p.depart = a - dur;
      p.phase = rnd() * 6.28;
      p.gi = i === 0 ? "#f3f2ee" : GI[Math.floor(rnd() * GI.length)];
      p.hair = HAIR[Math.floor(rnd() * HAIR.length)];
      p.w = 0.92 + rnd() * 0.18;
      col.set(p.gi);
      torsos.setColorAt(i, col);
      shoulders.setColorAt(i, col);
      legs.setColorAt(i, col);
      arms.setColorAt(i * 2, col);
      arms.setColorAt(i * 2 + 1, col);
      col.set(p.hair);
      heads.setColorAt(i, col);
    }
    torsos.instanceColor.needsUpdate = true;
    legs.instanceColor.needsUpdate = true;
    arms.instanceColor.needsUpdate = true;
    shoulders.instanceColor.needsUpdate = true;
    heads.instanceColor.needsUpdate = true;

    const dummy = new THREE.Object3D();
    const off = new THREE.Vector3();
    const eul = new THREE.Euler(0, 0, 0, "YXZ");
    const HIP = 1.0;
    const hidden = new THREE.Matrix4().makeScale(0, 0, 0);

    function place(mesh, i, bx, bz, yaw, pitch, partY, sx, sy, sz, lift, lx = 0, roll = 0) {
      eul.set(-pitch, yaw, roll, "YXZ");
      off.set(lx, partY - HIP, 0).applyEuler(eul);
      dummy.position.set(bx + off.x, HIP + off.y + lift, bz + off.z);
      dummy.rotation.copy(eul);
      dummy.scale.set(sx, sy, sz);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    function crowdAt(t) {
      let arrived = 0;
      for (let i = 0; i < N; i++) {
        const p = people[i];
        if (t < p.depart) {
          torsos.setMatrixAt(i, hidden);
          legs.setMatrixAt(i, hidden);
          arms.setMatrixAt(i * 2, hidden);
          arms.setMatrixAt(i * 2 + 1, hidden);
          shoulders.setMatrixAt(i, hidden);
          heads.setMatrixAt(i, hidden);
          continue;
        }
        let x, z, yaw, lift = 0, sway = 0;
        if (t < p.arrive) {
          const k = (t - p.depart) / (p.arrive - p.depart);
          const e = 1 - Math.pow(1 - k, 2.2);
          x = lerp(p.sx, p.x, e);
          z = lerp(p.sz, p.z, e);
          // face where they are going
          yaw = Math.atan2(-(p.x - p.sx), -(p.z - p.sz));
          const step = (t / 1000) * 9 + p.phase;
          lift = Math.abs(Math.sin(step)) * 0.05 * (1 - e * 0.6);
          sway = Math.sin(step) * 0.08;
        } else {
          arrived++;
          x = p.x;
          z = p.z;
          // turn to face the front of the mat (up the frame)
          const k = ss(p.arrive, p.arrive + 450, t);
          const walkYaw = Math.atan2(-(p.x - p.sx), -(p.z - p.sz));
          let dy = 0 - walkYaw;
          while (dy > Math.PI) dy -= Math.PI * 2;
          while (dy < -Math.PI) dy += Math.PI * 2;
          yaw = walkYaw + dy * k;
          // breathing idle
          sway = Math.sin(t / 900 + p.phase) * 0.02;
        }
        // the bow, rippling out from the centre
        const bt = t - (T_BOW + (p.d / dMax) * BOW_SPREAD);
        const pitch = bt > 0 ? Math.sin(Math.PI * clamp01(bt / 1100)) * 0.62 : 0;
        // legs stay planted; the bow hinges at the hip above them
        place(legs, i, x, z, yaw, 0, 0.5, 1.45 * p.w, 1, 0.9, lift);
        place(torsos, i, x, z, yaw + sway * 0.5, pitch, 1.05, 1.25 * p.w, 1, 0.85, lift);
        place(shoulders, i, x, z, yaw + sway, pitch, 1.4, 0.25 * p.w, 0.12, 0.135, lift);
        place(heads, i, x, z, yaw + sway, pitch, 1.62, 1, 1.08, 1, lift);
        // arms hang just outside the shoulders, a little open
        place(arms, i * 2, x, z, yaw + sway, pitch, 1.12, 1, 1, 1, lift, -0.27 * p.w, -0.12);
        place(arms, i * 2 + 1, x, z, yaw + sway, pitch, 1.12, 1, 1, 1, lift, 0.27 * p.w, 0.12);
      }
      torsos.instanceMatrix.needsUpdate = true;
      legs.instanceMatrix.needsUpdate = true;
      arms.instanceMatrix.needsUpdate = true;
      shoulders.instanceMatrix.needsUpdate = true;
      heads.instanceMatrix.needsUpdate = true;
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
      sun.position.set(-30, 100, cz + 40);
    }

    function renderAt(t) {
      const arrived = crowdAt(t);
      cameraAt(t);
      renderer.render(scene, camera);

      setFx(refs.intro.current, ss(200, 650, t) * (1 - ss(1350, 1650, t)), (1 - ss(200, 800, t)) * 8);
      if (refs.num.current) refs.num.current.textContent = Math.min(COUNT, arrived).toLocaleString("en-US");
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
      await new Promise((res) => {
        if (logoTx.image && logoTx.image.complete) res();
        else {
          const tick = () => (logoTx.image && logoTx.image.complete ? res() : setTimeout(tick, 30));
          tick();
        }
      });
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
        <div className="mm-label">{label}</div>
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
