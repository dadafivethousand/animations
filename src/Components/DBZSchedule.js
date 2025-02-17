import React, { useEffect, useState } from "react";
import schedule from "../Schedule"; // Ensure correct schedule import
import "../Stylesheets/DBZSchedule.css"; // Link CSS file

function DBZSchedule({ day }) {
  const [poweringUp, setPoweringUp] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    // Powering up effect starts immediately
    setTimeout(() => {
      setPoweringUp(false);
      setShowSchedule(true);
    }, 5000); // Power-up lasts 5 seconds before explosion & reveal
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
    <div className={`dbz-container ${poweringUp ? "shaking" : ""}`}>
      {/* POWERING UP EFFECT */}
      {poweringUp && <div className="dbz-powerup"></div>}

      {/* SCHEDULE REVEAL */}
      {showSchedule && (
        <div className="dbz-schedule">
           <h2 className="dbz-day">{day}</h2>
          {schedule[day] &&
            schedule[day].map((cls, idx) => (
              <div key={idx} className="dbz-class">
                <span className="dbz-class-text">
                  {cls.name} - {formatTime(cls.start)}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default DBZSchedule;
