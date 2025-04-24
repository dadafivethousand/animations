import React, { useEffect, useState } from "react";
import "../Stylesheets/GreekSchedule.css";
import schedule from "../Schedule";

export default function GreekSchedule({ day, animationDelay = 500, animationInterval = 300 }) {
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
    <div className="greek-wrapper">
      <h1 className="greek-title">{day.toUpperCase()}</h1>
      <div className="greek-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="greek-card">
              <div className="pillar left" />
              <div className="greek-content">
                <span className="greek-class">{cls.name}</span>
                <span className="greek-time">{formatTime(cls.start)}</span>
              </div>
              <div className="pillar right" />
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
