import React, { useEffect, useState } from "react";
import "../Stylesheets/RolexSchedule.css";
import schedule from "../Schedule";
import RolexTypewriter from "./RolexTypewriter";

export default function RolexSchedule({ day, animationDelay = 6000, animationInterval = 400 }) {
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
    <div className="rolex-container">
      <h1 className="rolex-title">{day.toUpperCase()}</h1>
      <RolexTypewriter />
      <div className="rolex-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="rolex-class">
              <span className="rolex-class-name">{cls.name}</span>
              <span className="rolex-class-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
