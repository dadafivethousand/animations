import React, { useEffect, useState } from "react";
import "../Stylesheets/NapoleonSchedule.css";
import schedule from "../Schedule";

function NapoleonSchedule({ day, animationDelay = 1200, animationInterval = 450 }) {
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
      }, 90);
    }, animationDelay);
  }, [day, animationDelay]);

  useEffect(() => {
    setTimeout(() => setShowSchedule(true), animationDelay + 1000);
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
    <div className="napoleon-container">
      <div className="napoleon-day">{displayDay}</div>
      <div className="napoleon-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="napoleon-class">
              <span className="napoleon-class-name">{cls.name}</span>
              <span className="napoleon-class-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default NapoleonSchedule;
