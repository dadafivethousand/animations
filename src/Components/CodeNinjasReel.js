// CodeNinjasReel.jsx — a sequenced "reel" of themed mini-movie scenes on a
// black stage. Each scene plays for its duration, then the next crossfades in.
// Loops. Mobile / portrait only.
//
// Scenes: Intro (particle mask + typewriter) -> Coding -> [Chess, AI,
// Robotics, Games — added next]. New scenes drop straight into SCENES.
import React, { useEffect, useState } from "react";
import "../Stylesheets/CodeNinjasReel.css";
import SceneIntro from "./SceneIntro";
import SceneCoding from "./SceneCoding";

const SCENES = [
  { Comp: SceneIntro, dur: 6800 },
  { Comp: SceneCoding, dur: 6400 },
];
const XFADE = 800; // crossfade window (ms)

export default function CodeNinjasReel() {
  // a small stack of mounted layers; the newest is on top, older ones fade out
  const [stack, setStack] = useState([{ k: 0, i: 0 }]);

  useEffect(() => {
    let key = 1, i = 0, timers = [];
    const schedule = () => {
      timers.push(setTimeout(() => {
        i = (i + 1) % SCENES.length;
        const k = key++;
        setStack((s) => [...s, { k, i }]);
        timers.push(setTimeout(() => setStack((s) => s.filter((l) => l.k === k)), XFADE));
        schedule();
      }, SCENES[i].dur));
    };
    schedule();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="reel">
      {stack.map(({ k, i }) => {
        const Comp = SCENES[i].Comp;
        return <div className="reel-layer" key={k}><Comp /></div>;
      })}
    </div>
  );
}
