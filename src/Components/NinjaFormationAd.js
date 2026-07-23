// NinjaFormationAd.jsx — Code Ninjas Woodbridge brand reveal.
//
// A WebGL (three.js) particle system: ~42,000 glowing points swirl through 3D
// space and coalesce into the Code Ninjas ninja mask (sampled from the icon's
// dark pixels, so the eye-band reads as a gap and the eye-slits glow). Once the
// mask forms, the wordmark, tagline and CTA resolve underneath.
//
// The particle motion runs on the GPU: each point interpolates from a random
// start to its mask target via a single uProg uniform, with a swirl that fades
// as it lands. Mobile / portrait only.
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "../Stylesheets/NinjaFormationAd.css";
import ninjaMask from "../Images/cn-ninja-icon.png";

const COUNT = 42000;

const VERT = `
  uniform float uProg; uniform float uTime; uniform float uSize; uniform float uPix;
  attribute vec3 aStart; attribute vec3 aTarget; attribute vec3 aColor; attribute float aSeed;
  varying vec3 vColor; varying float vA;
  void main() {
    float e = clamp(uProg, 0.0, 1.0);
    float t = e * e * (3.0 - 2.0 * e);            // smoothstep ease
    vec3 pos = mix(aStart, aTarget, t);
    float sw = 1.0 - t;                            // swirl fades as it lands
    float a = aSeed * 6.2831853 + uTime * 0.8;
    pos += vec3(sin(a), cos(a * 1.27), sin(a * 0.63)) * sw * 0.6;
    pos.xy += vec2(sin(uTime * 0.7 + aSeed * 11.0), cos(uTime * 0.6 + aSeed * 9.0)) * 0.012 * t;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float ps = uSize * uPix / max(0.001, -mv.z);
    gl_PointSize = clamp(ps, 1.0, 8.0);
    vColor = aColor;
    vA = mix(0.15, 1.0, t);
  }
`;

const FRAG = `
  precision mediump float;
  varying vec3 vColor; varying float vA;
  void main() {
    vec2 d = gl_PointCoord - 0.5;
    float r2 = dot(d, d);
    float alpha = smoothstep(0.25, 0.0, r2);       // soft round sprite
    if (alpha <= 0.001) discard;
    gl_FragColor = vec4(vColor, alpha * vA);
  }
`;

