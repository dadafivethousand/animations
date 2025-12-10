import React, { useEffect, useMemo, useRef, useState } from "react";
import "../Stylesheets/CodeBenefitsMatrix.css";

export default function CodeBenefitsMatrix({
  typingSpeed = 45,
  linePause = 650,

  // ⏱ Only rain at start (no text)
  startDelay = 2200,     // when the text starts typing (no text before this)
  rainDimDelay = 2250,   // when rain fades slightly (just after text appears)
  rainDimOpacity = 0.55, // keep background rain clearly visible

  mobileBreakpoint = 600 // px
}) {
  /* ---------- Responsive (shorter copy for mobile) ---------- */
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= mobileBreakpoint : false
  );
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth <= mobileBreakpoint);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileBreakpoint]);

  // Short, one-line header
  const headline = "Why Learn to Code?";

  // Kid-friendly AND motivational/success-oriented
  const benefitsLong = useMemo(
    () => [
      { emoji: "🎮", text: "Make games, apps & cool projects" },
      { emoji: "🧠", text: "Sharpen problem-solving every day" },
      { emoji: "💸", text: "Build skills that pay later" },
      { emoji: "🎓", text: "Stand out for internships & scholarships" },
      { emoji: "🚀", text: "Launch side projects (even a mini business)" },
      { emoji: "🤝", text: "Lead teams by building together" },
      { emoji: "📈", text: "Confidence grows as your skills grow" },
      { emoji: "🌍", text: "Future-ready in any career you choose" }
    ],
    []
  );

