import React, { useEffect, useState } from "react";
import "../Stylesheets/McGregorVsKhabibSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function McGregorVsKhabibSchedule({ day, animationDelay = 1000, animationInterval = 450 }) {
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
    <div className="mcgregor-vs-khabib-container">
      <div className="fight-split"></div> {/* Split Fight Background */}
      <div className="fight-header">
        <h1 className="fight-day">{day.toUpperCase()}</h1>
      </div>
      <div className="fight-content">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="fight-class-container">
            {visibleArray.includes(idx) && (
              <div className={`fight-class fight-impact fight-${idx % 2 === 0 ? "mcgregor" : "khabib"}`}>
                <span className="fight-class-name">{cls.name}</span>
                <span className="fight-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default McGregorVsKhabibSchedule;
