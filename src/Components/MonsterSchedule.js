import React, { useEffect, useState } from "react";
import "../Stylesheets/MonsterSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function MonsterSchedule({ day, animationDelay = 500, animationInterval = 250 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

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

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMouseX((event.clientX / window.innerWidth - 0.5) * 20);
      setMouseY((event.clientY / window.innerHeight - 0.5) * 20);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="monster-container">
      <div className="monster-background"></div>
      <div 
        className="monster-tv" 
        style={{ transform: `rotateX(${mouseY}deg) rotateY(${mouseX}deg)` }}
      >
        <h1 className="monster-day glitch-effect">{day.toUpperCase()}</h1>
        <div className="monster-schedule">
          {schedule[day]?.map((cls, idx) => (
            visibleArray.includes(idx) && (
              <div key={idx} className={`monster-class monster-class-${idx % 3} lightning`}>
                <span className="monster-class-name">{cls.name}</span>
                <span className="monster-class-time">{formatTime(cls.start)}</span>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default MonsterSchedule;
