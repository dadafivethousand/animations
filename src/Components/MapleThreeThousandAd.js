// MapleThreeThousandAd.js — Maple Jiu Jitsu hits 3,000 Instagram followers,
// told as a rocket launch broadcast.
//
// T-3, 2, 1 -> ignition (flash, shake, smoke rolling off the pad) -> liftoff.
// The camera rides the rocket up through a cloud deck into black space with
// the Earth's limb below, while the telemetry strip counts FOLLOWERS like
// altitude. On 3,000 the frame flashes, the rocket rips out of shot and the
// thank-you lands.
//
// The scene is one <canvas> driven by requestAnimationFrame (smoke needs a
// particle system; CSS cannot do it). The HUD and copy are HTML on top, with
// their numbers written straight into refs so React never re-renders per frame.
//
//   ?theme=dusk  (default) orange horizon, blue hour
//   ?theme=night           dark launch, the flame lights everything
// Timing and copy are identical between them.
import React from "react";
import "../Stylesheets/MapleThreeThousandAd.css";
import mapleLogo from "../Images/maple-logo.png";
import mapleBjjLogo from "../Images/maple-bjj-logo.png";

// ---------------- timeline (ms from mount) ----------------
const T_HUD = 200;
const T_C3 = 700;
const T_C2 = 1400;
const T_C1 = 2100;
const T_IGN = 2750;
const T_LIFT = 3250;
const T_END = 8300; // 3,000 reached
const T_RELEASE = T_END + 600; // camera stops following, rocket leaves
const T_LABEL = T_END + 700;
const T_THANKS = T_END + 1400;
const T_SIGN = T_END + 2200;
export const MAPLE_ROCKET_TIMELINE = { T_C3, T_C2, T_C1, T_IGN, T_LIFT, T_END };

const TARGET = 3000;
const R_END = 6200; // world altitude (px) at T_END

// ---------------- helpers ----------------
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ss = (e0, e1, x) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;
function hex(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a, b, t) {
  const A = hex(a);
  const B = hex(b);
  return `rgb(${Math.round(lerp(A[0], B[0], t))},${Math.round(lerp(A[1], B[1], t))},${Math.round(lerp(A[2], B[2], t))})`;
}
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Soft round sprite, tinted. Particles are drawImage'd from these, which is
// far cheaper than a gradient per particle.
function sprite(color, hard = 0) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const [r, gg, b] = hex(color);
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, `rgba(${r},${gg},${b},1)`);
  grd.addColorStop(0.35 + hard * 0.3, `rgba(${r},${gg},${b},0.75)`);
  grd.addColorStop(0.7, `rgba(${r},${gg},${b},0.22)`);
  grd.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return c;
}

const THEMES = {
  dusk: {
    top: "#16204a",
    mid: "#57497c",
    hor: "#ff9a52",
    land: "#090a10",
    hills: "#151629",
    smoke: "#d8d6dc",
    shade: "#6d6878",
    cloud: "#d9b9bd",
    starsFrom: 0,
    ambient: 0.75,
  },
  night: {
    top: "#02040c",
    mid: "#0a1030",
    hor: "#27305a",
    land: "#040508",
    hills: "#0b0e1c",
    smoke: "#b9bdc6",
    shade: "#3a3e4a",
    cloud: "#4c5468",
    starsFrom: 0.55,
    ambient: 0.35,
  },
};
const SPACE = { top: "#000000", mid: "#01030a", hor: "#0a1a3c" };

