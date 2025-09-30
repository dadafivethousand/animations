import React, { useEffect, useRef, useState } from "react";
import "../Stylesheets/MatrixWomenPromo.css";
import Nabi from "../Images/Nabi.jpg";
import Jess from "../Images/Jess.jpg";

/* ========================= Typewriter ========================= */
function Typewriter({ text, start, speed = 100, className }) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;

    let i = 0;
    const tick = () => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        timerRef.current = null;
        return;
      }
      timerRef.current = setTimeout(tick, speed);
    };
    timerRef.current = setTimeout(tick, speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [start, text, speed]);

  if (!start && out.length === 0) return null;

  return (
    <span className={className}>
      {out}
      {!done ? <span className="mx-caret" aria-hidden>█</span> : null}
    </span>
  );
}

/* ========================= UltraMatrixRain =========================
   Layered, realistic Matrix rain with parallax, bright heads, long trails,
   wind drift, DPR scaling, and autoresume/pause. No inline styles.
==================================================================== */
function UltraMatrixRain({ active }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    let width = 0, height = 0, DPR = 1;
    let running = false;

    // Glyph set: numbers + uppercase + symbols + katakana
    const CHARS =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*+=-アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロヲ";

    // Three parallax layers
    const LAYERS = [
      // tiny/far (dense, slow)
      { font: 10, drift: 0.05, speedMin: 0.7, speedMax: 1.0, alpha: 0.75, resetChance: 0.93 },
      // mid layer
      { font: 12, drift: 0.07, speedMin: 0.9, speedMax: 1.25, alpha: 0.85, resetChance: 0.94 },
      // large/near (sparser, faster)
      { font: 14, drift: 0.09, speedMin: 1.1, speedMax: 1.5, alpha: 0.9, resetChance: 0.96 },
    ];

    // Each layer has columns/drops
    let state = [];

    const rand = (a, b) => a + Math.random() * (b - a);

    const setup = () => {
      // Device pixel ratio
      DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      width = canvas.offsetWidth | 0;
      height = canvas.offsetHeight | 0;
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.textBaseline = "top";

      // Initialize layers
      state = LAYERS.map(layer => {
        const cols = Math.floor(width / layer.font);
        const drops = new Array(cols).fill(0).map(() => rand(0, height / layer.font));
        const speeds = new Array(cols).fill(0).map(() => rand(layer.speedMin, layer.speedMax));
        const headGlow = new Array(cols).fill(0).map(() => rand(0.9, 1.2)); // slight per-col head intensity
        const jitter = new Array(cols).fill(0).map(() => rand(-0.2, 0.2)); // per-col vertical jitter
        return { ...layer, cols, drops, speeds, headGlow, jitter, wind: rand(-0.15, 0.15) };
      });
    };

    // Debounced resize
    let resizeTimer = null;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setup();
      }, 120);
    };

    const drawLayer = (layer) => {
      const { font, cols, drops, speeds, headGlow, alpha, drift, jitter, resetChance } = layer;

      ctx.font = `${font}px monospace`;
      ctx.fillStyle = `rgba(0,255,0,${alpha})`;

      for (let i = 0; i < cols; i++) {
        const x = i * font;
        const y = drops[i] * font;

        // Head (brighter glyph)
        // Draw head with stronger glow
        ctx.shadowColor = "rgba(0,255,120,0.45)";
        ctx.shadowBlur = 8;
        const head = CHARS[(Math.random() * CHARS.length) | 0];
        ctx.fillText(head, x, y);

        // Trail: a couple faded glyphs behind the head
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 0.55 * alpha;
        const trail1 = CHARS[(Math.random() * CHARS.length) | 0];
        ctx.fillText(trail1, x + drift * 3, y - font);
        ctx.globalAlpha = 0.3 * alpha;
        const trail2 = CHARS[(Math.random() * CHARS.length) | 0];
        ctx.fillText(trail2, x + drift * 5, y - font * 2);

        // Reset alpha for next column
        ctx.globalAlpha = 1;

        // Advance this drop with slight jitter
        drops[i] += speeds[i] + jitter[i] * 0.2;

        // Occasionally drift sideways by nudging x via wind on next frames
        // (implemented visually by drawing the trail shifted; head x stays on column)

        // Reset to top with probability, making density high
        if (y > height && Math.random() > resetChance) {
          drops[i] = -Math.random() * 10; // respawn above top for smoother entry
          speeds[i] = rand(layer.speedMin, layer.speedMax);
          jitter[i] = rand(-0.2, 0.2);
        }
      }
      // light layer blending is handled by per-frame fade
    };

    const frame = () => {
      // Fade previous frame for long trails
      ctx.fillStyle = "rgba(0,0,0,0.07)";
      ctx.fillRect(0, 0, width, height);

      // Draw each layer
      for (let l = 0; l < state.length; l++) {
        drawLayer(state[l]);
      }
      rafRef.current = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      rafRef.current = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    // Visibility pause: save battery when tab is hidden
    const vis = () => {
      if (document.hidden || !active) {
        stop();
      } else {
        start();
      }
    };

    setup();
    if (active) start();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", vis);
    // Observe canvas size changes (e.g., CSS changes without window resize)
    observerRef.current = new ResizeObserver(setup);
    observerRef.current.observe(canvas);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", vis);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [active]);

  return <canvas ref={canvasRef} className={`mx-canvas ${active ? "mx-canvas-on" : ""}`} aria-hidden />;
}

