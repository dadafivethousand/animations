// CodeNinjasReel.jsx — the full sequenced reel of themed mini-movie scenes on a
// black stage. Each scene plays for its duration, then the next crossfades in.
// Loops. Mobile / portrait only.
import React, { useEffect, useState } from "react";
import "../Stylesheets/CodeNinjasReel.css";
import SceneIntro from "./SceneIntro";
import SceneCoding from "./SceneCoding";
import SceneChess from "./SceneChess";
import SceneAI from "./SceneAI";
import SceneRobotics from "./SceneRobotics";
import SceneWebDev from "./SceneWebDev";
import SceneGames from "./SceneGames";

// duration each scene is fully on screen (ms), tuned to its animation length
const SCENES = [
  { Comp: SceneIntro, dur: 6600 },
  { Comp: SceneCoding, dur: 5600 },
  { Comp: SceneChess, dur: 7200 },
  { Comp: SceneAI, dur: 6600 },
  { Comp: SceneRobotics, dur: 6000 },
  { Comp: SceneWebDev, dur: 7000 },
  { Comp: SceneGames, dur: 6000 },
];
const XFADE = 900; // crossfade window (ms)

export default function CodeNinjasReel() {
  // a small stack of mounted layers; the newest is on top, older ones crossfade out
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
