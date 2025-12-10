import React, { useEffect, useState } from "react";
import "./ReggaetonSchedule.css";
import schedule from "../RhSchedule"; // Using the existing schedule

export default function ReggaetonSchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleClasses, setVisibleClasses] = useState([]);

  // Reveal the day title after a short delay
  useEffect(() => {
    const t = setTimeout(() => setShowSchedule(true), animationDelay);
    return () => clearTimeout(t); // cleanup
  }, [animationDelay]);

  // Stagger in each class card
  useEffect(() => {
    if (!showSchedule) return;
    const timers = [];
    setVisibleClasses([]);
    const items = schedule[day] || [];
    items.forEach((_, idx) => {
      const t = setTimeout(() => {
        setVisibleClasses((prev) => [...prev, idx]);
      }, idx * animationInterval);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout); // cleanup
  }, [showSchedule, day, animationInterval]);

  // Convert decimal time to 12-hour format
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : String(minutes);
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="reggaeton-container">
      {/* Title for the Day */}
      <h1 className={`reggaeton-title ${showSchedule ? "visible" : ""}`}>{day}</h1>

      {/* Schedule List */}
      <div className="reggaeton-schedule-wrapper">
        {(schedule[day] || []).map((cls, idx) => (
          <div
            key={idx}
            className={`reggaeton-class ${visibleClasses.includes(idx) ? "dance-in" : ""} ${
              cls.cancelled ? "cancelled" : ""
            }`}
          >
            {/* LEFT: name + inline Maple chip kept on ONE line */}
            <div className="reggaeton-class-row">
              <span className="reggaeton-class-name">
                {cls.name}
              </span>
              {cls.maple && (
                <span className="chip chip--maple" title="Maple location">📍 Maple</span>
              )}
            </div>

            {/* RIGHT: start time only */}
            <span className="reggaeton-time">{formatTime(cls.start)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
