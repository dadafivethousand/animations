import React, { useEffect, useState } from "react";
import "../Stylesheets/PollosSchedule.css";
import schedule from "../Schedule";
import pollos from "../Images/Los_Pollos_Hermanos_logo.png"

export default function PollosSchedule({ day, animationDelay = 1600, animationInterval = 250 }) {
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
    <div className="pollos-wrapper">
      <h1 className="pollos-title">🍗 {day}</h1>
      <div className="pollos-schedule">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="pollos-class" key={idx}>
              <div className="pollos-time">{formatTime(cls.start)}</div>
              <div className="pollos-name">{cls.name}</div>
            </div>
          ) : null
        )}
      </div>
      <img src={pollos}/>
    </div>
  );
}
