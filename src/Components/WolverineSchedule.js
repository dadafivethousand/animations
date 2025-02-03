import React from "react";
import schedule from "../Schedule";
import "../Stylesheets/WolverineSchedule.css";

function WolverineSchedule({ day }) {
  const classesForDay = schedule[day] || [];

  // Convert decimal hours (e.g., 7.5) -> "7:30 AM"
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="wolverine-schedule-container deadpool-theme">
      {/* Day of the Week */}
      <h1 className="day-of-week">
        {day}
        {/* Bullet holes */}
        <>
          <span className="bulletHole hole1"></span>
          <span className="bulletHole hole2"></span>
          <span className="bulletHole hole3"></span>
          <span className="bulletHole hole4"></span>
          <span className="bulletHole hole5"></span>
          <span className="bulletHole hole6"></span>
        </>
      </h1>

      {/* Wolverine-themed class items appear AFTER bullet holes finish */}
      <div className="wolverine-classes-list">
        {classesForDay.map((cls, idx) => (
          <div className="wolverine-class-item float-up" key={idx} style={{ animationDelay: `${1.4 + idx * 0.2}s` }}>
            <div className="class-name">{cls.name}</div>
            <div className="class-time">{formatTime(cls.start)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WolverineSchedule;
