import React, { useEffect, useState } from "react";
import "../Stylesheets/FridaySchedule.css";
import schedule from "../Schedule";
 
export default function FridaySchedule({ day, animationDelay = 1800, animationInterval = 300 }) {
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
    <div className="friday-wrapper">
      <h1 className="friday-title">{day}</h1>

      <div className="friday-schedule">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="friday-class" key={idx}>
                   <div className="friday-name">{cls.name}</div>
              <div className="friday-time">{formatTime(cls.start)}</div>
           
            </div>
          ) : null
        )}
      </div>
            <div className="friday-poster">
<div class="tenor-gif-embed" data-postid="12839544880309883282" data-share-method="host" data-aspect-ratio="1.77778" data-width="100%"><a href="https://tenor.com/view/horrified-funny-face-dang-ice-cube-gif-12839544880309883282">Horrified Funny GIF</a>from <a href="https://tenor.com/search/horrified-gifs">Horrified GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>      
</div>
    </div>
  );
}
