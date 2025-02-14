import React, { useEffect, useState } from "react";

import schedule from "../Schedule";

function Template({ day }) {
  const [showTitle, setShowTitle] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    // Show classes after 1.5s
    const timeout = setTimeout(() => {
      setStartAnimation(true);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Show classes after 1.5s
    const timeout = setTimeout(() => {
      setShowTitle(true);
    }, 3300);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Show classes after 1.5s
    const timeout = setTimeout(() => {
      setShowTitle(false);
      
    }, 8000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Show classes after 1.5s
    const timeout = setTimeout(() => {
      setShowSchedule(true);
      
    }, 9000);
    return () => clearTimeout(timeout);
  }, []);

  // Convert decimal hours to AM/PM format
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="-container">

 

<div className={`-schedule ${showSchedule? '-visible':''}`}>
      <h1 className={`-day ${showSchedule ? "" : ""}`}>{day}</h1>

{/* SMASHING Class Names */}
<div className="-classes">
  {schedule[day] &&
    schedule[day].map((cls, idx) => (
      <div
        key={idx}
        className={`-class ${showSchedule ? "" : ""}`}
        style={{ animationDelay: `${idx * 0.3}s` }}
      >
        <span className="-class-text">
          {cls.name} - {formatTime(cls.start)}
        </span>

      </div>
    ))}
</div>
    </div> 
    </div>
  );
}

export default Template;
