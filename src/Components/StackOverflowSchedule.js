import React, { useEffect, useState } from "react";
import "../Stylesheets/StackOverflowSchedule.css";
import schedule from "../Schedule";

function StackOverflowSchedule({ day, delay = 1600 }) {
  const [visibleClasses, setVisibleClasses] = useState([]);
  const [displayDay, setDisplayDay] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const typeInterval = setInterval(() => {
        setDisplayDay(day.substring(0, i + 1));
        i++;
        if (i > day.length) clearInterval(typeInterval);
      }, 55);
    }, delay);
    return () => clearTimeout(timer);
  }, [day, delay]);

  useEffect(() => {
    const classes = schedule[day] || [];
    const animationDelay = setTimeout(() => {
      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleClasses((prev) => [...prev, idx]);
        }, idx * 180);
      });
    }, 1000 + delay);

    return () => clearTimeout(animationDelay);
  }, [day, delay]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 || 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="stack-container">
      <div className="stack-day">{displayDay}</div>
      <div className="stack-schedule">
        {(schedule[day] || []).map((cls, idx) =>
          visibleClasses.includes(idx) ? (
            <div className="stack-class" key={idx}>
              <span className="stack-name">{cls.name}</span>
              <span className="stack-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default StackOverflowSchedule;
