import React, { useEffect, useState } from "react";
import "../Stylesheets/SupermanSchedule.css";
import schedule from "../Schedule";

function SupermanSchedule({ day }) {
  const [showClasses, setShowClasses] = useState(false);

  useEffect(() => {
    // Delay before classes start flying
    setTimeout(() => {
      setShowClasses(true);
    }, 500);
  }, []);

  // Convert time to AM/PM format
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="superman-container">
      <h1 className="superman-title">{day}</h1>
      <div className="superman-classes">
        {schedule[day]?.map((cls, idx) => (
          <div
            key={idx}
            className={`superman-class ${showClasses ? "fly-up" : ""}`}
            style={{ animationDelay: `${idx * 0.3}s` }}
          >
            <div className="class-name">{cls.name}</div>
            <div className="class-time">{formatTime(cls.start)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SupermanSchedule;
