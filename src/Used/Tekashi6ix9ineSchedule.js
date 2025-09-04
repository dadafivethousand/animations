// Tekashi6ix9ineSchedule.jsx — refactored to show MAPLE chip (kept structure/behavior)
import React, { useEffect, useState } from "react";
import "./Tekashi6ix9ineSchedule.css";
import schedule from "../RhSchedule";
import FadeIn from "../Utils/FadeIn";

export default function Tekashi6ix9ineSchedule({
  day,
  animationDelay = 1000,
  animationInterval = 200,
}) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    const timers = [];
    (schedule[day] || []).forEach((_, i) => {
      const t = setTimeout(() => {
        setVisible((v) => [...v, i]);
      }, animationDelay + i * animationInterval);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (dt) => {
    const h = Math.floor(dt);
    const m = Math.round((dt - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="sn-container">
      <h1 className="sn-title">
        {day
          .toUpperCase()
          .split("")
          .map((char, i) => (
            <span key={i} style={{ "--i": i }}>{char}</span>
          ))}
      </h1>

      <div className="sn-track">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div key={i} className="sn-class" style={{ "--delay": `${i * 0.2}s` }}>
              <div className="sn-left">
                <span className="sn-name">{cls.name}</span>
                {cls.maple && <span className="sn-chip">📍 MAPLE</span>}
              </div>
              <span className="sn-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>

      <FadeIn />
      <div
        className="tenor-gif-embed"
        data-postid="12657031"
        data-share-method="host"
        data-aspect-ratio="1.78771"
        data-width="100%"
      >
        <a href="https://tenor.com/view/6ix9ine-bobby-shmurda-gif-12657031">6ix9ine Bobby Shmurda GIF</a>
        from <a href="https://tenor.com/search/6ix9ine-gifs">6ix9ine GIFs</a>
      </div>
      <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
      <FadeIn />
    </div>
  );
}
