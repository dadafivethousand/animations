import React, { useEffect, useState } from "react";
import schedule from "../RhSchedule";
import "./SpartanSchedule.css";
import Spear from "./Spear.css";

function SpartanSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowSchedule(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="spartan-container">
      <h1 className={`spartan-title ${showSchedule ? "spartan-visible" : ""}`}>
        {day}
      </h1>

      <div className="spartan-schedule">
        {(schedule[day] || []).map((cls, idx) => (
          <div className="spartan-card-wrap" key={idx}>
            <div
              className={`spartan-class ${showSchedule ? "spartan-fade-in" : ""}`}
              style={{ animationDelay: `${idx * 1}s` }}
            >
              <span className="spartan-class-text">
                {cls.name}
                <br />
                {formatTime(cls.start)}
              </span>
            </div>

            {/* Maple plaque under the circle */}
            {cls.maple && (
              <div className="spartan-maple">📍 MAPLE LOCATION</div>
            )}
          </div>
        ))}
      </div>

      <Spear />
    </div>
  );
}

export default SpartanSchedule;