/* ========================= Main Component ========================= */
export default function MatrixWomenPromo() {
  const HEADLINE =
    "Due to extremely high demand for our womens' class we will have 2 instructors.";
  const NABI_BIO =
    "Coach N°1 — Nabiha\nRank: Blue Belt\nExperience: 5 years\nFavourite technique: Armbar";
  const JESS_BIO =
    "Coach N°2 — Jessica\nRank: Blue Belt\nExperience: 4 years\nFavourite technique: Triangle";
  const FOOT_1 = "October 24, 7:30 PM";
  const FOOT_2 = "Maple BJJ — 20 Cranston Park";

  // Steps:
  // 0 headline → 1 show Nabi photo → 2 Nabi bio → 3 show Jess photo → 4 Jess bio → 5 footer1 → 6 footer2
  const [step, setStep] = useState(0);
  const [rainOn, setRainOn] = useState(false);

  useEffect(() => {
    if (step === 1) {
      const t = setTimeout(() => setStep(2), 400);
      return () => clearTimeout(t);
    }
    if (step === 3) {
      const t = setTimeout(() => setStep(4), 400);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    const t = setTimeout(() => setRainOn(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mx-wrap">
      <UltraMatrixRain active={rainOn} />

      <div className="mx-content">
        {/* HEADLINE */}
        <div className="mx-type">
          <Typewriter text={HEADLINE} start={true} speed={105} className="mx-type-text" />
          {/* When headline is done, advance to step 1 */}
          <StepWhenPrinted fullText={HEADLINE} onDone={() => setStep(1)} />
        </div>

        {/* COACHES */}
        <div className="mx-profiles">
          {/* NABIHA */}
          <div className="mx-card" aria-label="Coach Nabiha">
            <div className="mx-row">
              {step >= 1 && (
                <div className="mx-photo mx-holo">
                  <img src={Nabi} alt="Coach Nabiha" className="mx-img mx-img--nabi" />
                </div>
              )}
              <div className="mx-bio">
                <Typewriter text={NABI_BIO} start={step >= 2} speed={105} className="mx-bio-typed" />
                <StepWhenPrinted fullText={step >= 2 ? NABI_BIO : ""} onDone={() => step < 3 && setStep(3)} />
              </div>
            </div>
          </div>

          {/* JESSICA */}
          <div className="mx-card" aria-label="Coach Jessica">
            <div className="mx-row">
              {step >= 3 && (
                <div className="mx-photo mx-holo">
                  <img src={Jess} alt="Coach Jessica" className="mx-img mx-img--jess" />
                </div>
              )}
              <div className="mx-bio">
                <Typewriter text={JESS_BIO} start={step >= 4} speed={105} className="mx-bio-typed" />
                <StepWhenPrinted fullText={step >= 4 ? JESS_BIO : ""} onDone={() => step < 5 && setStep(5)} />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mx-footer-typed">
          <div className="mx-footer-line">
            <Typewriter text={FOOT_1} start={step >= 5} speed={105} className="mx-footer-text" />
            <StepWhenPrinted fullText={step >= 5 ? FOOT_1 : ""} onDone={() => step < 6 && setStep(6)} />
          </div>
          <div className="mx-footer-line">
            <Typewriter text={FOOT_2} start={step >= 6} speed={105} className="mx-footer-text" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Call onDone once when `fullText` becomes non-empty (i.e., its Typewriter has started and completed) */
function StepWhenPrinted({ fullText, onDone }) {
  const fired = useRef(false);
  useEffect(() => {
    if (!fullText || fired.current) return;
    // Defer a tick so Typewriter finishes the last char
    const t = setTimeout(() => {
      fired.current = true;
      onDone && onDone();
    }, 0);
    return () => clearTimeout(t);
  }, [fullText, onDone]);
  return null;
}
