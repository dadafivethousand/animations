import React, { useEffect, useState } from "react";
import "../Stylesheets/HardInDaPaintSchedule.css";
import schedule from "../Schedule";
import FadeIn from "../Utils/FadeIn"

function HardInDaPaintSchedule({ day, delay = 2000 }) {
  const [visibleClasses, setVisibleClasses] = useState([]);
  const [displayDay, setDisplayDay] = useState("");

  useEffect(() => {
    setTimeout(() => {
    let i = 0;
    const typeInterval = setInterval(() => {
      setDisplayDay(day.substring(0, i + 1));
      i++;
      if (i > day.length) clearInterval(typeInterval);
    }, 80);
        
    }, delay);

  }, [day]);

  useEffect(() => {
    const classes = schedule[day] || [];

    const totalDelay = delay;

    setTimeout(() => {
      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleClasses((prev) => [...prev, idx]);
        }, idx * 300);
      });
    }, totalDelay);
  }, [day, delay]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 || 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="paint-container">
      <div className="paint-day">{displayDay}</div>
      <div className="paint-schedule">
        {(schedule[day] || []).map((cls, idx) =>
          visibleClasses.includes(idx) ? (
            <div className="paint-class" key={idx}>
              <span className="paint-name">{cls.name}</span>
              <span className="paint-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
     <FadeIn speed={5000} delay = {1000}>
      <img src={'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXMzOG9kMHFjY2ljMmhmc3pnbXgzY3U0YnMzd2JwaGdpcjZsZm1mYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZHFoy2YVdMsus/giphy.gif'} />
    </FadeIn>
    </div>
  );
}

export default HardInDaPaintSchedule;
