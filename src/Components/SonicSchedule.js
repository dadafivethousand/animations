import React, { useEffect, useState } from "react";
import "../Stylesheets/SonicSchedule.css";
import schedule from "../Schedule";

function SonicSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, 1000);
  }, []);

  // Format time into AM/PM format
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="sonic-container">
      <div className="sonic-content">
        <h1 className="sonic-title">{day}</h1>

        {/* Schedule Classes */}
        <div className="sonic-classes">
          {showSchedule &&
            schedule[day]?.map((cls, idx) => (
              <div key={idx} className={`sonic-class ${idx % 2 === 0 ? "from-left" : "from-right"}`} 
                style={{ animationDelay: `${idx * .4}s` }}>
                <div className="sonic-class-name">{cls.name} - <span className="sonic-class-time">{formatTime(cls.start)} </span></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default SonicSchedule;
