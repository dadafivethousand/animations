import React, { useEffect, useState } from "react";
import "../Stylesheets/Tekashi6ix9ineSchedule.css";
import schedule from "../Schedule";
import FadeIn from "../Utils/FadeIn";


export default function Tekashi6ix9ineSchedule({ day, animationDelay = 1000, animationInterval = 200 }) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    (schedule[day] || []).forEach((_, i) => {
      setTimeout(() => {
        setVisible((v) => [...v, i]);
      }, animationDelay + i * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (dt) => {
    const h = Math.floor(dt),
      m = Math.round((dt - h) * 60),
      hr = h % 12 || 12,
      ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="sn-container">
      <h1 className="sn-title">
        {day.toUpperCase().split("").map((char, i) => (
          <span key={i} style={{ "--i": i }}>{char}</span>
        ))}
      </h1>
      <div className="sn-track">
        {schedule[day]?.map((cls, i) =>
          visible.includes(i) && (
            <div key={i} className="sn-class" style={{ "--delay": `${i * 0.2}s` }}>
              <span className="sn-name">{cls.name}</span>
              <span className="sn-time">{formatTime(cls.start)}</span>
            </div>
          )
        )}
      </div>
      <FadeIn />
      <div className="tenor-gif-embed" data-postid="12657031" data-share-method="host" data-aspect-ratio="1.78771" data-width="100%"><a href="https://tenor.com/view/6ix9ine-bobby-shmurda-gif-12657031">6ix9ine Bobby Shmurda GIF</a>from <a href="https://tenor.com/search/6ix9ine-gifs">6ix9ine GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
   <FadeIn />
     </div>
  );
}
