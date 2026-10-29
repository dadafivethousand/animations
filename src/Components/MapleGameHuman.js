// MapleGameHuman.js — a smooth, skinned human for MapleGameAd.
//
// One SkinnedMesh per person, not a stack of capsules: legs, arms and torso
// are continuous tubes whose vertices are weighted across the joints, so a
// knee or an elbow bends as a single surface instead of two parts meeting.
// Clothing is vertex colour on that same surface (shirt, sleeves, shorts,
// gi jacket and pants, belt), so there are no seams between garments and
// skin. Hair, face and any decals ride on the head and chest bones.
//
// Rest pose is standing, arms at the sides, facing -z. Every bone starts
// unrotated, so animation is plain local rotations:
//   +x on a hip or shoulder swings the limb forward; knees fold with -x;
//   elbows fold with +x.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const SEG = 18; // around each tube

function makeBones() {
  const b = (name, x, y, z, parent) => {
    const bone = new THREE.Bone();
    bone.name = name;
    bone.position.set(x, y, z);
    if (parent) parent.add(bone);
    return bone;
  };
  const hips = b("hips", 0, 0.95, 0, null);
  const spine = b("spine", 0, 0.1, 0, hips);
  const chest = b("chest", 0, 0.22, 0, spine);
  const neck = b("neck", 0, 0.24, 0, chest);
  const head = b("head", 0, 0.1, 0, neck);
  const side = {};
  for (const s of [-1, 1]) {
    const shoulder = b("shoulder" + s, 0.205 * s, 0.17, 0, chest); // y 1.44
    const elbow = b("elbow" + s, 0, -0.29, 0, shoulder); // 1.15
    const hand = b("hand" + s, 0, -0.27, 0, elbow); // 0.88
    const thigh = b("thigh" + s, 0.095 * s, -0.03, 0, hips); // 0.92
    const knee = b("knee" + s, 0, -0.43, 0, thigh); // 0.49
    const foot = b("foot" + s, 0, -0.42, 0, knee); // 0.07
    side[s] = { shoulder, elbow, hand, thigh, knee, foot };
  }
  const list = [hips, spine, chest, neck, head];
  for (const s of [-1, 1]) list.push(...Object.values(side[s]));
  return { hips, spine, chest, neck, head, side, list };
}

// accumulates many parts into one skinned geometry
class Builder {
  constructor(boneIndex) {
    this.idx = boneIndex;
    this.pos = [];
    this.col = [];
    this.si = [];
    this.sw = [];
    this.ind = [];
  }
  vert(x, y, z, c, a, wa, b2, wb) {
    this.pos.push(x, y, z);
    this.col.push(c.r, c.g, c.b);
    this.si.push(this.idx[a], this.idx[b2 || a], 0, 0);
    this.sw.push(wa, wb || 0, 0, 0);
    return this.pos.length / 3 - 1;
  }
  // a tube down a list of rings: each ring is {y, cx, cz, rx, rz, bones:[[name,w],[name,w]], colour}
  tube(rings, capTop = true, capBottom = true) {
    const base = this.pos.length / 3;
    for (const r of rings) {
      for (let i = 0; i < SEG; i++) {
        const a = (i / SEG) * Math.PI * 2;
        const [b1, b2] = r.bones;
        this.vert(r.cx + Math.cos(a) * r.rx, r.y, r.cz + Math.sin(a) * r.rz, r.colour, b1[0], b1[1], b2 ? b2[0] : null, b2 ? b2[1] : 0);
      }
    }
    for (let j = 0; j < rings.length - 1; j++) {
      for (let i = 0; i < SEG; i++) {
        const a = base + j * SEG + i;
        const b = base + j * SEG + ((i + 1) % SEG);
        const c = a + SEG;
        const d = b + SEG;
        this.ind.push(a, c, b, b, c, d);
      }
    }
    const cap = (j, flip) => {
      const r = rings[j];
      const [b1, b2] = r.bones;
      const centre = this.vert(r.cx, r.y, r.cz, r.colour, b1[0], b1[1], b2 ? b2[0] : null, b2 ? b2[1] : 0);
      for (let i = 0; i < SEG; i++) {
        const a = base + j * SEG + i;
        const b = base + j * SEG + ((i + 1) % SEG);
        if (flip) this.ind.push(centre, a, b);
        else this.ind.push(centre, b, a);
      }
    };
    if (capTop) cap(0, true);
    if (capBottom) cap(rings.length - 1, false);
  }
  // a rigid part: any geometry, every vertex on one bone
  rigid(geo, matrix, colour, bone) {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    g.applyMatrix4(matrix);
    const p = g.attributes.position;
    const base = this.pos.length / 3;
    for (let i = 0; i < p.count; i++) this.vert(p.getX(i), p.getY(i), p.getZ(i), colour, bone, 1);
    for (let i = 0; i < p.count; i += 3) this.ind.push(base + i, base + i + 1, base + i + 2);
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(this.col, 3));
    g.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(this.si, 4));
    g.setAttribute("skinWeight", new THREE.Float32BufferAttribute(this.sw, 4));
    g.setIndex(this.ind);
    g.computeVertexNormals();
    return g;
  }
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * outfit: { skin, hair, top, bottom, shoes, sleeve: 'short'|'long', legs: 'shorts'|'long', belt?, bald? }
 */
