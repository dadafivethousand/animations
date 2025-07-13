import React, { useEffect, useState } from "react";
import "./BreakingBadSchedule.css";
import schedule from "../RhSchedule"; // Assuming schedule data exists

function BreakingBadSchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const sched = 'Schedule'

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
          setVisibleArray((prev) => [...prev, idx]); // Reveal schedule items one by one
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

  return (
    <div className="bb-container">
      <div className={`bb-bg ${showSchedule ? "active" : ""}`}></div>

      <div className="bb-content">
        <h2 className="bb-title unindent">
          <span className="bb-symbol">{day.slice(0, 2)}</span>
          <span className="bb-rest">{day.slice(2)}</span><br></br>
          </h2>
          <h2 className="bb-title indent">
          <span className="bb-symbol">{sched.slice(0, 2)}</span>
          <span className="bb-rest">{sched.slice(2)}</span>
          </h2>

        {showSchedule && (
          <div className="bb-classes">
            {schedule[day]?.map((cls, idx) => (
              visibleArray.includes(idx) && (
                <div key={idx} className="bb-class">
                  <span className="bb-class-name">{cls.name}</span> <span className="bb-class-time">{formatTime(cls.start)}</span>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BreakingBadSchedule;
