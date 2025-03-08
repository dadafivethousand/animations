import React, { useEffect, useState } from "react";
import "../Stylesheets/MarioSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function MarioSchedule({ day, animationDelay = 1000, animationInterval = 1500 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay);
  }, [animationDelay]);

  useEffect(() => {
    if (showSchedule) {
      const classes = schedule[day] || [];
      if (classes.length === 0) return;

      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleArray((prev) => [...prev, idx]);
        }, idx * animationInterval);
      });
    }
  }, [showSchedule, day, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  // Cycle through animation classes
  const getAnimationClass = (idx) => {
    const animationClasses = ["slideUp1", "slideUp2", "slideUp3"];
    return animationClasses[idx % 3]; // Cycles between slideUp1, slideUp2, slideUp3
  };

  return (
    <div className="mario-container">

      <h1 className="mario-header">Sunday</h1>
      {/* Green Pipe at the Bottom */}
      <div className="mario-pipe"></div>
      <div className="mario-pipe-body"></div>

      {/* Schedule Content */}
      <div className="mario-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className={`mario-class ${getAnimationClass(idx)}`}>
              <span className="mario-class-name">{cls.name}</span>
              <span className="mario-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default MarioSchedule;
