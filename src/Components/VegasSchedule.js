import React, { useEffect, useState } from "react";
import "../Stylesheets/VegasSchedule.css";
import schedule from "../Schedule";

export default function VegasSchedule({ day, animationDelay = 300, animationInterval = 150 }) {
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
    <div className="vegas-container">
      <h1 className="vegas-day">{day.toUpperCase()}</h1>

      <div className="vegas-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="vegas-class-container">
            {visibleArray.includes(idx) && (
              <div className="vegas-class">
                <span className="vegas-class-name">{cls.name}</span>
                <span className="vegas-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
