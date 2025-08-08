import React, { useEffect, useRef, useState } from "react";
import "./UncleSamSchedule.css";
import schedule from "../RhSchedule";

export default function UncleSamSchedule({
  day,
  animationDelay = 1000,
  animationInterval = 400,
}) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  useEffect(() => {
    clearAllTimeouts();
    setShowSchedule(false);
    setVisibleArray([]);

    const t = setTimeout(() => setShowSchedule(true), animationDelay + 1200);
    timeoutsRef.current.push(t);

    return clearAllTimeouts;
  }, [day, animationDelay]);

  useEffect(() => {
    if (!showSchedule) return;

    const classes = schedule[day] || [];
    setVisibleArray([]);

    classes.forEach((_, idx) => {
      const t = setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, idx * animationInterval);
      timeoutsRef.current.push(t);
    });

    return clearAllTimeouts;
  }, [showSchedule, day, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="sam-container">
      <div className="sam-day">{day}</div>
      <div className="sam-schedule">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="sam-class">
              <div className="sam-class-left">
                <span className="sam-class-name">{cls.name}</span>
                {cls.maple && (
                  <span className="sam-badge maple">📍 Maple</span>
                )}
              </div>
              <span className="sam-class-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
