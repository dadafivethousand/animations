// File: src/Components/MatrixWomenPromo.js
import React, { useEffect, useRef, useState } from "react";
import "../Stylesheets/MatrixWomenPromo.css";
import Nabi from "../Images/Nabi.jpg";
import Jess from "../Images/Jess.jpg";

export default function MatrixWomenPromo() {
  const headline =
    "Meet your instructors:";

  const [typed, setTyped] = useState("");
  const [showImages, setShowImages] = useState(false);
  const [showBios, setShowBios] = useState(false);
  const [rainOn, setRainOn] = useState(false);

  // Footer typewriter
  const [typedFooter, setTypedFooter] = useState("");
  const [footerTypingStarted, setFooterTypingStarted] = useState(false);

  const footerText =
    "Date: Friday, October 24, 7:30 pm\n" +
    "Location: Maple Jiu-Jitsu Academy \n" +
    "Price: Free for Women";

  // Headline typewriter
  useEffect(() => {
    let i = 0;
    const speed = 18;
    const id = setInterval(() => {
      i += 1;
      setTyped(headline.slice(0, i));
      if (i >= headline.length) {
        clearInterval(id);
        setTimeout(() => setShowImages(true), 250);
        setTimeout(() => setShowBios(true), 800);
        setTimeout(() => setRainOn(true), 1400);
      }
    }, speed);
    return () => clearInterval(id);
  }, [headline]);

  // Footer typewriter — starts after bios
  useEffect(() => {
    if (!showBios) return;
    const startDelay = 350;
    let i = 0;
    const speed = 32;
    let intervalId;
    const kick = setTimeout(() => {
      setFooterTypingStarted(true);
      intervalId = setInterval(() => {
        i += 1;
        setTypedFooter(footerText.slice(0, i));
        if (i >= footerText.length) {
          clearInterval(intervalId);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(kick);
      if (intervalId) clearInterval(intervalId);
    };
  }, [showBios, footerText]);

  // Render typed footer text as label/value rows
  // The caret is inserted INSIDE the last row so it follows the text.
  const renderFooter = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    const lastIdx = lines.length - 1;

    return lines.map((line, idx) => {
      const colon = line.indexOf(":");
      const isActiveRow = idx === lastIdx && footerTypingStarted;

      if (colon !== -1) {
        const label = line.slice(0, colon + 1);
        const value = line.slice(colon + 1);
        return (
          <div className="mx-foot-row" key={idx}>
            <span className="mx-foot-label">{label}</span>
            <span className="mx-foot-value">
              {value}
              {isActiveRow && <span className="mx-caret mx-caret--inline" aria-hidden>█</span>}
            </span>
          </div>
        );
      }
      // If we haven't typed the ":" yet, render the whole line as value
      return (
        <div className="mx-foot-row" key={idx}>
          <span className="mx-foot-value">
            {line}
            {isActiveRow && <span className="mx-caret mx-caret--inline" aria-hidden>█</span>}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="mx-wrap">
      <MatrixRain active={rainOn} />

      <div className="mx-content">
        {/* Headline typewriter */}
        <div className="mx-type">
          <span className="mx-type-text">{typed}</span>
          <span className="mx-caret" aria-hidden>█</span>
        </div>

        {/* Profiles */}
        <section className={`mx-profiles ${showImages ? "mx-in" : ""}`}>
          {/* Nabiha */}
          <article className={`mx-card ${showBios ? "mx-bio-in" : ""}`}>
            <div className="mx-row">
              <div className="mx-photo mx-photo--square holo holo--soft">
                <img src={Nabi} alt="Coach Nabiha" className="mx-img" />
              </div>
              <div className="mx-bio">
                <h2>Coach N°1 Nabiha</h2>
                <ul>
                  <li>Rank: <b>Blue Belt</b></li>
                  <li>Experience: <b>5 years</b></li>
                  <li>Specialty: <b>Armbar</b></li>
                </ul>
              </div>
            </div>
          </article>

          {/* Jessica */}
          <article className={`mx-card ${showBios ? "mx-bio-in" : ""}`}>
            <div className="mx-row">
              <div className="mx-photo mx-photo--square holo holo--soft">
                <img src={Jess} alt="Coach Jessica" className="mx-img mx-img--jess" />
              </div>
              <div className="mx-bio">
                <h2>Coach N°2 Jessica</h2>
                <ul>
                  <li>Rank: <b>Blue Belt</b></li>
                  <li>Experience: <b>4 years</b></li>
                  <li>Specialty: <b>Triangle</b></li>
                </ul>
              </div>
            </div>
          </article>
        </section>

        {/* Footer — card styled like bios; labels green/bold, values white; caret follows text */}
        <div className="mx-card mx-footer">
          <div className="mx-foot">
            {renderFooter(typedFooter)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Matrix Rain canvas ===== */
function MatrixRain({ active }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = 0, height = 0, DPR = 1;
    let fontSize = 9;
    let columns = 0;
    let drops = [];
    let speeds = [];
    let headPhase = [];

    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()+=-アカサタナハマヤラワガザダバパイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロヲ";

    const setup = () => {
      const { offsetWidth, offsetHeight } = canvas;
      DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      width = offsetWidth;
      height = offsetHeight;
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      ctx.textBaseline = "top";

      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * (height / fontSize)));
      speeds = new Array(columns).fill(0).map(() => 0.9 + Math.random() * 1.1);
      headPhase = new Array(columns).fill(0).map(() => Math.random() * Math.PI * 2);
    };

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, width, height);

      const tailLen = 8;

      for (let i = 0; i < columns; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const flicker = (Math.sin(headPhase[i]) + 1) * 0.5;
        headPhase[i] += 0.12 + Math.random() * 0.06;

        const headChar = chars[(Math.random() * chars.length) | 0];
        ctx.shadowBlur = 6 + flicker * 6;
        ctx.shadowColor = "#00ff88";
        ctx.fillStyle = "#aaffcc";
        ctx.fillText(headChar, x, y);

        ctx.shadowBlur = 0;
        for (let t = 1; t <= tailLen; t++) {
          const ty = y - t * fontSize;
          if (ty < -fontSize) break;
          const tailChar = chars[(Math.random() * chars.length) | 0];
          const alpha = Math.max(0, 0.12 - t * 0.012);
          ctx.fillStyle = `rgba(0,255,128,${alpha})`;
          ctx.fillText(tailChar, x, ty);
        }

        drops[i] += speeds[i];

        if (y > height + tailLen * fontSize && Math.random() > 0.9) {
          drops[i] = -Math.random() * 20;
          speeds[i] = 0.9 + Math.random() * 1.1;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const onResize = () => setup();

    setup();
    if (active) rafRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  return (
    <canvas
      className={`mx-canvas ${active ? "mx-canvas-on" : ""}`}
      ref={canvasRef}
      aria-hidden
    />
  );
}
