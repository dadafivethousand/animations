import React, { useEffect, useState } from "react";
import "./ArmyCamoSchedule.css";
import schedule from "../RhSchedule";

export default function ArmyCamoSchedule({ day, animationDelay = 1800, animationInterval = 150 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const classes = schedule[day] || [];
    classes.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
    });
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
    <div className="army-container">
      <h1 className="army-day">{day.toUpperCase()}</h1>
      <div className="army-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="army-class-container">
            {visibleArray.includes(idx) && (
              <div className="army-class">
                <span className="army-class-name">{cls.name}</span>
                <span className="army-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