export function makeHuman(outfit, extras = {}) {
  const B = makeBones();
  const index = {};
  B.list.forEach((bone, i) => (index[bone.name] = i));
  const build = new Builder(index);
  const C = (hex) => new THREE.Color(hex);
  const skin = C(outfit.skin);
  const top = C(outfit.top);
  const bottom = C(outfit.bottom);
  const shoes = C(outfit.shoes || outfit.skin);
  const belt = outfit.belt ? C(outfit.belt) : null;
  const longSleeve = outfit.sleeve === "long";
  const longLegs = outfit.legs === "long";
  const gi = !!outfit.gi;

  // ---- torso: hips up to the neck, elliptical, weighted hips/spine/chest ----
  const torsoProfile = [
    // y, rx, rz
    [0.84, 0.165, 0.108], [0.9, 0.172, 0.112], [0.96, 0.162, 0.106], [1.02, 0.15, 0.1], [1.08, 0.148, 0.1],
    [1.14, 0.158, 0.106], [1.22, 0.178, 0.116], [1.3, 0.192, 0.122], [1.38, 0.2, 0.118], [1.43, 0.195, 0.108],
    [1.47, 0.16, 0.09], [1.5, 0.09, 0.07], [1.52, 0.06, 0.055],
  ];
  const torsoRings = [];
  for (let i = 0; i < torsoProfile.length; i++) {
    const [y, rx, rz] = torsoProfile[i];
    const wSpine = smooth(0.94, 1.08, y);
    const wChest = smooth(1.14, 1.3, y);
    let bones;
    if (wChest > 0) bones = [["chest", wChest], ["spine", 1 - wChest]];
    else bones = [["spine", wSpine], ["hips", 1 - wSpine]];
    // what is worn at this height
    let colour = top;
    if (y < 0.985) colour = gi ? top : bottom; // a gi jacket hangs past the hips
    if (gi && belt && y > 0.94 && y < 1.0) colour = belt;
    if (!gi && y < 0.985) colour = bottom;
    torsoRings.push({ y, cx: 0, cz: 0, rx, rz, bones, colour });
  }
  build.tube(torsoRings.reverse(), true, true);

  // ---- neck and head ----
  build.rigid(new THREE.CylinderGeometry(0.05, 0.056, 0.14, SEG), new THREE.Matrix4().makeTranslation(0, 1.555, 0.005), skin, "neck");
  build.rigid(
    new THREE.SphereGeometry(0.104, 28, 20),
    new THREE.Matrix4().compose(new THREE.Vector3(0, 1.665, -0.005), new THREE.Quaternion(), new THREE.Vector3(0.93, 1.14, 1.02)),
    skin,
    "head"
  );
  // ears
  for (const s of [-1, 1]) {
    build.rigid(
      new THREE.SphereGeometry(0.022, 10, 8),
      new THREE.Matrix4().compose(new THREE.Vector3(0.097 * s, 1.66, 0.005), new THREE.Quaternion(), new THREE.Vector3(0.5, 1.2, 0.9)),
      skin,
      "head"
    );
  }

  // ---- legs: hip -> knee -> ankle, one tube each ----
  for (const s of [-1, 1]) {
    const x0 = 0.095 * s;
    const prof = [
      // y, r
      [0.95, 0.098], [0.88, 0.094], [0.8, 0.087], [0.72, 0.078], [0.63, 0.068], [0.56, 0.06], [0.52, 0.056],
      [0.48, 0.055], [0.44, 0.058], [0.38, 0.062], [0.32, 0.058], [0.25, 0.048], [0.18, 0.04], [0.11, 0.036], [0.075, 0.036],
    ];
    const rings = prof.map(([y, r]) => {
      // knee blend 0.44..0.54, ankle blend 0.07..0.12
      const wk = 1 - smooth(0.44, 0.54, y);
      const wf = 1 - smooth(0.07, 0.12, y);
      let bones;
      if (wf > 0) bones = [["foot" + s, wf], ["knee" + s, 1 - wf]];
      else bones = [["knee" + s, wk], ["thigh" + s, 1 - wk]];
      let colour = bottom;
      if (!longLegs && y < 0.57) colour = skin; // shorts end above the knee
      if (longLegs && y < 0.13) colour = skin;
      // the inside of the thigh tucks toward the middle a touch
      return { y, cx: x0 - s * (y > 0.8 ? 0.012 : 0), cz: y < 0.44 && y > 0.2 ? 0.008 : 0, rx: r, rz: r * 0.95, bones, colour };
    });
    build.tube(rings, false, true);
    // foot / shoe
    build.rigid(
      new RoundedBoxGeometry(0.098, 0.085, 0.26, 3, 0.035),
      new THREE.Matrix4().makeTranslation(x0, 0.045, -0.055),
      gi ? skin : shoes,
      "foot" + s
    );
    if (!gi && outfit.shoes) {
      // the sole, a shade darker
      build.rigid(new RoundedBoxGeometry(0.104, 0.022, 0.27, 2, 0.008), new THREE.Matrix4().makeTranslation(x0, 0.011, -0.055), C("#d8d8d8"), "foot" + s);
    }
  }

  // ---- arms: shoulder -> elbow -> wrist ----
  for (const s of [-1, 1]) {
    const x0 = 0.205 * s;
    const prof = [
      [1.475, 0.06], [1.44, 0.07], [1.39, 0.064], [1.33, 0.058], [1.26, 0.054], [1.2, 0.05],
      [1.16, 0.046], [1.12, 0.046], [1.06, 0.047], [1.0, 0.044], [0.94, 0.038], [0.9, 0.034],
    ];
    const rings = prof.map(([y, r]) => {
      const we = 1 - smooth(1.12, 1.2, y); // elbow blend
      const wh = 1 - smooth(0.89, 0.93, y);
      let bones;
      if (wh > 0) bones = [["hand" + s, wh], ["elbow" + s, 1 - wh]];
      else bones = [["elbow" + s, we], ["shoulder" + s, 1 - we]];
      if (y > 1.43) bones = [["shoulder" + s, 0.8], ["chest", 0.2]];
      let colour = top;
      if (!longSleeve && y < 1.27) colour = skin; // short sleeve ends mid upper arm
      if (longSleeve && y < 0.95) colour = skin;
      // arms hang a little outward
      const flare = (1.44 - y) * 0.06 * s;
      return { y, cx: x0 + flare, cz: 0, rx: r, rz: r * 0.92, bones, colour };
    });
    build.tube(rings, true, false);
    // hand
    build.rigid(
      new THREE.SphereGeometry(0.046, 14, 10),
      new THREE.Matrix4().compose(new THREE.Vector3(x0 + 0.03 * s, 0.84, 0.0), new THREE.Quaternion(), new THREE.Vector3(0.72, 1.3, 0.95)),
      skin,
      "hand" + s
    );
    build.rigid(
      new THREE.SphereGeometry(0.02, 10, 8),
      new THREE.Matrix4().compose(new THREE.Vector3(x0 + 0.018 * s, 0.86, -0.035), new THREE.Quaternion(), new THREE.Vector3(1, 1.6, 1)),
      skin,
      "hand" + s
    ); // thumb
  }

  const geo = build.geometry();
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: gi ? 0.92 : 0.78 });
  const mesh = new THREE.SkinnedMesh(geo, mat);
  mesh.add(B.hips);
  mesh.updateMatrixWorld(true);
  mesh.bind(new THREE.Skeleton(B.list));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;

  // ---- hair and face, on the head bone ----
  const headLocal = (x, y, z) => new THREE.Vector3(x, y - 1.61, z);
  if (!outfit.bald) {
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.111, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.52),
      new THREE.MeshStandardMaterial({ color: outfit.hair, roughness: 0.85 })
    );
    hair.position.copy(headLocal(0, 1.685, 0.012));
    hair.rotation.x = 0.32;
    hair.scale.set(0.97, 1.0, 1.05);
    hair.castShadow = true;
    B.head.add(hair);
    // a fade: short at the sides and back
    const fade = new THREE.Mesh(
      new THREE.SphereGeometry(0.107, 28, 16, 0, Math.PI * 2, Math.PI * 0.35, Math.PI * 0.3),
      new THREE.MeshStandardMaterial({ color: outfit.hair, roughness: 0.95, transparent: true, opacity: 0.55 })
    );
    fade.position.copy(headLocal(0, 1.665, 0.006));
    fade.scale.set(0.95, 1.12, 1.03);
    B.head.add(fade);
  }
  const dark = new THREE.MeshStandardMaterial({ color: "#1b120c", roughness: 0.35 });
  const white = new THREE.MeshStandardMaterial({ color: "#f2efe8", roughness: 0.4 });
  const browMat = new THREE.MeshStandardMaterial({ color: outfit.hair || "#2a1a10", roughness: 0.8 });
  const skinMat = new THREE.MeshStandardMaterial({ color: outfit.skin, roughness: 0.55 });
  for (const s of [-1, 1]) {
    const w = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 8), white);
    w.position.copy(headLocal(0.034 * s, 1.678, -0.09));
    w.scale.set(1.2, 0.8, 0.6);
    B.head.add(w);
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.0085, 10, 8), dark);
    e.position.copy(headLocal(0.034 * s, 1.678, -0.098));
    B.head.add(e);
    const brow = new THREE.Mesh(new RoundedBoxGeometry(0.036, 0.008, 0.012, 1, 0.003), browMat);
    brow.position.copy(headLocal(0.035 * s, 1.703, -0.096));
    brow.rotation.z = -0.1 * s;
    B.head.add(brow);
  }
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.017, 12, 10), skinMat);
  nose.position.copy(headLocal(0, 1.655, -0.105));
  nose.scale.set(0.85, 1.3, 1.1);
  B.head.add(nose);
  const mouth = new THREE.Mesh(new RoundedBoxGeometry(0.038, 0.007, 0.01, 1, 0.003), new THREE.MeshStandardMaterial({ color: "#7a3e32", roughness: 0.6 }));
  mouth.position.copy(headLocal(0, 1.618, -0.098));
  B.head.add(mouth);

  if (extras.backDecal) {
    // e.g. the Maple mark on the back of a tee; rides the chest bone
    const d = new THREE.Mesh(
      new THREE.PlaneGeometry(0.25, 0.255),
      new THREE.MeshStandardMaterial({ map: extras.backDecal, transparent: true, roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -2 })
    );
    d.position.set(0, 1.335 - 1.27, 0.124);
    d.rotation.x = -0.08;
    B.chest.add(d);
  }

  const human = { mesh, bones: B };
  return human;
}

