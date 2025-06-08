import React, { useEffect, useState } from "react";
import "../Stylesheets/CoffinSchedule.css";
import schedule from "../Schedule";
import tombcarriers from "../Images/tombcarriers.gif";

export default function CoffinSchedule({ day, animationDelay = 400, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const classes = schedule[day] || [];
    classes.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
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
    <div className="coffin-container">
      <h1 className="coffin-title">{day.toUpperCase()}</h1>
      <div className="coffin-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="coffin-class-wrapper">
            {visibleArray.includes(idx) && (
              <div className="coffin-entry" style={{ animationDelay: `${idx * 150}ms` }}>
                <span className="coffin-class-name">{cls.name}</span>
                <span className="coffin-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
     </div>
  );
}
