import React, { useEffect, useState } from "react";
import "../Stylesheets/AuraFarmingSchedule.css";
import schedule from "../Schedule";

function AuraFarmingSchedule({ day }) {
  const [visibleClasses, setVisibleClasses] = useState([]);
  const [displayDay, setDisplayDay] = useState("");

  useEffect(() => {
    let i = 0;
    const typeInterval = setInterval(() => {
      setDisplayDay(day.substring(0, i + 1));
      i++;
      if (i > day.length) clearInterval(typeInterval);
    }, 100);
  }, [day]);

  useEffect(() => {
    const classes = schedule[day] || [];
    classes.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleClasses((prev) => [...prev, idx]);
      }, idx * 400);
    });
  }, [day]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 || 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="aura-container">
    
        <div class="tenor-gif-embed" data-postid="13961136228978115920" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/boat-kid-aura-farming-pacu-jalur-indonesia-boat-race-aura-farming-kid-gif-13961136228978115920">Boat Kid Aura Farming Pacu Jalur GIF</a>from <a href="https://tenor.com/search/boat+kid+aura+farming-gifs">Boat Kid Aura Farming GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
        <div class="tenor-gif-embed" data-postid="13961136228978115920" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/boat-kid-aura-farming-pacu-jalur-indonesia-boat-race-aura-farming-kid-gif-13961136228978115920">Boat Kid Aura Farming Pacu Jalur GIF</a>from <a href="https://tenor.com/search/boat+kid+aura+farming-gifs">Boat Kid Aura Farming GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>

 <div className="aura-day-and-schedule">
      <div className="aura-day">{displayDay}</div>
      <div className="aura-schedule">
        {(schedule[day] || []).map((cls, idx) =>
          visibleClasses.includes(idx) ? (
            <div className="aura-class" key={idx}>
              <span className="aura-name">{cls.name}</span>
              <span className="aura-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
      </div>
    </div>
  );
}

export default AuraFarmingSchedule;