const benefitsShort = useMemo(
  () => [
    { emoji: "💸", text: "Higher earning potential" },

    { emoji: "🧠", text: "Brain development" },

    { emoji: "🤝", text: "Grow your network" },
    { emoji: "🚪", text: "Opens more doors" },
    { emoji: "🧑‍🎓", text: "Scholarship opportunities" },
        { emoji: "📈", text: "Build  confidence" },

  ],
  []
);

  const benefits = isMobile ? benefitsShort : benefitsLong;

  const fullLines = useMemo(
    () => [headline, ...benefits.map((b) => `${b.emoji} ${b.text}`)],
    [headline, benefits]
  );

  /* ---------- Matrix Rain ---------- */
  const canvasRef = useRef(null);
  const rainOpacityRef = useRef(1);
  const introActiveRef = useRef(true);   // intro: heavier/faster rain
  const animationRef = useRef(null);
  const resizeTimer = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const DPR = Math.max(1, Math.floor(window.devicePixelRatio || 1));

    function sizeCanvas() {
      const { clientWidth, clientHeight } = canvas.parentElement;
      canvas.width = clientWidth * DPR;
      canvas.height = clientHeight * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    sizeCanvas();

    function onResize() {
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(() => {
        cancelAnimationFrame(animationRef.current);
        sizeCanvas();
        initRain();
        loop();
      }, 150);
    }
    window.addEventListener("resize", onResize);

    const chars =
      "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロゴゾドボポヴ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charArray = chars.split("");

    let columns = 0;
    let drops = [];
    let fontSize = 18;

    // Two speeds: faster during intro for a heavier feel
    const speedIntro = 20; // ms-ish per frame
    const speedNormal = 33;
    let speed = speedIntro;

    function initRain() {
      const w = canvas.width / DPR;
      fontSize = Math.max(13, Math.min(22, Math.floor(w / 60)));
      ctx.font = `${fontSize}px monospace`;
      columns = Math.ceil(w / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * -30));
    }
    initRain();

    function draw() {
      const w = canvas.width / DPR;
      const h = canvas.height / DPR;

      // Trail: lighter during intro for more glyph persistence
      const trailAlpha = introActiveRef.current ? 0.05 : 0.08;
      ctx.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < columns; i++) {
        // Greener/brighter leading glyph during intro
        const greenBase = introActiveRef.current ? 200 : 160;
        const green = greenBase + Math.floor(Math.random() * 55);
        ctx.fillStyle = `rgba(0, ${green}, 0, ${rainOpacityRef.current})`;

        // Occasionally draw two glyphs in intro for denser feel
        const passes = introActiveRef.current && Math.random() < 0.25 ? 2 : 1;
        for (let p = 0; p < passes; p++) {
          const text = charArray[(Math.random() * charArray.length) | 0];
          const x = i * fontSize;
          const y = (drops[i] + (p ? -1 : 0)) * fontSize;

          ctx.shadowColor = `rgba(0, 255, 70, ${rainOpacityRef.current})`;
          ctx.shadowBlur = introActiveRef.current ? 10 : 6;
          ctx.fillText(text, x, y);
          ctx.shadowBlur = 0;
        }

        if (drops[i] * fontSize > h && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i]++;
        }
      }
    }

    let last = performance.now();
    function loop(now = performance.now()) {
      // Adjust speed depending on intro phase
      speed = introActiveRef.current ? speedIntro : speedNormal;

      const dt = now - last;
      if (dt >= speed) {
        draw();
        last = now;
      }
      animationRef.current = requestAnimationFrame(loop);
    }
    loop();

    // End of intro intensity: just after dim delay
    const endIntroTimer = setTimeout(() => {
      introActiveRef.current = false;
    }, rainDimDelay);

    // Dim the rain slightly, but keep it clearly visible
    const dimTimer = setTimeout(() => {
      const start = performance.now();
      const startOpacity = rainOpacityRef.current;
      const target = rainDimOpacity; // e.g., 0.32
      const duration = 900;
      function fade(now) {
        const t = Math.min(1, (now - start) / duration);
        rainOpacityRef.current = startOpacity + (target - startOpacity) * t;
        if (t < 1) requestAnimationFrame(fade);
      }
      requestAnimationFrame(fade);
    }, rainDimDelay);

    return () => {
      clearTimeout(dimTimer);
      clearTimeout(endIntroTimer);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [rainDimDelay, rainDimOpacity]);

  /* ---------- Typewriter & intro text visibility ---------- */
  const [typedLines, setTypedLines] = useState(() =>
    Array(fullLines.length).fill("")
  );
  const [lineIndex, setLineIndex] = useState(0);
  const [showText, setShowText] = useState(false); // fully hide content until startDelay
  const [started, setStarted] = useState(startDelay === 0);

  // Keep content hidden until the rain-only intro completes
  useEffect(() => {
    setShowText(false);
    const showTimer = setTimeout(() => setShowText(true), startDelay);
    return () => clearTimeout(showTimer);
  }, [startDelay]);

  // Reset typing when copy changes (e.g., mobile ↔ desktop)
  useEffect(() => {
    setTypedLines(Array(fullLines.length).fill(""));
    setLineIndex(0);
    setStarted(false);
    const kick = setTimeout(() => setStarted(true), startDelay + 10);
    return () => clearTimeout(kick);
  }, [fullLines, startDelay]);

  // Typewriter
  useEffect(() => {
    if (!started) return;
    if (lineIndex >= fullLines.length) return;

    const currentFull = fullLines[lineIndex];
    const currentTyped = typedLines[lineIndex];

    let timer;
    if (currentTyped.length < currentFull.length) {
      timer = setTimeout(() => {
        setTypedLines((prev) => {
          const copy = [...prev];
          copy[lineIndex] = currentFull.slice(0, currentTyped.length + 1);
          return copy;
        });
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setLineIndex((i) => i + 1);
      }, linePause);
    }
    return () => clearTimeout(timer);
  }, [started, lineIndex, typedLines, fullLines, typingSpeed, linePause]);

  return (
    <div className="CBM-Container" data-mobile={isMobile ? "1" : "0"}>
      <canvas ref={canvasRef} className="CBM-Rain" aria-hidden />

      <div className={`CBM-Content ${showText ? "CBM-Content--visible" : "CBM-Content--hidden"}`}>
        {/* Subtle dark plate for readability over rain */}
        <div className="CBM-Backdrop" aria-hidden />
        <ul className="CBM-List">
          {fullLines.map((_, idx) => {
            const isActive = idx === lineIndex && lineIndex < fullLines.length;
            const isHeadline = idx === 0;
            return (
              <li
                key={idx}
                className={`CBM-ListItem ${isHeadline ? "CBM-Headline" : "indent"}`}
              >
                <span className="CBM-Line" title={fullLines[idx]}>
                  {typedLines[idx]}
                  {isActive && <span className="CBM-Caret" aria-hidden>▮</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="CBM-Vignette" aria-hidden />
    </div>
  );
}
