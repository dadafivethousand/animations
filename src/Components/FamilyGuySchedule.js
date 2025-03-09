import React, { useEffect, useState } from "react";
import "../Stylesheets/FamilyGuySchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function FamilyGuySchedule({ day, animationDelay = 1000, animationInterval = 1000 }) {
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
    <div className="familyguy-container">
      {/* Family Guy-Themed Background */}
      <div className="familyguy-background"></div>

      {/* TV Frame for the Schedule */}
      <div className="familyguy-tv">
        <h1 className="familyguy-day">{day.toUpperCase()}</h1>
        <div className="familyguy-schedule">
          {schedule[day]?.map((cls, idx) => (
            visibleArray.includes(idx) && (
              <div key={idx} className="familyguy-class">
                <span className="familyguy-class-name">{cls.name}</span>
                <span className="familyguy-class-time">{formatTime(cls.start)}</span>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default FamilyGuySchedule;
