import React, { useEffect, useState } from "react";
import "./RolexTypewriter.css";
import RolexLogo from "../../Images/Used/rolex-logo.png"

export default function RolexTypewriter() {
  const fullText = "RICHMOND HILL JIU-JITSU";
  const [displayedText, setDisplayedText] = useState("ROLEX");
  const [phase, setPhase] = useState("backspacing");
  const [i, setI] = useState(0);
  const [moveLogo, setMoveLogo] = useState(false);
  const [startTyping, setStartTyping] = useState(false);

  // Start everything after 3s delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      setStartTyping(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMoveLogo(true);
    }, 4500);
    return () => clearTimeout(timeout);
  }, []);

  // Run typewriter logic only if startTyping is true
  useEffect(() => {
    if (!startTyping) return;

    let intervalId;
    let timeoutId;

    if (phase === "backspacing") {
      if (displayedText.endsWith("EX")) {
        intervalId = setInterval(() => {
          setDisplayedText(prev => prev.slice(0, -1));
        }, 800);
      } else {
        timeoutId = setTimeout(() => {
          setPhase("typing");
          setI(1);
        }, 500);
      }
    }

    if (phase === "typing") {
      if (i < fullText.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(fullText.slice(0, i + 1));
          setI(prev => prev + 1);
        }, 200);
      }
    }

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [startTyping, displayedText, i, phase]);

  return (
    <div className={`rolex-typewriter ${moveLogo ? "move" : ""}`}>
      <img src={RolexLogo} alt="Rolex Logo" />
      <h1>{displayedText}</h1>
    </div>
  );
}
