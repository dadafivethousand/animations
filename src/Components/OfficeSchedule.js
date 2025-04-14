import React, { useEffect, useState } from "react";
import "../Stylesheets/OfficeSchedule.css";
import schedule from "../Schedule";

export default function OfficeSchedule({ day, animationDelay = 500, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const classes = schedule[day] || [];
    classes.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray(prev => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="office-wrapper">
      <div className="office-day">{day.toUpperCase()}</div>
      <div className="corkboard">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div
              key={idx}
              className="sticky-note"
              style={{
                "--rotate": `${Math.random() * 6 - 3}deg`,
                "--x": `${Math.random() * 12 - 6}px`,
                "--y": `${Math.random() * 10 - 5}px`,
              }}
            >
              <div className="pin-head" />
              <div className="note-content">
                <div className="note-class">{cls.name}</div>
                <div className="note-time">{formatTime(cls.start)}</div>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
