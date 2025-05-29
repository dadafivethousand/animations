import React, { useEffect, useState } from "react";
import schedule from "../Schedule";
import "../Stylesheets/NewspaperSchedule.css";

export default function NewspaperSchedule({ day, animationDelay = 800, animationInterval = 400 }) {
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

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="newspaper-wrapper">
      <div className="masthead">
        <h1 className="paper-title">The Maple Times</h1>
        <div className="paper-subtitle">{today}</div>
      </div>
      <div className="headline">Today's Schedule – {day}</div>
      <div className="schedule-columns">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="schedule-article" key={idx} style={{ animationDelay: `${idx * 0.3}s` }}>
              <div className="class-headline">{cls.name}</div>
              <div className="class-time">{formatTime(cls.start)}</div>
              <p className="class-description">
                Join us for "{cls.name}" at {formatTime(cls.start)}. Bring your energy, your focus, and your best self.
              </p>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
