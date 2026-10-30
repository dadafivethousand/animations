// MapleWarship.js — a modern guided-missile destroyer in the Maple truck's
// blue camo. Built bow toward +x, waterline at y = 0, about 66 m long.
//
// Fo'c'sle with anchors, windlass, bollards and a breakwater; a stealth gun
// turret; forward and aft missile cells; a faceted forward superstructure
// with a bridge, bridge wings and four octagonal radar faces; a raked
// lattice mast with radars that turn, yardarm and satcom domes; two stealth
// funnels (the Maple mark on the forward one); close-in guns fore and aft;
// anti-ship missile canisters; torpedo tubes; RHIBs in davits; life-raft
// racks; a hangar and flight deck; rails with stanchions; whip aerials; a
// Canadian ensign at the stern.
//
// Camo is laid with box-projected UVs from each mesh's own geometry, so the
// pattern is the same scale on every face instead of stretched per part.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (x) => Math.min(1, Math.max(0, x));
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
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

// the Maple truck wrap: royal blue ground, mid-blue and navy blobs
function camoCanvas(w, h, seed, scale) {
  return canvas(w, h, (x) => {
    const r = mulberry32(seed);
    x.fillStyle = "#207eff";
    x.fillRect(0, 0, w, h);
    const blob = (cx0, cy0, rad, stretch, rot) => {
      const n = 12;
      const pts = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const rr = rad * (0.6 + r() * 0.65);
        const px = Math.cos(a) * rr * stretch;
        const py = Math.sin(a) * rr;
        pts.push([cx0 + px * Math.cos(rot) - py * Math.sin(rot), cy0 + px * Math.sin(rot) + py * Math.cos(rot)]);
      }
      x.beginPath();
      const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      const m0 = mid(pts[n - 1], pts[0]);
      x.moveTo(m0[0], m0[1]);
      for (let i = 0; i < n; i++) {
        const m = mid(pts[i], pts[(i + 1) % n]);
        x.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]);
      }
      x.fill();
    };
    const layer = (colour, count, rMin, rMax) => {
      x.fillStyle = colour;
      for (let i = 0; i < count; i++) {
        const rad = (rMin + r() * (rMax - rMin)) * scale;
        // tile: draw each blob wrapped, so the texture repeats seamlessly
        const cx0 = r() * w;
        const cy0 = r() * h;
        const st = 1.1 + r() * 0.7;
        const rot = (r() - 0.5) * 1.2;
        const R = rad * 2.4;
        for (const ox of [-w, 0, w])
          for (const oy of [-h, 0, h]) {
            const X = cx0 + ox;
            const Y = cy0 + oy;
            if (X < -R || X > w + R || Y < -R || Y > h + R) continue;
            blob(X, Y, rad, st, rot);
          }
      }
    };
    const k = (w * h) / (2048 * 2048);
    layer("#1353af", Math.ceil((46 * k) / (scale * scale)), 70, 150);
    layer("#0a2354", Math.ceil((40 * k) / (scale * scale)), 60, 130);
    layer("#1353af", Math.ceil((20 * k) / (scale * scale)), 30, 70);
  });
}

// box-projected UVs (metres / tile)
function boxUV(geo, tile) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  g.computeVertexNormals();
  const p = g.attributes.position;
  const n = g.attributes.normal;
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i));
    const ay = Math.abs(n.getY(i));
    const az = Math.abs(n.getZ(i));
    let u;
    let v;
    if (ay >= ax && ay >= az) {
      u = p.getX(i);
      v = p.getZ(i);
    } else if (ax >= az) {
      u = p.getZ(i);
      v = p.getY(i);
    } else {
      u = p.getX(i);
      v = p.getY(i);
    }
    uv[i * 2] = u / tile;
    uv[i * 2 + 1] = v / tile;
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
}

