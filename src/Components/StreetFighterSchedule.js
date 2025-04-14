import React, { useEffect, useState } from "react";
import "../Stylesheets/StreetFighterSchedule.css";
import schedule from "../Schedule";
import streetFighter from "../Images/13199.gif"

export default function StreetFighterSchedule({ day, animationDelay = 500, animationInterval = 300 }) {
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
    <div className="sf-wrapper">
      <div className="sf-glow" />
      <h1 className="sf-title">{day.toUpperCase()}</h1>
      <div className="sf-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="sf-card">
              <span className="sf-class">{cls.name}</span>
              <span className="sf-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
      <div className="sf-gif">
        <img src={streetFighter}/>
      </div>
    </div>
  );
}