/**
 * Pose a human for one frame.
 * phase: gait phase (radians, distance-driven); g: 0 standing .. 1 full walk
 */
export function poseHuman(h, phase, g, { lean = 0, breath = 0, armsOut = 0 } = {}) {
  const B = h.bones;
  const A = 0.42 * g;
  const K = 0.95 * g;
  for (const s of [-1, 1]) {
    const S = B.side[s];
    const ph = phase + (s > 0 ? Math.PI : 0);
    const th = A * Math.sin(ph);
    const flex = (K * Math.max(0, Math.cos(ph)) + 0.08) * g + (1 - g) * 0.05;
    S.thigh.rotation.set(th, 0, 0.02 * s);
    S.knee.rotation.x = -flex;
    S.foot.rotation.x = -(th - flex) * 0.85;
    S.shoulder.rotation.set(-0.8 * A * Math.sin(ph), 0, (0.06 + armsOut) * s);
    S.elbow.rotation.x = 0.16 + 0.32 * g + 0.18 * g * Math.max(0, Math.sin(ph));
    S.hand.rotation.x = 0.1;
  }
  B.hips.position.y = 0.95 + (0.022 * Math.abs(Math.cos(phase)) - 0.011) * g;
  B.hips.rotation.set(0, 0.08 * Math.sin(phase) * g, 0.03 * Math.cos(phase) * g);
  B.spine.rotation.set(-lean * 0.6, -0.06 * Math.sin(phase) * g, 0);
  B.chest.rotation.set(-lean * 0.4 + breath * 0.012, -0.08 * Math.sin(phase) * g, -0.02 * Math.cos(phase) * g);
  B.neck.rotation.set(lean * 0.25, 0.04 * Math.sin(phase) * g, 0);
  B.head.rotation.set(0.04, 0, 0);
}
