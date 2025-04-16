import React, { useEffect, useState } from "react";
import "../Stylesheets/FortniteSchedule.css";
import schedule from "../Schedule";
import fortniteGif from "../Images/icegif-555.gif"

export default function FortniteSchedule({ day, animationDelay = 1000, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);
  const [showgif, setShowgif] = useState(false);

  useEffect(() => {
  setTimeout(() => {
    setShowgif(true)
  }, 2000);
  }, []);

  useEffect(() => {
    const classes = schedule[day] || [];
    classes.forEach((_, idx) => {
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
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="fortnite-wrapper">
      <div className="glow-overlay" />
      <h1 className="fortnite-title">{day.toUpperCase()}</h1>

      <div className="fortnite-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="fortnite-class">
              <div className="fortnite-inner-class">
              <span className="fortnite-class-name">{cls.name}</span>
              <span className="fortnite-class-time">{formatTime(cls.start)}</span>
            </div>
            </div>
          ) : null
        )}
      </div>
      <img className={`fortnite-gif ${showgif? 'fortnite-show': ''}` } src={fortniteGif} />
    </div>
  );
}
