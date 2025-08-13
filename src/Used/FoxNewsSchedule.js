import React, { useEffect, useState } from "react";
import schedule from "../RhSchedule";
import "./FoxNewsSchedule.css";

export default function FoxNewsSchedule({
  day,
  animationDelay = 1500,
  animationInterval = 400,
}) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    setVisibleArray([]);
    const entries = schedule[day] || [];
    const timers = [];
    entries.forEach((_, idx) => {
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
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="fox-wrapper">
      <div className="fox-top-bar">
        <div className="fox-day">{day.toUpperCase()} SCHEDULE</div>
      </div>

      <div className="fox-schedule-container">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="fox-class-wrap" key={idx}>
              <div className="fox-class-card">
                <div className="fox-name-time">
                  {/* name / replacement */}
                  <div className="fox-name-block">
                    {cls.replacement ? (
                      <>
                        <span className="fox-name fox-name-replaced">
                          {cls.name.toUpperCase()}
                        </span>
                        <span className="fox-replacement">
                          → {String(cls.replacement).toUpperCase()}
                        </span>
                      </>
                    ) : (
                      <span className="fox-name">{cls.name.toUpperCase()}</span>
                    )}
                  </div>
                  {/* time */}
                  <div className="fox-time">{formatTime(cls.start)}</div>
                </div>
              </div>

              {/* maple location bar under the card */}
              {cls.maple && (
                <div className="fox-maple-row">📍 MAPLE LOCATION</div>
              )}
            </div>
          ) : null
        )}
      </div>

      <div className="fox-ticker">
        <div className="ticker-text">
          🔴 LIVE · MAPLE BJJ · {day.toUpperCase()} COVERAGE · TRAIN HARD · STAY
          SHARP · OSS! 🔥
        </div>
      </div>
    </div>
  );
}
