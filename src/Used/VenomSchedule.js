import React, { useEffect, useState } from "react";
import "../Stylesheets/VenomSchedule.css";
import schedule from "../Schedule";

function VenomSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, 500);
  }, []);

  // Convert decimal hours to AM/PM format
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="venom-container">
      <div className="venom-content">
        {/* Title */}
        <h1 className="venom-title">{day}</h1>

        {/* Schedule Classes */}
        <div className="venom-classes">
          {showSchedule &&
            schedule[day]?.map((cls, idx) => (
              <div
                key={idx}
                className="venom-class"
                style={{ animationDelay: `${Math.random() * 2}s` }} // Random delay for independent pulsing
              >
                <div className="venom-class-name">{cls.name}</div>
                <div className="venom-class-time">{formatTime(cls.start)}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default VenomSchedule;
