import React, { useEffect, useState } from "react";
import "../Stylesheets/RolexTypewriter.css";
import RolexLogo from "../Images/rolex-logo.png"

export default function RolexTypewriter() {
  const fullText = "ROLL WITH US";
  const [displayedText, setDisplayedText] = useState("ROLEX");
  const [phase, setPhase] = useState("backspacing"); // backspacing or typing
  const [i, setI] = useState(0);

  const [moveLogo, setMoveLogo] = useState(false)

  useEffect(() => {
    setTimeout(() => {
        setMoveLogo(true)
    }, 3000);
  }
)

  useEffect(() => {
    if (phase === "backspacing") {
      if (displayedText.endsWith("EX")) {
        const interval = setInterval(() => {
          setDisplayedText(prev => prev.slice(0, -1));
        }, 800);
        return () => clearInterval(interval);
      } else {
setTimeout(() => {
    setPhase("typing");
    setI(2); // "ROL" is already there
    
}, 10);
   
      }
    }

    if (phase === "typing") {
      if (i < fullText.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(fullText.slice(0, i + 1));
          setI(prev => prev + 1);
        }, 200);
        return () => clearTimeout(timeout);
      }
    }
  }, [displayedText, i, phase]);

  return (
    <div className={`rolex-typewriter ${moveLogo ? 'move': ''}`}>
        <img src={RolexLogo}/>
      <h1>{displayedText}</h1>
    </div>
  );
}
