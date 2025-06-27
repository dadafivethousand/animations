import React, { useEffect, useState } from "react";
import "../Stylesheets/TokyoSchedule.css";
import schedule from "../RhSchedule";
import tokyo from "../Images/Used/Tokyo GIF - Find & Share on GIPHY.gif"
export default function TokyoSchedule({ day, animationDelay = 800, animationInterval = 300 }) {
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
    <div className="tokyo-wrapper">
        <img className="tokyo-gif" src={tokyo}/>
      <h3 className="tokyo-title">{day.toUpperCase()}</h3>
      <div className="tokyo-grid">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="tokyo-card" key={idx}>
              <span className="tokyo-class">{cls.name}</span>
              <span className="tokyo-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
