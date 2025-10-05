import React, { useEffect, useMemo, useRef, useState } from "react";
import "../Stylesheets/StarWarsIntro.css";
import swlogo from "../Images/StarwarsCN.png"

export default function StarWarsIntro({
  title = "Episode I",
  subtitle = "GRAND OPENING",
  lines = [
    "New Location coming December 2025.",
    "Teacing Kids Coding, Robotics & AI",
    "Reserve your discounted price.",
    "Follow the link in the bio.",
  ],
  startDelay = 600,        // ms before the crawl starts
  pixelsPerSecond = 55,    // crawl speed (higher = faster)
  repeat = false,          // loop the crawl
  onEnd,
}) {
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const [started, setStarted] = useState(false);

  const content = useMemo(
    () => [
      { type: "kicker", text: title },
      { type: "headline", text: subtitle },
      ...lines.map((t) => ({ type: "line", text: t })),
    ],
    [title, subtitle, lines]
  );

  useEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current;
      const panel = panelRef.current;
      if (!wrap || !panel) return;

      const wrapH = wrap.clientHeight;
      const panelH = panel.scrollHeight;

      // how far to travel (start below + exit above)
      const startBelow = Math.round(wrapH * .70);
      const endAbove = Math.round(panelH + wrapH * 0.95);
      const total = startBelow + endAbove;

      const durationSec = Math.max(10, total / Math.max(1, pixelsPerSecond));
      wrap.style.setProperty("--sw-crawl-duration", `${durationSec}s`);
      wrap.style.setProperty("--sw-start-offset", `${startBelow}px`);
    };
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, [content, pixelsPerSecond]);

  useEffect(() => {
    const id = setTimeout(() => setStarted(true), Math.max(0, startDelay));
    return () => clearTimeout(id);
  }, [startDelay]);

  useEffect(() => {
    if (repeat || !panelRef.current) return;
    const el = panelRef.current;
    const handler = () => onEnd && onEnd();
    el.addEventListener("animationend", handler);
    return () => el.removeEventListener("animationend", handler);
  }, [repeat, onEnd]);

  return (
    <section
      className={`sw-wrap${started ? " sw-start" : ""}${repeat ? " sw-loop" : ""}`}
      ref={wrapRef}
      aria-label="Star Wars style opening crawl"
    >
        <img src={swlogo}/>
      {/* pitch black background; optional stars are subtle & can be removed */}
      <div className="sw-stars sw-stars--near" />
      <div className="sw-stars sw-stars--far" />

      <div className="sw-stage" role="presentation">
        {/* Constant tilt layer creates the pyramid taper */}
        <div className="sw-tilt">
          <div className="sw-panel" ref={panelRef}>
            <p className="sw-kicker">{title}</p>
            <h1 className="sw-headline">{subtitle}</h1>
            <div className="sw-body">
              {lines.map((t, i) => (
                <p className="sw-line" key={i}>{t}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
