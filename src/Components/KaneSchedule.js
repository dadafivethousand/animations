import React, { useEffect, useState } from "react";
import schedule from "../Schedule";
import "../Stylesheets/KaneSchedule.css"; // Ensure correct import path

function KaneSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [fireActive, setFireActive] = useState(false);
  const [visibleClasses, setVisibleClasses] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
      setFireActive(true); // Activate pyro after 1 sec
    }, 2000);
  }, []);

  useEffect(() => {
    if (showSchedule) {
      schedule[day]?.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleClasses((prev) => [...prev, idx]);
        }, idx * 300);
      });
    }
  }, [showSchedule, day]);

  // Convert decimal time to 12-hour format
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className={`kane-container ${fireActive ? "shake" : ""}`}>
      {/* Explosive Pyro */}
      <div className={`pyro-container ${fireActive ? "active" : ""}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`pyro-flame flame-${i + 1}`}></div>
        ))}
      </div>

      {/* Smoke Clouds */}
      <div className="smoke-layer"></div>

      {/* Heatwave Effect */}
 
      {/* Ember Particles */}
      <div className="ember-container"></div>

      {/* Day Title with Burning Effect */}
      <h1 className={`kane-title ${showSchedule ? "visible" : ""}`}>
        {day}
      </h1>

      {/* Schedule */}
      <div className={`kane-schedule ${showSchedule ? "visible" : ""}`}>
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`kane-class ${visibleClasses.includes(idx) ? "slide-in" : ""}`}
            >
              <span className="kane-class-text">
                {cls.name} - {formatTime(cls.start)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default KaneSchedule;
