import React, { useEffect, useState } from "react";
import "../Stylesheets/PaddySchedule.css";
import schedule from "../Schedule";

export default function PaddySchedule({ day, animationDelay = 1800, animationInterval = 400 }) {
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
    <div className="paddy-wrapper">
      <h1 className="paddy-title">{day.toUpperCase()}</h1>
      <div className="paddy-grid">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div
              className="paddy-card"
              key={idx}
              style={{ animationDelay: `${idx * animationInterval}ms` }}
            >
              <span className="paddy-class">{cls.name}</span>
              <span className="paddy-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
      <img src='https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDQ0N2d4amQ5d2o3emw2cXRtaTkwZHFsNnMxNGNub2RiOWs1ejA0biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FNtl8uSFfRS5S00nLZ/giphy.gif' />
    </div>
  );
}
