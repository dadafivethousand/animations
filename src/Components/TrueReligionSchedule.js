import React, { useEffect, useState } from "react";
import "../Stylesheets/TrueReligionSchedule.css";
import schedule from "../RhSchedule";

export default function TrueReligionSchedule({ day, animationDelay = 1500, animationInterval = 200 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const entries = schedule[day] || [];
    setVisibleArray([]);
    entries.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray(prev => [...prev, idx]);
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

  return (
    <div className="tr-wrapper">
      <header className="tr-header">
        <div className="tr-logo" />
        <h1 className="tr-title">{day.toUpperCase()}</h1>
      </header>

      <section className="tr-schedule">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="tr-card" key={idx}>
              <div className="tr-details">
                <div className="tr-class">{cls.name}</div>
                {cls.maple && <div className="tr-premium">MAPLE LOCATION</div>}
              </div>
              <div className="tr-time">{formatTime(cls.start)}</div>
            </div>
          ) : null
        )}
      </section>
    </div>
  );
}
