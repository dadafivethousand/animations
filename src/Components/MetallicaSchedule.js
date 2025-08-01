import React, { useEffect, useState } from "react";
import "../Stylesheets/MetallicaSchedule.css";
import schedule from "../Schedule";

function MetallicaSchedule({ day, delay = 1800 }) {
  const [visibleClasses, setVisibleClasses] = useState([]);
  const classes = schedule[day] || [];

  useEffect(() => {
    setTimeout(() => {
      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleClasses((prev) => [...prev, idx]);
        }, idx * 200);
      });
    }, delay);
  }, [day, delay]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 || 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="metallica-container">
      <div className="metallica-day">{day.toUpperCase()}</div>
      <div className="metallica-schedule">
        {classes.map((cls, idx) =>
          visibleClasses.includes(idx) ? (
            <div className="metallica-class" key={idx}>
              <span className="metallica-name">{cls.name}</span>
              <span className="metallica-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default MetallicaSchedule;