export function buildWarship({ aniso = 8, logoTex = null, foamMat = null, wakeTex = null, wakeAlpha = null } = {}) {
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const rnd = mulberry32(2026);
  const WL = 66;
  const tW = (x) => (x + WL / 2) / WL;
  const beam = (x) => {
    const t = tW(x);
    if (t > 0.5) return 7.0 * Math.pow(Math.max(0, 1 - Math.pow((t - 0.5) / 0.5, 2)), 0.6);
    return 7.0 * (0.84 + 0.16 * Math.sin((t / 0.5) * (Math.PI / 2)));
  };
  const deckY = (x) => 4.6 + 2.4 * Math.pow(Math.max(0, (tW(x) - 0.6) / 0.4), 1.7);
  const keel = (x) => {
    const t = tW(x);
    return -3.4 + (t > 0.87 ? 7.8 * Math.pow((t - 0.87) / 0.13, 1.6) : 0) + (t < 0.03 ? (1.2 * (0.03 - t)) / 0.03 : 0);
  };
  // V bottom, a knuckle, flared topsides
  const flare = (v) => (v < 0.72 ? 0.36 + 0.64 * Math.pow(v / 0.72, 0.5) * 0.93 : 0.955 + 0.06 * ((v - 0.72) / 0.28));
  const halfAt = (x, y) => beam(x) * flare(clamp01((y - keel(x)) / (deckY(x) - keel(x))));

  const ship = new THREE.Group();
  const hull = new THREE.Group(); // rolls and pitches
  ship.add(hull);
  const spinners = []; // radars that turn

  // ---- materials ----
  const camoT = tex(camoCanvas(1024, 1024, 77, 0.5), { aniso, repeat: [1, 1] });
  const camo = new THREE.MeshStandardMaterial({ map: camoT, roughness: 0.5, metalness: 0.3 });
  const haze = new THREE.MeshStandardMaterial({ color: "#4f5966", roughness: 0.45, metalness: 0.45 });
  const dark = new THREE.MeshStandardMaterial({ color: "#0d1219", roughness: 0.4, metalness: 0.5 });
  const steel = new THREE.MeshStandardMaterial({ color: "#8b939d", roughness: 0.35, metalness: 0.8 });
  const white = new THREE.MeshStandardMaterial({ color: "#e9edf2", roughness: 0.45 });
  const glass = new THREE.MeshStandardMaterial({ color: "#07101c", roughness: 0.08, metalness: 0.7, emissive: "#1b3b5e", emissiveIntensity: 0.35 });
  const deckMat = new THREE.MeshStandardMaterial({
    map: tex(canvas(512, 512, (g, w, h) => {
      const r = mulberry32(5);
      g.fillStyle = "#2c323b";
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 9000; i++) {
        g.fillStyle = `rgba(${r() < 0.5 ? "0,0,0" : "255,255,255"},${r() * 0.05})`;
        g.fillRect(r() * w, r() * h, 2, 2);
      }
      g.fillStyle = "rgba(0,0,0,0.25)";
      for (let k = 0; k < 8; k++) g.fillRect(0, (k * h) / 8, w, 2);
    }), { aniso, repeat: [8, 2] }),
    roughness: 0.95,
  });
  const add = (geo, mat, x, y, z, parent = hull) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };
  const camoMesh = (geo, x, y, z, parent = hull) => add(boxUV(geo, 6), camo, x, y, z, parent);

  // a faceted, tapered block: the stealth shape everything up top is made of
  function stealth(len, w, h, insetX = 0.6, insetZ = 0.9, frontRake = 0) {
    const g = new THREE.BoxGeometry(len, h, w);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      if (p.getY(i) > 0) {
        const sx = Math.sign(p.getX(i));
        p.setX(i, p.getX(i) - sx * insetX - (sx > 0 ? frontRake : 0));
        p.setZ(i, p.getZ(i) - Math.sign(p.getZ(i)) * insetZ);
      }
    }
    return g;
  }

  // ---- hull sides: camo, the boot-top, the name and hull number ----
  const HX2U = (x) => tW(x) * 2048;
  const HY2V = (y) => (1 - (y + 4) / 11.5) * 512;
  const sideC = camoCanvas(2048, 512, 4242, 0.38);
  {
    const g = sideC.getContext("2d");
    g.fillStyle = "#0b0e14";
    g.fillRect(0, HY2V(0.3), 2048, 512);
    g.fillStyle = "#e9eef5";
    g.fillRect(0, HY2V(0.45), 2048, HY2V(0.3) - HY2V(0.45));
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.lineJoin = "round";
    g.font = "900 135px Inter, Arial Black, Arial";
    g.lineWidth = 9;
    g.strokeStyle = "#0a2354";
    g.strokeText("MAPLE JIU-JITSU", HX2U(-4), HY2V(2.55));
    g.fillStyle = "#ffffff";
    g.fillText("MAPLE JIU-JITSU", HX2U(-4), HY2V(2.55));
    g.font = "900 115px Inter, Arial Black, Arial";
    g.strokeText("01", HX2U(25.5), HY2V(4.5));
    g.fillText("01", HX2U(25.5), HY2V(4.5));
    // the hawse pipe, and a line of portholes
    for (const x of [27.5]) {
      g.fillStyle = "#0b0e14";
      g.beginPath();
      g.ellipse(HX2U(x), HY2V(5.6), 13, 11, 0, 0, Math.PI * 2);
      g.fill();
    }
    for (let x = -24; x < 18; x += 2.2) {
      g.fillStyle = "#0b0e14";
      g.beginPath();
      g.arc(HX2U(x), HY2V(3.9), 3.5, 0, Math.PI * 2);
      g.fill();
    }
    // weld seams: faint plate lines
    g.strokeStyle = "rgba(0,0,0,0.12)";
    g.lineWidth = 2;
    for (let x = -33; x < 33; x += 3.2) {
      g.beginPath();
      g.moveTo(HX2U(x), 0);
      g.lineTo(HX2U(x), HY2V(0.45));
      g.stroke();
    }
  }
  const sideMat = new THREE.MeshStandardMaterial({ map: tex(sideC, { aniso }), roughness: 0.5, metalness: 0.3, side: THREE.DoubleSide });
  for (const sd of [1, -1]) {
    const NX = 140;
    const NY = 26;
    const pos = [];
    const uv = [];
    const idx = [];
    for (let i = 0; i <= NX; i++) {
      const x = -WL / 2 + (WL * i) / NX;
      const b = beam(x);
      const k = keel(x);
      const d = deckY(x);
      for (let j = 0; j <= NY; j++) {
        const v = j / NY;
        const y = lerp(k, d, v);
        pos.push(x, y, sd * Math.max(0.02, b * flare(v)));
        uv.push(sd > 0 ? tW(x) : 1 - tW(x), (y + 4) / 11.5);
      }
    }
    for (let i = 0; i < NX; i++)
      for (let j = 0; j < NY; j++) {
        const a = i * (NY + 1) + j;
        const b2 = a + NY + 1;
        if (sd > 0) idx.push(a, b2, a + 1, a + 1, b2, b2 + 1);
        else idx.push(a, a + 1, b2, a + 1, b2 + 1, b2);
      }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    add(geo, sideMat, 0, 0, 0);
  }
  // transom
  {
    const x = -WL / 2;
    const shape = new THREE.Shape();
    const N = 16;
    for (let j = 0; j <= N; j++) {
      const v = j / N;
      const y = lerp(keel(x), deckY(x), v);
      j ? shape.lineTo(beam(x) * flare(v), y) : shape.moveTo(beam(x) * flare(v), y);
    }
    for (let j = N; j >= 0; j--) {
      const v = j / N;
      shape.lineTo(-beam(x) * flare(v), lerp(keel(x), deckY(x), v));
    }
    const tr = add(boxUV(new THREE.ShapeGeometry(shape), 9), camo, 0, 0, 0);
    tr.material = camo.clone();
    tr.material.side = THREE.DoubleSide;
    tr.rotation.y = -Math.PI / 2;
    tr.position.x = x;
  }
  // the weather deck, following the sheer
  {
    const N = 90;
    const pos = [];
    const uv = [];
    const idx = [];
    for (let i = 0; i <= N; i++) {
      const x = -WL / 2 + (WL * i) / N;
      const b = Math.max(0.02, beam(x) * flare(1) - 0.04);
      pos.push(x, deckY(x), -b, x, deckY(x), b);
      uv.push(x / 8, 0, x / 8, 1);
      if (i < N) idx.push(2 * i, 2 * i + 1, 2 * i + 2, 2 * i + 2, 2 * i + 1, 2 * i + 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    add(geo, deckMat, 0, 0, 0).castShadow = false;
  }
  const D = (x) => deckY(x);

  // ---- fo'c'sle: anchors, windlass, bollards, breakwater ----
  for (const sd of [-1, 1]) {
    // anchor stowed in its hawse
    const a = new THREE.Group();
    add(new THREE.BoxGeometry(0.18, 1.6, 0.18), dark, 0, 0, 0, a);
    const fl = add(new THREE.BoxGeometry(1.1, 0.22, 0.2), dark, 0, -0.75, 0, a);
    fl.rotation.z = 0.0;
    for (const s2 of [-1, 1]) {
      const fluke = add(new THREE.ConeGeometry(0.2, 0.55, 4), dark, s2 * 0.55, -0.55, 0, a);
      fluke.rotation.z = s2 * 0.6;
    }
    a.position.set(27.5, 5.0, sd * (halfAt(27.5, 5) + 0.12));
    a.rotation.y = sd > 0 ? 0 : Math.PI;
    a.rotation.x = sd * 0.25;
    hull.add(a);
    // windlass and chain
    const w = add(new THREE.CylinderGeometry(0.45, 0.55, 0.6, 16), haze, 25.5, D(25.5) + 0.3, sd * 1.1);
    add(new THREE.CylinderGeometry(0.25, 0.25, 0.4, 12), dark, 25.5, D(25.5) + 0.8, sd * 1.1);
    const chainPts = [];
    for (let k = 0; k <= 10; k++) chainPts.push(V(lerp(25.5, 28.6, k / 10), D(lerp(25.5, 28.6, k / 10)) + 0.06, sd * lerp(1.1, 1.7, k / 10)));
    add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(chainPts), 20, 0.07, 6), dark, 0, 0, 0);
    void w;
    // bollards along the deck edge
    for (const x of [29, 21, 3, -10, -24, -30]) {
      const z = sd * (beam(x) * flare(1) - 0.7);
      for (const dx of [-0.35, 0.35]) add(new THREE.CylinderGeometry(0.15, 0.17, 0.5, 12), haze, x + dx, D(x) + 0.25, z);
    }
  }
  {
    // a raked breakwater across the fo'c'sle
    const shape = new THREE.Shape();
    const bx = 23;
    const bw = beam(bx) * flare(1) - 0.3;
    shape.moveTo(-bw, 0);
    shape.lineTo(0, 0.7);
    shape.lineTo(bw, 0);
    shape.lineTo(bw, 1.1);
    shape.lineTo(0, 1.8);
    shape.lineTo(-bw, 1.1);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.15, bevelEnabled: false });
    const m = camoMesh(g, bx, D(bx), 0);
    m.rotation.y = Math.PI / 2;
    m.rotation.z = 0;
    m.rotation.x = 0;
  }

  // ---- the gun: a stealth turret and a long barrel ----
  {
    const gun = new THREE.Group();
    const shield = new THREE.CylinderGeometry(1.5, 2.25, 1.8, 6);
    const p = shield.attributes.position;
    for (let i = 0; i < p.count; i++) {
      p.setX(i, p.getX(i) * 1.3 + (p.getY(i) > 0 ? -0.3 : 0));
    }
    add(boxUV(shield, 9), camo, 0, 0.9, 0, gun);
    add(new THREE.CylinderGeometry(2.0, 2.0, 0.3, 24), haze, 0, 0.0, 0, gun);
    const barrel = add(new THREE.CylinderGeometry(0.13, 0.2, 6.8, 16), haze, 3.9, 1.05, 0, gun);
    barrel.rotation.z = -Math.PI / 2 + 0.07;
    add(new THREE.CylinderGeometry(0.27, 0.27, 0.9, 16), haze, 1.5, 1.0, 0, gun).rotation.z = -Math.PI / 2;
    gun.position.set(19, D(19), 0);
    hull.add(gun);
  }

  // ---- missile cells ----
  const vlsT = tex(canvas(512, 512, (g, w, h) => {
    g.fillStyle = "#3a414b";
    g.fillRect(0, 0, w, h);
    const n = 8;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const x = (i * w) / n;
        const y = (j * h) / n;
        g.fillStyle = "#2c323b";
        g.fillRect(x + 5, y + 5, w / n - 10, h / n - 10);
        g.strokeStyle = "#5a636e";
        g.lineWidth = 2;
        g.strokeRect(x + 5, y + 5, w / n - 10, h / n - 10);
        g.fillStyle = "#1a1e24";
        g.beginPath();
        g.arc(x + w / n - 14, y + 14, 4, 0, Math.PI * 2);
        g.fill();
      }
    g.strokeStyle = "#e9c46a";
    g.lineWidth = 6;
    g.strokeRect(3, 3, w - 6, h - 6);
  }), { aniso });
  const vlsMat = new THREE.MeshStandardMaterial({ map: vlsT, roughness: 0.75, metalness: 0.3 });
  add(new THREE.BoxGeometry(5.6, 0.35, 5.6), vlsMat, 14.4, D(14.4) + 0.17, 0);
  add(new THREE.BoxGeometry(4.6, 0.35, 5.6), vlsMat, -15.3, D(-15.3) + 0.17, 0);

  // ---- forward superstructure ----
  const S0 = D(5);
  camoMesh(stealth(14.5, 12.2, 3.2, 0.5, 0.7, 0.4), 4.75, S0 + 1.6, 0); // level 1: -2.5..12
  camoMesh(stealth(10.6, 10.6, 3.0, 0.6, 0.8, 1.0), 5.3, S0 + 3.2 + 1.5, 0); // bridge level
  // the bridge: a raked front with a band of windows, wings out to the sides
  {
    const wy = S0 + 3.2 + 2.0;
    const front = add(new THREE.BoxGeometry(0.2, 1.0, 8.6), glass, 9.85, wy, 0);
    front.rotation.z = -0.32;
    for (let k = -4; k <= 4; k++) add(new THREE.BoxGeometry(0.25, 1.05, 0.08), haze, 9.88, wy, k * 0.98).rotation.z = -0.32;
    for (const sd of [-1, 1]) {
      // wing
      camoMesh(stealth(2.6, 2.8, 1.6, 0.2, 0.3), 8.6, S0 + 3.2 + 2.0, sd * 6.0);
      add(new THREE.BoxGeometry(0.15, 0.7, 2.2), glass, 9.92, S0 + 3.2 + 2.2, sd * 6.0);
      add(new THREE.BoxGeometry(2.0, 0.7, 0.12), glass, 8.6, S0 + 3.2 + 2.2, sd * 7.42);
      // side windows down the bridge
      for (let k = 0; k < 5; k++) add(new THREE.BoxGeometry(0.75, 0.6, 0.1), glass, 3.0 + k * 1.2, S0 + 3.2 + 2.0, sd * 4.65);
      // searchlight and horn
      add(new THREE.CylinderGeometry(0.22, 0.22, 0.35, 12), steel, 9.2, S0 + 3.2 + 3.0, sd * 6.6).rotation.z = Math.PI / 2;
    }
  }
  camoMesh(stealth(7.5, 8.6, 2.6, 0.5, 0.7, 0.6), 4.5, S0 + 6.2 + 1.3, 0); // level 3
  // four octagonal radar faces on the corners
  {
    const oct = new THREE.CircleGeometry(1.75, 8);
    const faceMat = new THREE.MeshStandardMaterial({ color: "#2a3340", roughness: 0.6, metalness: 0.4 });
    const ring = new THREE.RingGeometry(1.7, 1.9, 8);
    for (const [x, sd, yaw] of [[8.3, 1, Math.PI / 4], [8.3, -1, -Math.PI / 4], [1.2, 1, (3 * Math.PI) / 4], [1.2, -1, (-3 * Math.PI) / 4]]) {
      const g = new THREE.Group();
      add(oct, faceMat, 0, 0, 0, g);
      add(ring, haze, 0, 0, 0.01, g);
      // the array's tile grid, as a fine raised lattice
      for (let k = -3; k <= 3; k++) {
        add(new THREE.BoxGeometry(3.2, 0.03, 0.03), haze, 0, k * 0.42, 0.02, g);
        add(new THREE.BoxGeometry(0.03, 3.2, 0.03), haze, k * 0.42, 0, 0.02, g);
      }
      g.position.set(x, S0 + 5.6, sd * 4.15);
      g.rotation.y = Math.PI / 2 - yaw + (sd > 0 ? 0 : 0);
      g.lookAt(g.position.clone().add(V(Math.cos(yaw), 0.28, Math.sin(yaw) * -1 * -1)));
      g.rotation.y = Math.atan2(Math.cos(yaw), Math.sin(yaw) * sd * sd) ;
      hull.add(g);
      g.userData.yaw = yaw;
      // face outward and forward/aft: normal = (sx, 0, sz)
      const nx = x > 5 ? 0.72 : -0.72;
      const nz = sd * 0.69;
      g.rotation.set(0, 0, 0);
      g.lookAt(g.position.clone().add(V(nx, 0.25, nz)));
    }
  }
  // close-in gun, forward, on its own platform
  function ciws(x, y, z, parent = hull) {
    const g = new THREE.Group();
    add(new THREE.CylinderGeometry(0.9, 1.0, 0.5, 20), haze, 0, 0.25, 0, g);
    add(new THREE.CylinderGeometry(0.75, 0.85, 1.4, 20), white, 0, 1.2, 0, g);
    const dome = add(new THREE.SphereGeometry(0.78, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), white, 0, 1.9, 0, g);
    dome.scale.y = 1.35;
    // the Gatling barrels
    const gb = new THREE.Group();
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      add(new THREE.CylinderGeometry(0.035, 0.035, 1.9, 8), dark, Math.cos(a) * 0.12, Math.sin(a) * 0.12, 0, gb).rotation.x = Math.PI / 2;
    }
    gb.rotation.y = Math.PI / 2;
    gb.position.set(1.4, 1.1, 0);
    g.add(gb);
    add(new THREE.BoxGeometry(0.5, 0.5, 0.9), white, 0.4, 1.0, 0.85, g);
    g.position.set(x, y, z);
    parent.add(g);
    return g;
  }
  camoMesh(stealth(2.6, 3.0, 0.9, 0.2, 0.2), 12.6, S0 + 0.45, 0);
  ciws(12.6, S0 + 0.9, 0);
  // chaff launchers on the bridge roof corners
  for (const sd of [-1, 1]) {
    const g = new THREE.Group();
    for (let k = 0; k < 6; k++) add(new THREE.CylinderGeometry(0.09, 0.09, 0.8, 8), haze, (k % 3) * 0.2, 0.3 + Math.floor(k / 3) * 0.2, 0, g).rotation.z = 0.8;
    g.position.set(7.4, S0 + 6.25, sd * 4.0);
    hull.add(g);
  }

  // ---- the mast: a raked lattice tripod with radars ----
  {
    const base = S0 + 8.8;
    const top = base + 13;
    const mastX = 4.0;
    const legs = [V(mastX + 1.8, base, 2.0), V(mastX + 1.8, base, -2.0), V(mastX - 2.0, base, 0)];
    const apex = V(mastX - 1.0, top, 0);
    for (const L of legs) {
      const d = apex.clone().sub(L);
      const m = add(new THREE.CylinderGeometry(0.16, 0.24, d.length(), 10), camo, 0, 0, 0);
      m.material = camo;
      m.position.copy(L).addScaledVector(d, 0.5);
      m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
    }
    // lattice bracing between the legs
    for (let k = 1; k < 7; k++) {
      const f = k / 7;
      const pts = legs.map((L) => L.clone().lerp(apex, f));
      for (let i = 0; i < 3; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % 3];
        const d = b.clone().sub(a);
        const m = add(new THREE.CylinderGeometry(0.05, 0.05, d.length(), 6), haze, 0, 0, 0);
        m.position.copy(a).addScaledVector(d, 0.5);
        m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
      }
    }
    const at = (f) => legs[0].clone().lerp(apex, f).setZ(0).setX(lerp(mastX, apex.x, f));
    // platforms
    for (const f of [0.45, 0.72]) {
      const p = at(f);
      add(new THREE.CylinderGeometry(2.0 - f * 1.3, 2.0 - f * 1.3, 0.12, 20), haze, p.x, p.y, 0);
    }
    // surface-search radar: a slotted bar that turns
    {
      const p = at(0.72);
      const r = new THREE.Group();
      add(new THREE.BoxGeometry(0.5, 0.35, 3.8), dark, 0, 0.6, 0, r);
      add(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 8), dark, 0, 0.25, 0, r);
      r.position.copy(p);
      hull.add(r);
      spinners.push({ o: r, w: 2.4 });
    }
    // navigation radar higher, faster
    {
      const r = new THREE.Group();
      add(new THREE.BoxGeometry(0.3, 0.18, 2.4), dark, 0, 0.35, 0, r);
      add(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8), dark, 0, 0.15, 0, r);
      r.position.copy(apex).add(V(0, 0.1, 0));
      hull.add(r);
      spinners.push({ o: r, w: 4.1 });
    }
    // yardarm with signal halyards and aerials
    {
      const p = at(0.62);
      add(new THREE.BoxGeometry(0.16, 0.16, 7.5), haze, p.x, p.y, 0);
      for (const sd of [-1, 1]) {
        add(new THREE.CylinderGeometry(0.03, 0.04, 2.2, 6), dark, p.x, p.y + 1.1, sd * 3.4);
        add(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8), white, p.x, p.y - 0.25, sd * 2.6);
      }
    }
    // the top pole and a beacon
    add(new THREE.CylinderGeometry(0.05, 0.07, 3.0, 8), dark, apex.x, apex.y + 1.9, 0);
    add(new THREE.SphereGeometry(0.12, 10, 8), new THREE.MeshStandardMaterial({ color: "#ff4030", emissive: "#ff2010", emissiveIntensity: 2 }), apex.x, apex.y + 3.4, 0);
    // satcom radomes on pedestals, aft corners of level 3
    for (const sd of [-1, 1]) {
      add(new THREE.CylinderGeometry(0.25, 0.35, 1.1, 10), haze, 1.4, S0 + 9.35, sd * 3.0);
      add(new THREE.SphereGeometry(0.85, 24, 18), white, 1.4, S0 + 10.5, sd * 3.0);
    }
  }

  // ---- midships: the deckhouse, two stealth funnels, boats, rafts ----
  const M0 = D(-8);
  camoMesh(stealth(13.0, 11.4, 3.2, 0.4, 0.6), -9.0, M0 + 1.6, 0); // -15.5..-2.5
  for (const [fx, h] of [[-5.2, 5.4], [-12.2, 5.0]]) {
    camoMesh(stealth(4.6, 5.0, h, 1.1, 0.9, 0.2), fx, M0 + 3.2 + h / 2, 0);
    // exhaust uptakes
    for (const sd of [-1, 1]) add(new THREE.BoxGeometry(1.2, 0.5, 1.3), dark, fx - 0.6, M0 + 3.2 + h + 0.2, sd * 0.85);
  }
  if (logoTex) {
    for (const sd of [-1, 1]) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.64), new THREE.MeshStandardMaterial({ map: logoTex, transparent: true, roughness: 0.6 }));
      m.position.set(-5.3, M0 + 3.2 + 2.9, sd * 2.36);
      m.rotation.y = sd > 0 ? 0 : Math.PI;
      m.rotation.x = -sd * 0.17 * 0;
      // follow the funnel's taper: lean the decal in with the face
      m.rotateX(sd > 0 ? -0.17 : 0.17);
      hull.add(m);
    }
  }
  // anti-ship missile canisters: two banks of four, angled across the ship
  for (const sd of [-1, 1]) {
    const bank = new THREE.Group();
    add(new THREE.BoxGeometry(2.6, 0.25, 2.2), haze, 0, 0, 0, bank);
    for (let k = 0; k < 4; k++) {
      const c = add(new THREE.BoxGeometry(4.6, 0.55, 0.55), haze, 0.2, 0.55 + Math.floor(k / 2) * 0.6, -0.35 + (k % 2) * 0.7, bank);
      c.rotation.z = 0.32;
      add(new THREE.CircleGeometry(0.22, 12), dark, 0, 0, 0, c).position.set(2.31, 0, 0);
    }
    bank.position.set(-8.6, M0 + 3.25, sd * 2.6);
    bank.rotation.y = sd * 0.42;
    hull.add(bank);
  }
  // RHIBs in their davits, one each side
  for (const sd of [-1, 1]) {
    const boat = new THREE.Group();
    const tube = new THREE.CapsuleGeometry(0.42, 5.4, 6, 14);
    for (const s2 of [-1, 1]) {
      const t = add(tube, new THREE.MeshStandardMaterial({ color: "#2b2d31", roughness: 0.7 }), 0, 0.5, s2 * 0.95, boat);
      t.rotation.z = Math.PI / 2;
    }
    add(new RoundedBoxGeometry(6.0, 0.7, 1.9, 3, 0.3), new THREE.MeshStandardMaterial({ color: "#3d4651", roughness: 0.6 }), 0, 0.25, 0, boat);
    add(new RoundedBoxGeometry(1.0, 0.9, 1.0, 2, 0.15), new THREE.MeshStandardMaterial({ color: "#d9dde2", roughness: 0.6 }), 0.3, 1.0, 0, boat);
    add(new THREE.BoxGeometry(0.6, 0.5, 0.6), new THREE.MeshStandardMaterial({ color: "#ff6a1a", roughness: 0.6 }), -2.4, 0.95, 0, boat);
    boat.position.set(-9.0, M0 + 1.1, sd * 6.65);
    hull.add(boat);
    // davit arms
    for (const dx of [-2.2, 2.2]) {
      const arm = new THREE.Group();
      add(new THREE.BoxGeometry(0.25, 3.0, 0.25), haze, 0, 1.5, 0, arm);
      add(new THREE.BoxGeometry(0.25, 0.25, 1.6), haze, 0, 3.0, sd * 0.7, arm);
      arm.position.set(-9.0 + dx, M0, sd * 5.7);
      hull.add(arm);
      add(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 4), dark, -9.0 + dx, M0 + 2.3, sd * 6.65);
    }
  }
  // life-raft canisters racked along the deckhouse
  for (const sd of [-1, 1]) {
    for (let k = 0; k < 4; k++) {
      const c = add(new THREE.CapsuleGeometry(0.32, 0.8, 4, 12), white, -14.6 + k * 1.15, M0 + 2.4, sd * 5.4);
      c.rotation.z = Math.PI / 2;
      c.rotation.y = Math.PI / 2;
    }
    add(new THREE.BoxGeometry(4.8, 0.08, 0.9), haze, -12.9, M0 + 2.0, sd * 5.4);
  }

  // ---- aft: torpedo tubes, hangar, aft close-in gun, flight deck ----
  for (const sd of [-1, 1]) {
    const tt = new THREE.Group();
    add(new THREE.CylinderGeometry(0.35, 0.35, 0.5, 12), haze, 0, 0.25, 0, tt);
    for (let k = 0; k < 3; k++) {
      const t = add(new THREE.CylinderGeometry(0.17, 0.17, 3.0, 12), haze, 0, 0.55 + k * 0.36, 0, tt);
      t.rotation.z = Math.PI / 2;
    }
    tt.position.set(-17.6, D(-17.6), sd * 5.3);
    tt.rotation.y = sd * 0.7;
    hull.add(tt);
  }
  const H0 = D(-22);
  camoMesh(stealth(7.4, 11.6, 5.4, 0.3, 0.6), -22.0, H0 + 2.7, 0); // hangar -25.7..-18.3
  // hangar doors: ribbed, facing aft
  {
    const doorT = tex(canvas(256, 256, (g, w, h) => {
      g.fillStyle = "#3a434e";
      g.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 16) {
        g.fillStyle = "rgba(0,0,0,0.35)";
        g.fillRect(0, y, w, 3);
        g.fillStyle = "rgba(255,255,255,0.08)";
        g.fillRect(0, y + 3, w, 2);
      }
    }), { aniso });
    const door = new THREE.Mesh(new THREE.PlaneGeometry(9.0, 4.2), new THREE.MeshStandardMaterial({ map: doorT, roughness: 0.6, metalness: 0.4 }));
    door.position.set(-25.72, H0 + 2.15, 0);
    door.rotation.y = -Math.PI / 2;
    hull.add(door);
  }
  camoMesh(stealth(2.8, 3.0, 1.0, 0.2, 0.2), -20.5, H0 + 5.4 + 0.5, 0);
  ciws(-20.5, H0 + 5.9, 0).rotation.y = Math.PI;
  for (const sd of [-1, 1]) add(new THREE.CylinderGeometry(0.03, 0.05, 5.5, 6), dark, -19.0, H0 + 5.4 + 2.75, sd * 4.6);
  // flight deck markings
  {
    const fd = tex(canvas(512, 512, (g, w, h) => {
      g.fillStyle = "#2c323b";
      g.fillRect(0, 0, w, h);
      g.strokeStyle = "#f2f2f2";
      g.lineWidth = 10;
      g.beginPath();
      g.arc(w / 2, h / 2, w * 0.3, 0, Math.PI * 2);
      g.stroke();
      g.fillStyle = "#e9c46a";
      g.fillRect(w / 2 - 5, 0, 10, h);
      g.strokeStyle = "#f2f2f2";
      g.lineWidth = 8;
      g.strokeRect(10, 10, w - 20, h - 20);
      g.fillStyle = "#f2f2f2";
      g.font = "900 140px Inter, Arial";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("01", w / 2, h / 2 + 6);
    }), { aniso });
    const pad = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 11.4), new THREE.MeshStandardMaterial({ map: fd, roughness: 0.9 }));
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(-29.5, D(-29.5) + 0.03, 0);
    hull.add(pad);
    // tie-down grid
    for (let i = 0; i < 6; i++)
      for (let j = 0; j < 9; j++) add(new THREE.CircleGeometry(0.06, 8), dark, -32.6 + i * 1.2, D(-29.5) + 0.04, -4.8 + j * 1.2).rotation.x = -Math.PI / 2;
  }

  // ---- rails with stanchions, whip aerials, ensign ----
  {
    const pts = [];
    for (const sd of [-1, 1]) {
      for (let x = -WL / 2 + 0.5; x < 27; x += 1.4) {
        const z = sd * (beam(x) * flare(1) - 0.12);
        const y = D(x);
        pts.push(V(x, y, z), V(x, y + 1.05, z));
      }
      for (const hgt of [0.55, 1.05]) {
        let prev = null;
        for (let x = -WL / 2 + 0.5; x < 27; x += 0.7) {
          const p = V(x, D(x) + hgt, sd * (beam(x) * flare(1) - 0.12));
          if (prev) pts.push(prev, p);
          prev = p;
        }
      }
    }
    const rails = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: "#c8d0da", transparent: true, opacity: 0.85 }));
    hull.add(rails);
  }
  for (const [x, z, h] of [[-1.5, 5.6, 6.5], [-1.5, -5.6, 6.5], [11.5, 5.2, 4.5], [11.5, -5.2, 4.5], [-16, 5.2, 5]]) {
    const a = add(new THREE.CylinderGeometry(0.035, 0.06, h, 6), dark, x, D(x) + 3.2 + h / 2, z);
    a.rotation.x = Math.sign(z) * 0.12;
  }
  let ensign = null;
  {
    const flagT = tex(canvas(256, 128, (g, w, h) => {
      g.fillStyle = "#d52b1e";
      g.fillRect(0, 0, w, h);
      g.fillStyle = "#ffffff";
      g.fillRect(w / 4, 0, w / 2, h);
      g.fillStyle = "#d52b1e";
      const L = [[0, -0.44], [0.07, -0.3], [0.15, -0.34], [0.12, -0.12], [0.24, -0.24], [0.27, -0.17], [0.38, -0.19], [0.34, -0.07], [0.41, -0.04], [0.21, 0.12], [0.24, 0.2], [0.03, 0.17], [0.03, 0.4], [-0.03, 0.4], [-0.03, 0.17], [-0.24, 0.2], [-0.21, 0.12], [-0.41, -0.04], [-0.34, -0.07], [-0.38, -0.19], [-0.27, -0.17], [-0.24, -0.24], [-0.12, -0.12], [-0.15, -0.34], [-0.07, -0.3]];
      g.beginPath();
      L.forEach(([x, y], k) => (k ? g.lineTo(w / 2 + x * h, h / 2 + y * h) : g.moveTo(w / 2 + x * h, h / 2 + y * h)));
      g.closePath();
      g.fill();
    }));
    add(new THREE.CylinderGeometry(0.05, 0.06, 5, 8), dark, -WL / 2 + 0.4, D(-WL / 2) + 2.5, 0);
    ensign = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.4, 14, 2), new THREE.MeshStandardMaterial({ map: flagT, side: THREE.DoubleSide, roughness: 0.9 }));
    ensign.geometry.translate(-1.4, 0, 0);
    ensign.position.set(-WL / 2 + 0.4, D(-WL / 2) + 4.3, 0);
    ensign.userData.rest = ensign.geometry.attributes.position.array.slice();
    hull.add(ensign);
  }

  // ---- foam, wake, spray ----
  const foams = [];
  if (foamMat) {
    for (const sd of [-1, 1]) {
      const N = 60;
      const pos = [];
      const uv = [];
      const idx = [];
      for (let i = 0; i <= N; i++) {
        const x = -WL / 2 + (WL * i) / N;
        const hw = halfAt(x, 0.15);
        const width = 1.0 + 5.0 * Math.pow(Math.max(0, tW(x) - 0.6) / 0.4, 1.4);
        pos.push(x, 0.07, sd * (hw + 0.05), x, 0.07, sd * (hw + 0.05 + width));
        uv.push(i / N, 0, i / N, 1);
        if (i < N) idx.push(2 * i, 2 * i + 2, 2 * i + 1, 2 * i + 1, 2 * i + 2, 2 * i + 3);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      geo.setIndex(idx);
      const m = new THREE.Mesh(geo, foamMat.clone());
      m.renderOrder = 2;
      ship.add(m);
      foams.push(m);
    }
  }
  let wake = null;
  if (wakeTex && wakeAlpha) {
    const geo = new THREE.PlaneGeometry(1, 1, 1, 24);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const along = p.getY(i) + 0.5;
      p.setXYZ(i, -WL / 2 - along * 180, 0.06, p.getX(i) * (15 + along * 55));
    }
    const uvA = geo.attributes.uv;
    for (let i = 0; i < uvA.count; i++) uvA.setXY(i, uvA.getX(i), 1 - uvA.getY(i));
    wake = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: wakeTex, alphaMap: wakeAlpha, transparent: true, depthWrite: false, color: "#eef4f4", opacity: 0.9 }));
    wake.renderOrder = 2;
    ship.add(wake);
  }

  hull.traverse((o) => {
    if (o.isMesh && o.castShadow === undefined) o.castShadow = true;
  });

  function update(t, speed01) {
    const s = t / 1000;
    for (const sp of spinners) sp.o.rotation.y = s * sp.w;
    if (ensign) {
      const p = ensign.geometry.attributes.position;
      const rest = ensign.userData.rest;
      for (let i = 0; i < p.count; i++) {
        const x0 = -rest[i * 3];
        p.setXYZ(i, rest[i * 3], rest[i * 3 + 1], 0.3 * (x0 / 2.8) * Math.sin(x0 * 2.4 - s * (6 + 6 * speed01)));
      }
      p.needsUpdate = true;
    }
    for (const f of foams) f.material.opacity = 0.5 + 0.45 * speed01;
    if (wake) wake.material.opacity = 0.3 + 0.65 * speed01;
  }

  return { group: ship, hull, WL, beam, halfAt, deckY, update };
}
