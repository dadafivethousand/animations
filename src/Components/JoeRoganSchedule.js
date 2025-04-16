import React, { useEffect, useState } from "react";
import "../Stylesheets/JoeRoganSchedule.css";
import schedule from "../Schedule";

export default function JoeRoganSchedule({ day, animationDelay = 1500, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const classes = schedule[day] || [];
    classes.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
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
    <div className="jre-wrapper">
      <h1 className="jre-title">{day.toUpperCase()}</h1>

      <div className="jre-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="jre-card">
              <span className="jre-class">{cls.name}</span>
              <span className="jre-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
      <div className="jre-gif">
      <div class="tenor-gif-embed" data-postid="20946667" data-share-method="host" data-aspect-ratio="1.78771" data-width="100%"><a href="https://tenor.com/view/jre-joe-rogan-joe-rogan-mma-gif-20946667">Jre Joe Rogan GIF</a>from <a href="https://tenor.com/search/jre-gifs">Jre GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>      <div className="jre-background" />
      </div>
    </div>
  );
}
