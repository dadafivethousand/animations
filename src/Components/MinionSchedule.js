import React, { useEffect, useState } from "react";
import "../Stylesheets/MinionSchedule.css";
import schedule from "../Schedule";

function MinionSchedule({ day, delay = 1600 }) {
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
    <div className="minion-container">
      <div className="minion-day">{displayDay}</div>
      <div className="minion-schedule">
        {(schedule[day] || []).map((cls, idx) =>
          visibleClasses.includes(idx) ? (
            <div className="minion-class" key={idx}>
              <span className="minion-name">{cls.name}</span>
              <span className="minion-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default MinionSchedule;
