import React, { useEffect, useState } from "react";
import "../Stylesheets/8MileSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists
import eightmileposter from '../Images/8mile.jpg';

function EightMileSchedule({ day, animationDelay = 7000, animationInterval = 500 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [titleText, setTitleText] = useState("8 MILE"); // Initial title
  const [phase, setPhase] = useState("show8mile"); // Phases: 'show8mile', 'backspacing8mile', 'typingLocation'
  const [typedDay, setTypedDay] = useState(""); // For the weekday
  const [showDayText, setShowDayText] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay);
  }, [animationDelay]);

  // Handle "8 MILE" appearing, then backspacing, then typing "20 Cranston Park"
  useEffect(() => {
    if (phase === "show8mile") {
      setTimeout(() => setPhase("backspacing8mile"), 1000); // Pause before backspacing
    }

    if (phase === "backspacing8mile") {
      let text = "8 MILE";
      let i = text.length;
      const interval = setInterval(() => {
        setTitleText(text.substring(0, i));
        i--;
        if (i < 0) {
          clearInterval(interval);
          setTimeout(() => setPhase("typingLocation"), 500); // Pause before typing "20 Cranston Park"
        }
      }, 100); // Backspacing speed
      return () => clearInterval(interval);
    }

    if (phase === "typingLocation") {
      let text = "20 Cranston Park";
      let i = 0;
      const interval = setInterval(() => {
        setTitleText(text.substring(0, i + 1));
        i++;
        if (i > text.length) {
          clearInterval(interval);
          setTimeout(() => setShowDayText(true), 500); // Start typing weekday name
        }
      }, 150); // Typing speed
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Handle weekday typewriter effect (unchanged from your original)
  useEffect(() => {
    if (showDayText) {
      let i = 0;
      const interval = setInterval(() => {
        setTypedDay(day.substring(0, i + 1));
        i++;
        if (i === day.length) clearInterval(interval);
      }, 150); // Adjust speed of typing
      return () => clearInterval(interval);
    }
  }, [showDayText, day]);

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
    <div className="mile-container">
      {/* Title in 8 Mile style */}
      <h1 className="mile-title">{titleText}</h1>

      {/* Schedule */}
      <div className="mile-schedule">
        <h2 className="mile-day">{typedDay}</h2> {/* Unchanged weekday typing effect */}

        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className="mile-class">
              <span className="mile-class-name">{cls.name}</span>
              <span className="mile-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default EightMileSchedule;
