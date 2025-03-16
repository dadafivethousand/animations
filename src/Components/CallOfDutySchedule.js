import React, { useEffect, useState } from "react";
import "../Stylesheets/CallOfDutySchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function CallOfDutySchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
  const [visibleArray, setVisibleArray] = useState([]);
  const [typedText, setTypedText] = useState(""); // Typewriter effect state
  const [typingCompleted, setTypingCompleted] = useState(false); // Track typing completion

  useEffect(() => {
    setTimeout(() => {
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < day.length) {
          setTypedText(day.slice(0, index + 1)); // Correctly slice the string instead of appending
          index++;
        } else {
          clearInterval(typeInterval);
          setTypingCompleted(true); // Mark typing as complete
        }
      }, 150); // Adjust speed of typewriter effect
    }, 1500); // 1.5s delay before typewriter effect starts
  }, [day]);

  useEffect(() => {
    if (typingCompleted) {
      setTimeout(() => {
        const classes = schedule[day] || [];
        if (classes.length === 0) return;

        classes.forEach((_, idx) => {
          setTimeout(() => {
            setVisibleArray((prev) => [...prev, idx]);
          }, idx * animationInterval);
        });
      }, 500); // Small delay after typing completes
    }
  }, [typingCompleted, day, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="cod-container">
      <div className="cod-hud-overlay"></div> {/* Tactical mission HUD */}
      <div className="cod-header">
        <h1 className={`cod-day ${typingCompleted ? "typing-done" : ""}`}>{typedText}</h1>
      </div>
      <div className="cod-content">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="cod-class-container">
            {visibleArray.includes(idx) && (
              <div className="cod-class holo-text">
                <span className="cod-class-name">{cls.name}</span>
                <span className="cod-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CallOfDutySchedule;
