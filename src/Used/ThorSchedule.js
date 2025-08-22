// ThorSchedule.jsx
import React, { useEffect, useState } from "react";
import "./Stylesheets/ThorSchedule.css";
import schedule from "../RhSchedule";
import MapleStudios from "./MapleMarvel";

export default function ThorSchedule({
  day,
  animationDelay = 4000,
  animationInterval = 400,
}) {
  const [visibleArray, setVisibleArray] = useState([]);
  const [typedDay, setTypedDay] = useState("");

  useEffect(() => {
    const word = day;
    let i = 0;
    const start = setTimeout(() => {
      const interval = setInterval(() => {
        setTypedDay(word.substring(0, i + 1));
        i++;
        if (i > word.length) clearInterval(interval);
      }, 200);
    }, 2500);
    return () => clearTimeout(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const entries = schedule[day] || [];
    const timers = [];
    entries.forEach((_, idx) => {
      const t = setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="thor-container">
      <MapleStudios />

      <div className="tenor">
        <div
          class="tenor-gif-embed"
          data-postid="25769716"
          data-share-method="host"
          data-aspect-ratio="1.23552"
          data-width="100%"
        >
          <a href="https://tenor.com/view/chris-hemsworth-thor-love-and-gif-25769716">
            Chris Hemsworth GIF
          </a>
          from <a href="https://tenor.com/search/chris-gifs">Chris GIFs</a>
        </div>
        <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
      </div>

      <h1 className="thor-title">{typedDay}</h1>

      <div className="thor-schedule">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="thor-class">
              <div className="thor-left">
                <span className="thor-class-name">{cls.name}</span>
                {cls.maple && (
                  <span className="thor-maple">
                    <span className="thor-pin" aria-hidden>
                      📍
                    </span>
                    MAPLE
                  </span>
                )}
              </div>
              <span className="thor-class-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
