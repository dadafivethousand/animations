import React, { useEffect, useState } from "react";
import "../Stylesheets/PunchoutSchedule.css";
import schedule from "../Schedule";

export default function PunchoutSchedule({ day, animationDelay = 500, animationInterval = 300 }) {
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
    <div className="punchout-wrapper">
       <div className="punchout-gif"> 
         <div class="tenor-gif-embed" data-postid="302447697707782859" data-share-method="host" data-aspect-ratio="0.965863" data-width="100%"><a href="https://tenor.com/view/knock-knockout-gif-302447697707782859">Knock Knockout GIF</a>from <a href="https://tenor.com/search/knock-gifs">Knock GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
         </div>
       <h1 className="punchout-title">{day.toUpperCase()}</h1>
      <div className="punchout-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="punchout-card">
              <span className="punchout-class">{cls.name}</span>
              <span className="punchout-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
