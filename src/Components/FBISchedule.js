import React, { useEffect, useState } from "react";
import "../Stylesheets/RealisticFolder.css";
import schedule from "../Schedule";

export default function FBISchedule({ day, animationDelay = 1800, animationInterval = 400 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const entries = schedule[day] || [];
    entries.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray(prev => [...prev, idx]);
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
    <div className="fbi-mobile-only">
      <h1 className="fbi-day-heading">{day}</h1>
      {(schedule[day] || []).map((cls, idx) =>
        visibleArray.includes(idx) ? (
          <div className="folder-container" key={idx} style={{ animationDelay: `${idx * 0.4}s` }}>
            <div className="folder-tab">CLASS {idx + 1}</div>
            <div className="folder-body">
               <div className="folder-content">
                <div className="entry-time">{formatTime(cls.start)}</div>
                <div className="entry-name">{cls.name}</div>
                <div className="confidential-stamp">CONFIDENTIAL</div>
              </div>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
