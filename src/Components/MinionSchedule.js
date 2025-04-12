import React, { useEffect, useState } from "react";
import "../Stylesheets/MinionSchedule.css";
import schedule from "../Schedule"; // -> { Monday: [{ name, start }, ...], Tuesday: [...], etc. }

function MinionSchedule({ day }) {
  const [fadeIn, setFadeIn] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);

  // 1) On mount, fade in after short delay
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeIn(true), 500);
    return () => clearTimeout(fadeTimer);
  }, []);

  // 2) Reveal each schedule item one-by-one
  useEffect(() => {
    if (!fadeIn) return;

    const items = schedule[day] || [];
    items.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, idx]);
      }, idx * 400); // 400ms apart
    });
  }, [fadeIn, day]);

  // Time formatting helper
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="minion-blueprint">
      {/* Big Minion silhouette in background, day label at top */}
      <div className={`minion-header ${fadeIn ? "visible" : ""}`}>
        <h1 className="minion-day-title">
          {day.toUpperCase()} SCHEDULE
        </h1>
      </div>

      {/* Schedule items with banana bullets */}
      <div className="minion-schedule-list">
        {(schedule[day] || []).map((cls, idx) => (
          visibleItems.includes(idx) && (
            <div key={idx} className="minion-schedule-item">
              <div className="banana-bullet">🍌</div>
              <div className="minion-class-name">{cls.name}</div>
              <div className="minion-class-time">
                {formatTime(cls.start)}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default MinionSchedule;
