import React, { useEffect, useState } from "react";
import "./VegasSchedule.css";
import schedule from "../RhSchedule";

export default function VegasSchedule({ day, animationDelay = 1800, animationInterval = 150 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    setVisibleArray([]);
    const classes = schedule[day] || [];
    const timers = [];

    classes.forEach((_, idx) => {
      const t = setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="vegas-container">
      <h1 className="vegas-day">{day.toUpperCase()}</h1>

      <div className="vegas-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="vegas-class-wrapper">
            {visibleArray.includes(idx) && (
              <>
                <div className="vegas-outer-class">
                <div className="vegas-class">
                  <span className="vegas-class-name">{cls.name}</span>
                  <span className="vegas-class-time">{formatTime(cls.start)}</span>
                </div>
                {cls.maple && <div className="vegas-maple">📍 Maple Location</div>}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
