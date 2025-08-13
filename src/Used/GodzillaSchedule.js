import React, { useEffect, useState } from "react";
import "./GodzillaSchedule.css";
import schedule from "../RhSchedule";

function GodzillaSchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    setShowSchedule(false);
    setVisibleArray([]);
    const showTimer = setTimeout(() => setShowSchedule(true), animationDelay);
    return () => clearTimeout(showTimer);
  }, [day, animationDelay]);

  useEffect(() => {
    if (!showSchedule) return;
    setVisibleArray([]);
    const classes = schedule[day] || [];
    const timers = [];
    classes.forEach((_, idx) => {
      const t = setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, idx * animationInterval);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
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
    <div className="godzilla-container">
      <div className={`godzilla-bg ${showSchedule ? "active" : ""}`} />

      <div className="godzilla-content">
        <h1 className="godzilla-title">{day}</h1>

        {showSchedule && (
          <div className="godzilla-classes">
            {(schedule[day] || []).map((cls, idx) =>
              visibleArray.includes(idx) ? (
                <div key={idx} className="godzilla-class-wrap">
                  <div className="godzilla-class">
                    <div className="godzilla-left">
                      {cls.replacement ? (
                        <span className="godzilla-name-group">
                          <span className="godzilla-name godzilla-name-replaced">
                            {cls.name}
                          </span>
                          <span className="godzilla-replacement">
                            → {String(cls.replacement)}
                          </span>
                        </span>
                      ) : (
                        <span className="godzilla-name">{cls.name}</span>
                      )}
                    </div>
                    <span className="godzilla-class-time">{formatTime(cls.start)}</span>
                      {cls.maple && (
                    <div className="godzilla-maple-row">📍 MAPLE LOCATION</div>
                  )}
                  </div>

                
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default GodzillaSchedule;
