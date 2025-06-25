import React, { useEffect, useState } from "react";
import "./TmntSchedule.css";
import schedule from "../RhSchedule"; // Assuming schedule data exists

function TmntSchedule({ day, animationDelay = 1000, animationInterval = 400 }) {
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
    <div className="tmnt-container">
      <div className="tmnt-sewer-pattern"></div> {/* TMNT-Themed Background */}
      <div className="tmnt-header">
        <h1 className="tmnt-day">{day.toUpperCase()}</h1>
      </div>
      <div className="tmnt-content">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="tmnt-class-container">
            {visibleArray.includes(idx) && (
              <div className="tmnt-class tmnt-ninja-flip">
                <span className="tmnt-class-name">{cls.name}</span>
                <span className="tmnt-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TmntSchedule;
