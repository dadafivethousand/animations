import React, { useEffect, useState } from "react";
import "./BuzzSchedule.css";
import schedule from "../RhSchedule"; // Assuming schedule data exists

function BuzzSchedule({ day, animationDelay = 2000, animationInterval = 500 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [displayDay, setDisplayDay] = useState("");

  useEffect(() => {
    setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayDay(day.substring(0, i + 1));
        i++;
        if (i > day.length) {
          clearInterval(interval);
        }
      }, 100);
    }, animationDelay);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay + 2000);
  }, []);

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
    <div className="buzz-container">
      {/* Day of the week appears in futuristic style */}
      <div className="buzz-day">{displayDay}</div>

      {/* Schedule Below */}
      <div className="buzz-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className="buzz-class">
              <span className="buzz-class-name">{cls.name}</span>
              <span className="buzz-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default BuzzSchedule;
