import React, { useEffect, useState } from "react";
import "../Stylesheets/IceAgeSchedule.css";
import schedule from "../Schedule";

function IceAgeSchedule({ day }) {
  const [visible, setVisible] = useState([]);
  const [displayDay, setDisplayDay] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayDay(day.substring(0, i + 1));
      i++;
      if (i > day.length) clearInterval(interval);
    }, 90);
    return () => clearInterval(interval);
  }, [day]);

  useEffect(() => {
    const classes = schedule[day] || [];
    classes.forEach((_, idx) => {
      setTimeout(() => {
        setVisible((prev) => [...prev, idx]);
      }, idx * 400);
    });
  }, [day]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 || 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="iceage-container">
      <div className="iceage-day">{displayDay}</div>
      <div className="iceage-schedule">
        {(schedule[day] || []).map((cls, idx) =>
          visible.includes(idx) ? (
            <div className="iceage-class" key={idx}>
              <span className="iceage-name">{cls.name}</span>
              <span className="iceage-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default IceAgeSchedule;
