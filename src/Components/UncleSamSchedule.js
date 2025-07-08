import React, { useEffect, useState } from "react";
import "../Stylesheets/UncleSamSchedule.css";
import schedule from "../Schedule";

function UncleSamSchedule({ day, animationDelay = 1000, animationInterval = 400 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [displayDay, setDisplayDay] = useState("");

 

  useEffect(() => {
    setTimeout(() => setShowSchedule(true), animationDelay + 1200);
  }, [animationDelay]);

  useEffect(() => {
    if (showSchedule) {
      const classes = schedule[day] || [];
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

  return (
    <div className="sam-container">
      <div className="sam-day">{day}</div>
      <div className="sam-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="sam-class">
              <span className="sam-class-name">{cls.name}</span>
              <span className="sam-class-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default UncleSamSchedule;
