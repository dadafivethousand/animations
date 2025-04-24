import React, { useEffect, useState } from "react";
import "../Stylesheets/iPhoneLockScreenSchedule.css";
import schedule from "../Schedule";

export default function iPhoneLockScreenSchedule({ day, animationDelay = 1000, animationInterval = 400 }) {
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
    <div className="iphone-wrapper">
      
      <div className="lock-header">
        <div className="day-label">{day.toUpperCase()}</div>
        <div className="time-display">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <div className="notification-stack">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div
              className="notification-card"
              key={idx}
              style={{ animationDelay: `${idx * animationInterval}ms` }}
            >
              <div className="notif-title">{cls.name}</div>
              <div className="notif-time">{formatTime(cls.start)}</div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