export default function NinjaFormationAd() {
  const mountRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

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

    const group = new THREE.Group();           // holds the particle mask
    scene.add(group);

    const uniforms = {
      uProg: { value: 0 }, uTime: { value: 0 },
      uSize: { value: 0.013 }, uPix: { value: 1000 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms, vertexShader: VERT, fragmentShader: FRAG,
      transparent: true, depthWrite: false, depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    // faint background starfield for depth
    const starN = 1200;
    const sp = new Float32Array(starN * 3);
    for (let i = 0; i < starN; i++) {
      sp[i * 3] = (Math.random() - 0.5) * 42;
      sp[i * 3 + 1] = (Math.random() - 0.5) * 42;
      sp[i * 3 + 2] = -6 - Math.random() * 26;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x6a7280, size: 0.055, sizeAttenuation: true,
      transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    function resize() {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.uPix.value = renderer.domElement.height;   // drawing-buffer px
      // fit the mask to ~62% of the visible width (capped so it isn't too tall)
      const dist = camera.position.z - group.position.z;
      const visH = 2 * Math.tan((camera.fov * Math.PI / 180) / 2) * dist;
      const visW = visH * camera.aspect;
      // keep the mask small and high in the frame so it never overlaps the
      // CODE NINJAS / WOODBRIDGE wordmark that sits below (bottom-anchored)
      group.scale.setScalar(Math.min(visW * 0.50, visH * 0.33));
      group.position.y = visH * 0.30;
    }

    // build the particle mask from the icon's dark pixels
    const img = new Image();
    img.onload = () => {
      const S = 220;
      const cv = document.createElement("canvas"); cv.width = S; cv.height = S;
      const ctx = cv.getContext("2d");
      ctx.drawImage(img, 0, 0, S, S);
      const data = ctx.getImageData(0, 0, S, S).data;
      const ink = [];
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const idx = (y * S + x) * 4;
        if (data[idx + 3] < 100) continue;              // transparent
        const lum = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
        if (lum < 95) ink.push(x, y);                   // dark = mask ink
      }
      if (!ink.length) return;
      const nInk = ink.length / 2;

      const aStart = new Float32Array(COUNT * 3);
      const aTarget = new Float32Array(COUNT * 3);
      const aColor = new Float32Array(COUNT * 3);
      const aSeed = new Float32Array(COUNT);
      // corporate Code Ninjas identity — CN blue + white, with brand-red sparks
      const CNBLUE = [0.16, 0.66, 0.88], WHITE = [0.92, 0.96, 1.0], RED = [1.0, 0.16, 0.24];

      for (let i = 0; i < COUNT; i++) {
        const p = ((Math.random() * nInk) | 0) * 2;
        const nx = (ink[p] + (Math.random() - 0.5)) / S - 0.5;
        const ny = -((ink[p + 1] + (Math.random() - 0.5)) / S - 0.5);
        aTarget[i * 3] = nx; aTarget[i * 3 + 1] = ny; aTarget[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
        // start: a swirling disc in front of the camera
        const r = 1.0 + Math.random() * 1.6, th = Math.random() * 6.2831853;
        aStart[i * 3] = r * Math.cos(th);
        aStart[i * 3 + 1] = r * Math.sin(th);
        aStart[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
        const roll = Math.random();
        const c = roll < 0.09 ? RED : (roll < 0.5 ? CNBLUE : WHITE);
        const j = 0.9 + Math.random() * 0.1;            // brightness variance
        aColor[i * 3] = c[0] * j; aColor[i * 3 + 1] = c[1] * j; aColor[i * 3 + 2] = c[2] * j;
        aSeed[i] = Math.random();
      }

      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(COUNT * 3), 3));
      g.setAttribute("aStart", new THREE.Float32BufferAttribute(aStart, 3));
      g.setAttribute("aTarget", new THREE.Float32BufferAttribute(aTarget, 3));
      g.setAttribute("aColor", new THREE.Float32BufferAttribute(aColor, 3));
      g.setAttribute("aSeed", new THREE.Float32BufferAttribute(aSeed, 1));
      points = new THREE.Points(g, material);
      points.frustumCulled = false;
      group.add(points);
    };
    img.src = ninjaMask;

    resize();
    window.addEventListener("resize", resize);
    const revealT = setTimeout(() => setRevealed(true), 3000);

    function animate() {
      if (!running) return;
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      uniforms.uProg.value = Math.min(1, Math.max(0, (t - 0.7) / 2.1));
      camera.position.z = 9 - 1.6 * Math.min(1, t / 3);   // slow dolly-in
      camera.position.x = Math.sin(t * 0.25) * 0.15;       // gentle idle drift
      camera.position.y = Math.cos(t * 0.20) * 0.10;
      camera.lookAt(0, group.position.y * 0.5, 0);
      stars.rotation.z = t * 0.01;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(revealT);
      window.removeEventListener("resize", resize);
      if (points) points.geometry.dispose();
      material.dispose(); starGeo.dispose(); starMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="nf-stage">
      <div className="nf-canvas" ref={mountRef} aria-hidden />

      <div className={`nf-below ${revealed ? "is-in" : ""}`}>
        <div className="nf-name" style={{ transitionDelay: "0ms" }}>
          <span className="nf-code">CODE</span><span className="nf-ninjas">NINJAS</span>
        </div>
        <div className="nf-sub" style={{ transitionDelay: "90ms" }}>WOODBRIDGE</div>
        <h1 className="nf-tag" style={{ transitionDelay: "180ms" }}>
          Where kids build<br /><em>real video games.</em>
        </h1>
        <div className="nf-cta" style={{ transitionDelay: "300ms" }}>
          <span>cnwoodbridge.com</span>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor"
              strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="nf-meta" style={{ transitionDelay: "400ms" }}>
          <span>6175 Hwy 7, Woodbridge</span><i /><span>647-887-9940</span>
        </div>
      </div>
    </div>
  );
}
