import React, { useEffect, useState } from "react";
import "./StackOverflowSchedule.css";
import schedule from "../RhSchedule";

function StackOverflowSchedule({ day, delay = 1600 }) {
  const [visibleClasses, setVisibleClasses] = useState([]);
  const [displayDay, setDisplayDay] = useState("");

  // Type out the day label
  useEffect(() => {
    let typeTimeout;
    let typeInterval;

    setDisplayDay("");

    typeTimeout = setTimeout(() => {
      let i = 0;
      typeInterval = setInterval(() => {
        setDisplayDay(day.substring(0, i + 1));
        i++;
        if (i > day.length) {
          clearInterval(typeInterval);
        }
      }, 55);
    }, delay);

    return () => {
      clearTimeout(typeTimeout);
      if (typeInterval) clearInterval(typeInterval);
    };
  }, [day, delay]);

  // Staggered reveal of classes
  useEffect(() => {
    const classes = schedule[day] || [];
    const timeouts = [];
    setVisibleClasses([]);

    const baseTimeout = setTimeout(() => {
      classes.forEach((_, idx) => {
        const t = setTimeout(() => {
          setVisibleClasses((prev) => [...prev, idx]);
        }, idx * 180);
        timeouts.push(t);
      });
    }, 1000 + delay);

    return () => {
      clearTimeout(baseTimeout);
      timeouts.forEach(clearTimeout);
    };
  }, [day, delay]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 || 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  const items = schedule[day] || [];

  return (
    <div className="stack-container">
      <div className="stack-day">{displayDay}</div>
      <div className="stack-schedule">
        {items.map((cls, idx) =>
          visibleClasses.includes(idx) ? (
            <div className="stack-class" key={idx}>
              <div className="stack-left">
                <span className="stack-name">{cls.name}</span>
                {cls.maple && (
                  <span className="stack-chip">📍 MAPLE</span>
                )}
              </div>
              <time className="stack-time">
                {formatTime(cls.start)}
              </time>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default StackOverflowSchedule;
