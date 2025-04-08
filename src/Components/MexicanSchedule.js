import React, { useEffect, useState } from "react";
import "../Stylesheets/MexicanSchedule.css";
import schedule from "../Schedule";
import mariachi from "../Images/Mariachi Mañanitas GIF - Mariachi Mañanitas Cumpleaños - Discover & Share GIFs.gif"

export default function MexicanSchedule({ day, animationDelay = 1500, animationInterval = 500 }) {
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
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${amPm}`;
  };

  return (
    <div className="mexican-container">
      <h1 className="mexican-title">{day.toUpperCase()}</h1>
      <div className="mexican-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="mexican-class">
              <span className="mexican-class-name"> {cls.name}</span>
              <span className="mexican-class-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
      <img className="mexican-mariachi" src={mariachi}/>
    </div>
  );
}
