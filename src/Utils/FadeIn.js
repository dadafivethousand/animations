import React, { useState, useEffect } from "react";
import "./FadeIn.css";

export default function FadeIn({
  children,
  delay = 0,
  speed = 1000,
  blinking = false
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  const className = `fade-in ${isVisible ? "visible" : ""} ${blinking ? "blinking" : ""}`;

  return (
    <div className={className} style={{ "--fade-speed": `${speed}ms` }}>
      {children}
    </div>
  );
}