export default function MapleThreeThousandAd({
  name = "MAPLE JIU JITSU",
  mission = "MISSION 3K",
  label = "FOLLOWERS",
  thanks = "THANK YOU",
  signoff = "SEE YOU ON THE MATS",
  site = "maplebjj.com",
}) {
  const themeKey = React.useMemo(() => {
    if (typeof window === "undefined") return "dusk";
    const q = new URLSearchParams(window.location.search).get("theme");
    return THEMES[q] ? q : "dusk";
  }, []);

  const canvasRef = React.useRef(null);
  const clockRef = React.useRef(null);
  const speedRef = React.useRef(null);
  const folRef = React.useRef(null);
  const [phase, setPhase] = React.useState(0);

  // ---- phase cues for the HTML layer ----
  React.useEffect(() => {
    const cues = [T_HUD, T_C3, T_C2, T_C1, T_IGN, T_LIFT, T_END, T_LABEL, T_THANKS, T_SIGN];
    const ids = cues.map((t, i) => setTimeout(() => setPhase(i + 1), t));
    return () => ids.forEach(clearTimeout);
  }, []);

  // ---- the scene ----
  React.useEffect(() => {
    const TH = THEMES[themeKey];
    const cv = canvasRef.current;
    const ctx = cv.getContext("2d");
    const rnd = mulberry32(3000);

    let W = 0;
    let H = 0;
    let S = 1;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      S = Math.min(W / 360, H / 640);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit);

    const SPR = {
      smoke: sprite(TH.smoke),
      shade: sprite(TH.shade),
      warm: sprite("#ff8f3a"),
      cloud: sprite(TH.cloud),
      hot: sprite("#fff1c4", 1),
    };
    const leafImg = new Image();
    leafImg.src = mapleBjjLogo;

    // Fixed scenery, generated once.
    const stars = Array.from({ length: 170 }, () => ({
      x: rnd(),
      y: rnd(),
      r: 0.35 + Math.pow(rnd(), 3) * 1.4,
      tw: rnd() * 6.28,
    }));
    const clouds = Array.from({ length: 70 }, () => ({
      x: (rnd() - 0.5) * 900,
      alt: 1900 + rnd() * 900,
      r: 50 + rnd() * 110,
      a: 0.25 + rnd() * 0.35,
      front: rnd() < 0.35,
    }));
    const lights = Array.from({ length: 46 }, () => ({
      x: (rnd() - 0.5) * 1400,
      alt: -3 - rnd() * 40,
      r: 0.6 + rnd() * 1.1,
    }));
    const hillPts = Array.from({ length: 28 }, (_, i) => ({
      x: -900 + i * 66,
      h: 10 + rnd() * 26 + Math.sin(i * 0.7) * 10,
    }));

    let parts = [];
    let lastNozzleAlt = 0;
    const t0 = performance.now();
    let last = t0;
    let raf;

    const altAt = (t) => {
      if (t < T_LIFT) return 0;
      const u = (t - T_LIFT) / (T_END - T_LIFT);
      return R_END * Math.pow(u, 2.15);
    };

    function emit(p) {
      parts.push(p);
      if (parts.length > 1800) parts.splice(0, parts.length - 1800);
    }

    function drawRocket(t, power) {
      // local coords: base of the engine section at (0,0), up is -y
      const bodyGrad = ctx.createLinearGradient(-14, 0, 14, 0);
      bodyGrad.addColorStop(0, "#5d636c");
      bodyGrad.addColorStop(0.28, "#e9ecef");
      bodyGrad.addColorStop(0.42, "#ffffff");
      bodyGrad.addColorStop(0.75, "#b4bac2");
      bodyGrad.addColorStop(1, "#4a4f57");

      // legs / fins
      ctx.fillStyle = "#1b1e23";
      ctx.beginPath();
      ctx.moveTo(-13, -30); ctx.lineTo(-24, 4); ctx.lineTo(-18, 4); ctx.lineTo(-11, -8); ctx.closePath();
      ctx.moveTo(13, -30); ctx.lineTo(24, 4); ctx.lineTo(18, 4); ctx.lineTo(11, -8); ctx.closePath();
      ctx.fill();

      // engine bells
      ctx.fillStyle = "#2a2d33";
      ctx.beginPath();
      ctx.moveTo(-10, 0); ctx.lineTo(-12, 8); ctx.lineTo(12, 8); ctx.lineTo(10, 0); ctx.closePath();
      ctx.fill();

      // body + fairing
      ctx.beginPath();
      ctx.moveTo(-13, 0);
      ctx.lineTo(-13, -168);
      ctx.bezierCurveTo(-13, -190, -6, -210, 0, -218);
      ctx.bezierCurveTo(6, -210, 13, -190, 13, -168);
      ctx.lineTo(13, 0);
      ctx.closePath();
      ctx.save();
      ctx.clip();
      ctx.fillStyle = bodyGrad;
      ctx.fillRect(-14, -220, 28, 222);
      // engine section, interstage, fairing seam
      ctx.fillStyle = "rgba(20,22,26,0.92)";
      ctx.fillRect(-14, -18, 28, 18);
      ctx.fillRect(-14, -126, 28, 9);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(-14, -169, 28, 1.2);
      // panel lines
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      for (let y = -110; y < -20; y += 18) ctx.fillRect(-14, y, 28, 0.8);
      // decal: the leaf, then MAPLE running up the body
      if (leafImg.complete && leafImg.naturalWidth) {
        ctx.drawImage(leafImg, -9, -158, 18, 18);
      }
      ctx.save();
      ctx.translate(2.5, -32);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = "#0a1a3c";
      ctx.font = "900 11px Inter, Arial, sans-serif";
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillText("MAPLE", 0, 0);
      ctx.restore();
      // underlit by the flame
      if (power > 0) {
        const lit = ctx.createLinearGradient(0, 0, 0, -120);
        lit.addColorStop(0, `rgba(255,150,60,${0.55 * power})`);
        lit.addColorStop(1, "rgba(255,150,60,0)");
        ctx.fillStyle = lit;
        ctx.fillRect(-14, -120, 28, 122);
      }
      ctx.restore();
    }

    function drawFlame(t, power, alt) {
      if (power <= 0) return;
      const thin = ss(400, 5200, alt); // plume balloons in thin air
      const flick = 1 + Math.sin(t * 0.061) * 0.07 + Math.sin(t * 0.137) * 0.05 + (rnd() - 0.5) * 0.12;
      const len = (70 + 50 * thin) * power * flick;
      const w = 11 + 34 * thin;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const glow = ctx.createRadialGradient(0, 20, 0, 0, 20, 190);
      glow.addColorStop(0, `rgba(255,170,80,${0.55 * power})`);
      glow.addColorStop(0.4, `rgba(255,110,40,${0.18 * power})`);
      glow.addColorStop(1, "rgba(255,90,30,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(-190, -170, 380, 380);

      const plume = (wid, l, c0, c1) => {
        const g = ctx.createLinearGradient(0, 6, 0, 6 + l);
        g.addColorStop(0, c0);
        g.addColorStop(1, c1);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(-10, 6);
        ctx.bezierCurveTo(-wid, 6 + l * 0.3, -wid * 0.45, 6 + l * 0.8, 0, 6 + l);
        ctx.bezierCurveTo(wid * 0.45, 6 + l * 0.8, wid, 6 + l * 0.3, 10, 6);
        ctx.closePath();
        ctx.fill();
      };
      plume(w * 1.5, len * 1.5, "rgba(255,120,40,0.65)", "rgba(255,60,20,0)");
      plume(w * 1.05, len * 1.1, "rgba(255,190,90,0.9)", "rgba(255,120,40,0)");
      plume(w * 0.55, len * 0.75, "rgba(255,255,235,1)", "rgba(255,220,150,0)");

      // shock diamonds, only in thick air
      const md = (1 - thin) * power;
      if (md > 0.05) {
        for (let i = 0; i < 4; i++) {
          const y = 16 + i * 13 * flick;
          ctx.globalAlpha = md * (0.85 - i * 0.18);
          ctx.drawImage(SPR.hot, -5, y - 4, 10, 8);
        }
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    }

    function frame(now) {
      const t = now - t0;
      const dt = Math.min(50, now - last);
      last = now;

      // ---- rocket & camera ----
      const r = altAt(t);
      const u = clamp01((t - T_LIFT) / (T_END - T_LIFT));
      const power = ss(T_IGN, T_IGN + 350, t);
      const camAlt = t < T_RELEASE ? r : altAt(T_RELEASE);
      const z = S * lerp(1.0, 0.5, ss(0.25, 1, u));
      const baseY = H * lerp(0.8, 0.66, ss(0, 0.35, u));

      // ---- shake ----
      let A = 0;
      if (t > T_IGN) A += 7 * Math.exp(-(t - T_IGN) / 600) + 2.2 * power * (1 - ss(0.6, 1, u));
      if (t > T_END) A += 10 * Math.exp(-(t - T_END) / 380);
      const sx = A * (Math.sin(t * 0.093) * 0.6 + (rnd() - 0.5) * 0.8);
      const sy = A * (Math.cos(t * 0.081) * 0.6 + (rnd() - 0.5) * 0.8);

      // world -> screen
      const ox = W / 2 + sx;
      const oy = baseY + camAlt * z + sy;
      const toScreenY = (alt) => oy - alt * z;

      // ---- sky ----
      const k = ss(700, 5200, camAlt);
      const horY = toScreenY(0);
      const sky = ctx.createLinearGradient(0, 0, 0, Math.max(horY, H * 0.5));
      sky.addColorStop(0, mix(TH.top, SPACE.top, k));
      sky.addColorStop(0.6, mix(TH.mid, SPACE.mid, k));
      sky.addColorStop(1, mix(TH.hor, SPACE.hor, k));
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // ---- stars ----
      const sa = Math.max(TH.starsFrom, ss(1800, 4800, camAlt));
      if (sa > 0) {
        ctx.fillStyle = "#ffffff";
        const drift = (camAlt * 0.02 * S) % H;
        for (const s of stars) {
          const y = (s.y * H + drift) % H;
          const fade = Math.min(1, (horY - y) / 120); // not below the horizon glow
          if (fade <= 0) continue;
          ctx.globalAlpha = sa * fade * (0.55 + 0.45 * Math.sin(s.tw + t * 0.003));
          ctx.fillRect(s.x * W, y, s.r * S, s.r * S);
        }
        ctx.globalAlpha = 1;
      }

      // ---- Earth's limb ----
      const la = ss(3600, 6400, camAlt);
      if (la > 0) {
        const cx = W / 2;
        const R = W * 2.4;
        const cy = H * 1.08 + R - ss(3600, 6400, camAlt) * H * 0.12;
        ctx.save();
        ctx.globalAlpha = la;
        const atm = ctx.createRadialGradient(cx, cy, R - 4, cx, cy, R + 60 * S);
        atm.addColorStop(0, "rgba(90,170,255,0.9)");
        atm.addColorStop(0.25, "rgba(60,130,255,0.35)");
        atm.addColorStop(1, "rgba(40,90,255,0)");
        ctx.fillStyle = atm;
        ctx.beginPath();
        ctx.arc(cx, cy, R + 60 * S, 0, Math.PI * 2);
        ctx.fill();
        const earth = ctx.createLinearGradient(0, cy - R, 0, cy - R + H * 0.2);
        earth.addColorStop(0, "#1d4f9a");
        earth.addColorStop(0.15, "#0d2a5a");
        earth.addColorStop(1, "#020a1c");
        ctx.fillStyle = earth;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ---- world layer ----
      ctx.save();
      ctx.translate(ox, oy);
      ctx.scale(z, z);

      // horizon glow band
      if (horY < H + 200) {
        const hg = ctx.createLinearGradient(0, -160, 0, 0);
        hg.addColorStop(0, "rgba(255,160,90,0)");
        hg.addColorStop(1, themeKey === "dusk" ? "rgba(255,170,100,0.35)" : "rgba(120,140,220,0.12)");
        ctx.fillStyle = hg;
        ctx.fillRect(-2000, -160, 4000, 160);
      }

      // distant hills
      ctx.fillStyle = TH.hills;
      ctx.beginPath();
      ctx.moveTo(-1000, 0);
      for (const p of hillPts) ctx.lineTo(p.x, -p.h);
      ctx.lineTo(1000, 0);
      ctx.closePath();
      ctx.fill();

      // clouds behind
      for (const c of clouds) {
        if (c.front) continue;
        ctx.globalAlpha = c.a * TH.ambient;
        ctx.drawImage(SPR.cloud, c.x - c.r, -c.alt - c.r * 0.5, c.r * 2, c.r);
      }
      ctx.globalAlpha = 1;

      // ground
      ctx.fillStyle = TH.land;
      ctx.fillRect(-2000, 0, 4000, 3000);
      for (const l of lights) {
        ctx.fillStyle = "rgba(255,200,130,0.85)";
        ctx.fillRect(l.x, -l.alt, l.r, l.r);
      }

      // the pad and tower, lit by the flame
      const padLit = power * (1 - ss(0, 900, r));
      ctx.fillStyle = mix("#25282e", "#7a4a2a", padLit * 0.8);
      ctx.fillRect(-70, -6, 140, 10);
      const towerCol = mix("#14171c", "#8a4f25", padLit * 0.7);
      ctx.strokeStyle = towerCol;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-46, -6); ctx.lineTo(-46, -238);
      ctx.moveTo(-32, -6); ctx.lineTo(-32, -238);
      for (let y = -6; y > -236; y -= 14) {
        ctx.moveTo(-46, y); ctx.lineTo(-32, y - 14);
        ctx.moveTo(-32, y); ctx.lineTo(-46, y - 14);
      }
      ctx.stroke();
      ctx.fillStyle = towerCol;
      ctx.fillRect(-48, -242, 18, 5);
      // access arm swings away just before ignition
      const armA = ss(T_IGN - 700, T_IGN - 100, t) * 1.25;
      ctx.save();
      ctx.translate(-32, -176);
      ctx.rotate(-armA);
      ctx.fillRect(0, -2, 20, 4);
      ctx.restore();
      // blinking red beacon
      if (Math.floor(t / 600) % 2 === 0) {
        ctx.fillStyle = "#ff2a2a";
        ctx.globalCompositeOperation = "lighter";
        ctx.drawImage(SPR.warm, -45, -252, 12, 12);
        ctx.globalCompositeOperation = "source-over";
        ctx.fillRect(-40, -247, 2, 2);
      }

      // ---- particles: update + emit ----
      const nozzleAlt = r - 8;
      // venting vapour during the countdown
      if (t < T_IGN) {
        if (rnd() < dt * 0.03) {
          emit({ x: (rnd() < 0.5 ? -13 : 13), alt: 120 + rnd() * 40, vx: (rnd() - 0.5) * 0.02, vy: -0.012,
            r0: 2, r1: 16 + rnd() * 10, tau: 900, age: 0, life: 1600, a: 0.3, front: false });
        }
      }
      // ignition: smoke thrown sideways out of the flame trench
      if (t > T_IGN && r < 160) {
        const n = Math.round(dt * 0.55 * power * (1 - r / 160));
        for (let i = 0; i < n; i++) {
          const dir = rnd() < 0.5 ? -1 : 1;
          const up = rnd() < 0.25; // some of it boils straight up round the rocket
          emit({ x: dir * rnd() * 10, alt: rnd() * 8, vx: dir * (up ? 0.03 + rnd() * 0.08 : 0.16 + rnd() * 0.42),
            vy: up ? 0.04 + rnd() * 0.07 : 0.008 + rnd() * 0.03,
            r0: 14, r1: 90 + rnd() * 90, tau: 1500, age: 0, life: 5600 + rnd() * 2400, a: 0.9, front: rnd() < 0.5 });
        }
      }
      // ascent: exhaust trail, filled along the path travelled this frame
      if (t > T_LIFT) {
        const seg = Math.max(0, nozzleAlt - lastNozzleAlt);
        const n = Math.min(40, Math.max(Math.round(dt * 0.16), Math.round(seg / 5)));
        const thin = ss(400, 5200, r);
        for (let i = 0; i < n; i++) {
          const a = lastNozzleAlt + seg * (i / Math.max(1, n)) - 20 - rnd() * 30;
          emit({ x: (rnd() - 0.5) * 6, alt: a, vx: (rnd() - 0.5) * 0.025, vy: -0.005,
            r0: 20 + thin * 16, r1: 50 + rnd() * 40 + thin * 60, tau: 900, age: 0, life: 3200 + rnd() * 1800,
            a: 0.85 * (1 - thin * 0.65), front: false });
        }
      }
      lastNozzleAlt = nozzleAlt;

      for (const p of parts) {
        p.age += dt;
        p.x += p.vx * dt;
        p.alt += p.vy * dt;
        p.vx *= Math.pow(0.9985, dt);
      }
      parts = parts.filter((p) => p.age < p.life);

      const drawParts = (front) => {
        const top = -(camAlt + (H - baseY) / z + 400);
        const bottom = -(camAlt - baseY / z - 400);
        for (const p of parts) {
          if (p.front !== front) continue;
          if (-p.alt < top || -p.alt > bottom) continue;
          const rad = p.r0 + (p.r1 - p.r0) * (1 - Math.exp(-p.age / p.tau));
          const fade = Math.min(1, p.age / 140) * Math.pow(1 - p.age / p.life, 1.3);
          const al = p.a * fade;
          // shadowed core + lit body
          ctx.globalAlpha = al * 0.7;
          ctx.drawImage(SPR.shade, p.x - rad, -p.alt - rad * 0.9, rad * 2, rad * 2);
          ctx.globalAlpha = al * 0.65;
          ctx.drawImage(SPR.smoke, p.x - rad, -p.alt - rad * 1.1, rad * 2, rad * 2);
          // flame light on smoke near the nozzle
          const d = Math.hypot(p.x, p.alt - nozzleAlt);
          const warm = power * Math.max(0, 1 - d / 260) * (t < T_RELEASE + 400 ? 1 : 0);
          if (warm > 0.02) {
            ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = al * warm * 0.55;
            ctx.drawImage(SPR.warm, p.x - rad, -p.alt - rad, rad * 2, rad * 2);
            ctx.globalCompositeOperation = "source-over";
          }
        }
        ctx.globalAlpha = 1;
      };

      drawParts(false);

      // rocket + flame
      ctx.save();
      ctx.translate(0, -r);
      drawFlame(t, power, r);
      drawRocket(t, power);
      ctx.restore();

      drawParts(true);

      // clouds in front
      for (const c of clouds) {
        if (!c.front) continue;
        ctx.globalAlpha = c.a * TH.ambient * 0.9;
        ctx.drawImage(SPR.cloud, c.x - c.r, -c.alt - c.r * 0.5, c.r * 2, c.r);
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      // ---- speed streaks while punching through the air ----
      const vel = t > T_LIFT ? u : 0;
      const streak = ss(0.25, 0.55, vel) * (1 - ss(0.8, 1, vel));
      if (streak > 0) {
        ctx.strokeStyle = `rgba(255,255,255,${0.12 * streak})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 22; i++) {
          const x = ((i * 97.3) % 1) * W + (i * 37) % W;
          const y = ((t * 1.6 + i * 211) % (H + 200)) - 100;
          ctx.moveTo(x % W, y);
          ctx.lineTo(x % W, y + 60 * S);
        }
        ctx.stroke();
      }

      // ---- vignette ----
      const vg = ctx.createRadialGradient(W / 2, H * 0.5, H * 0.25, W / 2, H * 0.5, H * 0.75);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      // ---- flashes ----
      let fl = 0;
      if (t > T_IGN) fl += 0.55 * Math.exp(-(t - T_IGN) / 260);
      if (t > T_END) fl += 0.8 * Math.exp(-(t - T_END) / 320);
      if (fl > 0.01) {
        ctx.fillStyle = `rgba(255,236,210,${Math.min(1, fl)})`;
        ctx.fillRect(0, 0, W, H);
      }

      // ---- HUD numbers ----
      const secs = (t - T_IGN - 500) / 1000; // T-0 at liftoff
      const sign = secs < 0 ? "T-" : "T+";
      const as = Math.abs(secs);
      const cs = secs < 0 ? Math.ceil(as) : Math.floor(as);
      if (clockRef.current) clockRef.current.textContent = `${sign}00:00:${String(cs).padStart(2, "0")}`;
      const fol = Math.round(TARGET * Math.pow(u, 1.5));
      if (folRef.current) folRef.current.textContent = fol.toLocaleString("en-US");
      const kmh = t > T_LIFT ? Math.round(28000 * Math.pow(Math.min(u, 1.0), 1.1)) : 0;
      if (speedRef.current) speedRef.current.textContent = kmh.toLocaleString("en-US");

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, [themeKey]);

  const cls = Array.from({ length: phase }, (_, i) => `rk-p${i + 1}`).join(" ");
  const countText = phase >= 6 ? "LIFTOFF" : phase === 5 ? "IGNITION" : phase === 4 ? "1" : phase === 3 ? "2" : phase === 2 ? "3" : "";

  return (
    <div className={`rk-stage rk-${themeKey} ${cls}`}>
      <canvas ref={canvasRef} className="rk-canvas" aria-hidden />

      <div className="rk-hud-top">
        <img className="rk-hud-logo" src={mapleLogo} alt="" />
        <div className="rk-hud-id">
          <div className="rk-hud-name">{name}</div>
          <div className="rk-hud-mission">{mission}</div>
        </div>
        <div className="rk-clock" ref={clockRef}>T-00:00:03</div>
      </div>

      <div className="rk-count" key={countText}>
        <span className={countText.length > 1 ? "rk-word" : "rk-digit"}>{countText}</span>
      </div>

      <div className="rk-tele">
        <div className="rk-gauge">
          <div className="rk-g-label">SPEED</div>
          <div className="rk-g-val"><b ref={speedRef}>0</b><small>KM/H</small></div>
        </div>
        <div className="rk-gauge rk-gauge-main">
          <div className="rk-g-label">{label}</div>
          <div className="rk-g-val"><b ref={folRef}>0</b></div>
        </div>
      </div>

      <div className="rk-final">
        <img className="rk-final-logo" src={mapleLogo} alt="Maple Jiu Jitsu" />
        <div className="rk-final-num">3,000</div>
        <div className="rk-final-label"><span>{label}</span></div>
        <div className="rk-final-thanks"><span>{thanks}</span></div>
        <div className="rk-final-sign">{signoff}</div>
        <div className="rk-final-site">{site}</div>
      </div>
    </div>
  );
}
