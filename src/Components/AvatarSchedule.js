import React, { useEffect, useState } from "react";
import "../Stylesheets/AvatarSchedule.css";
import schedule from "../Schedule";

export default function AvatarSchedule({ day, animationDelay = 1800, animationInterval = 300 }) {
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
    <div className="avatar-container">
      <div className="avatar-header">
        <h1 className="avatar-day">{day.toUpperCase()}</h1>
      </div>
      <div className="avatar-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="avatar-class-container">
            {visibleArray.includes(idx) && (
              <div className="avatar-class">
                <span className="avatar-class-name">{cls.name}</span>
                <span className="avatar-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
