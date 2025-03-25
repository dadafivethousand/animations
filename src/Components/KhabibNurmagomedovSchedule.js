import React, { useEffect, useState } from "react";
import "../Stylesheets/KhabibNurmagomedovSchedule.css";
import schedule from "../Schedule";

function KhabibNurmagomedovSchedule({ day, animationDelay = 500, animationInterval = 300 }) {
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
      }, 80);
    }, animationDelay);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay + 1500);
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
    <div className="khabib-container">
      {/* Dominant Day Display */}
      <div className="khabib-day">{displayDay}</div>

      {/* The Schedule */}
      <div className="khabib-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className="khabib-class">
              <span className="khabib-class-name">{cls.name}</span>
              <span className="khabib-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default KhabibNurmagomedovSchedule;
