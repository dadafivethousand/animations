import React, { useEffect, useState } from "react";
import schedule from "../Schedule";
import "../Stylesheets/50Cent.css"; // Make sure the CSS is properly linked

function FiftyCentSchedule({ day }) {
  const [showTitle, setShowTitle] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setStartAnimation(true);
    }, 1500);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowTitle(true);
    }, 3300);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowTitle(false);
    }, 8000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, 9000);
  }, []);

  // Convert decimal hours to AM/PM format
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="fiftycent-container">
      {/* Album Background Overlay */}
      <div className="fiftycent-overlay"></div>

      {/* Title Screen (Mimicking the Album Intro) */}
      {showTitle && (
        <div className="fiftycent-title">
          <h1>GET RICH OR DIE TRYIN'</h1>
        </div>
      )}

      {/* Schedule Section */}
      <div className={`fiftycent-schedule ${showSchedule ? "fiftycent-visible" : ""}`}>
        <h1 className="fiftycent-day">{day}</h1>

        {/* Class List */}
        <div className="fiftycent-classes">
          {schedule[day] &&
            schedule[day].map((cls, idx) => (
              <div
                key={idx}
                className={`fiftycent-class ${showSchedule ? "fiftycent-slide-in" : ""}`}
                style={{ animationDelay: `${idx * 0.3}s` }}
              >
                <span className="fiftycent-class-text">
                  {cls.name} - {formatTime(cls.start)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default FiftyCentSchedule;
