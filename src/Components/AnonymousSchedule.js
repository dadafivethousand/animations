import React, { useEffect, useState } from "react";
import "../Stylesheets/AnonymousSchedule.css";
import schedule from "../Schedule";

export default function AnonymousSchedule({ day, animationDelay = 400, animationInterval = 150 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const entries = schedule[day] || [];
    entries.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray(prev => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="anon-wrapper">
        <div class="tenor-gif-embed" data-postid="21188344" data-share-method="host" data-aspect-ratio="1.15942" data-width="100%"><a href="https://tenor.com/view/hacker-gif-21188344">Hacker GIF</a>from <a href="https://tenor.com/search/hacker-gifs">Hacker GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
      <h3 className="anon-title">{day.toUpperCase()}</h3>
      <div className="anon-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="anon-card" key={idx}>
              <span className="anon-class">{cls.name}</span>
              <span className="anon-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
