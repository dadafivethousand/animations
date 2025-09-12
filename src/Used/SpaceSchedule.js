// SpaceSchedule.js — refactored to show MAPLE tag on classes with maple: true
import React, { useEffect, useState } from "react";
import "./SpaceSchedule.css";
import schedule from "../RhSchedule";

function SpaceSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [spaceship, setSpaceship] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSchedule(true), 2000); // reach space
    const t2 = setTimeout(() => setSpaceship(true), 5000);    // fly ship
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    // reset visibility when day changes
    setVisibleArray([]);
    if (!showSchedule) return;

    const classes = schedule[day] || [];
    if (classes.length === 0) return;

    // staggered reveal
    const timers = [];
    const startDelay = 2000;
    classes.forEach((_, idx) => {
      const t = setTimeout(
        () => setVisibleArray((prev) => [...prev, idx]),
        startDelay + idx * 500
      );
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, [showSchedule, day]);

  // Convert decimal hours to AM/PM format
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className={`space-container space-mode`}>
      <div className="space-content">
        {showSchedule && <div className="earth">🌍</div>}

        <div className={`space-ship ${spaceship ? "space-ship-fly" : ""}`}>
          🚀
        </div>

        {showSchedule && (
          <div className="space-classes">
            <h1 className="space-title">{day}</h1>
            { (schedule[day] || []).map((cls, idx) =>
              visibleArray.includes(idx) ? (
                <div key={idx} className="space-class">
                  <span className="space-left">
                    <span className="space-class-name">{cls.name}</span>
                    {cls.maple && <span className="space-chip">📍 MAPLE</span>}
                  </span>
                  <span className="space-class-time">{formatTime(cls.start)}</span>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SpaceSchedule;
