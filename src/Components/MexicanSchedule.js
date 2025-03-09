import React, { useEffect, useState } from "react";
import "../Stylesheets/MexicanSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function MexicanSchedule({ day, animationDelay = 1000, animationInterval = 1000 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay);
  }, [animationDelay]);

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
    <div className="mexican-container">
      {/* Papel Picado - Traditional Mexican Banners */}
      <div className="papel-picado"></div>

      {/* Title with Authentic Mexican Style */}
      <h1 className="mexican-day">{day.toUpperCase()}</h1>

      {/* Schedule Content */}
      <div className="mexican-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className="mexican-class">
              <span className="mexican-class-name">{cls.name}</span>
              <span className="mexican-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default MexicanSchedule;
