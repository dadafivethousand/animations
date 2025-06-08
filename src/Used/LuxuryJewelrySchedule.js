import React, { useEffect, useState } from "react";
import "../Stylesheets/LuxuryJewelrySchedule.css";
import schedule from "../Schedule";

export default function LuxuryJewelrySchedule({ day, animationDelay = 1800, animationInterval = 300 }) {
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
    <div className="luxury-container">
      <div className="luxury-header">
        <h1 className="luxury-day">{day.toUpperCase()}</h1>
      </div>
      <div className="luxury-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="luxury-class-container">
            {visibleArray.includes(idx) && (
              <div className="luxury-class">
                <span className="luxury-class-name">{cls.name}</span>
                <span className="luxury-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
