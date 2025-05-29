import React, { useEffect, useState } from "react";
import schedule from "../Schedule";
import "../Stylesheets/PrisonWallSchedule.css";

export default function PrisonWallSchedule({ day, animationDelay = 1800, animationInterval = 500 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const entries = schedule[day] || [];
    entries.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="prison-wall">
      <div className="lighting-overlay"></div>
      <h1 className="prison-day">{day}</h1>

      <div className="prison-classes">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="prison-class" key={idx}>
              <div className="carved-time">{formatTime(cls.start)}</div>
              <div className="carved-name">{cls.name}</div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
