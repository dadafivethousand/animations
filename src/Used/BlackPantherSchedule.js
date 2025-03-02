import React, { useEffect, useState } from "react";
import "../Stylesheets/BlackPantherSchedule.css";
import schedule from "../Schedule";

function BlackPantherSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [goUp, setGoUp] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, 500);
  }, []);

  useEffect(() => {
    setGoUp(true)
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
    <div className="black-panther-container">
      {/* Necklace (Now in a Circular Arc) */}
      <div className={`black-panther-necklace  ${goUp? 'black-panther-up': ''}`}>
        {[...Array(12)].map((_, idx) => (
          <div
            key={idx}
            className={`black-panther-claw claw${idx}`}
           />
        ))}
      </div>

      <div className="black-panther-content">
        {/* Title */}
        <h1 className="black-panther-title">{day}</h1>

        {/* Schedule Classes */}
        <div className="black-panther-classes">
          {showSchedule &&
            schedule[day]?.map((cls, idx) => (
              <div
                key={idx}
                className="black-panther-class"
                style={{ animationDelay: `${idx * 1}s` }}
              >
                <div className="black-panther-class-name">{cls.name}</div>
                <div className="black-panther-class-time">{formatTime(cls.start)}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default BlackPantherSchedule;
