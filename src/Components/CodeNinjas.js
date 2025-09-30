import React, { useEffect, useMemo, useState } from "react";
import "../Stylesheets/CodeNinjas.css";
import cnwoodbridge from "../Images/Woodbridge.mp4";

export default function CodeNinjas({
  typingSpeed = 45,
  linePause = 700,
  startDelay = 500,
}) {
  const offerings = useMemo(
    () => [
      { emoji: "💻", text: "Coding & Game Development" },
      { emoji: "🎮", text: "Roblox & Minecraft Modding" },
      { emoji: "🤖", text: "Robotics & AI Exploration" },
      { emoji: "🎨", text: "Digital Art & Animation" },
      { emoji: "🧩", text: "Problem-Solving Challenges" },
      { emoji: "🌐", text: "STEM Skills for the Future" },
    ],
    []
  );

  const fullLines = useMemo(
    () => offerings.map((o) => `${o.emoji} ${o.text}`),
    [offerings]
  );

  const [typedLines, setTypedLines] = useState(
    () => Array(fullLines.length).fill("")
  );
  const [lineIndex, setLineIndex] = useState(0);
  const [started, setStarted] = useState(startDelay === 0);
  const [showFooter, setShowFooter] = useState(false);
  const [sendRocket, setSendRocket] = useState(false);

  useEffect(() => {
    const g = setTimeout(() => setShowFooter(true), 11000);
    return () => clearTimeout(g);
  }, []);

  useEffect(() => {
    const h = setTimeout(() => setSendRocket(true), 12000);
    return () => clearTimeout(h);
  }, []);

  useEffect(() => {
    if (startDelay <= 0) return;
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

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
    <div className="CN-Container">
      {/* 🚀 Rocket is absolute from start, never pushes layout */}
      <span
        className={`${sendRocket ? "Rocket" : ""} Rocket-invisible`}
        aria-hidden
      >
        🚀
      </span>

      <video
        autoPlay
        muted
        playsInline
        src={cnwoodbridge}
        className="CN-Video"
      />

      <div className="CN-Content">
        <ul className="CN-List">
          {fullLines.map((_, idx) => {
            const isActive = idx === lineIndex && lineIndex < fullLines.length;
            return (
              <li key={idx} className="CN-ListItem">
                <span className="CN-Line">
                  {typedLines[idx]}
                  {isActive && <span className="CN-Caret" aria-hidden>▮</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={`${showFooter ? "cn-show-footer" : ""} cn-footer`}>
        Coming December 2025
      </div>
    </div>
  );
}
