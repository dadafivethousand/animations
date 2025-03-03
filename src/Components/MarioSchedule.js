import React, { useEffect, useState } from "react";
import "../Stylesheets/MarioSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function MarioSchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
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
    <div className="mario-container">
      <div className={`mario-bg ${showSchedule ? "active" : ""}`}></div>

      <div className="mario-content">
        <h2 className="mario-title">{day}</h2>

        {showSchedule && (
          <div className="mario-classes">
            {schedule[day]?.map((cls, idx) => (
              visibleArray.includes(idx) && (
                <div key={idx} className="mario-class">
                  <span className="mario-class-name">{cls.name}</span> sdf-{" "}
                  <span className="mario-class-time">{formatTime(cls.start)}</span>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MarioSchedule;
