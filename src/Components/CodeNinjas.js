import React, { useEffect, useMemo, useState } from "react";
import "../Stylesheets/CodeNinjas.css";

import cnwoodbridge from "../Images/Woodbridge.mp4";

export default function CodeNinjas({
  typingSpeed = 45,   // ms per character
  linePause = 700,    // pause (ms) after a line finishes before the next begins
  startDelay = 500,   // delay (ms) before the first character types
}) {
  // You can tweak items or emojis here
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

  // Precompute the full strings once so we aren’t rebuilding them on every keystroke
  const fullLines = useMemo(
    () => offerings.map((o) => `${o.emoji} ${o.text}`),
    [offerings]
  );

  const [typedLines, setTypedLines] = useState(
    () => Array(fullLines.length).fill("")
  );
  const [lineIndex, setLineIndex] = useState(0);
  const [started, setStarted] = useState(startDelay === 0);
  const [showFooter, setShowFooter] = useState(false)


   useEffect(() => {
   
    const g = setTimeout(() => setShowFooter(true), 11000);
    return () => clearTimeout(g);
  }, []);


  // Handle initial delay before typing starts
  useEffect(() => {
    if (startDelay <= 0) return;
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  // Typewriter logic: type current line char-by-char, then advance to next line after a pause
  useEffect(() => {
    if (!started) return;
    if (lineIndex >= fullLines.length) return; // all done

    const currentFull = fullLines[lineIndex];
    const currentTyped = typedLines[lineIndex];

    let timer;

    if (currentTyped.length < currentFull.length) {
      // Keep typing current line
      timer = setTimeout(() => {
        setTypedLines((prev) => {
          const copy = [...prev];
          copy[lineIndex] = currentFull.slice(0, currentTyped.length + 1);
          return copy;
        });
      }, typingSpeed);
    } else {
      // Line finished: wait a bit, then move to the next line
      timer = setTimeout(() => {
        setLineIndex((i) => i + 1);
      }, linePause);
    }

    return () => clearTimeout(timer);
  }, [started, lineIndex, typedLines, fullLines, typingSpeed, linePause]);

  return (
    <div className="CN-Container">
        <span className="Rocket">🚀</span>
      {/* Video Background */}
      <video
        autoPlay
         
        muted
        playsInline
        src={cnwoodbridge}
        className="CN-Video"
      />

      {/* Overlay Content */}
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

      <div className={`${showFooter ? "cn-show-footer": ""} cn-footer`}>Coming December 2025
      </div>

    </div>
  );
}
