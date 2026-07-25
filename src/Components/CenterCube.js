// CenterCube.jsx — hybrid ad unit: a tall 3D box (square footprint) whose four
// side faces each hold a real photo/clip of the center. A tiny state machine
// rotates it 90° at a time; when a face snaps to the front, its <video> plays
// (others pause + reset) — so real footage reveals one clip at a time on a
// branded stage. Portrait / mobile only.
//
// TO SHIP FOR REAL: replace the four FACES sources with four vertical (≈4:5)
// clips/photos of YOUR center. Videos autoplay muted (browser policy) — add
// music/voiceover in your post edit after screen-recording.
import React, { useEffect, useRef, useState } from "react";
import "../Stylesheets/CenterCube.css";

import woodSrc from "../Images/Woodbridge.mp4";
import circuitSrc from "../Images/circuit-bg.mp4";
import kidsImg from "../Images/kids.jpeg";
import roomImg from "../Images/IMG_4224.jpg";

// one entry per face, in rotation order. `video` faces play-on-front.
const FACES = [
  { video: woodSrc, label: "Inside our dojo" },
  { image: kidsImg, label: "Coding camp" },
  { video: circuitSrc, label: "Build real games" },
  { image: roomImg, label: "Robotics & more" },
];

const HOLD = 3200; // ms each face stays flat-on before the next quarter-turn

export default function CenterCube() {
  const [step, setStep] = useState(0);           // ever-increasing; never unwinds
  const media = useRef([]);

  // advance one quarter-turn on a timer
  useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), HOLD);
    return () => clearInterval(id);
  }, []);

  // Front face plays from the start; every other video sits paused on its
  // opening frame (a still) so it's ready to play cleanly when its turn comes.
  useEffect(() => {
    const front = ((step % FACES.length) + FACES.length) % FACES.length;
    media.current.forEach((el, i) => {
      if (!el || el.tagName !== "VIDEO") return;
      if (i === front) {
        try { el.currentTime = 0; el.play(); } catch (e) {}
      } else {
        try { el.pause(); el.currentTime = 0; } catch (e) {} // rewind to still frame
      }
    });
  }, [step]);

  const angle = -step * 90; // accumulate so it always spins one direction

  return (
    <div className="cc-stage">
      <div className="cc-amb" aria-hidden />

      <div className="cc-head">
        <span className="cc-kicker">CODE NINJAS · WOODBRIDGE</span>
        <span className="cc-title">SEE INSIDE</span>
      </div>

      <div className="cc-scene">
        <div className="cc-cube" style={{ "--angle": `${angle}deg` }}>
          {FACES.map((f, i) => (
            <div className={`cc-face cc-f${i}`} key={i}>
              <div className="cc-screen">
                {f.video ? (
                  <video
                    ref={(el) => (media.current[i] = el)}
                    src={f.video}
                    muted loop playsInline preload="auto"
                  />
                ) : (
                  <img ref={(el) => (media.current[i] = el)} src={f.image} alt="" />
                )}
                <span className="cc-glint" aria-hidden />
                <span className="cc-facelabel">{f.label}</span>
              </div>
              <i className="cc-bolt bl-tl" aria-hidden />
              <i className="cc-bolt bl-tr" aria-hidden />
              <i className="cc-bolt bl-bl" aria-hidden />
              <i className="cc-bolt bl-br" aria-hidden />
            </div>
          ))}
          <div className="cc-cap cc-cap-top" aria-hidden />
          <div className="cc-cap cc-cap-bot" aria-hidden />
        </div>
        <div className="cc-floor" aria-hidden />
      </div>

      <div className="cc-cta">
        <span className="cc-cta-main">Book a <b>FREE</b> session</span>
        <span className="cc-cta-sub">cnwoodbridge.com</span>
      </div>
    </div>
  );
}
