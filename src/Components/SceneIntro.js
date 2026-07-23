// SceneIntro.jsx — reel scene 1.
// The ninja mask forms from ~42k particles, then a typewriter prints
// "CODE NINJAS" and "WOODBRIDGE" beneath it. Pure black stage (the reel
// paints black behind the transparent WebGL canvas).
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "../Stylesheets/CodeNinjasReel.css";
import ninjaMask from "../Images/cn-ninja-icon.png";

const COUNT = 42000;

const VERT = `
  uniform float uProg; uniform float uTime; uniform float uSize; uniform float uPix;
  attribute vec3 aStart; attribute vec3 aTarget; attribute vec3 aColor; attribute float aSeed;
  varying vec3 vColor; varying float vA;
  void main() {
    float e = clamp(uProg, 0.0, 1.0);
    float t = e * e * (3.0 - 2.0 * e);
    vec3 pos = mix(aStart, aTarget, t);
    float sw = 1.0 - t;
    float a = aSeed * 6.2831853 + uTime * 0.8;
    pos += vec3(sin(a), cos(a * 1.27), sin(a * 0.63)) * sw * 0.6;
    pos.xy += vec2(sin(uTime * 0.7 + aSeed * 11.0), cos(uTime * 0.6 + aSeed * 9.0)) * 0.012 * t;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float ps = uSize * uPix / max(0.001, -mv.z);
    gl_PointSize = clamp(ps, 1.0, 8.0);
    vColor = aColor; vA = mix(0.15, 1.0, t);
  }
`;
const FRAG = `
  precision mediump float;
  varying vec3 vColor; varying float vA;
  void main() {
    vec2 d = gl_PointCoord - 0.5;
    float alpha = smoothstep(0.25, 0.0, dot(d, d));
    if (alpha <= 0.001) discard;
    gl_FragColor = vec4(vColor, alpha * vA);
  }
`;

const LINE1 = "CODE NINJAS";
const LINE2 = "WOODBRIDGE";

export default function SceneIntro() {
  const mountRef = useRef(null);
  const [n1, setN1] = useState(0);
  const [n2, setN2] = useState(0);
  const [typing, setTyping] = useState(0); // 0 none, 1 line1, 2 line2, 3 done

  // typewriter, kicked off after the mask forms (~2.6s)
  useEffect(() => {
    const timers = [];
    timers.push(setTimeout(() => {
      setTyping(1);
      for (let i = 1; i <= LINE1.length; i++) timers.push(setTimeout(() => setN1(i), i * 95));
      const after1 = LINE1.length * 95 + 420;
      timers.push(setTimeout(() => setTyping(2), after1));
      for (let i = 1; i <= LINE2.length; i++) timers.push(setTimeout(() => setN2(i), after1 + i * 95));
      timers.push(setTimeout(() => setTyping(3), after1 + LINE2.length * 95 + 300));
    }, 2600));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    let raf, running = true, points = null;
    const clock = new THREE.Clock();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 9);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    const uniforms = { uProg: { value: 0 }, uTime: { value: 0 }, uSize: { value: 0.013 }, uPix: { value: 1000 } };
    const material = new THREE.ShaderMaterial({
      uniforms, vertexShader: VERT, fragmentShader: FRAG,
      transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
    });

    const starN = 1100, sp = new Float32Array(starN * 3);
    for (let i = 0; i < starN; i++) { sp[i * 3] = (Math.random() - 0.5) * 42; sp[i * 3 + 1] = (Math.random() - 0.5) * 42; sp[i * 3 + 2] = -6 - Math.random() * 26; }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x4a5566, size: 0.05, sizeAttenuation: true, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    function resize() {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      uniforms.uPix.value = renderer.domElement.height;
      const dist = camera.position.z - group.position.z;
      const visH = 2 * Math.tan((camera.fov * Math.PI / 180) / 2) * dist;
      const visW = visH * camera.aspect;
      group.scale.setScalar(Math.min(visW * 0.52, visH * 0.34));
      group.position.y = visH * 0.20;   // upper area; typewriter sits below
    }

    const img = new Image();
    img.onload = () => {
      const S = 220, cv = document.createElement("canvas"); cv.width = S; cv.height = S;
      const ctx = cv.getContext("2d"); ctx.drawImage(img, 0, 0, S, S);
      const data = ctx.getImageData(0, 0, S, S).data, ink = [];
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const idx = (y * S + x) * 4; if (data[idx + 3] < 100) continue;
        if (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114 < 95) ink.push(x, y);
      }
      if (!ink.length) return;
      const nInk = ink.length / 2;
      const aStart = new Float32Array(COUNT * 3), aTarget = new Float32Array(COUNT * 3), aColor = new Float32Array(COUNT * 3), aSeed = new Float32Array(COUNT);
      const CNBLUE = [0.16, 0.66, 0.88], WHITE = [0.92, 0.96, 1.0], RED = [1.0, 0.16, 0.24];
      for (let i = 0; i < COUNT; i++) {
        const p = ((Math.random() * nInk) | 0) * 2;
        aTarget[i * 3] = (ink[p] + (Math.random() - 0.5)) / S - 0.5;
        aTarget[i * 3 + 1] = -((ink[p + 1] + (Math.random() - 0.5)) / S - 0.5);
        aTarget[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
        const r = 1.0 + Math.random() * 1.6, th = Math.random() * 6.2831853;
        aStart[i * 3] = r * Math.cos(th); aStart[i * 3 + 1] = r * Math.sin(th); aStart[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
        const roll = Math.random(), c = roll < 0.09 ? RED : (roll < 0.5 ? CNBLUE : WHITE);
        aColor[i * 3] = c[0]; aColor[i * 3 + 1] = c[1]; aColor[i * 3 + 2] = c[2];
        aSeed[i] = Math.random();
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(COUNT * 3), 3));
      g.setAttribute("aStart", new THREE.Float32BufferAttribute(aStart, 3));
      g.setAttribute("aTarget", new THREE.Float32BufferAttribute(aTarget, 3));
      g.setAttribute("aColor", new THREE.Float32BufferAttribute(aColor, 3));
      g.setAttribute("aSeed", new THREE.Float32BufferAttribute(aSeed, 1));
      points = new THREE.Points(g, material); points.frustumCulled = false; group.add(points);
    };
    img.src = ninjaMask;

    resize(); window.addEventListener("resize", resize);
    function animate() {
      if (!running) return;
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      uniforms.uProg.value = Math.min(1, Math.max(0, (t - 0.7) / 2.1));
      camera.position.z = 9 - 1.6 * Math.min(1, t / 3);
      camera.position.x = Math.sin(t * 0.25) * 0.12; camera.position.y = Math.cos(t * 0.2) * 0.08;
      camera.lookAt(0, group.position.y * 0.5, 0);
      stars.rotation.z = t * 0.01;
      renderer.render(scene, camera);
    }
    animate();
    return () => {
      running = false; cancelAnimationFrame(raf); window.removeEventListener("resize", resize);
      if (points) points.geometry.dispose();
      material.dispose(); starGeo.dispose(); starMat.dispose(); renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="sc sc-intro">
      <div className="nf-canvas" ref={mountRef} aria-hidden />
      <div className="si-type">
        <div className="si-l1">
          {LINE1.slice(0, n1)}
          {typing === 1 && <span className="si-caret" />}
        </div>
        <div className="si-l2">
          {LINE2.slice(0, n2)}
          {typing >= 2 && typing < 3 && <span className="si-caret" />}
        </div>
      </div>
    </div>
  );
}
