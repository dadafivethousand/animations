import React, { useEffect, useState } from "react";
import "../Stylesheets/SixNineSchedule.css";
import schedule from "../Schedule";

function SixNineSchedule({ day, animationDelay = 300, animationInterval = 200 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [typedDay, setTypedDay] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedDay(day.substring(0, i + 1));
      i++;
      if (i > day.length) clearInterval(interval);
    }, 50);
  }, [day]);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay);
  }, [animationDelay]);

  useEffect(() => {
    if (!showSchedule) return;
    const entries = schedule[day] || [];
    entries.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray(prev => [...prev, idx]);
      }, idx * animationInterval);
    });
  }, [showSchedule, day, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${amPm}`;
  };

  return (
    <div className="sixnine-container">
      <div className="sixnine-header">
        <h1 className="sixnine-day">{typedDay}</h1>
      </div>

      <div className="sixnine-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className="sixnine-class">
              <span className="sixnine-class-name">{cls.name}</span>
              <span className="sixnine-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default SixNineSchedule;
