import React, { useEffect, useState } from "react";
import "./UsainBoltSchedule.css";
import schedule from "../RhSchedule";

function UsainBoltSchedule({ day, animationDelay = 800, animationInterval = 200 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [displayDay, setDisplayDay] = useState("");
  const [boltEffect, setBoltEffect] = useState(false);

  useEffect(() => {
    setTimeout(() => setBoltEffect(true), 500);
    setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayDay(day.substring(0, i + 1));
        i++;
        if (i > day.length) clearInterval(interval);
      }, 80); // Slowed typing effect
    }, animationDelay);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay + 1200);
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
    <div className="usain-container">
      {/* Lightning Bolt Intro */}
 
      {/* Bolt Header */}
      <div className="usain-header">
        <span className="usain-day">{displayDay}</span>
        <div className="lightning"></div>
      </div>

      {/* Sprinting Schedule */}
      <div className="usain-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className={`usain-class sprint-${idx % 2 === 0 ? 'left' : 'right'}`}>
              <span className="usain-class-name">{cls.name}</span>
              <span className="usain-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default UsainBoltSchedule;
