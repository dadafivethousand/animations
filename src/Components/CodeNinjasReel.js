// CodeNinjasReel.jsx — the full sequenced reel of themed mini-movie scenes on a
// black stage. Scenes cross-dissolve (outgoing fades out as incoming fades in)
// so the previous scene never lingers under the next. Loops. Mobile/portrait.
import React, { useEffect, useState } from "react";
import "../Stylesheets/CodeNinjasReel.css";
import SceneIntro from "./SceneIntro";
import SceneCoding from "./SceneCoding";
import SceneChess from "./SceneChess";
import SceneAI from "./SceneAI";
import SceneRobotics from "./SceneRobotics";
import SceneWebDev from "./SceneWebDev";
import SceneGames from "./SceneGames";

// duration each scene is fully on screen (ms) — short for social feeds
const SCENES = [
  { Comp: SceneIntro, dur: 2800 },
  { Comp: SceneCoding, dur: 2300 },
  { Comp: SceneChess, dur: 3200 },
  { Comp: SceneAI, dur: 2500 },
  { Comp: SceneRobotics, dur: 2300 },
  { Comp: SceneWebDev, dur: 3000 },
  { Comp: SceneGames, dur: 2800 },
];
const XFADE = 500; // cross-dissolve window (ms)

export default function CodeNinjasReel() {
  const [stack, setStack] = useState([{ k: 0, i: 0, leaving: false }]);

  useEffect(() => {
    let key = 1, i = 0, timers = [];
    const schedule = () => {
      timers.push(setTimeout(() => {
        i = (i + 1) % SCENES.length;
        const k = key++;
        // mark existing layers as leaving (fade out) and add the new one (fades in)
        setStack((s) => s.map((l) => ({ ...l, leaving: true })).concat({ k, i, leaving: false }));
        timers.push(setTimeout(() => setStack((s) => s.filter((l) => l.k === k)), XFADE));
        schedule();
      }, SCENES[i].dur));
    };
    schedule();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="reel">
      {stack.map(({ k, i, leaving }) => {
        const Comp = SCENES[i].Comp;
        return <div className={`reel-layer${leaving ? " reel-out" : ""}`} key={k}><Comp /></div>;
      })}
    </div>
  );
}
