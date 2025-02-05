import React, { useEffect, useState } from "react";
import "../Stylesheets/HulkSchedule.css";
import schedule from "../Schedule";

function HulkSchedule({ day }) {
  const [showClasses, setShowClasses] = useState(false);
  const [showFist, setShowFist] = useState(true);

  useEffect(() => {
    // Hulk's fist smashes down after 1.5s
    setTimeout(() => {
      setShowFist(false);
      setShowClasses(true);
    }, 1500);
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
    <div className="hulk-container">
      {/* Cracked Background Effect */}
      <div className="hulk-cracks"></div>

      {/* HULK FIST (Smashes Down) */}
      {showFist && <div className="hulk-fist"></div>}

      {/* Hulk-Themed Day Title */}
      <h1 className={`hulk-title ${showClasses ? "shake" : ""}`}>{day}</h1>

      {/* SMASHING Class Names */}
      <div className="hulk-classes">
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`hulk-class ${showClasses ? "smash-in" : ""}`}
              style={{ animationDelay: `${idx * 0.3}s` }}
            >
              <span className="class-text">
                {cls.name} - {formatTime(cls.start)}
              </span>
              <div className="hulk-crack-effect"></div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default HulkSchedule;
