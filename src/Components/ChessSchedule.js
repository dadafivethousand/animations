import React, { useEffect, useState } from "react";
import "../Stylesheets/ChessSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function ChessSchedule({ day, animationDelay = 800, animationInterval = 600 }) {
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
      <div className="chess-header">
        <h1 className="chess-day">{day.toUpperCase()}</h1>
      </div>

      <div className="chessboard">
        {/* Generate Chessboard Squares */}
        {Array.from({ length: 64 }).map((_, idx) => {
          const isDark = (Math.floor(idx / 8) + (idx % 8)) % 2 === 1;
          const classData = schedule[day]?.[idx] || null;
          return (
            <div key={idx} className={`square ${isDark ? "dark-square" : "light-square"}`}>
              {visibleArray.includes(idx) && classData && (
                <div className="chess-class fade-in">
                  <span className="chess-class-name">{classData.name}</span>
                  <span className="chess-class-time">{formatTime(classData.start)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChessSchedule;
