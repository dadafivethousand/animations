// PandaSchedule.jsx — refactored to show MAPLE chip (kept structure/behavior)
import React, { useEffect, useState } from "react";
import "./PandaSchedule.css";
import schedule from "../RhSchedule";

function PandaSchedule({ day, animationDelay = 1500, animationInterval = 500 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [displayDay, setDisplayDay] = useState("");

  useEffect(() => {
    setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayDay(day.substring(0, i + 1));
        i++;
        if (i > day.length) clearInterval(interval);
      }, 80);
    }, animationDelay);
  }, [day, animationDelay]);

  useEffect(() => {
    setTimeout(() => setShowSchedule(true), animationDelay + 1500);
  }, [animationDelay]);

  useEffect(() => {
    if (!showSchedule) return;
    const classes = schedule[day] || [];
    classes.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, idx * animationInterval);
    });
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
    <div className="panda-container">
      <div className="panda-scroll">
        <div className="panda-header-scroll">{displayDay}</div>

        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="panda-class">
              <div className="panda-left">
                <span className="panda-class-name">{cls.name}</span>
                {cls.maple && <span className="panda-chip">📍 MAPLE</span>}
              </div>
              <span className="panda-class-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default PandaSchedule;
