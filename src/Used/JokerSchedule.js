import React, { useEffect, useState } from "react";
import "./JokerSchedule.css";
import schedule from "../RhSchedule"; // Assuming schedule data exists

function JokerSchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
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

  return (
    <div className="joker-container">
      <h1 className="joker-day">{day.toUpperCase()}</h1>
      <div className="joker-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div
              key={idx}
              className="joker-class animated-entry"
              style={{
                "--index": idx,
                "--curve": Math.sin(idx * 0.5) * 15 + "deg", // Curves but stays readable
              }}
            >
              <span className="joker-class-name">{cls.name}</span> <br></br>
              <span className="joker-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default JokerSchedule;
