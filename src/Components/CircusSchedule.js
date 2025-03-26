import React, { useEffect, useState } from "react";
import "../Stylesheets/CircusSchedule.css";
import schedule from "../Schedule";

function CircusSchedule({ day, animationDelay = 2000, animationInterval = 800 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [typedDay, setTypedDay] = useState("");

  useEffect(() => {
    const delayTyping = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setTypedDay(day.substring(0, i + 1));
        i++;
        if (i > day.length) clearInterval(interval);
      }, 150);
    }, 1000); // Delay before typing starts
    return () => clearTimeout(delayTyping);
  }, [day]);

  useEffect(() => {
    setTimeout(() => setShowSchedule(true), animationDelay);
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
    <div className="circus-container">
      <div className="circus-header">
        <h1 className="circus-day">{typedDay}</h1>
      </div>

      <div className="circus-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="circus-class">
              <span className="circus-class-name">{cls.name}</span>
              <span className="circus-class-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default CircusSchedule;
