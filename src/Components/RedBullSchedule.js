import React, { useEffect, useState } from "react";
import "../Stylesheets/RedBullSchedule.css";
import schedule from "../Schedule";

export default function RedBullSchedule({ day, animationDelay = 300, animationInterval = 150 }) {
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
    <div className="redbull-container">
      <h1 className="redbull-day">{day.toUpperCase()}</h1>
      <div className="redbull-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="redbull-class-container">
            {visibleArray.includes(idx) && (
              <div className="redbull-class">
                <span className="redbull-class-name">{cls.name}</span>
                <span className="redbull-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <img src={'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTd3ZHp2dW90cXBpOHpjYmt1eHpmcjd3aHF3MzBoNXJwZGJob2ptbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g0EIj5mX0CFSL6PqbP/giphy.gif'}/>
      </div>
    </div>
  );
}
