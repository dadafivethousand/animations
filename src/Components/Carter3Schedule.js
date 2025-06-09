import React, { useEffect, useState } from "react";
import "../Stylesheets/Carter3Schedule.css";
import mapleschedule from "../Schedule";
import rhschedule from "../RhSchedule";

export default function Carter3Schedule({ day, rh = false, revealSpeed = 1000 }) {
  const schedule = rh ? rhschedule : mapleschedule;
  const classes = schedule[day] || [];

  const [visibleLines, setVisibleLines] = useState(0);

  const lines = [
    day.toUpperCase(),
    ...classes.map(cls => `${cls.name} — ${formatTime(cls.start)}`)
  ];

  useEffect(() => {
    setVisibleLines(0);
    const interval = setInterval(() => {
      setVisibleLines(prev => {
        if (prev < lines.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, revealSpeed);
    return () => clearInterval(interval);
  }, [day, classes, revealSpeed]);

  function formatTime(decimalTime) {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  }

  return (
    <div className="carter-container">
      <div className="lines">
        {lines.slice(0, visibleLines).map((line, idx) => (
          <div 
            key={idx} 
            className={idx === 0 ? "day-line" : "class-line"}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
