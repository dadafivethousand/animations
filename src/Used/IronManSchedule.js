import React, { useEffect, useState } from "react";
import "../Stylesheets/IronManSchedule.css";
import schedule from "../Schedule";
import MapleLogo from "../Components/MapleMarvel";

function IronManSchedule({ day }) {
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
    <div className="ironman-container">
      {/* Arc Reactor in Background */}
      <div className="arc-reactor"></div>

      <h1 className="ironman-title">{day}</h1>

      <div className="ironman-classes">
        {showSchedule &&
          schedule[day]?.map((cls, idx) => (
            <div
              key={idx}
              className="ironman-class"
              style={{ animationDelay: `${idx * 0.3}s` }}
            >
              <div className="ironman-class-name">{cls.name}</div>
              <div className="ironman-class-time">{formatTime(cls.start)}</div>
            </div>
          ))}
      </div>.
  
    </div>
  );
}

export default IronManSchedule;
