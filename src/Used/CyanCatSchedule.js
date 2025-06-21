import React, { useEffect, useState } from "react";
import "../Stylesheets/CyanCatSchedule.css";
import schedule from "../Schedule";

export default function CyanCatSchedule({ day, animationDelay = 1300, animationInterval = 300 }) {
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
    <div className="cc-container">
      <div className="cc-header">
        <div className="cc-rainbow-bar" />
        <h1 className="cc-title">{day.toUpperCase()}</h1>
        <div className="cc-rainbow-bar" />
      </div>
      <div className="cc-track">
        {schedule[day]?.map(
          (cls, i) =>
            visible.includes(i) && (
              <div key={i} className="cc-class">
                <span className="cc-class-name">{cls.name}</span>
                <span className="cc-class-time">{formatTime(cls.start)}</span>
              </div>
            )
        )}
      </div>
<div className="cyan-cats">
     <div className="tenor-gif-embed" data-postid="22656380" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/cat-space-nyan-cat-gif-22656380">Cat Space GIF</a>from <a href="https://tenor.com/search/cat-gifs">Cat GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
  
        <div className="tenor-gif-embed" data-postid="22656380" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/cat-space-nyan-cat-gif-22656380">Cat Space GIF</a>from <a href="https://tenor.com/search/cat-gifs">Cat GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
  </div>
    </div>
  );
}
