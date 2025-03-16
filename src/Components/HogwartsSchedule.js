import React, { useEffect, useState } from "react";
import "../Stylesheets/HogwartsSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function HogwartsSchedule({ day, animationDelay = 1000, animationInterval = 700 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [scrollUnrolled, setScrollUnrolled] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setScrollUnrolled(true);
      setTimeout(() => {
        setShowSchedule(true);
      }, 2000); // Unroll animation delay
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
    <div className="hogwarts-container">
      <div className="floating-candles"></div> {/* Floating candles effect */}
      <div className={`hogwarts-scroll ${scrollUnrolled ? "unrolled" : ""}`}>
        <div className="hogwarts-header">
          <h1 className="hogwarts-day">{day.toUpperCase()}</h1>
        </div>
        <div className="hogwarts-content">
          {schedule[day]?.map((cls, idx) => (
            <div key={idx} className="hogwarts-class-container">
              {visibleArray.includes(idx) && (
                <div className="hogwarts-class parchment-reveal">
                  <span className="hogwarts-class-name">{cls.name}</span>
                  <span className="hogwarts-class-time">{formatTime(cls.start)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HogwartsSchedule;
