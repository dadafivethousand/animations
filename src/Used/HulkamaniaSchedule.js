import React, { useEffect, useState } from "react";
import "./HulkamaniaSchedule.css";
import schedule from "../RhSchedule";

function HulkamaniaSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);

  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSchedule(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [safeDay]);

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
    <div className="hulkamania-container">
      <div className="hulkamania-content">
        {/* Title */}
        <h1 className="hulkamania-title">{safeDay}</h1>

        {/* Schedule Classes */}
        <div className="hulkamania-classes">
          {showSchedule &&
            items.map((cls, idx) => (
              <div
                key={idx}
                className="hulkamania-class"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <div className="hulkamania-left">
                  <span className="hulkamania-class-name">
                    {cls.name}
                  </span>

                  {cls.maple && (
                    <span className="hulkamania-chip">
                      📍 MAPLE
                    </span>
                  )}
                </div>

                <time className="hulkamania-time">
                  {formatTime(cls.start)}
                </time>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default HulkamaniaSchedule;
