import React, { useEffect, useState } from "react";
import "../Stylesheets/GigaChadSchedule.css";
import schedule from "../Schedule";
import chadImg from "../Images/virgin-vs-chad-meme-template-full-82d5ca9c.webp"; // Replace with actual path

export default function GigaChadSchedule({ day, animationDelay = 1800, animationInterval = 300 }) {
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
    <div className="giga-wrapper">
      <h1 className="giga-title">{day}</h1>
      <div className="giga-layout">
        <img src={chadImg} alt="Chad" className="giga-chad-img" />
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className={`giga-label giga-label-${idx % 8}`} key={idx}>
              <div className="giga-text">
                <strong>{formatTime(cls.start)}</strong> — {cls.name}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
