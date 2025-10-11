// LionKingSunrise.jsx
import React, { useEffect, useRef } from "react";
import "../Stylesheets/LionKingSunriseOverlay.css";

export default function LionKingSunrise({
  play = true,
  duration = 5000,
  delay = 2000,
  zIndex = 999,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !play) return;

    el.style.setProperty("--lk-duration", `${duration}ms`);
    el.style.setProperty("--lk-delay", `${delay}ms`);
    el.style.setProperty("--lk-z", zIndex);

    el.classList.add("lk--playing");
  }, [play, duration, delay, zIndex]);

  return (
    <div className="lk" ref={ref} aria-hidden="true">
      <div className="lk-night" />
      <div className="lk-sky" />
      <div className="lk-sun">
        <div className="lk-sun-core" />
        <div className="lk-sun-glow" />
      </div>
    </div>
  );
}
