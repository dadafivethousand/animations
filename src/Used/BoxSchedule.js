import React, { useEffect, useState } from "react";
import "../Stylesheets/BoxSchedule.css";
import schedule from "../Schedule";

export default function BoxSchedule({ day, animationDelay = 1000, animationInterval = 300 }) {
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
    <div className="box-wrapper">
      <h1 className="box-title">{day.toUpperCase()}</h1>
      <div className="box-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="box-card" key={idx}>
              <span className="box-class">{cls.name}</span>
              <span className="box-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
      <img src='https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWhjNmYwb2F1eHVyYWhyb212cDVlcDRyYjRkbGNycTJkeGYyOTZzdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/nqxqoSbRaDmgbgyXJK/giphy.gif' />
    </div>
  );
}
