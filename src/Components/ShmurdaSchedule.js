import React, { useEffect, useState } from "react";
import "../Stylesheets/ShmurdaSchedule.css";
import schedule from "../Schedule";

function ShmurdaSchedule({ day, animationDelay = 1000, animationInterval = 400 }) {
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
    setTimeout(() => setShowSchedule(true), animationDelay + 1200);
  }, [animationDelay]);

  useEffect(() => {
    if (showSchedule) {
      const classes = schedule[day] || [];
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
    <div className="shmurda-container">
      <div className="shmurda-day">{displayDay}</div>
      <div className="shmurda-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="shmurda-class">
              <span className="shmurda-class-name">{cls.name}</span>
              <span className="shmurda-class-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default ShmurdaSchedule;
