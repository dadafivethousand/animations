import React, { useEffect, useState } from "react";
import "../Stylesheets/McGregorSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function McGregorSchedule({ day, animationDelay = 1000, animationInterval = 400 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      const classes = schedule[day] || [];
      if (classes.length === 0) return;

      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleArray((prev) => [...prev, idx]);
        }, idx * animationInterval);
      });
    }, animationDelay);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="mcgregor-container">
      <div className="mcgregor-grid"></div> {/* Fight Night Grid Background */}
      <div className="mcgregor-header">
        <h1 className="mcgregor-day">{day.toUpperCase()}</h1>
      </div>
      <div className="mcgregor-content">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="mcgregor-class-container">
            {visibleArray.includes(idx) && (
              <div className={`mcgregor-class mcgregor-punch-${idx % 2 === 0 ? "left" : "right"}`}>
                <span className="mcgregor-class-name">{cls.name}</span>
                <span className="mcgregor-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default McGregorSchedule;
