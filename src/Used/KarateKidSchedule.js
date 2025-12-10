import React, { useEffect, useState } from "react";
import "../Stylesheets/KarateKidSchedule.css";
import schedule from "../Schedule";

function KarateKidSchedule({ day, delay = 1600 }) {
  const [visibleClasses, setVisibleClasses] = useState([]);
  const [displayDay, setDisplayDay] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const typeInterval = setInterval(() => {
        setDisplayDay(day.substring(0, i + 1));
        i++;
        if (i > day.length) clearInterval(typeInterval);
      }, 50);
    }, delay);
    return () => clearTimeout(timer);
  }, [day, delay]);

  useEffect(() => {
    const classes = schedule[day] || [];
    const animationDelay = setTimeout(() => {
      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleClasses((prev) => [...prev, idx]);
        }, idx * 200);
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
    <div className="dojo-wrapper">
      <div className="dojo-banner">{displayDay}</div>
      <ul className="belt-scroll">
        {(schedule[day] || []).map((cls, idx) =>
          visibleClasses.includes(idx) ? (
            <li className={`belt-item ${idx % 2 === 0 ? "light" : "light"}`} key={idx}>
              <div className="belt-name">{cls.name}</div>
              <div className="belt-time">{formatTime(cls.start)}</div>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
}

export default KarateKidSchedule;
