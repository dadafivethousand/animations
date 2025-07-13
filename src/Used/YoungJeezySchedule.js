import React, { useEffect, useState } from "react";
import "../Stylesheets/YoungJeezySchedule.css";
import schedule from "../Schedule";
import TypewriterCycle from "../Utils/TypewriterCycle";
 

export default function YoungJeezySchedule({ day, animationDelay = 1300, animationInterval = 150 }) {
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
    <div className="jeezy-container">
      <h1 className="jeezy-day">
        <TypewriterCycle deletingSpeed={10000000} texts={['Thursday']}/>
 
        </h1>
      <div className="jeezy-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="jeezy-class-container">
            {visibleArray.includes(idx) && (
              <div className="jeezy-class">
                <span className="jeezy-class-name">{cls.name}</span>
                <span className="jeezy-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
