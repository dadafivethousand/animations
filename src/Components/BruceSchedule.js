import React, { useEffect, useState } from "react";
import "../Stylesheets/BruceSchedule.css";
import schedule from "../Schedule";

export default function BruceSchedule({ day, animationDelay = 500, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);

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
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="bruce-epic-container">
      {/* Matrix-level Kanji */}
      <div className="kanji k1">武</div>
      <div className="kanji k2">道</div>
      <div className="kanji k3">力</div>
      <div className="kanji k4">魂</div>
 
 
     
      <div className="kanji k9"> 炎</div>
      <div className="kanji k10">命</div>
      <div className="kanji k11">撃</div>
      <div className="kanji k12">気</div>

      <h1 className="bruce-epic-title">{day.toUpperCase()}</h1>

      <div className="bruce-epic-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="scroll-card">
              <span className="scroll-class">{cls.name}</span>
              <span className="scroll-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
