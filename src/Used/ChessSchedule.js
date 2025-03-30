import React, { useEffect, useState } from "react";
import "../Stylesheets/ChessSchedule.css";
import schedule from "../Schedule"; // Same structure as before
import CheckeredLine from "./CheckeredLine";

function ChessSchedule({ day, animationDelay = 1000, animationInterval = 400 }) {
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
    <div className="chess-container">
      <CheckeredLine />
      <h1 className="chess-header">{day.toUpperCase()}</h1>

      <div className="chess-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="chess-class-container">
            {visibleArray.includes(idx) && (
              <div className="chess-class">
                <span className="chess-class-name">{cls.name}</span>
                <span className="chess-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChessSchedule;
