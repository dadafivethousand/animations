import React, { useEffect, useState } from "react";
import "./SonicSchedule.css";
import schedule from "../RhSchedule";

function SonicSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSchedule(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="sonic-container">
      <div className="sonic-content">
        <h1 className="sonic-title">{day}</h1>

        <div className="sonic-classes">
          {showSchedule &&
            (schedule[day] || []).map((cls, idx) => (
              <div className="sonic-card-wrap" key={idx}>
                <div
                  className={`sonic-class ${idx % 2 === 0 ? "from-left" : "from-right"}`}
                  style={{ animationDelay: `${idx * 0.4}s` }}
                >
                  <div className="sonic-class-name">
                    {cls.name} - <span className="sonic-class-time">{formatTime(cls.start)}</span>
                  </div>
                </div>

                {/* Maple plaque UNDER the morphing pill */}
                {cls.maple && (
                  <div className="sonic-maple">📍 Maple Location</div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default SonicSchedule;
